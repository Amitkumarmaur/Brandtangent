import { supabase } from "@/lib/supabase"
import type { BlogPost, ContentCategory } from "@/lib/supabase"
import { prepareBlogMarkdownBody } from "@/lib/blog-markdown"

/** Matches seed order; used when DB has no rows yet (offline / pre-migration). */
export const MOCK_CONTENT_CATEGORIES: ContentCategory[] = [
  { id: "mock-technology", name: "Technology", slug: "technology", display_order: 0 },
  { id: "mock-industry", name: "Industry", slug: "industry", display_order: 10 },
  { id: "mock-development", name: "Development", slug: "development", display_order: 20 },
  { id: "mock-ai", name: "AI", slug: "ai", display_order: 30 },
  { id: "mock-design", name: "Design", slug: "design", display_order: 40 },
  { id: "mock-data", name: "Data", slug: "data", display_order: 50 },
]

export const ALL_ARTICLES_LABEL = "All Articles"

export type BlogContentCategoryJoin = {
  content_categories: ContentCategory | null
}

/** Raw row from Supabase: legacy demo columns and/or production `blogs` (seo_title, body_content, …). */
export type BlogRowWithCategories = {
  id: string
  slug: string
  title?: string | null
  /** Production blogs table headline / page title source */
  seo_title?: string | null
  category?: string | null
  excerpt?: string | null
  meta_description?: string | null
  content?: string | null
  body_content?: string | null
  image_url?: string | null
  hero_image?: string | null
  published_at: string | null
  created_at?: string | null
  author_name?: string | null
  author_image?: string | null
  read_time?: string | null
  /** Featured case studies on the blog post (same order as the array in Supabase). */
  linked_case_study_ids?: string[] | null
  blog_content_categories?: BlogContentCategoryJoin[] | null
}

export function blogRowDisplayTitle(row: BlogRowWithCategories): string {
  const t = (row.title ?? row.seo_title ?? "").trim()
  return t || "Blog"
}

export function blogRowExcerpt(row: BlogRowWithCategories): string {
  return (row.excerpt ?? row.meta_description ?? "").trim()
}

/**
 * Prefer production `body_content` when set; fall back to legacy `content`.
 * Trims only for the emptiness check — full normalization runs in `blogRowToBlogPost`.
 */
export function blogRowBody(row: BlogRowWithCategories): string {
  const rawBody = row.body_content ?? ""
  if (rawBody.trim().length > 0) return rawBody.trim()
  return (row.content ?? "").trim()
}

export function blogRowHeroImage(row: BlogRowWithCategories): string {
  return (row.image_url ?? row.hero_image ?? "").trim()
}

export function sortContentCategories(cats: ContentCategory[]): ContentCategory[] {
  return [...cats].sort((a, b) => a.display_order - b.display_order)
}

export function flattenBlogContentCategories(row: BlogRowWithCategories): ContentCategory[] {
  const rows = row.blog_content_categories
  if (!Array.isArray(rows)) return []
  const out: ContentCategory[] = []
  for (const row of rows) {
    const cc = row.content_categories
    if (cc && typeof cc.id === "string") out.push(cc)
  }
  return sortContentCategories(out)
}

export function slugifyLabel(text: string): string {
  return text
    .trim()
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
}

/** Compact badge: first category by display order, else legacy `category`, else default. */
export function primaryBlogCategoryBadge(
  cats: ContentCategory[] | undefined,
  legacy: string | null | undefined,
  fallback = "Insight"
): string {
  const sorted = cats?.length ? sortContentCategories(cats) : []
  if (sorted.length) return sorted[0].name
  const t = legacy?.trim()
  if (t) return t
  return fallback
}

/** Hero eyebrow: all names joined, else legacy, else default. */
export function formatBlogCategoriesForHero(
  cats: ContentCategory[] | undefined,
  legacy: string | null | undefined,
  fallback = "Insight"
): string {
  const sorted = cats?.length ? sortContentCategories(cats) : []
  if (sorted.length) return sorted.map((c) => c.name).join(" · ")
  const t = legacy?.trim()
  if (t) return t
  return fallback
}

export function blogRowToBlogPost(row: BlogRowWithCategories): BlogPost {
  const content_categories = flattenBlogContentCategories(row)
  const displayTitle = blogRowDisplayTitle(row)
  const rawBody = blogRowBody(row)
  return {
    id: row.id,
    title: displayTitle,
    slug: row.slug,
    category: primaryBlogCategoryBadge(content_categories, row.category),
    excerpt: blogRowExcerpt(row),
    content: prepareBlogMarkdownBody(rawBody, displayTitle),
    image_url: blogRowHeroImage(row),
    published_at: row.published_at ?? row.created_at ?? "",
    author_name: row.author_name ?? undefined,
    author_image: row.author_image ?? undefined,
    read_time: row.read_time ?? undefined,
    content_categories: content_categories.length ? content_categories : undefined,
  }
}

export function postMatchesContentCategorySlug(
  post: BlogPost,
  slug: string | null
): boolean {
  if (!slug) return true
  if (post.content_categories?.some((c) => c.slug === slug)) return true
  if (post.category && slugifyLabel(post.category) === slug) return true
  return false
}

/** Filter chips when `content_categories` table is empty but posts exist (legacy-only). */
export function buildFilterCategoryList(
  fromDb: ContentCategory[],
  posts: BlogPost[]
): ContentCategory[] {
  if (fromDb.length) return sortContentCategories(fromDb)
  const bySlug = new Map<string, ContentCategory>()
  for (const p of posts) {
    for (const c of p.content_categories ?? []) {
      bySlug.set(c.slug, c)
    }
    if (!p.content_categories?.length && p.category?.trim()) {
      const slug = slugifyLabel(p.category)
      if (!bySlug.has(slug)) {
        bySlug.set(slug, {
          id: `derived-${slug}`,
          name: p.category.trim(),
          slug,
          display_order: 100,
        })
      }
    }
  }
  const derived = [...bySlug.values()]
  if (derived.length) return sortContentCategories(derived)
  return MOCK_CONTENT_CATEGORIES
}

export async function fetchContentCategories(): Promise<ContentCategory[]> {
  const { data, error } = await supabase
    .from("content_categories")
    .select("id, name, slug, display_order")
    .order("display_order", { ascending: true })

  if (error || !data?.length) return []
  return data as ContentCategory[]
}

const BLOG_LIST_SELECT = `
  *,
  blog_content_categories (
    content_categories ( id, name, slug, display_order )
  )
`

/**
 * Published blogs with content-category joins.
 * When `categorySlug` is set, only blogs linked in `blog_content_categories` for that slug.
 */
export async function fetchBlogsForCategoryFilter(
  categorySlug: string | null
): Promise<{
  data: BlogRowWithCategories[] | null
  error: Error | null
}> {
  if (!categorySlug) {
    const { data, error } = await supabase
      .from("blogs")
      .select(BLOG_LIST_SELECT)
      .eq("published", true)
      .order("published_at", { ascending: false })

    return {
      data: (data as BlogRowWithCategories[] | null) ?? null,
      error: error ? new Error(error.message) : null,
    }
  }

  const ids = await fetchBlogIdsForCategorySlug(categorySlug)
  if (ids.length === 0) {
    return { data: [], error: null }
  }

  const { data, error } = await supabase
    .from("blogs")
    .select(BLOG_LIST_SELECT)
    .eq("published", true)
    .in("id", ids)
    .order("published_at", { ascending: false })

  return {
    data: (data as BlogRowWithCategories[] | null) ?? null,
    error: error ? new Error(error.message) : null,
  }
}

/** @deprecated Prefer fetchBlogsForCategoryFilter(null) */
export async function fetchBlogsWithContentCategories(): Promise<{
  data: BlogRowWithCategories[] | null
  error: Error | null
}> {
  return fetchBlogsForCategoryFilter(null)
}

/**
 * Paginated published blogs with content-category joins.
 * Fetches `limit + 1` rows under the hood so we can report `hasMore` without an
 * extra `count` query. Returns at most `limit` rows to the caller.
 */
export async function fetchBlogsPage(
  categorySlug: string | null,
  limit: number,
  offset: number
): Promise<{
  data: BlogRowWithCategories[]
  hasMore: boolean
  error: Error | null
}> {
  const rangeFrom = offset
  const rangeTo = offset + limit // inclusive end => limit + 1 rows

  if (!categorySlug) {
    const { data, error } = await supabase
      .from("blogs")
      .select(BLOG_LIST_SELECT)
      .eq("published", true)
      .order("published_at", { ascending: false })
      .range(rangeFrom, rangeTo)

    if (error) {
      return { data: [], hasMore: false, error: new Error(error.message) }
    }

    const rows = (data as BlogRowWithCategories[] | null) ?? []
    const hasMore = rows.length > limit
    return { data: rows.slice(0, limit), hasMore, error: null }
  }

  const ids = await fetchBlogIdsForCategorySlug(categorySlug)
  if (ids.length === 0) {
    return { data: [], hasMore: false, error: null }
  }

  const { data, error } = await supabase
    .from("blogs")
    .select(BLOG_LIST_SELECT)
    .eq("published", true)
    .in("id", ids)
    .order("published_at", { ascending: false })
    .range(rangeFrom, rangeTo)

  if (error) {
    return { data: [], hasMore: false, error: new Error(error.message) }
  }

  const rows = (data as BlogRowWithCategories[] | null) ?? []
  const hasMore = rows.length > limit
  return { data: rows.slice(0, limit), hasMore, error: null }
}

/** Case study detail: topics linked in Supabase (optional). */
export async function fetchCaseStudyContentCategories(
  caseStudyId: string
): Promise<ContentCategory[]> {
  const { data, error } = await supabase
    .from("case_study_content_categories")
    .select("content_categories ( id, name, slug, display_order )")
    .eq("case_study_id", caseStudyId)

  if (error || !data?.length) return []
  const out: ContentCategory[] = []
  for (const row of data as { content_categories: ContentCategory | null }[]) {
    const cc = row.content_categories
    if (cc && typeof cc.id === "string") out.push(cc)
  }
  return sortContentCategories(out)
}

/**
 * For a future case-studies index: IDs of studies tagged with this category slug.
 */
export async function fetchCaseStudyIdsForCategorySlug(
  categorySlug: string
): Promise<string[]> {
  const { data: cat, error: catErr } = await supabase
    .from("content_categories")
    .select("id")
    .eq("slug", categorySlug)
    .maybeSingle()

  if (catErr || !cat?.id) return []

  const { data: links, error: linkErr } = await supabase
    .from("case_study_content_categories")
    .select("case_study_id")
    .eq("content_category_id", cat.id)

  if (linkErr || !links?.length) return []
  return links.map((l: { case_study_id: string }) => l.case_study_id)
}

/**
 * For a future case-studies index: IDs of blogs tagged with this category slug.
 */
export async function fetchBlogIdsForCategorySlug(categorySlug: string): Promise<string[]> {
  const { data: cat, error: catErr } = await supabase
    .from("content_categories")
    .select("id")
    .eq("slug", categorySlug)
    .maybeSingle()

  if (catErr || !cat?.id) return []

  const { data: links, error: linkErr } = await supabase
    .from("blog_content_categories")
    .select("blog_id")
    .eq("content_category_id", cat.id)

  if (linkErr || !links?.length) return []
  return [...new Set(links.map((l: { blog_id: string }) => l.blog_id))]
}

/** Case studies index: first chip label (parallel to blog’s “All Articles”). */
export const ALL_CASE_STUDIES_LABEL = "All work"

export type CaseStudyContentCategoryJoin = {
  content_categories: ContentCategory | null
}

/**
 * Case study row as returned from Supabase with both joins:
 *   - `case_study_content_categories` (m-n topic taxonomy, legacy but still used by blogs)
 *   - `industries` (single-select industry via `industry_id` FK)
 *   - `services` (single-select service via `linked_service_id` FK)
 */
export type CaseStudyRowWithCategories = {
  id: string
  slug: string
  h1_title?: string | null
  brief_description?: string | null
  hero_image?: string | null
  industry_id?: string | null
  linked_service_id?: string | null
  display_order?: number | null
  case_study_content_categories?: CaseStudyContentCategoryJoin[] | null
  industries?: { id: string; name: string; slug: string; display_order: number } | null
  services?: { id: string; name: string; slug: string; display_order: number | null } | null
}

export type CaseStudyListItem = {
  id: string
  slug: string
  title: string
  excerpt: string
  image_url: string
  /** Human-readable industry name resolved from the `industries` FK join. */
  industry: string
  /** Industry slug (for filtering). Empty string when no industry is set. */
  industry_slug: string
  /** Human-readable service name resolved from the `services` FK join. */
  service_name: string
  /** Service slug (for filtering). Empty string when no service is linked. */
  service_slug: string
  content_categories?: ContentCategory[]
}

const CASE_STUDY_CARD_FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=800&h=1000"

const CASE_STUDY_LIST_SELECT = `
  *,
  case_study_content_categories (
    content_categories ( id, name, slug, display_order )
  ),
  industries:industry_id ( id, name, slug, display_order ),
  services:linked_service_id ( id, name, slug, display_order )
`

export function flattenCaseStudyContentCategories(row: CaseStudyRowWithCategories): ContentCategory[] {
  const rows = row.case_study_content_categories
  if (!Array.isArray(rows)) return []
  const out: ContentCategory[] = []
  for (const r of rows) {
    const cc = r.content_categories
    if (cc && typeof cc.id === "string") out.push(cc)
  }
  return sortContentCategories(out)
}

export function caseStudyRowToListItem(row: CaseStudyRowWithCategories): CaseStudyListItem {
  const content_categories = flattenCaseStudyContentCategories(row)
  const img = (row.hero_image ?? "").trim()
  const industryName = (row.industries?.name ?? "").trim()
  const industrySlug = (row.industries?.slug ?? "").trim()
  const serviceName = (row.services?.name ?? "").trim()
  const serviceSlug = (row.services?.slug ?? "").trim()
  return {
    id: row.id,
    slug: row.slug,
    title: (row.h1_title ?? "").trim() || "Case study",
    excerpt: (row.brief_description ?? "").trim(),
    image_url: img || CASE_STUDY_CARD_FALLBACK_IMAGE,
    industry: industryName || "B2B",
    industry_slug: industrySlug,
    service_name: serviceName,
    service_slug: serviceSlug,
    content_categories: content_categories.length ? content_categories : undefined,
  }
}

export function primaryCaseStudyCategoryBadge(
  cats: ContentCategory[] | undefined,
  industry: string | undefined,
  fallback = "Case study"
): string {
  const sorted = cats?.length ? sortContentCategories(cats) : []
  if (sorted.length) return sorted[0].name
  const t = industry?.trim()
  if (t) return t
  return fallback
}

export function caseStudyMatchesContentCategorySlug(
  item: CaseStudyListItem,
  slug: string | null
): boolean {
  if (!slug) return true
  if (item.content_categories?.some((c) => c.slug === slug)) return true
  return false
}

/**
 * Filter chips when `content_categories` is empty: derive from linked case study tags or industry.
 */
export function buildCaseStudyFilterCategoryList(
  fromDb: ContentCategory[],
  studies: CaseStudyListItem[]
): ContentCategory[] {
  if (fromDb.length) return sortContentCategories(fromDb)
  const bySlug = new Map<string, ContentCategory>()
  for (const s of studies) {
    for (const c of s.content_categories ?? []) {
      bySlug.set(c.slug, c)
    }
    if (!s.content_categories?.length && s.industry?.trim()) {
      const slug = slugifyLabel(s.industry)
      if (!bySlug.has(slug)) {
        bySlug.set(slug, {
          id: `derived-${slug}`,
          name: s.industry.trim(),
          slug,
          display_order: 100,
        })
      }
    }
  }
  const derived = [...bySlug.values()]
  if (derived.length) return sortContentCategories(derived)
  return MOCK_CONTENT_CATEGORIES
}

/**
 * Published case studies with `case_study_content_categories` joins.
 * When `categorySlug` is set, only studies linked for that topic in Supabase.
 */
export async function fetchCaseStudiesForCategoryFilter(categorySlug: string | null): Promise<{
  data: CaseStudyRowWithCategories[] | null
  error: Error | null
}> {
  if (!categorySlug) {
    const { data, error } = await supabase
      .from("case_studies")
      .select(CASE_STUDY_LIST_SELECT)
      .eq("published", true)
      .order("display_order", { ascending: true })

    return {
      data: (data as CaseStudyRowWithCategories[] | null) ?? null,
      error: error ? new Error(error.message) : null,
    }
  }

  const ids = await fetchCaseStudyIdsForCategorySlug(categorySlug)
  if (ids.length === 0) {
    return { data: [], error: null }
  }

  const { data, error } = await supabase
    .from("case_studies")
    .select(CASE_STUDY_LIST_SELECT)
    .eq("published", true)
    .in("id", ids)
    .order("display_order", { ascending: true })

  return {
    data: (data as CaseStudyRowWithCategories[] | null) ?? null,
    error: error ? new Error(error.message) : null,
  }
}

/**
 * Fetches every published case study with the joins needed to power the
 * /case-studies index (topics + industry + service). The grid filters are
 * applied client-side against this list, so we only hit Supabase once per
 * visit regardless of how many facets the user toggles.
 */
export async function fetchAllPublishedCaseStudies(): Promise<{
  data: CaseStudyRowWithCategories[] | null
  error: Error | null
}> {
  const { data, error } = await supabase
    .from("case_studies")
    .select(CASE_STUDY_LIST_SELECT)
    .eq("published", true)
    .order("display_order", { ascending: true })

  return {
    data: (data as CaseStudyRowWithCategories[] | null) ?? null,
    error: error ? new Error(error.message) : null,
  }
}

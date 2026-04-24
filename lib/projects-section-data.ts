import { supabase } from "@/lib/supabase"

/** Case studies without a linked service / category bucket (still shown under one tab). */
export const UNCATEGORIZED_TAB_SLUG = "__uncategorized__"

export type ProjectSectionServiceCategory = {
  id: string
  slug: string
  name: string
  display_order: number
}

export type HomeProjectCard = {
  id: string
  slug: string
  title: string
  image: string
  /** `service_categories.slug` from `case_studies` → `services`, or `UNCATEGORIZED_TAB_SLUG`. */
  serviceCategorySlug: string
}

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=800&h=1000"

type ServiceJoin = {
  name: string | null
  slug: string | null
  service_categories: {
    id: string
    slug: string
    name: string
    display_order: number | null
  } | null
} | null

type CaseStudyProjectRow = {
  id: string
  slug: string
  h1_title: string | null
  hero_image: string | null
  display_order: number | null
  services: ServiceJoin
}

const CASE_STUDY_PROJECTS_SELECT = `
  id,
  slug,
  h1_title,
  hero_image,
  display_order,
  services:linked_service_id (
    name,
    slug,
    service_categories!services_category_id_fkey (
      id,
      slug,
      name,
      display_order
    )
  )
`

const UNCATEGORIZED_TAB: ProjectSectionServiceCategory = {
  id: "uncategorized-tab",
  slug: UNCATEGORIZED_TAB_SLUG,
  name: "Other",
  display_order: 999,
}

/** Prefer the first tab that has at least one case study; else first tab in Supabase order. */
export function pickInitialCategorySlug(
  categories: ProjectSectionServiceCategory[],
  cards: HomeProjectCard[]
): string {
  const counts = new Map<string, number>()
  for (const c of cards) {
    counts.set(c.serviceCategorySlug, (counts.get(c.serviceCategorySlug) ?? 0) + 1)
  }
  for (const cat of categories) {
    if ((counts.get(cat.slug) ?? 0) > 0) return cat.slug
  }
  return categories[0]?.slug ?? ""
}

/**
 * Homepage “Our work”: published `case_studies` plus `service_categories` tabs
 * that actually have at least one linked case study (`linked_service_id` → `services` → category).
 */
export async function fetchHomepageProjectsData(): Promise<{
  cards: HomeProjectCard[]
  categories: ProjectSectionServiceCategory[]
  error: string | null
}> {
  const [catsRes, studiesRes] = await Promise.all([
    supabase
      .from("service_categories")
      .select("id, name, slug, display_order")
      .order("display_order", { ascending: true }),
    supabase
      .from("case_studies")
      .select(CASE_STUDY_PROJECTS_SELECT)
      .eq("published", true)
      .order("display_order", { ascending: true }),
  ])

  if (catsRes.error) {
    return { cards: [], categories: [], error: catsRes.error.message }
  }
  if (studiesRes.error) {
    return { cards: [], categories: [], error: studiesRes.error.message }
  }

  const dbCategories = (catsRes.data ?? []) as ProjectSectionServiceCategory[]
  const rows = (studiesRes.data as CaseStudyProjectRow[] | null) ?? []

  const cards: HomeProjectCard[] = rows.map((row) => {
    const s = row.services
    const sc = s?.service_categories
    const rawSlug = (sc?.slug ?? "").trim()
    const serviceCategorySlug = rawSlug.length > 0 ? rawSlug : UNCATEGORIZED_TAB_SLUG
    const img = (row.hero_image ?? "").trim()
    return {
      id: row.id,
      slug: row.slug,
      title: (row.h1_title ?? "").trim() || "Case study",
      image: img.length > 0 ? img : FALLBACK_IMAGE,
      serviceCategorySlug,
    }
  })

  const slugSet = new Set(cards.map((c) => c.serviceCategorySlug))
  const hasUncategorized = slugSet.has(UNCATEGORIZED_TAB_SLUG)

  /** Every Supabase service category (ordered), so all buckets appear in the UI. */
  const categories: ProjectSectionServiceCategory[] = dbCategories.map((c) => ({
    ...c,
    display_order: typeof c.display_order === "number" ? c.display_order : 0,
  }))

  if (hasUncategorized) {
    categories.push(UNCATEGORIZED_TAB)
  }

  categories.sort((a, b) => a.display_order - b.display_order)

  return { cards, categories, error: null }
}

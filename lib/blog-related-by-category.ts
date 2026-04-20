import { supabase } from "@/lib/supabase"
import {
  sortContentCategories,
  type BlogContentCategoryJoin,
} from "@/lib/content-categories"
import type { ContentCategory } from "@/lib/supabase"

export type RelatedBlogPostCard = {
  id: string
  slug: string
  title: string
  excerpt: string
  image_url: string
  categoryLabel: string
}

type BlogRow = {
  id: string
  slug: string
  seo_title: string | null
  meta_description: string | null
  hero_image: string | null
  published_at: string | null
  published: boolean | null
  blog_content_categories?: BlogContentCategoryJoin[] | null
}

function primaryCategoryName(row: BlogRow): string {
  const joins = row.blog_content_categories
  if (!Array.isArray(joins)) return "Insight"
  const cats: ContentCategory[] = []
  for (const j of joins) {
    const cc = j.content_categories
    if (cc && typeof cc.id === "string") cats.push(cc)
  }
  const sorted = sortContentCategories(cats)
  return sorted[0]?.name ?? "Insight"
}

/**
 * Other published blogs that share at least one `content_categories` id with this post.
 * Ordered by `published_at` descending.
 */
export async function fetchRelatedBlogsBySharedCategories(
  currentBlogId: string,
  contentCategoryIds: string[],
  limit = 6
): Promise<RelatedBlogPostCard[]> {
  const catIds = [...new Set(contentCategoryIds)].filter(Boolean)
  if (!catIds.length) return []

  const { data: links, error: linkErr } = await supabase
    .from("blog_content_categories")
    .select("blog_id")
    .in("content_category_id", catIds)

  if (linkErr || !links?.length) return []

  const candidateIds = [
    ...new Set(links.map((l: { blog_id: string }) => l.blog_id)),
  ].filter((id) => id !== currentBlogId)

  if (!candidateIds.length) return []

  const { data: blogs, error: blogErr } = await supabase
    .from("blogs")
    .select(
      `
      id,
      slug,
      seo_title,
      meta_description,
      hero_image,
      published_at,
      published,
      blog_content_categories (
        content_categories ( id, name, slug, display_order )
      )
    `
    )
    .in("id", candidateIds)
    .eq("published", true)

  if (blogErr || !blogs?.length) return []

  const rows = blogs as BlogRow[]
  rows.sort((a, b) => {
    const ta = new Date(a.published_at ?? 0).getTime()
    const tb = new Date(b.published_at ?? 0).getTime()
    return tb - ta
  })

  return rows.slice(0, limit).map((r) => ({
    id: r.id,
    slug: r.slug,
    title: (r.seo_title ?? "Blog").trim() || "Blog",
    excerpt: (r.meta_description ?? "").trim(),
    image_url: (r.hero_image ?? "").trim(),
    categoryLabel: primaryCategoryName(r),
  }))
}

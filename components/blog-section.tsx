import { createClient } from "@supabase/supabase-js"
import {
  BlogRowWithCategories,
  blogRowToBlogPost,
} from "@/lib/content-categories"
import BlogSectionMarquee, {
  type BlogMarqueeItem,
} from "@/components/blog-section-marquee"
import BlogSectionHeader from "@/components/blog-section-header"

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=1200&h=800"

function formatMarqueeDate(iso: string | null | undefined): string {
  if (!iso) return ""
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return ""
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
}

async function getLatestBlogs(): Promise<BlogMarqueeItem[]> {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY!
  )

  const { data, error } = await supabase
    .from("blogs")
    .select(`*, blog_content_categories (content_categories ( id, name, slug, display_order ))`)
    .eq("published", true)
    .order("published_at", { ascending: false })
    .limit(10)

  if (error) return []

  const rows = (data as BlogRowWithCategories[] | null) ?? []
  return rows.map((row) => {
    const post = blogRowToBlogPost(row)
    return {
      id: post.id, slug: post.slug, title: post.title,
      category: post.category, image: post.image_url || FALLBACK_IMAGE,
      date: formatMarqueeDate(post.published_at),
    }
  })
}

export default async function BlogSection() {
  const items = await getLatestBlogs()
  if (!items.length) return null

  return (
    <section className="bg-background py-16 md:py-20 overflow-hidden border-t border-border">
      <BlogSectionHeader />

      <BlogSectionMarquee items={items} />
    </section>
  )
}

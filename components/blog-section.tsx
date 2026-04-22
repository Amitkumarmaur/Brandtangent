import Link from "next/link"
import { createClient } from "@supabase/supabase-js"
import {
  BlogRowWithCategories,
  blogRowToBlogPost,
} from "@/lib/content-categories"
import BlogSectionMarquee, {
  type BlogMarqueeItem,
} from "@/components/blog-section-marquee"

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=1200&h=800"

function formatMarqueeDate(iso: string | null | undefined): string {
  if (!iso) return ""
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return ""
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  })
}

async function getLatestBlogs(): Promise<BlogMarqueeItem[]> {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY!
  )

  const { data, error } = await supabase
    .from("blogs")
    .select(
      `
        *,
        blog_content_categories (
          content_categories ( id, name, slug, display_order )
        )
      `
    )
    .eq("published", true)
    .order("published_at", { ascending: false })
    .limit(10)

  if (error) {
    console.error("[BlogSection] Supabase error:", error.message)
    return []
  }

  const rows = (data as BlogRowWithCategories[] | null) ?? []
  return rows.map((row) => {
    const post = blogRowToBlogPost(row)
    return {
      id: post.id,
      slug: post.slug,
      title: post.title,
      category: post.category,
      image: post.image_url || FALLBACK_IMAGE,
      date: formatMarqueeDate(post.published_at),
    }
  })
}

export default async function BlogSection() {
  const items = await getLatestBlogs()

  if (!items.length) return null

  return (
    <section className="bg-grey-100 relative py-16 md:py-20 overflow-hidden border-t border-grey-200">
      <div className="w-full max-w-7xl mx-auto px-6 lg:px-8 relative z-10 mb-8 md:mb-12">
        <div className="flex flex-col xl:flex-row xl:items-end justify-between gap-6 md:gap-8">
          <div className="flex-1 xl:flex-shrink-0 pr-4">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-2 h-2 rounded-full bg-ignite-orange" />
              <span className="font-heading text-ignite-orange font-medium tracking-wider uppercase text-sm">
                Our Blog
              </span>
            </div>
            <h2 className="font-heading text-3xl md:text-4xl lg:text-5xl font-semibold text-foreground tracking-tight leading-tight max-w-3xl">
              What&apos;s Happening in <br className="hidden md:block" />
              The Industry?
            </h2>
          </div>

          <div className="flex justify-start xl:justify-end w-full xl:w-auto mt-2 md:mt-0 xl:mb-2">
            <Link
              href="/blog"
              className="bg-foreground hover:bg-grey-800 transition-colors text-white font-medium tracking-wide text-sm md:text-base py-3 px-8 rounded-full shadow-lg inline-block"
            >
              View All Blogs
            </Link>
          </div>
        </div>
      </div>

      <BlogSectionMarquee items={items} />
    </section>
  )
}

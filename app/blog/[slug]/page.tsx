import { notFound } from "next/navigation"
import { supabase } from "@/lib/supabase"
import { estimateReadTimeFromMarkdown } from "@/lib/blog"
import { fetchRelatedBlogsBySharedCategories } from "@/lib/blog-related-by-category"
import {
  blogRowToBlogPost,
  flattenBlogContentCategories,
  formatBlogCategoriesForHero,
  type BlogRowWithCategories,
} from "@/lib/content-categories"
import { Metadata } from "next"
import Header from "@/components/header"
import Footer from "@/components/footer"
import BlogPostHero from "@/components/blog/blog-post-hero"
import BlogPostContent from "@/components/blog/blog-post-content"
import BlogRelatedPosts from "@/components/blog/blog-related-posts"
import CaseStudyCTA from "@/components/case-studies/case-study-cta"

export const revalidate = 0

/** Pre-render all published post URLs from Supabase (ISR-friendly). */
export async function generateStaticParams() {
  const { data } = await supabase
    .from("blogs")
    .select("slug")
    .eq("published", true)

  return (data ?? []).map((row) => ({ slug: row.slug }))
}

/* ── SEO Metadata (columns: seo_title, meta_description, hero_image, published) ── */

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const resolvedParams = await params
  const { data: row } = await supabase
    .from("blogs")
    .select("seo_title, meta_description, hero_image, published")
    .eq("slug", resolvedParams.slug)
    .eq("published", true)
    .maybeSingle()

  if (!row) {
    return { title: "Blog | Brandtangent" }
  }

  const title = (row.seo_title ?? "Blog").trim() || "Blog"
  const description =
    (row.meta_description ?? "").trim() ||
    "Read the latest insights from Brandtangent."

  const meta: Metadata = {
    title: `${title} | Brandtangent`,
    description,
    openGraph: {
      title: `${title} | Brandtangent`,
      description,
      type: "article",
    },
  }

  const hero = (row.hero_image ?? "").trim()
  if (hero) {
    meta.openGraph = { ...meta.openGraph, images: [{ url: hero }] }
  }

  return meta
}

/* ── Page ─────────────────────────────────────────────────────────────────── */

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const resolvedParams = await params

  const { data: row, error } = await supabase
    .from("blogs")
    .select(
      `
      *,
      blog_content_categories (
        content_categories ( id, name, slug, display_order )
      )
    `
    )
    .eq("slug", resolvedParams.slug)
    .eq("published", true)
    .maybeSingle()

  if (error || !row) return notFound()

  const typed = row as BlogRowWithCategories
  const post = blogRowToBlogPost(typed)
  const categoryHero = formatBlogCategoriesForHero(
    post.content_categories,
    typed.category
  )
  const readTime = estimateReadTimeFromMarkdown(post.content)

  const sharedCategoryIds = flattenBlogContentCategories(typed).map((c) => c.id)
  const relatedPosts = await fetchRelatedBlogsBySharedCategories(
    typed.id,
    sharedCategoryIds,
    6
  )

  return (
    <main className="bg-white min-h-screen text-foreground bg-background bg-background bg-background overflow-hidden font-sans">
      <Header />

      <BlogPostHero
        title={post.title}
        category={categoryHero}
        date={post.published_at}
        image={post.image_url}
        authorName={post.author_name}
        authorImage={post.author_image}
        readTime={readTime}
      />

      <BlogPostContent content={post.content} />

      <BlogRelatedPosts items={relatedPosts} />

      <CaseStudyCTA />

      <Footer />
    </main>
  )
}

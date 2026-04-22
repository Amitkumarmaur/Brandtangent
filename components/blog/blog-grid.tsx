"use client"

import { useState, useEffect, useCallback } from "react"
import { motion } from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import type { BlogPost } from "@/lib/supabase"
import {
  ALL_ARTICLES_LABEL,
  blogRowToBlogPost,
  fetchBlogsPage,
  fetchContentCategories,
  sortContentCategories,
} from "@/lib/content-categories"

const PAGE_SIZE = 10

/** Badge text: when a filter chip is active, show that topic if the post has it; else primary. */
function categoryBadgeForCard(post: BlogPost, activeCategorySlug: string | null): string {
  if (activeCategorySlug && post.content_categories?.some((c) => c.slug === activeCategorySlug)) {
    const hit = post.content_categories.find((c) => c.slug === activeCategorySlug)
    if (hit?.name) return hit.name
  }
  return post.category
}

function BlogCard({
  post,
  variant,
  activeCategorySlug,
}: {
  post: BlogPost
  variant: "featured" | "grid"
  activeCategorySlug: string | null
}) {
  const isFeatured = variant === "featured"
  const badge = categoryBadgeForCard(post, activeCategorySlug)

  return (
    <Link
      href={`/blog/${post.slug}`}
      className={
        isFeatured
          ? "group flex flex-col md:flex-row bg-white rounded-[2rem] overflow-hidden border border-grey-200 shadow-sm hover:shadow-md transition-shadow"
          : "group flex flex-col bg-white rounded-[2rem] overflow-hidden border border-grey-200 shadow-sm hover:shadow-md transition-shadow h-full"
      }
    >
      <div
        className={
          isFeatured
            ? "relative w-full md:w-1/2 lg:w-3/5 h-64 md:h-auto min-h-[300px] overflow-hidden"
            : "relative w-full h-56 m-2 flex-shrink-0 rounded-[1.5rem] overflow-hidden bg-grey-100"
        }
      >
        <Image
          src={post.image_url}
          alt={post.title}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-700"
        />
        <div className={`absolute ${isFeatured ? "top-6 left-6" : "top-4 left-4"} z-10`}>
          <span
            className={
              isFeatured
                ? "bg-ignite-orange text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider backdrop-blur-md"
                : "bg-foreground/50 backdrop-blur-md text-white border border-white/20 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider"
            }
          >
            {badge}
          </span>
        </div>
      </div>
      <div
        className={
          isFeatured
            ? "p-8 md:p-12 lg:p-16 flex flex-col justify-center w-full md:w-1/2 lg:w-2/5"
            : "p-6 flex flex-col flex-grow"
        }
      >
        <span
          className={`text-grey-400 ${isFeatured ? "text-sm font-medium mb-4" : "text-sm font-medium mb-4"}`}
        >
          {new Date(post.published_at).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          })}
        </span>
        {isFeatured ? (
          <h2 className="heading-h2 text-foreground mb-4 group-hover:text-ignite-orange transition-colors">
            {post.title}
          </h2>
        ) : (
          <h3 className="heading-h3 text-foreground mb-3 group-hover:text-ignite-orange transition-colors">
            {post.title}
          </h3>
        )}
        <p className={isFeatured ? "text-body mb-8" : "text-body line-clamp-3 mb-6"}>{post.excerpt}</p>
        <div className="mt-auto">
          <span
            className={
              isFeatured
                ? "text-foreground font-medium flex items-center gap-2 group-hover:gap-3 transition-all"
                : "text-foreground font-medium text-sm flex items-center gap-2 group-hover:gap-3 transition-all"
            }
          >
            Read Article
            <svg
              width={isFeatured ? 20 : 16}
              height={isFeatured ? 20 : 16}
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-ignite-orange"
            >
              <path d="M5 12h14" />
              <path d="m12 5 7 7-7 7" />
            </svg>
          </span>
        </div>
      </div>
    </Link>
  )
}

export default function BlogGrid() {
  const [activeCategorySlug, setActiveCategorySlug] = useState<string | null>(null)
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [hasMore, setHasMore] = useState(false)
  const [filterCategories, setFilterCategories] = useState<{ name: string; slug: string }[]>([])
  const [loadError, setLoadError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      const fromDb = await fetchContentCategories()
      if (cancelled) return
      setFilterCategories(
        sortContentCategories(fromDb).map((c) => ({
          name: c.name,
          slug: c.slug,
        }))
      )
    })()
    return () => {
      cancelled = true
    }
  }, [])

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      setLoading(true)
      setLoadError(null)
      setPosts([])
      setHasMore(false)

      const page = await fetchBlogsPage(activeCategorySlug, PAGE_SIZE, 0)
      if (cancelled) return

      if (page.error) {
        setLoadError(page.error.message)
        setLoading(false)
        return
      }

      setPosts(page.data.map(blogRowToBlogPost))
      setHasMore(page.hasMore)
      setLoading(false)
    })()
    return () => {
      cancelled = true
    }
  }, [activeCategorySlug])

  const handleLoadMore = useCallback(async () => {
    if (loadingMore || !hasMore) return
    setLoadingMore(true)
    const page = await fetchBlogsPage(
      activeCategorySlug,
      PAGE_SIZE,
      posts.length
    )
    if (page.error) {
      setLoadError(page.error.message)
      setLoadingMore(false)
      return
    }
    setPosts((prev) => [...prev, ...page.data.map(blogRowToBlogPost)])
    setHasMore(page.hasMore)
    setLoadingMore(false)
  }, [activeCategorySlug, hasMore, loadingMore, posts.length])

  const isFiltered = activeCategorySlug !== null
  const showFeatured = !isFiltered && posts.length > 0
  const featuredPost = showFeatured ? posts[0] : null
  const gridPosts = showFeatured ? posts.slice(1) : posts
  const showInitialSpinner = loading && posts.length === 0

  return (
    <section className="relative w-full py-16 md:py-20 bg-grey-100 overflow-hidden">
      <div className="w-full max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
        <div className="flex flex-wrap gap-3 mb-12 border-b border-grey-200 pb-8">
          <button
            type="button"
            onClick={() => setActiveCategorySlug(null)}
            className={`px-5 py-2 rounded-full text-sm font-medium transition-colors ${
              activeCategorySlug === null
                ? "bg-foreground text-white hover:bg-grey-800"
                : "bg-white border border-grey-200 text-foreground hover:bg-grey-50"
            }`}
          >
            {ALL_ARTICLES_LABEL}
          </button>
          {filterCategories.map((cat) => (
            <button
              type="button"
              key={cat.slug}
              onClick={() => setActiveCategorySlug(cat.slug)}
              className={`px-5 py-2 rounded-full text-sm font-medium transition-colors ${
                activeCategorySlug === cat.slug
                  ? "bg-foreground text-white hover:bg-grey-800"
                  : "bg-white border border-grey-200 text-foreground hover:bg-grey-50"
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {loadError && (
          <p className="text-sm text-red-600 mb-8" role="alert">
            Could not load posts: {loadError}
          </p>
        )}

        {showInitialSpinner && (
          <div className="min-h-[300px] flex items-center justify-center">
            <div className="w-8 h-8 border-4 border-ignite-orange border-t-transparent rounded-full animate-spin" />
          </div>
        )}

        {!loadError && !showInitialSpinner && posts.length === 0 && (
          <p className="text-body text-grey-500 mb-12">
            {isFiltered
              ? "No published posts in this category yet."
              : "No published posts yet."}
          </p>
        )}

        {featuredPost && (
          <motion.div
            key={`featured-${featuredPost.id}`}
            className="mb-12 cursor-pointer"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
          >
            <BlogCard
              post={featuredPost}
              variant="featured"
              activeCategorySlug={activeCategorySlug}
            />
          </motion.div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {gridPosts.map((post) => (
            <div key={post.id} className="h-full">
              <BlogCard
                post={post}
                variant="grid"
                activeCategorySlug={activeCategorySlug}
              />
            </div>
          ))}
        </div>

        {hasMore && !showInitialSpinner && (
          <div className="flex justify-center mt-12 md:mt-16">
            <button
              type="button"
              onClick={handleLoadMore}
              disabled={loadingMore}
              className="bg-foreground text-white text-sm md:text-base font-medium tracking-wide py-3 px-8 rounded-full shadow-lg hover:bg-grey-800 transition-colors disabled:opacity-60 disabled:cursor-wait inline-flex items-center gap-3"
            >
              {loadingMore ? (
                <>
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Loading...
                </>
              ) : (
                "Load More Articles"
              )}
            </button>
          </div>
        )}
      </div>
    </section>
  )
}

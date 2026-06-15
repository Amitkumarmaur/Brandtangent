"use client"

import { useState, useEffect, useCallback } from "react"
import Link from "next/link"
import { motion, AnimatePresence } from "motion/react"
import { ArrowRight, Mail, Search } from "lucide-react"

import { Button } from "@/components/ui/button"
import { BlogPostCard } from "@/components/blog/blog-post-card"
import type { BlogPost } from "@/lib/supabase"
import {
  ALL_ARTICLES_LABEL,
  blogRowToBlogPost,
  fetchBlogsPage,
  fetchContentCategories,
  sortContentCategories,
} from "@/lib/content-categories"

const PAGE_SIZE = 9

function categoryBadgeForCard(post: BlogPost, activeCategorySlug: string | null): string {
  if (activeCategorySlug && post.content_categories?.some((c) => c.slug === activeCategorySlug)) {
    const hit = post.content_categories.find((c) => c.slug === activeCategorySlug)
    if (hit?.name) return hit.name
  }
  return post.category
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
      setFilterCategories(sortContentCategories(fromDb).map((c) => ({ name: c.name, slug: c.slug })))
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
    const page = await fetchBlogsPage(activeCategorySlug, PAGE_SIZE, posts.length)
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
    <>
      <section
        id="blog-grid"
        className="relative w-full overflow-hidden border-t border-border bg-background py-16 md:py-20"
      >
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.35]"
          aria-hidden
          style={{
            background:
              "radial-gradient(ellipse 80% 50% at 50% 0%, rgba(83,58,253,0.06), transparent 70%)",
          }}
        />

        <div className="relative mx-auto w-full max-w-7xl px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="mb-10 flex flex-col gap-6 lg:mb-14 lg:flex-row lg:items-end lg:justify-between"
          >
            <div>
              <div className="mb-4 flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-primary" />
                <span className="micro-cap text-muted-foreground">All articles</span>
              </div>
              <h2 className="display-lg text-foreground">Browse by topic</h2>
              <p className="text-subtitle mt-2 max-w-lg">
                Filter by theme or scroll the full library — strategy, creative, and
                growth in one place.
              </p>
            </div>

            <div className="flex items-center gap-2 rounded-full border border-border bg-card/80 px-4 py-2 text-sm text-muted-foreground shadow-[var(--shadow-1)] backdrop-blur-sm">
              <Search className="h-4 w-4 shrink-0" />
              <span>{posts.length} article{posts.length === 1 ? "" : "s"} shown</span>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="sticky top-[4.5rem] z-30 mb-12 -mx-1 overflow-x-auto px-1 pb-2"
          >
            <div className="flex min-w-max flex-wrap gap-2 rounded-md border border-border/60 bg-background/90 p-2 shadow-[var(--shadow-1)] backdrop-blur-md">
              <FilterPill
                active={activeCategorySlug === null}
                onClick={() => setActiveCategorySlug(null)}
                label={ALL_ARTICLES_LABEL}
              />
              {filterCategories.map((cat) => (
                <FilterPill
                  key={cat.slug}
                  active={activeCategorySlug === cat.slug}
                  onClick={() => setActiveCategorySlug(cat.slug)}
                  label={cat.name}
                />
              ))}
            </div>
          </motion.div>

          {loadError && (
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-8 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-600"
              role="alert"
            >
              Could not load posts: {loadError}
            </motion.p>
          )}

          {showInitialSpinner && (
            <div className="flex min-h-[400px] items-center justify-center">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                className="h-8 w-8 rounded-full border-[3px] border-border border-t-primary"
              />
            </div>
          )}

          {!loadError && !showInitialSpinner && posts.length === 0 && (
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="py-16 text-center text-muted-foreground"
            >
              {isFiltered ? "No published posts in this category yet." : "No published posts yet."}
            </motion.p>
          )}

          <AnimatePresence mode="wait">
            {featuredPost && (
              <motion.div
                key={`featured-${featuredPost.id}`}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                className="mb-12 lg:mb-16"
              >
                <BlogPostCard
                  post={featuredPost}
                  variant="featured"
                  categoryLabel={categoryBadgeForCard(featuredPost, activeCategorySlug)}
                />
              </motion.div>
            )}
          </AnimatePresence>

          <motion.div layout className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 lg:gap-8">
            <AnimatePresence mode="popLayout">
              {gridPosts.map((post, idx) => (
                <motion.div
                  key={post.id}
                  layout
                  initial={{ opacity: 0, scale: 0.96, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.96 }}
                  transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                  className="h-full"
                >
                  <BlogPostCard
                    post={post}
                    variant="default"
                    index={idx}
                    categoryLabel={categoryBadgeForCard(post, activeCategorySlug)}
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>

          {hasMore && !showInitialSpinner && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mt-16 flex justify-center md:mt-20"
            >
              <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
                <Button
                  size="lg"
                  onClick={handleLoadMore}
                  disabled={loadingMore}
                  className="min-w-[220px]"
                >
                  {loadingMore ? (
                    <>
                      <motion.span
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                        className="h-4 w-4 rounded-full border-2 border-white border-t-transparent"
                      />
                      Loading...
                    </>
                  ) : (
                    <>
                      Load more articles
                      <ArrowRight className="h-4 w-4" />
                    </>
                  )}
                </Button>
              </motion.div>
            </motion.div>
          )}
        </div>
      </section>

      <BlogNewsletterCta />
    </>
  )
}

function FilterPill({
  label,
  active,
  onClick,
}: {
  label: string
  active: boolean
  onClick: () => void
}) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
      className={`rounded-full px-5 py-2.5 text-sm font-semibold transition-all duration-200 ${
        active
          ? "bg-primary text-white shadow-[var(--shadow-accent-orange)]"
          : "bg-transparent text-foreground hover:bg-secondary"
      }`}
    >
      {label}
    </motion.button>
  )
}

function BlogNewsletterCta() {
  return (
    <section className="relative overflow-hidden border-t border-white/10 bg-primary py-16 md:py-20">
      <motion.div
        className="pointer-events-none absolute -left-20 top-0 h-64 w-64 rounded-full bg-white/5 blur-3xl"
        animate={{ scale: [1, 1.15, 1], opacity: [0.4, 0.7, 0.4] }}
        transition={{ duration: 6, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
        aria-hidden
      />
      <motion.div
        className="pointer-events-none absolute -right-16 bottom-0 h-72 w-72 rounded-full bg-accent-orange/20 blur-3xl"
        animate={{ scale: [1.1, 1, 1.1], opacity: [0.3, 0.55, 0.3] }}
        transition={{ duration: 7, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
        aria-hidden
      />

      <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="mx-auto max-w-2xl text-center"
        >
          <span className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-white/90">
            <Mail className="h-3.5 w-3.5" />
            Stay in the loop
          </span>
          <h2 className="display-lg mb-4 text-white">Strategy in your inbox</h2>
          <p className="mb-8 text-base text-white/70">
            Get brand and growth insights when we publish — no fluff, just frameworks
            that compound.
          </p>
          <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
            <Button
              size="lg"
              variant="secondary"
              className="bg-white text-primary hover:bg-white/90"
              asChild
            >
              <Link href="/#contact">
                Get in touch
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}

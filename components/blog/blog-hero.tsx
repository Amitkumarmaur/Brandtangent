"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { LayoutGroup, motion, useScroll, useTransform } from "motion/react"
import { ArrowRight, BookOpen, Lightbulb, PenLine, Sparkles } from "lucide-react"

import { Button } from "@/components/ui/button"
import { TextRotate } from "@/components/ui/text-rotate"
import { ElegantShapesBackground } from "@/components/landing/elegant-shapes"
import { GradientMesh } from "@/components/motion/gradient-mesh"
import BlogHeroShowcase from "@/components/blog/blog-hero-showcase"
import {
  blogRowToBlogPost,
  fetchBlogsPage,
  fetchContentCategories,
  sortContentCategories,
} from "@/lib/content-categories"
import type { BlogPost } from "@/lib/supabase"

const highlights = [
  {
    icon: Lightbulb,
    title: "Strategy-first",
    body: "Frameworks that connect brand decisions to measurable growth.",
  },
  {
    icon: PenLine,
    title: "Practical",
    body: "Playbooks you can apply — not theory for its own sake.",
  },
  {
    icon: Sparkles,
    title: "Category leaders",
    body: "Written for founders who want to lead, not follow.",
  },
]

const fadeUp = {
  hidden: { opacity: 0, y: 32 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.75,
      delay: 0.15 + i * 0.1,
      ease: [0.22, 1, 0.36, 1] as const,
    },
  }),
}

export default function BlogHero() {
  const { scrollY } = useScroll()
  const meshOpacity = useTransform(scrollY, [0, 450], [1, 0.2])
  const contentY = useTransform(scrollY, [0, 600], [0, -70])
  const showcaseY = useTransform(scrollY, [0, 600], [0, 50])

  const [featuredPosts, setFeaturedPosts] = useState<BlogPost[]>([])
  const [stats, setStats] = useState([
    { value: "50+", label: "Articles" },
    { value: "5", label: "Topics" },
    { value: "10K+", label: "Monthly reads" },
  ])

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      const [page, categories] = await Promise.all([
        fetchBlogsPage(null, 3, 0),
        fetchContentCategories(),
      ])
      if (cancelled) return

      const posts = (page.data ?? []).map(blogRowToBlogPost)
      setFeaturedPosts(posts)

      const sorted = sortContentCategories(categories)
      setStats([
        { value: `${Math.max(posts.length, 1)}+`, label: "Featured reads" },
        { value: String(Math.max(sorted.length, 1)), label: "Topics" },
        { value: "10K+", label: "Monthly reads" },
      ])
    })()
    return () => {
      cancelled = true
    }
  }, [])

  return (
    <section className="relative min-h-[88vh] overflow-hidden border-t border-border bg-background pb-12 pt-28 sm:pt-32 lg:pt-36 md:pb-16">
      <motion.div
        className="pointer-events-none absolute inset-0"
        style={{ opacity: meshOpacity }}
      >
        <GradientMesh />
      </motion.div>

      <ElegantShapesBackground />

      <div className="pointer-events-none absolute inset-0 opacity-[0.04]" aria-hidden>
        <div
          className="h-full w-full"
          style={{
            backgroundImage: `
              linear-gradient(var(--hairline) 1px, transparent 1px),
              linear-gradient(90deg, var(--hairline) 1px, transparent 1px)
            `,
            backgroundSize: "48px 48px",
          }}
        />
      </div>

      <div className="relative z-10 mx-auto w-full max-w-7xl px-6 lg:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <motion.div style={{ y: contentY }} className="text-left">
            <motion.div
              custom={0}
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              className="mb-6 inline-flex"
            >
              <span className="pill-tag inline-flex items-center gap-2">
                <BookOpen className="h-3 w-3 text-primary" strokeWidth={1.5} />
                Insights &amp; ideas
              </span>
            </motion.div>

            <motion.div custom={1} variants={fadeUp} initial="hidden" animate="visible">
              <h1 className="display-xxl mb-6 max-w-xl text-balance text-foreground">
                <span className="block">Thoughts on</span>
                <LayoutGroup>
                  <motion.span layout className="flex flex-wrap items-baseline gap-x-2">
                    <TextRotate
                      texts={["strategy", "creative", "growth", "systems"]}
                      mainClassName="text-primary"
                      staggerDuration={0.02}
                      staggerFrom="last"
                      rotationInterval={2800}
                      transition={{ type: "spring", damping: 30, stiffness: 400 }}
                    />
                  </motion.span>
                </LayoutGroup>
              </h1>
            </motion.div>

            <motion.p
              custom={2}
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              className="text-subtitle mb-8 max-w-md"
            >
              Explore our latest thinking on brand strategy, creative direction, and
              the systems that help brands lead their categories.
            </motion.p>

            <motion.div
              custom={3}
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              className="mb-10 flex flex-col items-start gap-3 sm:flex-row"
            >
              <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                <Button size="lg" asChild>
                  <a href="#blog-grid">
                    Browse articles
                    <ArrowRight className="h-4 w-4" />
                  </a>
                </Button>
              </motion.div>
              <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                <Button size="lg" variant="outline" asChild>
                  <Link href="/#contact">Start a project</Link>
                </Button>
              </motion.div>
            </motion.div>

            <motion.ul
              custom={4}
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              className="mb-10 space-y-3"
            >
              {highlights.map((item, i) => {
                const Icon = item.icon
                return (
                  <motion.li
                    key={item.title}
                    initial={{ opacity: 0, x: -16 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 + i * 0.1, duration: 0.5 }}
                    className="flex items-start gap-3"
                  >
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                      <Icon className="h-4 w-4 text-primary" strokeWidth={1.5} />
                    </div>
                    <div>
                      <p className="text-sm font-normal text-foreground">{item.title}</p>
                      <p className="text-caption">{item.body}</p>
                    </div>
                  </motion.li>
                )
              })}
            </motion.ul>

            <motion.div
              custom={5}
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              className="flex flex-wrap items-center gap-6 border-t border-border pt-6"
            >
              {stats.map(({ value, label }, i) => (
                <div key={label} className="flex items-center gap-6">
                  {i > 0 && <div className="hidden h-8 w-px bg-border sm:block" />}
                  <div>
                    <motion.p
                      className="tnum text-2xl font-light text-primary"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.7 + i * 0.1, type: "spring" }}
                    >
                      {value}
                    </motion.p>
                    <p className="text-caption">{label}</p>
                  </div>
                </div>
              ))}
            </motion.div>
          </motion.div>

          <motion.div
            style={{ y: showcaseY }}
            initial={{ opacity: 0, scale: 0.92, rotateY: -8 }}
            animate={{ opacity: 1, scale: 1, rotateY: 0 }}
            transition={{ duration: 1, delay: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="relative"
          >
            <BlogHeroShowcase posts={featuredPosts} />

            <motion.div
              className="pointer-events-none absolute -left-6 -top-6 h-28 w-28 rounded-full bg-primary/15 blur-3xl"
              animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.55, 0.3] }}
              transition={{
                duration: 4,
                repeat: Number.POSITIVE_INFINITY,
                ease: "easeInOut",
              }}
              aria-hidden
            />
            <motion.div
              className="pointer-events-none absolute -bottom-6 -right-6 h-36 w-36 rounded-full bg-[rgba(249,107,238,0.12)] blur-3xl"
              animate={{ scale: [1.2, 1, 1.2], opacity: [0.25, 0.5, 0.25] }}
              transition={{
                duration: 5,
                repeat: Number.POSITIVE_INFINITY,
                ease: "easeInOut",
              }}
              aria-hidden
            />
          </motion.div>
        </div>
      </div>

      <div className="hero-gradient pointer-events-none absolute bottom-0 left-0 right-0 h-20" />
    </section>
  )
}

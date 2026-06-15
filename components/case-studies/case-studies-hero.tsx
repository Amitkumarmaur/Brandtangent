"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { LayoutGroup, motion, useScroll, useTransform } from "motion/react"
import {
  ArrowRight,
  Briefcase,
  CheckCircle2,
  BarChart3,
  Layers,
  Target,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { TextRotate } from "@/components/ui/text-rotate"
import { ElegantShapesBackground } from "@/components/landing/elegant-shapes"
import { GradientMesh } from "@/components/motion/gradient-mesh"
import CaseStudiesHeroShowcase from "@/components/case-studies/case-studies-hero-showcase"
import {
  caseStudyRowToListItem,
  fetchAllPublishedCaseStudies,
  type CaseStudyListItem,
} from "@/lib/content-categories"

const highlights = [
  {
    icon: Target,
    title: "Brand-first",
    body: "Strategy and identity built for category leadership.",
  },
  {
    icon: BarChart3,
    title: "Measurable",
    body: "Every engagement ties back to growth you can report on.",
  },
  {
    icon: Layers,
    title: "Category depth",
    body: "Complex journeys and stakeholder-ready storytelling.",
  },
]

const stats = [
  { value: "30+", label: "Case studies" },
  { value: "12", label: "Industries" },
  { value: "98%", label: "Success rate" },
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

export default function CaseStudiesHero() {
  const { scrollY } = useScroll()
  const meshOpacity = useTransform(scrollY, [0, 450], [1, 0.2])
  const contentY = useTransform(scrollY, [0, 600], [0, -70])
  const showcaseY = useTransform(scrollY, [0, 600], [0, 50])

  const [featuredStudies, setFeaturedStudies] = useState<CaseStudyListItem[]>([])

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      const { data } = await fetchAllPublishedCaseStudies()
      if (cancelled) return
      const mapped = (data ?? []).map(caseStudyRowToListItem)
      setFeaturedStudies(mapped.slice(0, 3))
    })()
    return () => {
      cancelled = true
    }
  }, [])

  return (
    <section className="relative min-h-[90vh] overflow-hidden bg-background pt-28 sm:pt-32 lg:pt-36 pb-12 md:pb-16 border-t border-border">
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{ opacity: meshOpacity }}
      >
        <GradientMesh />
      </motion.div>

      <ElegantShapesBackground />

      <div className="absolute inset-0 opacity-[0.04] pointer-events-none" aria-hidden>
        <div
          className="w-full h-full"
          style={{
            backgroundImage: `
              linear-gradient(var(--hairline) 1px, transparent 1px),
              linear-gradient(90deg, var(--hairline) 1px, transparent 1px)
            `,
            backgroundSize: "48px 48px",
          }}
        />
      </div>

      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left — copy & actions */}
          <motion.div style={{ y: contentY }} className="text-left">
            <motion.div
              custom={0}
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              className="inline-flex mb-6"
            >
              <span className="pill-tag inline-flex items-center gap-2">
                <Briefcase className="w-3 h-3 text-primary" strokeWidth={1.5} />
                Portfolio
              </span>
            </motion.div>

            <motion.div custom={1} variants={fadeUp} initial="hidden" animate="visible">
              <h1 className="display-xxl text-foreground max-w-xl text-balance mb-6">
                <span className="block">Brand strategy</span>
                <span className="block">that drives</span>
                <LayoutGroup>
                  <motion.span
                    layout
                    className="flex flex-wrap items-baseline gap-x-2"
                  >
                    <TextRotate
                      texts={["results", "growth", "impact", "outcomes"]}
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
              className="text-subtitle max-w-md mb-8"
            >
              Strategy-led brand and creative for businesses that mean it — from
              identity systems to digital experiences. Explore how we connect
              strategy to measurable outcomes.
            </motion.p>

            <motion.div
              custom={3}
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              className="flex flex-col sm:flex-row items-start gap-3 mb-10"
            >
              <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                <Button size="lg" asChild>
                  <a href="#portfolio-grid">
                    Explore portfolio
                    <ArrowRight className="w-4 h-4" />
                  </a>
                </Button>
              </motion.div>
              <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                <Button size="lg" variant="outline" asChild>
                  <Link href="/#contact">Start a project</Link>
                </Button>
              </motion.div>
            </motion.div>

            {/* Animated highlight list */}
            <motion.ul
              custom={4}
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              className="space-y-3 mb-10"
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
                    <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                      <Icon className="w-4 h-4 text-primary" strokeWidth={1.5} />
                    </div>
                    <div>
                      <p className="text-sm font-normal text-foreground">{item.title}</p>
                      <p className="text-caption">{item.body}</p>
                    </div>
                  </motion.li>
                )
              })}
            </motion.ul>

            {/* Inline stats strip */}
            <motion.div
              custom={5}
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              className="flex flex-wrap items-center gap-6 pt-6 border-t border-border"
            >
              {stats.map(({ value, label }, i) => (
                <div key={label} className="flex items-center gap-6">
                  {i > 0 && <div className="hidden sm:block w-px h-8 bg-border" />}
                  <div>
                    <motion.p
                      className="text-2xl text-primary font-light tnum"
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

          {/* Right — 3D bento portfolio showcase */}
          <motion.div
            style={{ y: showcaseY }}
            initial={{ opacity: 0, scale: 0.9, rotateY: -8 }}
            animate={{ opacity: 1, scale: 1, rotateY: 0 }}
            transition={{ duration: 1, delay: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="relative"
          >
            <CaseStudiesHeroShowcase studies={featuredStudies} />

            <motion.div
              className="absolute -top-6 -left-6 w-28 h-28 bg-primary/15 rounded-full blur-3xl pointer-events-none"
              animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.55, 0.3] }}
              transition={{
                duration: 4,
                repeat: Number.POSITIVE_INFINITY,
                ease: "easeInOut",
              }}
              aria-hidden
            />
            <motion.div
              className="absolute -bottom-6 -right-6 w-36 h-36 bg-[rgba(249,107,238,0.12)] rounded-full blur-3xl pointer-events-none"
              animate={{ scale: [1.2, 1, 1.2], opacity: [0.25, 0.5, 0.25] }}
              transition={{
                duration: 5,
                repeat: Number.POSITIVE_INFINITY,
                ease: "easeInOut",
              }}
              aria-hidden
            />

            {/* Floating trust badge */}
            <motion.div
              className="absolute -top-4 right-4 glass rounded-full border border-border/60 px-3 py-1.5 flex items-center gap-2 shadow-[var(--shadow-1)]"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9 }}
            >
              <CheckCircle2 className="w-3.5 h-3.5 text-primary" />
              <span className="text-[11px] text-foreground font-light">
                5-star rated agency
              </span>
            </motion.div>
          </motion.div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-20 hero-gradient pointer-events-none" />
    </section>
  )
}

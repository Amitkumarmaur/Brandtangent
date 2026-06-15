"use client"

import { useEffect, useState, useCallback } from "react"
import {
  LayoutGroup,
  motion,
  AnimatePresence,
  useMotionValue,
  useScroll,
  useSpring,
  useTransform,
} from "motion/react"
import {
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  ChevronRight,
  Code2,
  Gauge,
  Shield,
  Zap,
} from "lucide-react"
import Image from "next/image"

import { Button } from "@/components/ui/button"
import { TextRotate } from "@/components/ui/text-rotate"
import { ElegantShapesBackground } from "@/components/landing/elegant-shapes"
import { GradientMesh } from "@/components/motion/gradient-mesh"
import { TiltCard } from "@/components/motion/tilt-card"
import { AboutGrain } from "@/components/about/about-grain"
import { fadeUp, lineReveal } from "@/components/about/about-motion"
import type { CategoryHeroProject } from "@/components/services/category-hero"
import WebDevelopmentHeroShowcase from "@/components/services/web-development-hero-showcase"

const FALLBACK_WORDS = ["Scalable", "Premium", "Fast", "Secure"]

const highlights = [
  { icon: Zap, title: "Lightning fast", body: "Core Web Vitals–optimized builds" },
  { icon: Shield, title: "Enterprise secure", body: "Auth, RLS, and hardened deployments" },
  { icon: Gauge, title: "Built to scale", body: "From MVP to multi-region SaaS" },
]

interface WebDevelopmentHeroProps {
  badge: string
  badgeIconUrl?: string | null
  badgeIconGlyph?: string | null
  displayTitle: string
  description: string
  animatedWords?: string[]
  statValue?: string | null
  statLabel?: string | null
  projects: CategoryHeroProject[]
}

function splitTitleLines(title: string): string[] {
  const t = (title ?? "").trim()
  if (!t) return [""]
  if (t.includes("\n")) return t.split("\n").map((s) => s.trim()).filter(Boolean)
  if (t.includes("<br")) return t.split(/<br\s*\/?>/i).map((s) => s.trim()).filter(Boolean)
  const parts = t.split(/\s+/)
  if (parts.length <= 1) return [t]
  const mid = Math.ceil(parts.length / 2)
  return [parts.slice(0, mid).join(" "), parts.slice(mid).join(" ")]
}

function isHttpUrl(s: string | null | undefined): boolean {
  const t = (s ?? "").trim().toLowerCase()
  return t.startsWith("http://") || t.startsWith("https://")
}

export default function WebDevelopmentHero({
  badge,
  badgeIconUrl,
  badgeIconGlyph,
  displayTitle,
  description,
  animatedWords,
  statValue,
  statLabel,
  projects,
}: WebDevelopmentHeroProps) {
  const words =
    animatedWords && animatedWords.length > 0 ? animatedWords : FALLBACK_WORDS
  const hasProjects = projects.length > 0

  const [slideIdx, setSlideIdx] = useState(0)
  const [paused, setPaused] = useState(false)

  const { scrollY, scrollYProgress } = useScroll()
  const progressScaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30 })
  const meshOpacity = useTransform(scrollY, [0, 500], [1, 0.15])
  const contentY = useTransform(scrollY, [0, 700], [0, -80])
  const showcaseY = useTransform(scrollY, [0, 700], [0, 50])

  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)
  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [5, -5]), {
    stiffness: 120,
    damping: 18,
  })
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-5, 5]), {
    stiffness: 120,
    damping: 18,
  })

  useEffect(() => {
    if (paused || !hasProjects || projects.length <= 1) return
    const t = setInterval(() => setSlideIdx((i) => (i + 1) % projects.length), 4500)
    return () => clearInterval(t)
  }, [paused, projects.length, hasProjects])

  const next = useCallback(
    () => setSlideIdx((i) => (hasProjects ? (i + 1) % projects.length : 0)),
    [projects.length, hasProjects],
  )
  const prev = useCallback(
    () => setSlideIdx((i) => (hasProjects ? (i - 1 + projects.length) % projects.length : 0)),
    [projects.length, hasProjects],
  )

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const r = e.currentTarget.getBoundingClientRect()
    mouseX.set((e.clientX - r.left) / r.width - 0.5)
    mouseY.set((e.clientY - r.top) / r.height - 0.5)
    setPaused(true)
  }
  const handleMouseLeave = () => {
    mouseX.set(0)
    mouseY.set(0)
    setPaused(false)
  }

  const project = hasProjects ? projects[slideIdx] : null
  const titleLines = splitTitleLines(displayTitle)

  return (
    <section className="relative min-h-[88vh] overflow-hidden border-t border-border bg-background pb-12 pt-28 sm:pt-32 lg:pt-36 md:pb-16">
      <motion.div
        className="absolute left-0 right-0 top-0 z-50 h-[2px] origin-left bg-accent-orange"
        style={{ scaleX: progressScaleX }}
      />

      <motion.div
        className="pointer-events-none absolute inset-0"
        style={{ opacity: meshOpacity }}
      >
        <GradientMesh />
      </motion.div>

      <ElegantShapesBackground />
      <AboutGrain />

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
                {badgeIconUrl && isHttpUrl(badgeIconUrl) ? (
                  <Image
                    src={badgeIconUrl.trim()}
                    alt=""
                    width={14}
                    height={14}
                    className="rounded-sm object-cover"
                  />
                ) : badgeIconGlyph ? (
                  <span className="text-sm leading-none" aria-hidden>
                    {badgeIconGlyph}
                  </span>
                ) : (
                  <Code2 className="h-3 w-3 text-accent-orange" strokeWidth={1.5} />
                )}
                {badge}
              </span>
            </motion.div>

            <motion.div custom={1} variants={fadeUp} initial="hidden" animate="visible">
              <h1 className="mb-2 max-w-xl text-balance font-semibold leading-[0.95] tracking-[-0.04em] text-foreground [font-size:clamp(2.5rem,5.5vw,4.5rem)]">
                {titleLines.map((line, i) => (
                  <span
                    key={i}
                    className={`block ${i === 1 ? "text-muted-foreground" : ""}`}
                  >
                    {line}
                  </span>
                ))}
              </h1>
              <LayoutGroup>
                <motion.div layout className="mt-1 flex flex-wrap items-baseline gap-x-2">
                  <TextRotate
                    texts={words}
                    mainClassName="font-semibold text-accent-orange [font-size:clamp(2rem,4.5vw,3.5rem)] leading-[0.95] tracking-[-0.03em]"
                    staggerDuration={0.02}
                    staggerFrom="last"
                    rotationInterval={2600}
                    transition={{ type: "spring", damping: 28, stiffness: 380 }}
                  />
                </motion.div>
              </LayoutGroup>
            </motion.div>

            <motion.div
              variants={lineReveal}
              initial="hidden"
              animate="visible"
              className="my-7 h-px max-w-xs bg-accent-orange"
            />

            <motion.p
              custom={2}
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              className="text-subtitle mb-8 max-w-md"
            >
              {description}
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
                  <a href="#capabilities">
                    Explore capabilities
                    <ArrowDown className="h-4 w-4" />
                  </a>
                </Button>
              </motion.div>
              <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                <Button size="lg" variant="outline" asChild>
                  <a href="/#contact">Start a project</a>
                </Button>
              </motion.div>
            </motion.div>

            <motion.ul
              custom={4}
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              className="space-y-3"
            >
              {highlights.map((item, i) => {
                const Icon = item.icon
                return (
                  <motion.li
                    key={item.title}
                    initial={{ opacity: 0, x: -16 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.55 + i * 0.08, duration: 0.5 }}
                    className="flex items-start gap-3"
                  >
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-accent-orange/10">
                      <Icon className="h-4 w-4 text-accent-orange" strokeWidth={1.5} />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">{item.title}</p>
                      <p className="text-caption">{item.body}</p>
                    </div>
                  </motion.li>
                )
              })}
            </motion.ul>
          </motion.div>

          <motion.div
            style={{ y: showcaseY }}
            initial={{ opacity: 0, scale: 0.94, y: 40 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="relative"
          >
            <div
              className="pointer-events-none absolute -left-3 -top-3 h-full w-full border border-accent-orange/25"
              aria-hidden
            />

            {hasProjects && project ? (
              <TiltCard intensity={8} className="w-full">
                <div
                  onMouseMove={handleMouseMove}
                  onMouseLeave={handleMouseLeave}
                  style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
                  className="relative min-h-[400px] overflow-hidden border border-border/60 bg-card shadow-[var(--shadow-glass)] sm:min-h-[460px]"
                >
                  <AnimatePresence mode="sync">
                    <motion.div
                      key={`img-${project.id}`}
                      initial={{ opacity: 0, scale: 1.05 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.98 }}
                      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                      className="absolute inset-0"
                    >
                      <Image
                        src={project.image}
                        alt={project.title}
                        fill
                        sizes="50vw"
                        className="object-cover object-center"
                        priority
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-foreground/85 via-foreground/20 to-transparent" />
                    </motion.div>
                  </AnimatePresence>

                  {project.stat.value ? (
                    <div className="absolute right-5 top-5 z-20 border border-border/60 bg-background/95 px-4 py-3 shadow-[var(--shadow-2)] backdrop-blur-sm">
                      <p className="tnum text-2xl font-light text-accent-orange">
                        {project.stat.value}
                      </p>
                      <p className="text-caption">{project.stat.label}</p>
                    </div>
                  ) : null}

                  <div className="absolute bottom-0 left-0 right-0 z-20 p-6 md:p-8">
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={`info-${project.id}`}
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -8 }}
                        transition={{ duration: 0.4 }}
                      >
                        <span className="micro-cap text-white/60">{project.category}</span>
                        <p className="mt-2 max-w-xs text-base font-semibold leading-snug text-white md:text-lg">
                          {project.title}
                        </p>
                      </motion.div>
                    </AnimatePresence>

                    {projects.length > 1 ? (
                      <div className="mt-5 flex items-center gap-3">
                        <motion.button
                          whileHover={{ scale: 1.08 }}
                          whileTap={{ scale: 0.92 }}
                          onClick={prev}
                          className="flex h-8 w-8 items-center justify-center rounded-full border border-white/20 bg-white/10"
                          aria-label="Previous slide"
                        >
                          <ArrowLeft className="h-3.5 w-3.5 text-white" />
                        </motion.button>
                        <div className="flex flex-1 gap-1.5">
                          {projects.map((p, i) => (
                            <button
                              key={p.id}
                              onClick={() => setSlideIdx(i)}
                              className="relative h-1 flex-1 overflow-hidden rounded-full bg-white/25"
                              aria-label={`Go to slide ${i + 1}`}
                            >
                              {i === slideIdx ? (
                                <motion.div
                                  className="absolute inset-0 bg-accent-orange"
                                  layoutId="webdev-hero-dot"
                                />
                              ) : null}
                            </button>
                          ))}
                        </div>
                        <motion.button
                          whileHover={{ scale: 1.08 }}
                          whileTap={{ scale: 0.92 }}
                          onClick={next}
                          className="flex h-8 w-8 items-center justify-center rounded-full border border-white/20 bg-white/10"
                          aria-label="Next slide"
                        >
                          <ChevronRight className="h-3.5 w-3.5 text-white" />
                        </motion.button>
                      </div>
                    ) : null}
                  </div>
                </div>
              </TiltCard>
            ) : (
              <WebDevelopmentHeroShowcase
                statValue={statValue}
                statLabel={statLabel}
              />
            )}

            {statValue ? (
              <motion.div
                className="absolute -bottom-4 -left-4 hidden rounded-md border border-border bg-background px-4 py-3 shadow-[var(--shadow-2)] md:block"
                initial={{ opacity: 0, x: -16 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.9, duration: 0.5 }}
              >
                <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                  {statLabel ?? "Impact"}
                </p>
                <p className="tnum text-2xl font-light text-accent-orange">{statValue}</p>
              </motion.div>
            ) : null}
          </motion.div>
        </div>
      </div>

      <div className="hero-gradient pointer-events-none absolute bottom-0 left-0 right-0 h-20" />
    </section>
  )
}

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
import { ArrowDown, ArrowRight, ArrowLeft, ChevronRight } from "lucide-react"
import Image from "next/image"

import { TextRotate } from "@/components/ui/text-rotate"
import { AboutGrain } from "@/components/about/about-grain"
import { fadeUp, lineReveal } from "@/components/about/about-motion"

export interface CategoryHeroProject {
  id: number | string
  category: string
  flag?: string
  title: string
  image: string
  stat: { value: string; label: string }
  accent: string
  uiColors?: string[]
}

interface CategoryHeroProps {
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

const FALLBACK_WORDS = ["Strategic", "Scalable", "Converting", "Measurable"]

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

export default function CategoryHero({
  badge,
  badgeIconUrl,
  badgeIconGlyph,
  displayTitle,
  description,
  animatedWords,
  statValue,
  statLabel,
  projects,
}: CategoryHeroProps) {
  const words =
    animatedWords && animatedWords.length > 0 ? animatedWords : FALLBACK_WORDS
  const hasProjects = projects.length > 0

  const [slideIdx, setSlideIdx] = useState(0)
  const [paused, setPaused] = useState(false)

  const { scrollY, scrollYProgress } = useScroll()
  const progressScaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30 })
  const contentY = useTransform(scrollY, [0, 600], [0, -50])

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
  const statNumberMatch = statValue ? statValue.match(/^(.*?)([+%x$]|Top \d+|#\d+)?$/) : null
  const statMain = statNumberMatch?.[1] ?? statValue ?? ""
  const statSuffix = statNumberMatch?.[2] ?? ""

  return (
    <section className="relative min-h-[88vh] overflow-hidden border-b border-white/10 bg-primary pt-28 pb-16 lg:pt-36 lg:pb-20">
      <motion.div
        className="absolute left-0 right-0 top-0 z-50 h-[2px] origin-left bg-accent-orange"
        style={{ scaleX: progressScaleX }}
      />

      <AboutGrain className="opacity-[0.06] mix-blend-screen" />

      <div
        className="pointer-events-none absolute inset-0 opacity-[0.04]"
        aria-hidden
        style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.15) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.15) 1px, transparent 1px)
          `,
          backgroundSize: "64px 64px",
        }}
      />

      <motion.p
        style={{ y: contentY }}
        className="pointer-events-none absolute right-4 top-1/3 hidden select-none font-mono text-[clamp(5rem,12vw,9rem)] font-bold leading-none tracking-tighter text-white/[0.04] lg:block"
        aria-hidden
      >
        {statMain || "500"}
      </motion.p>

      <div className="relative z-10 mx-auto w-full max-w-7xl px-6 lg:px-8">
        <div className="grid grid-cols-1 items-stretch gap-10 lg:grid-cols-[1fr_1.05fr] lg:gap-12">
          <motion.div style={{ y: contentY }} className="flex flex-col justify-between">
            <div>
              <motion.div
                custom={0}
                variants={fadeUp}
                initial="hidden"
                animate="visible"
                className="mb-8 flex items-center gap-3"
              >
                <span className="h-2 w-2 rounded-full bg-accent-orange" />
                {badgeIconUrl && isHttpUrl(badgeIconUrl) ? (
                  <Image
                    src={badgeIconUrl.trim()}
                    alt=""
                    width={24}
                    height={24}
                    className="shrink-0 rounded-sm border border-white/10 object-cover"
                  />
                ) : badgeIconGlyph ? (
                  <span className="shrink-0 text-lg leading-none" aria-hidden>
                    {badgeIconGlyph}
                  </span>
                ) : null}
                <span className="micro-cap text-white/50">{badge}</span>
              </motion.div>

              <motion.div custom={1} variants={fadeUp} initial="hidden" animate="visible">
                <h1 className="mb-3 max-w-xl font-semibold leading-[0.92] tracking-[-0.04em] text-white [font-size:clamp(2.5rem,5.5vw,4.75rem)]">
                  {titleLines.map((line, i) => (
                    <span key={i} className="block">
                      {line}
                    </span>
                  ))}
                </h1>
                <LayoutGroup>
                  <motion.div layout className="mt-2 flex flex-wrap items-baseline gap-x-2">
                    <TextRotate
                      texts={words}
                      mainClassName="font-semibold text-accent-orange [font-size:clamp(1.75rem,3.5vw,2.75rem)] leading-tight tracking-[-0.02em]"
                      staggerDuration={0.02}
                      staggerFrom="last"
                      rotationInterval={2400}
                      transition={{ type: "spring", damping: 28, stiffness: 380 }}
                    />
                  </motion.div>
                </LayoutGroup>
              </motion.div>

              <motion.div
                variants={lineReveal}
                initial="hidden"
                animate="visible"
                className="my-7 h-px max-w-[120px] bg-accent-orange"
              />

              <motion.p
                custom={2}
                variants={fadeUp}
                initial="hidden"
                animate="visible"
                className="max-w-md text-base leading-relaxed text-white/60 md:text-lg"
              >
                {description}
              </motion.p>
            </div>

            <motion.div
              custom={3}
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              className="mt-12 flex flex-wrap items-end justify-between gap-6"
            >
              {statValue ? (
                <div>
                  <p className="tnum font-mono text-4xl font-light text-white md:text-5xl">
                    {statMain}
                    {statSuffix ? (
                      <span className="text-white/40">{statSuffix}</span>
                    ) : null}
                  </p>
                  {statLabel ? (
                    <p className="micro-cap mt-2 text-white/40">{statLabel}</p>
                  ) : null}
                </div>
              ) : (
                <div />
              )}

              <motion.a
                href="#capabilities"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="inline-flex items-center gap-2 border border-white/20 bg-white/5 px-5 py-3 text-sm font-medium text-white backdrop-blur-sm transition-colors hover:border-accent-orange/50 hover:bg-white/10"
              >
                <ArrowDown className="h-4 w-4" />
                Explore capabilities
              </motion.a>
            </motion.div>
          </motion.div>

          {hasProjects && project ? (
            <motion.div
              initial={{ opacity: 0, y: 40, rotate: 1.5 }}
              animate={{ opacity: 1, y: 0, rotate: 0 }}
              transition={{ duration: 1, delay: 0.35, ease: [0.22, 1, 0.36, 1] }}
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
              style={{ rotateX, rotateY, perspective: 900, transformStyle: "preserve-3d" }}
              className="relative min-h-[420px] lg:min-h-[520px]"
            >
              <div
                className="pointer-events-none absolute -left-2 -top-2 h-full w-full border border-accent-orange/25"
                aria-hidden
              />

              <div className="relative h-full min-h-[420px] overflow-hidden lg:min-h-[520px]">
                <AnimatePresence mode="sync">
                  <motion.div
                    key={`img-${project.id}`}
                    initial={{ opacity: 0, scale: 1.06 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.98 }}
                    transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
                    className="absolute inset-0"
                  >
                    <Image
                      src={project.image}
                      alt={project.title}
                      fill
                      sizes="55vw"
                      className="object-cover object-center"
                      priority
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/25 to-black/10" />
                  </motion.div>
                </AnimatePresence>

                <div
                  className="absolute right-6 top-6 z-20"
                  style={{ transform: "translateZ(24px)" }}
                >
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={`stat-${project.id}`}
                      initial={{ opacity: 0, y: -12 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -12 }}
                      transition={{ duration: 0.35 }}
                      className="border border-white/15 bg-black/60 px-4 py-3 backdrop-blur-md"
                    >
                      <p className="tnum text-2xl font-light text-white">
                        {project.stat.value}
                      </p>
                      <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-white/45">
                        {project.stat.label}
                      </p>
                    </motion.div>
                  </AnimatePresence>
                </div>

                <div
                  className="absolute bottom-0 left-0 right-0 z-20 p-7 md:p-9"
                  style={{ transform: "translateZ(16px)" }}
                >
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={`info-${project.id}`}
                      initial={{ opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      transition={{ duration: 0.45 }}
                    >
                      <div className="mb-3 flex items-center gap-3">
                        <span className="micro-cap text-white/50">{project.category}</span>
                        {project.flag ? (
                          <>
                            <span className="text-white/25">|</span>
                            <span className="text-sm">{project.flag}</span>
                          </>
                        ) : null}
                      </div>
                      <div className="mb-4 h-px bg-white/15" />
                      <div className="flex items-end justify-between gap-4">
                        <p className="max-w-xs text-base font-semibold leading-snug text-white md:text-lg">
                          {project.title}
                        </p>
                        <motion.span
                          whileHover={{ scale: 1.08 }}
                          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/15"
                        >
                          <ArrowRight className="h-4 w-4 text-white" />
                        </motion.span>
                      </div>
                    </motion.div>
                  </AnimatePresence>

                  {projects.length > 1 ? (
                    <div className="mt-6 flex items-center gap-4">
                      <motion.button
                        whileHover={{ scale: 1.08 }}
                        whileTap={{ scale: 0.92 }}
                        onClick={prev}
                        className="flex h-9 w-9 items-center justify-center rounded-full border border-white/15 bg-white/10 transition-colors hover:bg-white/20"
                        aria-label="Previous slide"
                      >
                        <ArrowLeft className="h-4 w-4 text-white" />
                      </motion.button>

                      <div className="flex flex-1 gap-2">
                        {projects.map((p, i) => (
                          <button
                            key={p.id}
                            onClick={() => setSlideIdx(i)}
                            className="relative h-1 overflow-hidden rounded-full transition-all duration-300"
                            style={{
                              background: "rgba(255,255,255,0.2)",
                              width: i === slideIdx ? 36 : 12,
                            }}
                            aria-label={`Go to slide ${i + 1}`}
                          >
                            {i === slideIdx ? (
                              <motion.div
                                className="absolute inset-0 rounded-full bg-accent-orange"
                                layoutId="category-hero-dot"
                              />
                            ) : null}
                          </button>
                        ))}
                      </div>

                      <motion.button
                        whileHover={{ scale: 1.08 }}
                        whileTap={{ scale: 0.92 }}
                        onClick={next}
                        className="flex h-9 w-9 items-center justify-center rounded-full border border-white/15 bg-white/10 transition-colors hover:bg-white/20"
                        aria-label="Next slide"
                      >
                        <ChevronRight className="h-4 w-4 text-white" />
                      </motion.button>

                      <span className="font-mono text-xs tabular-nums text-white/35">
                        {String(slideIdx + 1).padStart(2, "0")} /{" "}
                        {String(projects.length).padStart(2, "0")}
                      </span>
                    </div>
                  ) : null}
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, x: 32 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="flex min-h-[420px] items-center justify-center border border-white/10 bg-white/5 lg:min-h-[520px]"
            >
              <p className="text-sm text-white/40">Case studies coming soon</p>
            </motion.div>
          )}
        </div>
      </div>
    </section>
  )
}

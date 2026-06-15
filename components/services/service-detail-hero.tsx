"use client"

import Link from "next/link"
import Image from "next/image"
import {
  LayoutGroup,
  motion,
  useScroll,
  useSpring,
  useTransform,
} from "motion/react"
import { ArrowDown, ArrowRight, ChevronRight, Code2, Gauge, Shield, Zap } from "lucide-react"

import { Button } from "@/components/ui/button"
import { TextRotate } from "@/components/ui/text-rotate"
import { ElegantShapesBackground } from "@/components/landing/elegant-shapes"
import { GradientMesh } from "@/components/motion/gradient-mesh"
import { TiltCard } from "@/components/motion/tilt-card"
import { AboutGrain } from "@/components/about/about-grain"
import { fadeUp, lineReveal } from "@/components/about/about-motion"

const ROTATE_WORDS = ["React", "Next.js", "TypeScript", "Scalable"]

const highlights = [
  { icon: Zap, title: "Performance-first", body: "Core Web Vitals and edge-ready architecture" },
  { icon: Shield, title: "Secure by default", body: "Auth, encryption, and compliance-ready builds" },
  { icon: Gauge, title: "Built to scale", body: "From MVP launch to multi-tenant SaaS" },
]

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1551434678-e076c223a692?auto=format&fit=crop&q=80&w=1200&h=800"

interface ServiceDetailHeroProps {
  title: string
  description: string
  badge: string
  image?: string | null
  categoryName?: string | null
  categorySlug?: string | null
  rotatingWords?: string[]
}

function splitHeroTitle(title: string): { lead: string; rest: string | null } {
  const t = title.trim()
  if (!t) return { lead: "Service", rest: null }

  const colon = t.indexOf(":")
  if (colon > 0 && colon < t.length - 1) {
    return { lead: t.slice(0, colon).trim(), rest: t.slice(colon + 1).trim() }
  }

  const words = t.split(/\s+/)
  if (words.length <= 4) return { lead: t, rest: null }

  const mid = Math.ceil(words.length / 2)
  return {
    lead: words.slice(0, mid).join(" "),
    rest: words.slice(mid).join(" "),
  }
}

export default function ServiceDetailHero({
  title,
  description,
  badge,
  image,
  categoryName,
  categorySlug,
  rotatingWords = ROTATE_WORDS,
}: ServiceDetailHeroProps) {
  const { scrollY, scrollYProgress } = useScroll()
  const progressScaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30 })
  const meshOpacity = useTransform(scrollY, [0, 500], [1, 0.15])
  const contentY = useTransform(scrollY, [0, 700], [0, -80])
  const showcaseY = useTransform(scrollY, [0, 700], [0, 50])

  const { lead, rest } = splitHeroTitle(title)
  const heroImage = (image ?? "").trim() || FALLBACK_IMAGE

  return (
    <section className="relative min-h-[88vh] overflow-hidden border-t border-border bg-background pb-12 pt-28 sm:pt-32 lg:pt-36 md:pb-16">
      <motion.div
        className="absolute left-0 right-0 top-0 z-50 h-[2px] origin-left bg-accent-orange"
        style={{ scaleX: progressScaleX }}
      />

      <motion.div className="pointer-events-none absolute inset-0" style={{ opacity: meshOpacity }}>
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
        {categorySlug && categoryName ? (
          <motion.nav
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mb-8 flex flex-wrap items-center gap-1.5 text-sm text-muted-foreground"
            aria-label="Breadcrumb"
          >
            <Link href="/services" className="transition-colors hover:text-foreground">
              Services
            </Link>
            <ChevronRight className="h-3.5 w-3.5 shrink-0 opacity-50" aria-hidden />
            <Link
              href={`/services/${categorySlug}`}
              className="transition-colors hover:text-foreground"
            >
              {categoryName}
            </Link>
            <ChevronRight className="h-3.5 w-3.5 shrink-0 opacity-50" aria-hidden />
            <span className="text-foreground">{badge}</span>
          </motion.nav>
        ) : null}

        <div className="grid items-start gap-12 lg:grid-cols-2 lg:gap-16">
          <motion.div style={{ y: contentY }} className="text-left">
            <motion.div
              custom={0}
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              className="mb-6 inline-flex"
            >
              <span className="pill-tag inline-flex items-center gap-2">
                <Code2 className="h-3 w-3 text-accent-orange" strokeWidth={1.5} />
                {badge}
              </span>
            </motion.div>

            <motion.div custom={1} variants={fadeUp} initial="hidden" animate="visible">
              <h1 className="mb-2 max-w-2xl text-balance font-semibold leading-[1.02] tracking-[-0.03em] text-foreground [font-size:clamp(2rem,4.5vw,3.75rem)]">
                {lead}
                {rest ? (
                  <>
                    <br />
                    <span className="text-muted-foreground">{rest}</span>
                  </>
                ) : null}
              </h1>
              <LayoutGroup>
                <motion.div layout className="mt-3 flex flex-wrap items-baseline gap-x-2">
                  <span className="text-muted-foreground [font-size:clamp(1.25rem,2.5vw,2rem)]">
                    Powered by
                  </span>
                  <TextRotate
                    texts={rotatingWords}
                    mainClassName="font-semibold text-accent-orange [font-size:clamp(1.25rem,2.5vw,2rem)] leading-tight"
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
              className="my-7 h-px max-w-xs bg-accent-orange"
            />

            <motion.p
              custom={2}
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              className="text-subtitle mb-8 max-w-lg"
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
                  <Link href="/#contact">
                    Start this project
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
              </motion.div>
              <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                <Button size="lg" variant="outline" asChild>
                  <a href="#expertise">See expertise</a>
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
            <TiltCard intensity={8} className="w-full">
              <div className="relative aspect-[4/3] overflow-hidden border border-border/60 bg-card shadow-[var(--shadow-glass)] sm:aspect-[5/4]">
                <Image
                  src={heroImage}
                  alt={title}
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-foreground/50 via-transparent to-transparent" />

                <motion.div
                  className="absolute bottom-5 left-5 right-5 border border-white/20 bg-background/95 p-4 backdrop-blur-sm md:bottom-6 md:left-6 md:right-6 md:p-5"
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8, duration: 0.5 }}
                >
                  <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                    Delivery stack
                  </p>
                  <p className="mt-1 text-sm font-medium text-foreground md:text-base">
                    React · Next.js · TypeScript · Vercel
                  </p>
                </motion.div>

                <motion.div
                  className="absolute -right-2 -top-2 hidden border border-border bg-background px-3 py-2 shadow-[var(--shadow-2)] md:block"
                  initial={{ opacity: 0, x: 12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 1, duration: 0.5 }}
                >
                  <p className="tnum text-xl font-light text-accent-orange">98%</p>
                  <p className="text-caption">Satisfaction</p>
                </motion.div>
              </div>
            </TiltCard>

            <motion.a
              href="#process"
              className="absolute -bottom-4 -left-4 hidden items-center gap-2 border border-border bg-background px-4 py-3 text-sm font-medium text-foreground shadow-[var(--shadow-2)] transition-colors hover:border-accent-orange/40 md:inline-flex"
              initial={{ opacity: 0, x: -16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1.1, duration: 0.5 }}
              whileHover={{ y: -2 }}
            >
              <ArrowDown className="h-4 w-4 text-accent-orange" />
              Our process
            </motion.a>
          </motion.div>
        </div>
      </div>

      <div className="hero-gradient pointer-events-none absolute bottom-0 left-0 right-0 h-20" />
    </section>
  )
}

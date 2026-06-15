"use client"

import {
  LayoutGroup,
  motion,
  useScroll,
  useSpring,
  useTransform,
} from "motion/react"
import { ArrowRight, Compass } from "lucide-react"

import { Button } from "@/components/ui/button"
import { TextRotate } from "@/components/ui/text-rotate"
import { GradientMesh } from "@/components/motion/gradient-mesh"
import AboutHeroShowcase from "@/components/about/about-hero-showcase"
import { AboutGrain } from "@/components/about/about-grain"
import { fadeUp, lineReveal } from "@/components/about/about-motion"

export default function AboutHero() {
  const { scrollY, scrollYProgress } = useScroll()
  const meshOpacity = useTransform(scrollY, [0, 500], [1, 0.15])
  const contentY = useTransform(scrollY, [0, 700], [0, -90])
  const showcaseY = useTransform(scrollY, [0, 700], [0, 60])
  const watermarkX = useTransform(scrollY, [0, 700], [0, -40])
  const progressScaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30 })

  return (
    <section className="relative min-h-[92vh] overflow-hidden border-t border-border bg-background pb-16 pt-28 sm:pt-32 lg:pt-36">
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

      <AboutGrain />

      <motion.p
        style={{ x: watermarkX }}
        className="pointer-events-none absolute -right-4 top-1/2 hidden origin-center -translate-y-1/2 select-none font-mono text-[clamp(6rem,14vw,11rem)] font-bold leading-none tracking-tighter text-foreground/[0.03] lg:block"
        aria-hidden
      >
        12+
      </motion.p>

      <div className="pointer-events-none absolute left-6 top-1/2 hidden -translate-y-1/2 lg:block" aria-hidden>
        <motion.span
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.6 }}
          className="micro-cap block origin-center -rotate-90 whitespace-nowrap text-muted-foreground"
        >
          Since 2012 — Bangalore to global
        </motion.span>
      </div>

      <div className="relative z-10 mx-auto w-full max-w-7xl px-6 lg:px-8">
        <div className="grid items-end gap-14 lg:grid-cols-[1.1fr_0.9fr] lg:gap-10 xl:gap-16">
          <motion.div style={{ y: contentY }} className="relative text-left">
            <motion.div
              custom={0}
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              className="mb-8 inline-flex"
            >
              <span className="pill-tag inline-flex items-center gap-2">
                <Compass className="h-3 w-3 text-accent-orange" strokeWidth={1.5} />
                About Brandtangent
              </span>
            </motion.div>

            <motion.div custom={1} variants={fadeUp} initial="hidden" animate="visible">
              <h1 className="mb-2 max-w-2xl text-balance font-semibold leading-[0.95] tracking-[-0.04em] text-foreground [font-size:clamp(2.75rem,6vw,5.5rem)]">
                We build brands
                <br />
                <span className="text-muted-foreground">that own their</span>
              </h1>
              <LayoutGroup>
                <motion.div layout className="mt-1 flex flex-wrap items-baseline gap-x-3">
                  <TextRotate
                    texts={["category", "market", "moment", "future"]}
                    mainClassName="font-semibold text-accent-orange [font-size:clamp(2.75rem,6vw,5.5rem)] leading-[0.95] tracking-[-0.04em]"
                    staggerDuration={0.025}
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
              className="my-8 h-px max-w-xs bg-accent-orange"
            />

            <motion.p
              custom={2}
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              className="mb-10 max-w-md text-lg leading-relaxed text-muted-foreground"
            >
              Twelve years crafting identities for 500+ ambitious brands — strategy,
              identity, and activation engineered to compound, not reset every quarter.
            </motion.p>

            <motion.div
              custom={3}
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              className="flex flex-col items-start gap-3 sm:flex-row"
            >
              <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                <Button size="lg" asChild>
                  <a href="#our-story">
                    Read our story
                    <ArrowRight className="h-4 w-4" />
                  </a>
                </Button>
              </motion.div>
              <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                <Button size="lg" variant="outline" asChild>
                  <a href="#values">Our values</a>
                </Button>
              </motion.div>
            </motion.div>
          </motion.div>

          <motion.div
            style={{ y: showcaseY }}
            initial={{ opacity: 0, y: 48, rotate: 2 }}
            animate={{ opacity: 1, y: 0, rotate: 0 }}
            transition={{ duration: 1.1, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="relative lg:-mb-8"
          >
            <div
              className="pointer-events-none absolute -left-3 -top-3 h-full w-full border border-accent-orange/30"
              aria-hidden
            />
            <AboutHeroShowcase />

            <motion.div
              className="absolute -bottom-4 -left-4 hidden rounded-md border border-border bg-background px-4 py-3 shadow-[var(--shadow-2)] md:block"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1, duration: 0.6 }}
            >
              <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                Retention
              </p>
              <p className="tnum text-2xl font-light text-accent-orange">98%</p>
            </motion.div>
          </motion.div>
        </div>
      </div>

      <div className="hero-gradient pointer-events-none absolute bottom-0 left-0 right-0 h-24" />
    </section>
  )
}

"use client"

import { motion, useScroll, useTransform } from "motion/react"
import { useRef } from "react"

import { AboutGrain } from "@/components/about/about-grain"
import { SectionReveal } from "@/components/motion/section-reveal"

export default function AboutStory() {
  const sectionRef = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  })
  const yearOpacity = useTransform(scrollYProgress, [0, 0.4, 0.8], [0.04, 0.08, 0.04])
  const yearY = useTransform(scrollYProgress, [0, 1], [40, -40])

  return (
    <section
      ref={sectionRef}
      id="our-story"
      className="relative overflow-hidden border-t border-border bg-background py-20 md:py-28"
    >
      <AboutGrain />

      <motion.div
        style={{ opacity: yearOpacity, y: yearY }}
        className="pointer-events-none absolute left-1/2 top-24 -translate-x-1/2 select-none font-mono text-[clamp(8rem,22vw,16rem)] font-bold leading-none tracking-tighter text-foreground"
        aria-hidden
      >
        2012
      </motion.div>

      <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-16 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-5">
            <div className="lg:sticky lg:top-32">
              <SectionReveal>
                <div className="mb-4 flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-accent-orange" />
                  <span className="micro-cap text-muted-foreground">The origin</span>
                </div>
                <h2 className="display-lg mb-6 text-foreground">
                  From campaigns to{" "}
                  <span className="relative inline-block">
                    compounding
                    <motion.span
                      className="absolute -bottom-1 left-0 h-[3px] w-full bg-accent-orange/60"
                      initial={{ scaleX: 0 }}
                      whileInView={{ scaleX: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.8, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
                    />
                  </span>{" "}
                  brand equity
                </h2>
                <p className="text-lg leading-relaxed text-muted-foreground">
                  Brandtangent began as a design-led studio obsessed with brand craft. Today
                  we&apos;re the team founders hire when they need strategic clarity{" "}
                  <span className="font-semibold text-foreground">and</span> creative execution
                  — without building an in-house agency.
                </p>
              </SectionReveal>
            </div>
          </div>

          <div className="space-y-8 lg:col-span-6 lg:col-start-7">
            <motion.div
              initial={{ opacity: 0, y: 32, rotate: -1 }}
              whileInView={{ opacity: 1, y: 0, rotate: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              className="relative border-l-4 border-accent-orange bg-secondary/60 p-8 md:p-10"
            >
              <span className="absolute -left-3 top-8 h-6 w-6 rounded-full bg-accent-orange" aria-hidden />
              <p className="text-xl font-medium leading-snug text-foreground md:text-2xl">
                We started in 2012 with one rule:{" "}
                <strong className="font-semibold">
                  every engagement has to tie to recognition or growth
                </strong>{" "}
                — not slides, not vanity dashboards.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="space-y-6 pl-0 md:pl-6"
            >
              <p className="text-base leading-relaxed text-muted-foreground">
                For years we ran brand programs for 100+ clients. The work was strong, but
                the bottleneck was always the same: unclear positioning, inconsistent creative,
                and identity that couldn&apos;t scale.
              </p>
              <p className="text-base leading-relaxed text-muted-foreground">
                In 2018 we rebuilt the studio around brand systems — strategy first, then
                identity, then activation — so brand equity compounds instead of resetting
                every quarter.
              </p>
            </motion.div>

            <motion.blockquote
              initial={{ opacity: 0, x: 24 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              className="relative py-4 pl-8"
            >
              <span
                className="pointer-events-none absolute left-0 top-0 font-serif text-6xl leading-none text-accent-orange/30"
                aria-hidden
              >
                &ldquo;
              </span>
              <p className="text-xl font-medium italic leading-relaxed text-foreground md:text-2xl">
                We&apos;re not here to rent attention. We&apos;re here to build the brand
                that earns it.
              </p>
            </motion.blockquote>
          </div>
        </div>
      </div>
    </section>
  )
}

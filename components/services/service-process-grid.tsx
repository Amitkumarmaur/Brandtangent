"use client"

import { useRef } from "react"
import { motion, useInView, useScroll, useTransform } from "motion/react"

import { AboutGrain } from "@/components/about/about-grain"

interface ProcessPhase {
  title: string
  items: string[]
}

const defaultPhases: ProcessPhase[] = [
  {
    title: "Planning",
    items: [
      "Business Analysis",
      "Document Specifications",
      "Preparing Wireframes",
      "Getting Client Approval",
    ],
  },
  {
    title: "Development",
    items: [
      "Coding",
      "Mockup & Page Layout Creation",
      "Review",
      "Approval Cycle",
    ],
  },
  {
    title: "Testing",
    items: [
      "Preparing Test Cases",
      "Testing",
      "Review By The QA Team",
      "Approval Cycle",
    ],
  },
  {
    title: "Deployment",
    items: [
      "Launch",
      "Opinion Monitoring",
      "Maintenance",
      "Post-Deployment Support",
    ],
  },
]

interface ServiceProcessGridProps {
  badge?: string
  title?: string
  description?: string
  phases?: ProcessPhase[]
  sectionId?: string
}

export default function ServiceProcessGrid({
  badge = "Our Process",
  title = "A seamless process from brief to launch",
  description = "Our process involves in-depth business analysis, documenting specifications, creating wireframes, and obtaining your approval before moving forward. Our team guides you through every step of the journey.",
  phases = defaultPhases,
  sectionId = "process",
}: ServiceProcessGridProps) {
  const sectionRef = useRef<HTMLElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)
  const isInView = useInView(sectionRef, { once: true, margin: "-80px" })

  const { scrollYProgress } = useScroll({
    target: trackRef,
    offset: ["start end", "end start"],
  })
  const x = useTransform(scrollYProgress, [0.08, 0.85], ["1%", "-48%"])

  return (
    <section
      id={sectionId}
      ref={sectionRef}
      className="relative overflow-hidden border-t border-border bg-secondary/30 py-20 md:py-28"
    >
      <AboutGrain />

      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="mb-14 flex flex-col gap-6 md:flex-row md:items-end md:justify-between"
        >
          <div className="max-w-2xl">
            <div className="mb-4 flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-accent-orange" />
              <span className="micro-cap text-muted-foreground">{badge}</span>
            </div>
            <h2 className="display-lg text-foreground">{title}</h2>
          </div>
          <p className="max-w-sm text-sm leading-relaxed text-muted-foreground md:text-right">
            {description}
          </p>
        </motion.div>
      </div>

      <div ref={trackRef}>
        <div className="hidden overflow-hidden md:block">
          <motion.div
            style={{ x }}
            className="flex w-max gap-5 px-6 lg:px-[max(1.5rem,calc((100vw-80rem)/2+1.5rem))]"
          >
            {phases.map((phase, index) => (
              <motion.article
                key={phase.title}
                initial={{ opacity: 0, y: 32 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.55, delay: index * 0.06 }}
                whileHover={{ y: -6 }}
                className="group relative w-[min(320px,72vw)] shrink-0 border border-border bg-background p-8 shadow-[var(--shadow-1)]"
              >
                <span className="font-mono text-5xl font-light text-foreground/10 transition-colors group-hover:text-accent-orange/25">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <h3 className="relative -mt-8 mb-6 text-xl font-semibold text-foreground">
                  {phase.title}
                </h3>
                <ul className="space-y-3">
                  {phase.items.map((item) => (
                    <li key={item} className="flex items-start gap-3 text-sm text-muted-foreground">
                      <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent-orange/70" />
                      {item}
                    </li>
                  ))}
                </ul>
                <motion.div
                  className="absolute bottom-0 left-0 h-1 bg-accent-orange"
                  initial={{ width: 0 }}
                  whileInView={{ width: "100%" }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.55, delay: 0.15 + index * 0.05 }}
                />
              </motion.article>
            ))}
          </motion.div>
        </div>

        <div className="space-y-5 px-6 md:hidden">
          {phases.map((phase, index) => (
            <motion.article
              key={phase.title}
              initial={{ opacity: 0, x: -16 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.5, delay: index * 0.06 }}
              className="border border-border bg-background p-6"
            >
              <span className="font-mono text-xs text-accent-orange">
                {String(index + 1).padStart(2, "0")}
              </span>
              <h3 className="mt-2 text-lg font-semibold text-foreground">{phase.title}</h3>
              <ul className="mt-4 space-y-2">
                {phase.items.map((item) => (
                  <li key={item} className="text-sm text-muted-foreground">
                    {item}
                  </li>
                ))}
              </ul>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  )
}

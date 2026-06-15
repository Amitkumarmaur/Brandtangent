"use client"

import { motion, useScroll, useTransform } from "motion/react"
import { useRef } from "react"

const milestones = [
  {
    year: "2012",
    title: "Founded in Bangalore",
    description:
      "Started as a 3-person design studio merging creativity with strategy.",
  },
  {
    year: "2015",
    title: "First 100 clients",
    description:
      "Crossed 100 clients and expanded to North American and GCC markets.",
  },
  {
    year: "2018",
    title: "Brand systems focus",
    description:
      "Pioneered systematic brand architecture for scale — category design before it was mainstream.",
  },
  {
    year: "2020",
    title: "Digital integration",
    description:
      "Expanded into digital experience design — brand strategy through to web and campaign execution.",
  },
  {
    year: "2023",
    title: "500+ brands served",
    description:
      "500+ brand transformations across 18 countries and 6 industries.",
  },
  {
    year: "2024",
    title: "Brandtangent era",
    description:
      "Refocused as a pure brand and creative studio for businesses that want to lead their category.",
  },
]

export default function AboutMilestones() {
  const trackRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: trackRef,
    offset: ["start end", "end start"],
  })
  const x = useTransform(scrollYProgress, [0.1, 0.85], ["2%", "-62%"])

  return (
    <section className="relative overflow-hidden border-t border-border bg-secondary/40 py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="mb-14 flex flex-col gap-6 md:flex-row md:items-end md:justify-between"
        >
          <div>
            <div className="mb-4 flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-accent-orange" />
              <span className="micro-cap text-muted-foreground">Milestones</span>
            </div>
            <h2 className="display-lg max-w-lg text-foreground">
              Twelve years, six inflection points
            </h2>
          </div>
          <p className="max-w-xs text-sm leading-relaxed text-muted-foreground md:text-right">
            Scroll to trace the arc — same team ethic, bigger leverage every chapter.
          </p>
        </motion.div>
      </div>

      <div ref={trackRef} className="relative">
        <div className="hidden overflow-hidden md:block">
          <motion.div style={{ x }} className="flex w-max gap-6 px-6 lg:px-[max(1.5rem,calc((100vw-80rem)/2+1.5rem))]">
            {milestones.map((m, i) => (
              <motion.article
                key={m.year}
                initial={{ opacity: 0, y: 32 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.55, delay: i * 0.05 }}
                whileHover={{ y: -8 }}
                className="group relative w-[min(340px,78vw)] shrink-0 border border-border bg-background p-8 shadow-[var(--shadow-1)] transition-shadow hover:shadow-[var(--shadow-accent-orange-soft)]"
              >
                <span className="tnum font-mono text-[4.5rem] font-light leading-none text-foreground/10 transition-colors group-hover:text-accent-orange/20">
                  {m.year}
                </span>
                <div className="relative -mt-10">
                  <span className="micro-cap text-accent-orange">{m.year}</span>
                  <h3 className="mt-2 text-xl font-semibold text-foreground">{m.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                    {m.description}
                  </p>
                </div>
                <motion.div
                  className="absolute bottom-0 left-0 h-1 bg-accent-orange"
                  initial={{ width: 0 }}
                  whileInView={{ width: "100%" }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.2 + i * 0.05 }}
                />
              </motion.article>
            ))}
          </motion.div>
        </div>

        <div className="space-y-5 px-6 md:hidden">
          {milestones.map((m, i) => (
            <motion.article
              key={m.year}
              initial={{ opacity: 0, x: -16 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.5, delay: i * 0.06 }}
              className="border border-border bg-background p-6"
            >
              <span className="micro-cap text-accent-orange">{m.year}</span>
              <h3 className="mt-2 text-lg font-semibold text-foreground">{m.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {m.description}
              </p>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  )
}

"use client"

import { motion } from "motion/react"

interface Result {
  metric: string
  label: string
  description?: string
}

interface CaseStudyResultsProps {
  results: Result[]
}

function sanitizeMetric(metric: string): string {
  return metric
    .replace(/\?/g, "â†’")
    .replace(/â†’/g, " â†’ ")
    .trim()
}

export default function CaseStudyResults({ results }: CaseStudyResultsProps) {
  return (
    <section className="relative w-full py-20 lg:py-32 bg-white border-t border-border overflow-hidden">
      {/* Watermark */}
      <div className="absolute right-6 top-6 text-[8rem] lg:text-[14rem] font-semibold text-[rgba(28,28,28,0.05)] leading-none select-none pointer-events-none">
        04
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="mb-14 md:mb-20"
        >
          <div className="flex items-center gap-2 mb-4">
            <div className="w-2 h-2 rounded-full bg-[rgba(28,28,28,0.4)]" />
            <span className="text-muted-foreground font-semibold tracking-wider text-sm uppercase">
              Impact
            </span>
          </div>
          <h2 className="display-xl text-foreground">The Results</h2>
        </motion.div>

        {/* Results grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {results.map((res, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="group relative bg-white border border-border rounded-md p-7 md:p-8 flex flex-col gap-3 overflow-hidden hover:border-[rgba(28,28,28,0.3)] hover:shadow-sm transition-all"
            >
              {/* Top accent bar on hover */}
              <div className="absolute top-0 left-0 right-0 h-0.5 bg-primary opacity-0 group-hover:opacity-100 transition-opacity" />

              {/* Index */}
              <span className="font-mono text-xs text-[rgba(28,28,28,0.3)] font-semibold">
                {String(i + 1).padStart(2, "0")}
              </span>

              {/* Metric */}
              <p className="display-lg text-foreground leading-tight">
                {sanitizeMetric(res.metric)}
              </p>

              {/* Label */}
              <h4 className="text-sm md:text-base font-semibold text-foreground leading-snug">
                {res.label}
              </h4>

              {/* Description */}
              {res.description && (
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {res.description}
                </p>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

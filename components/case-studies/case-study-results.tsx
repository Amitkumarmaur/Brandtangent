"use client"

import { motion } from "framer-motion"

interface Result {
  metric: string
  label: string
  description?: string
}

interface CaseStudyResultsProps {
  results: Result[]
}

// Fix corrupted arrow characters that come from the DB
function sanitizeMetric(metric: string): string {
  return metric
    .replace(/\?/g, "→")      // ? is a corrupted → in some encodings
    .replace(/→/g, " → ")     // ensure spacing around arrows
    .trim()
}

export default function CaseStudyResults({ results }: CaseStudyResultsProps) {
  return (
    <section className="relative w-full py-20 lg:py-32 bg-background border-t border-grey-200 overflow-hidden">
      {/* Large "04" watermark */}
      <div className="absolute right-6 top-6 font-heading text-[8rem] lg:text-[14rem] font-black text-grey-100 leading-none select-none pointer-events-none">
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
            <div className="w-2 h-2 rounded-full bg-ignite-orange" />
            <span className="font-heading text-ignite-orange font-medium tracking-wider text-sm uppercase">
              Impact
            </span>
          </div>
          <h2 className="font-heading text-3xl md:text-4xl lg:text-5xl font-semibold text-foreground tracking-tight leading-tight">
            The Results
          </h2>
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
              className="group relative bg-grey-50 border border-grey-200 rounded-2xl p-7 md:p-8 flex flex-col gap-3 overflow-hidden hover:border-ignite-orange/40 hover:shadow-lg transition-all"
            >
              {/* Orange top accent bar */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-ignite-orange opacity-0 group-hover:opacity-100 transition-opacity" />

              {/* Index number — subtle */}
              <span className="font-mono text-xs text-grey-300 font-bold">
                {String(i + 1).padStart(2, "0")}
              </span>

              {/* Metric */}
              <p className="font-heading text-3xl md:text-4xl xl:text-5xl font-black text-ignite-orange tracking-tight leading-tight">
                {sanitizeMetric(res.metric)}
              </p>

              {/* Label */}
              <h4 className="font-heading text-sm md:text-base font-semibold text-foreground leading-snug">
                {res.label}
              </h4>

              {/* Description */}
              {res.description && (
                <p className="text-sm text-grey-400 leading-relaxed">
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

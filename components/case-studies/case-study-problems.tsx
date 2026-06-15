"use client"

import { motion } from "motion/react"

interface CaseStudyProblemsProps {
  heading: string
  description?: string | null
}

export default function CaseStudyProblems({ heading, description }: CaseStudyProblemsProps) {
  return (
    <section className="relative w-full py-20 lg:py-32 bg-white border-t border-border overflow-hidden">
      {/* Watermark */}
      <div className="absolute right-8 top-8 text-[10rem] lg:text-[16rem] font-semibold text-[rgba(28,28,28,0.05)] leading-none select-none pointer-events-none">
        02
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-12 lg:gap-20 items-start">
          {/* Left */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-center gap-2 mb-2">
              <div className="w-2 h-2 rounded-full bg-[rgba(28,28,28,0.4)]" />
              <span className="text-muted-foreground font-semibold tracking-wider text-sm uppercase">
                The Challenge
              </span>
            </div>
            <h2 className="display-sm text-foreground">
              {heading}
            </h2>
          </motion.div>

          {/* Right */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, delay: 0.15 }}
          >
            {description && (
              <p className="text-lg md:text-xl text-muted-foreground leading-relaxed border-l-2 border-border pl-6">
                {description}
              </p>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  )
}

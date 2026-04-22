"use client"

import { motion } from "framer-motion"

interface CaseStudyAboutProps {
  heading: string
  description?: string | null
}

export default function CaseStudyAbout({ heading, description }: CaseStudyAboutProps) {
  return (
    <section className="relative w-full py-20 lg:py-32 bg-background border-t border-grey-200 overflow-hidden">
      {/* Large section number watermark */}
      <div className="absolute right-8 top-8 font-heading text-[10rem] lg:text-[16rem] font-black text-grey-200 leading-none select-none pointer-events-none">
        01
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-12 lg:gap-20 items-start">
          {/* Left: label */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-center gap-2 mb-2">
              <div className="w-2 h-2 rounded-full bg-ignite-orange" />
              <span className="font-heading text-ignite-orange font-medium tracking-wider text-sm uppercase">
                Background
              </span>
            </div>
            <h2 className="font-heading text-2xl md:text-3xl font-semibold text-foreground tracking-tight leading-tight">
              {heading}
            </h2>
          </motion.div>

          {/* Right: content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, delay: 0.15 }}
          >
            {description && (
              <p className="text-lg md:text-xl text-grey-400 leading-relaxed border-l-2 border-ignite-orange pl-6">
                {description}
              </p>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  )
}

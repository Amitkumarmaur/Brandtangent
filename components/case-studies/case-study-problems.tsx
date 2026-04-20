"use client"

import { motion } from "framer-motion"

interface CaseStudyProblemsProps {
  heading: string
  description?: string | null
}

export default function CaseStudyProblems({ heading, description }: CaseStudyProblemsProps) {
  return (
    <section className="relative w-full py-20 lg:py-32 bg-foreground overflow-hidden">
      {/* Large "02" watermark */}
      <div className="absolute right-8 top-8 font-heading text-[10rem] lg:text-[16rem] font-black text-white/5 leading-none select-none pointer-events-none">
        02
      </div>

      {/* Orange glow */}
      <div className="absolute bottom-0 left-1/4 w-[500px] h-[300px] bg-ignite-orange/8 rounded-full blur-[100px] pointer-events-none" />

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
              <div className="w-2 h-2 rounded-full bg-ignite-orange" />
              <span className="font-heading text-ignite-orange font-medium tracking-wider text-sm uppercase">
                The Challenge
              </span>
            </div>
            <h2 className="font-heading text-2xl md:text-3xl font-semibold text-white tracking-tight leading-tight">
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
              <p className="text-lg md:text-xl text-white/60 leading-relaxed border-l-2 border-ignite-orange pl-6">
                {description}
              </p>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  )
}

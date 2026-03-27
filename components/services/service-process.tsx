"use client"

import { useRef } from "react"
import { motion, useInView } from "framer-motion"

interface ProcessStep {
  step: string
  title: string
  description: string
}

interface ServiceProcessProps {
  badge: string
  title: string
  subtitle: string
  steps: ProcessStep[]
}

export default function ServiceProcess({ badge, title, subtitle, steps }: ServiceProcessProps) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  return (
    <section ref={ref} id="process" className="relative w-full py-16 md:py-24 bg-grey-800 overflow-hidden">
      {/* Ambient glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-ignite-orange/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="w-2 h-2 rounded-full bg-ignite-orange" />
            <span className="text-ignite-orange font-semibold tracking-widest uppercase text-xs">{badge}</span>
          </div>
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">{title}</h2>
          <p className="text-lg text-white/50 max-w-2xl mx-auto">{subtitle}</p>
        </motion.div>

        {/* Timeline Steps */}
        <div className="relative max-w-3xl mx-auto">
          {/* Vertical connector line */}
          <div className="absolute left-6 md:left-8 top-0 bottom-0 w-px bg-gradient-to-b from-ignite-orange/40 via-ignite-orange/20 to-transparent" />

          <div className="flex flex-col gap-10">
            {steps.map((step, index) => (
              <motion.div
                key={step.step}
                initial={{ opacity: 0, x: -30 }}
                animate={isInView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.6, delay: index * 0.15 }}
                className="relative flex gap-6 md:gap-8 group"
              >
                {/* Step number badge */}
                <div className="relative z-10 flex-shrink-0 w-12 h-12 md:w-16 md:h-16 rounded-full bg-foreground border-2 border-ignite-orange/30 group-hover:border-ignite-orange transition-colors flex items-center justify-center shadow-[0_0_20px_rgba(255,87,34,0.1)] group-hover:shadow-[0_0_30px_rgba(255,87,34,0.2)]">
                  <span className="text-ignite-orange font-bold text-sm md:text-base">{step.step}</span>
                </div>

                {/* Content */}
                <div className="flex-1 pb-2">
                  <h3 className="text-xl md:text-2xl font-bold text-white mb-2 group-hover:text-ignite-orange transition-colors">
                    {step.title}
                  </h3>
                  <p className="text-white/50 leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

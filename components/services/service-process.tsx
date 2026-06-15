"use client"

import { useRef } from "react"
import { motion, useInView } from "motion/react"

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
    <section ref={ref} id="process" className="relative w-full py-16 md:py-20 bg-white overflow-hidden border-t border-border">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <p className="micro-cap text-muted-foreground mb-4">{badge}</p>
          <h2 className="display-xl text-foreground mb-4">{title}</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">{subtitle}</p>
        </motion.div>

        <div className="relative max-w-3xl mx-auto">
          {/* Vertical connector line */}
          <div className="absolute left-6 md:left-8 top-0 bottom-0 w-px bg-gradient-to-b from-border via-border to-transparent" />

          <div className="flex flex-col gap-10">
            {steps.map((step, index) => (
              <motion.div
                key={step.step}
                initial={{ opacity: 0, x: -30 }}
                animate={isInView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.6, delay: index * 0.15 }}
                className="relative flex gap-6 md:gap-8 group"
              >
                <div className="relative z-10 flex-shrink-0 w-12 h-12 md:w-16 md:h-16 rounded-full bg-white border border-border group-hover:border-[rgba(28,28,28,0.4)] transition-colors flex items-center justify-center">
                  <span className="text-foreground font-semibold text-sm md:text-base">{step.step}</span>
                </div>

                <div className="flex-1 pb-2">
                  <h3 className="text-xl md:text-2xl font-semibold text-foreground mb-2">
                    {step.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
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

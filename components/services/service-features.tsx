"use client"

import { useState, useRef } from "react"
import { motion, AnimatePresence, useInView } from "framer-motion"
import type { LucideIcon } from "lucide-react"

interface Feature {
  icon?: LucideIcon
  title: string
  description: string
}

interface ServiceFeaturesProps {
  badge: string
  title: string
  subtitle: string
  features: Feature[]
}

export default function ServiceFeatures({ badge, title, subtitle, features }: ServiceFeaturesProps) {
  const [openIndex, setOpenIndex] = useState<number>(0)
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  return (
    <section ref={ref} className="relative w-full py-16 md:py-20 bg-grey-100 border-t border-grey-200">
      {/* Subtle warm glow — uses fixed positioning to avoid overflow issues */}
      <div className="absolute top-0 right-0 w-[500px] h-[400px] bg-ignite-orange/5 rounded-full blur-[120px] pointer-events-none" style={{ zIndex: 0 }} />

      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
        <div className="flex flex-col lg:flex-row lg:items-start gap-12 lg:gap-20">

          {/* Left Side — Scrollable Accordion */}
          <div className="lg:w-7/12">
            {features.map((feature, index) => {
              const isOpen = openIndex === index
              return (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 30 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.5, delay: index * 0.08 }}
                  className="border-b border-grey-200 last:border-b-0"
                >
                  <button
                    onClick={() => setOpenIndex(isOpen ? -1 : index)}
                    className="w-full flex items-center justify-between py-6 md:py-7 text-left group"
                  >
                    <span className={`text-lg md:text-xl lg:text-2xl font-semibold transition-colors duration-300 ${isOpen ? 'text-foreground' : 'text-grey-400 group-hover:text-grey-600'}`}>
                      {feature.title}
                    </span>
                    <div className={`w-3 h-3 rounded-full flex-shrink-0 ml-4 transition-all duration-300 ${isOpen ? 'bg-ignite-orange shadow-[0_0_12px_rgba(255,87,34,0.4)]' : 'bg-grey-200 group-hover:bg-grey-400'}`} />
                  </button>

                  <AnimatePresence>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.35, ease: "easeInOut" }}
                        className="overflow-hidden"
                      >
                        <div className="pb-7 pr-8">
                          <p className="text-grey-400 leading-relaxed text-base md:text-lg">
                            {feature.description}
                          </p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              )
            })}
          </div>

          {/* Right Side — Sticky Wrapper */}
          <div className="lg:w-5/12 sticky top-32 self-start">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8 }}
            >
              <div className="flex items-center gap-2 mb-5">
                <div className="w-2 h-2 rounded-full bg-ignite-orange animate-pulse" />
                <span className="text-ignite-orange font-semibold tracking-widest uppercase text-xs">{badge}</span>
              </div>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground leading-tight tracking-tight mb-6">
                {title}
              </h2>
              <p className="text-grey-400 text-base md:text-lg leading-relaxed max-w-md">
                {subtitle}
              </p>
            </motion.div>
          </div>

        </div>
      </div>
    </section>
  )
}

"use client"

import { useState, useRef } from "react"
import { motion, AnimatePresence, useInView } from "motion/react"
import type { LucideIcon } from "lucide-react"

import { AboutGrain } from "@/components/about/about-grain"
import { staggerContainer, staggerItem } from "@/components/about/about-motion"

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
  sectionId?: string
}

export default function ServiceFeatures({
  badge,
  title,
  subtitle,
  features,
  sectionId,
}: ServiceFeaturesProps) {
  const [openIndex, setOpenIndex] = useState<number>(0)
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-80px" })

  return (
    <section
      id={sectionId}
      ref={ref}
      className="relative overflow-hidden border-t border-border bg-background py-20 md:py-28"
    >
      <AboutGrain />

      <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-14 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-5">
            <div className="lg:sticky lg:top-32">
              <motion.div
                initial={{ opacity: 0, y: 28 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              >
                <div className="mb-4 flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-accent-orange" />
                  <span className="micro-cap text-muted-foreground">{badge}</span>
                </div>
                <h2 className="display-lg mb-6 text-foreground">{title}</h2>
                <p className="max-w-md text-lg leading-relaxed text-muted-foreground">{subtitle}</p>
                <motion.div
                  className="mt-8 h-px max-w-[80px] bg-accent-orange"
                  initial={{ scaleX: 0 }}
                  animate={isInView ? { scaleX: 1 } : {}}
                  transition={{ duration: 0.8, delay: 0.3 }}
                  style={{ originX: 0 }}
                />
              </motion.div>
            </div>
          </div>

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            className="lg:col-span-6 lg:col-start-7"
          >
            {features.map((feature, index) => {
              const isOpen = openIndex === index
              return (
                <motion.div
                  key={feature.title}
                  variants={staggerItem}
                  className="relative border-b border-border last:border-b-0"
                >
                  {isOpen ? (
                    <motion.div
                      layoutId="feature-active-bar"
                      className="absolute left-0 top-0 h-full w-1 bg-accent-orange"
                      transition={{ type: "spring", stiffness: 380, damping: 32 }}
                    />
                  ) : null}

                  <button
                    onClick={() => setOpenIndex(isOpen ? -1 : index)}
                    className="group flex w-full items-start gap-5 py-7 text-left md:py-8"
                  >
                    <span className="tnum shrink-0 font-mono text-sm text-muted-foreground/60 transition-colors group-hover:text-accent-orange">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <div className="flex-1">
                      <span
                        className={`block text-lg font-medium transition-colors md:text-xl ${
                          isOpen
                            ? "text-accent-orange"
                            : "text-foreground group-hover:text-accent-orange"
                        }`}
                      >
                        {feature.title}
                      </span>
                    </div>
                    <motion.span
                      animate={{ rotate: isOpen ? 90 : 0 }}
                      className={`mt-1.5 h-2 w-2 shrink-0 rounded-full transition-colors ${
                        isOpen ? "bg-accent-orange" : "bg-border group-hover:bg-accent-orange/30"
                      }`}
                    />
                  </button>

                  <AnimatePresence>
                    {isOpen ? (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
                        className="overflow-hidden"
                      >
                        <div className="pb-8 pl-10 pr-4 md:pl-12">
                          <p className="text-base leading-relaxed text-muted-foreground">
                            {feature.description}
                          </p>
                        </div>
                      </motion.div>
                    ) : null}
                  </AnimatePresence>
                </motion.div>
              )
            })}
          </motion.div>
        </div>
      </div>
    </section>
  )
}

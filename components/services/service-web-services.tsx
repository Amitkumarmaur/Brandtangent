"use client"

import { useState, useRef } from "react"
import { motion, AnimatePresence, useInView } from "motion/react"
import { ArrowUpRight, X } from "lucide-react"

import { staggerContainer, staggerItem } from "@/components/about/about-motion"

interface WebService {
  title: string
  shortDescription: string
  fullDescription: string[]
}

const defaultServices: WebService[] = [
  {
    title: "Website Design and Development",
    shortDescription:
      "Get your business an expertly crafted website that does not only look interactive but also ranks on SERPs.",
    fullDescription: [
      "At Brandtangent, we don't just build websites; we craft digital experiences that leave a lasting impression.",
      "From front-end developers to back-end engineers, our talent is the heartbeat of our success.",
    ],
  },
]

interface ServiceWebServicesProps {
  title?: string
  services?: WebService[]
}

export default function ServiceWebServices({
  title = "Our Web Services",
  services = defaultServices,
}: ServiceWebServicesProps) {
  const [selectedService, setSelectedService] = useState<WebService | null>(null)
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-80px" })

  if (!services.length) return null

  return (
    <>
      <section
        id="deliverables"
        ref={ref}
        className="relative overflow-hidden border-t border-border bg-secondary/30 py-20 md:py-28"
      >
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="mb-14 max-w-2xl"
          >
            <div className="mb-4 flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-accent-orange" />
              <span className="micro-cap text-muted-foreground">What we deliver</span>
            </div>
            <h2 className="display-lg text-foreground">{title}</h2>
          </motion.div>

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            className="grid grid-cols-1 gap-4 md:grid-cols-2"
          >
            {services.map((service, index) => (
              <motion.button
                key={service.title}
                type="button"
                variants={staggerItem}
                onClick={() => setSelectedService(service)}
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
                whileHover={{ y: -4 }}
                className={`group relative w-full overflow-hidden border bg-background p-8 text-left transition-shadow hover:shadow-[var(--shadow-accent-orange-soft)] ${
                  hoveredIndex === index ? "border-accent-orange/40" : "border-border"
                } ${index === 0 && services.length > 2 ? "md:col-span-2 md:grid md:grid-cols-[1fr_auto] md:items-center md:gap-8" : ""}`}
              >
                <span className="absolute left-6 top-6 font-mono text-xs text-muted-foreground/50 transition-colors group-hover:text-accent-orange">
                  {String(index + 1).padStart(2, "0")}
                </span>

                <div className={index === 0 && services.length > 2 ? "md:pt-4" : "pt-4"}>
                  <h3
                    className={`pr-8 font-semibold leading-snug text-foreground ${
                      index === 0 && services.length > 2 ? "text-2xl md:text-3xl" : "text-xl"
                    }`}
                  >
                    {service.title}
                  </h3>
                  <p
                    className={`mt-3 leading-relaxed text-muted-foreground ${
                      index === 0 && services.length > 2 ? "text-base max-w-2xl" : "text-sm"
                    }`}
                  >
                    {service.shortDescription}
                  </p>
                </div>

                <div className="mt-6 flex items-center justify-between md:mt-0">
                  <span className="text-sm font-semibold text-muted-foreground transition-colors group-hover:text-accent-orange">
                    Learn more
                  </span>
                  <span className="flex h-10 w-10 items-center justify-center bg-accent-orange/10 transition-colors group-hover:bg-accent-orange">
                    <ArrowUpRight className="h-4 w-4 text-accent-orange transition-colors group-hover:text-white" />
                  </span>
                </div>

                <motion.span
                  className="absolute bottom-0 left-0 h-0.5 bg-accent-orange"
                  initial={{ width: 0 }}
                  animate={{ width: hoveredIndex === index ? "100%" : 0 }}
                  transition={{ duration: 0.35 }}
                />
              </motion.button>
            ))}
          </motion.div>
        </div>
      </section>

      <AnimatePresence>
        {selectedService ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-[100] flex items-center justify-center px-4 py-8"
            onClick={() => setSelectedService(null)}
          >
            <div className="absolute inset-0 bg-foreground/50 backdrop-blur-sm" />

            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 24 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 24 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              onClick={(e) => e.stopPropagation()}
              className="relative max-h-[85vh] w-full max-w-2xl overflow-y-auto border border-border bg-background p-8 shadow-[var(--shadow-modal)] md:p-12"
            >
              <button
                type="button"
                onClick={() => setSelectedService(null)}
                className="absolute right-5 top-5 flex h-9 w-9 items-center justify-center border border-border transition-colors hover:border-accent-orange/40 hover:bg-secondary"
                aria-label="Close"
              >
                <X className="h-4 w-4 text-muted-foreground" />
              </button>

              <span className="micro-cap text-accent-orange">Deliverable</span>
              <h3 className="display-lg mt-2 mb-6 pr-10 text-foreground">
                {selectedService.title}
              </h3>

              <div className="space-y-4">
                {selectedService.fullDescription.map((paragraph, i) => (
                  <p key={i} className="text-base leading-relaxed text-muted-foreground">
                    {paragraph}
                  </p>
                ))}
              </div>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  )
}

"use client"

import { useRef } from "react"
import { motion, useInView } from "framer-motion"

interface ProcessPhase {
  title: string
  items: string[]
}

const defaultPhases: ProcessPhase[] = [
  {
    title: "Planning",
    items: [
      "Business Analysis",
      "Document Specifications",
      "Preparing Wireframes",
      "Getting Client Approval",
    ],
  },
  {
    title: "Development",
    items: [
      "Coding",
      "Mockup & Page Layout Creation",
      "Review",
      "Approval Cycle",
    ],
  },
  {
    title: "Testing",
    items: [
      "Preparing Test Cases",
      "Testing",
      "Review By The QA Team",
      "Approval Cycle",
    ],
  },
  {
    title: "Deployment",
    items: [
      "Launch",
      "Opinion Monitoring",
      "Maintenance",
      "Post-Deployment Support",
    ],
  },
]

interface ServiceProcessGridProps {
  badge?: string
  title?: string
  description?: string
  phases?: ProcessPhase[]
}

export default function ServiceProcessGrid({
  badge = "Our Process",
  title = "Elevate Your Web Experience with Our Seamless Process",
  description = "Our process involves in-depth business analysis, documenting specifications, creating wireframes, and obtaining your approval before moving forward. Our seasoned web experts guide you through every step of the journey, right till the end, ensuring your website aligns with your brand's objectives.",
  phases = defaultPhases,
}: ServiceProcessGridProps) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  return (
    <section ref={ref} className="relative w-full py-16 md:py-20 overflow-hidden" style={{ background: "#fff" }}>
      {/* Orange dot grid */}
      <div
        className="absolute inset-0 opacity-[0.05] pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, #FF5722 1px, transparent 0)`,
          backgroundSize: '40px 40px',
        }}
      />
      {/* Warm peach glow */}
      <div
        className="absolute top-0 right-0 w-[600px] h-[400px] rounded-full blur-[160px] pointer-events-none"
        style={{ background: "rgba(255,210,184,0.4)" }}
      />

      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-16">

          {/* Left — Sticky Text */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
            className="lg:w-5/12 lg:sticky lg:top-32"
            style={{ alignSelf: "flex-start" }}
          >
            <div className="flex items-center gap-2 mb-5">
              <div className="w-2 h-2 rounded-full bg-ignite-orange animate-pulse" />
              <span className="text-ignite-orange font-semibold tracking-widest uppercase text-xs">{badge}</span>
            </div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-light text-foreground leading-tight tracking-tight mb-6">
              {title}
            </h2>
            <p className="text-foreground/50 text-sm md:text-base leading-relaxed">
              {description}
            </p>
          </motion.div>

          {/* Right — 2×2 Process Cards Grid */}
          <div className="lg:w-7/12 grid grid-cols-1 sm:grid-cols-2 gap-5 md:gap-6">
            {phases.map((phase, index) => (
              <motion.div
                key={phase.title}
                initial={{ opacity: 0, y: 40 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.2 + index * 0.12 }}
                className="group relative rounded-2xl p-6 md:p-7 border transition-all duration-300 hover:scale-[1.03] hover:-translate-y-1"
                style={{
                  background: "#FFF5F0",
                  border: "1.5px solid rgba(255,87,34,0.10)",
                  boxShadow: "0 2px 12px rgba(255,210,184,0.25)",
                }}
              >
                {/* Top glow line on hover */}
                <div className="absolute top-0 left-4 right-4 h-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-full" style={{ background: "linear-gradient(to right, transparent, #FF5722, transparent)" }} />
                {/* Background gradient on hover */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl pointer-events-none" style={{ background: "linear-gradient(135deg, rgba(255,87,34,0.04), transparent)" }} />
                {/* Peach corner accent */}
                <div className="absolute top-0 right-0 w-14 h-14 rounded-bl-3xl rounded-tr-2xl opacity-70" style={{ background: "#FFD2B8" }} />

                {/* Step number */}
                <div className="absolute top-4 right-5 text-xs font-mono font-bold" style={{ color: "rgba(255,87,34,0.3)" }}>0{index + 1}</div>

                <h3 className="text-lg md:text-xl font-semibold text-foreground mb-5 group-hover:text-ignite-orange transition-colors">
                  {phase.title}
                </h3>

                <ul className="space-y-3">
                  {phase.items.map((item) => (
                    <li key={item} className="flex items-start gap-3">
                      <div className="w-2 h-2 rounded-full mt-1.5 flex-shrink-0" style={{ background: "#FF5722" }} />
                      <span className="text-foreground/55 text-sm leading-relaxed">{item}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>

        </div>
      </div>
    </section>
  )
}

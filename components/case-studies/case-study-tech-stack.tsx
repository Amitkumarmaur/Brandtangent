"use client"

import { motion } from "motion/react"

interface TechItem {
  name: string
  logo?: string | null
  color: string
}

interface CaseStudyTechStackProps {
  techStack: TechItem[]
}

export default function CaseStudyTechStack({ techStack }: CaseStudyTechStackProps) {
  return (
    <section className="relative w-full py-20 lg:py-28 bg-white border-t border-border overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Header row */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 md:mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-center gap-2 mb-4">
              <div className="w-2 h-2 rounded-full bg-[rgba(28,28,28,0.4)]" />
              <span className="text-muted-foreground font-semibold tracking-wider text-sm uppercase">
                Technology
              </span>
            </div>
            <h2 className="display-xl text-foreground">
              Tools &amp; Platforms Used
            </h2>
          </motion.div>

          <p className="text-sm text-muted-foreground max-w-xs md:text-right">
            Best-in-class tools selected specifically for this project&apos;s requirements.
          </p>
        </div>

        {/* Tech grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="flex flex-wrap gap-4 md:gap-6"
        >
          {techStack.map((tech, index) => (
            <motion.div
              key={`${tech.name}-${index}`}
              initial={{ opacity: 0, scale: 0.85 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.35, delay: index * 0.05 }}
              className="flex items-center gap-3 bg-white rounded-md border border-border px-5 py-3.5 hover:border-[rgba(28,28,28,0.3)] hover:shadow-sm transition-all group cursor-default"
            >
              {tech.logo ? (
                <div className="w-7 h-7 flex-shrink-0">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={tech.logo}
                    alt={tech.name}
                    className="w-full h-full object-contain"
                  />
                </div>
              ) : (
                <div
                  className="w-7 h-7 rounded-sm flex items-center justify-center flex-shrink-0 text-xs font-semibold"
                  style={{ backgroundColor: `${tech.color}20`, color: tech.color }}
                >
                  {tech.name.charAt(0)}
                </div>
              )}
              <span className="text-sm font-semibold text-foreground whitespace-nowrap">
                {tech.name}
              </span>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}

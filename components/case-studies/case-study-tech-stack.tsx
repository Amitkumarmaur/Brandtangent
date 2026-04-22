"use client"

import { motion } from "framer-motion"

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
    <section className="relative w-full py-20 lg:py-28 bg-grey-100 border-t border-grey-200 overflow-hidden">
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
              <div className="w-2 h-2 rounded-full bg-ignite-orange" />
              <span className="font-heading text-ignite-orange font-medium tracking-wider text-sm uppercase">
                Technology
              </span>
            </div>
            <h2 className="font-heading text-3xl md:text-4xl font-semibold text-foreground tracking-tight leading-tight">
              Tools &amp; Platforms Used
            </h2>
          </motion.div>

          <p className="text-sm text-grey-400 max-w-xs md:text-right">
            Best-in-class tools selected specifically for this project's requirements.
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
              className="flex items-center gap-3 bg-background rounded-2xl border border-grey-200 px-5 py-3.5 hover:border-ignite-orange/50 hover:shadow-md transition-all group cursor-default"
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
                  className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 text-xs font-bold"
                  style={{ backgroundColor: `${tech.color}20`, color: tech.color }}
                >
                  {tech.name.charAt(0)}
                </div>
              )}
              <span className="text-sm font-heading font-semibold text-foreground group-hover:text-ignite-orange transition-colors whitespace-nowrap">
                {tech.name}
              </span>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}

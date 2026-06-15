"use client"

import { motion } from "motion/react"

interface Challenge {
  title: string
  description: string
}

interface CaseStudyChallengesProps {
  challenges: Challenge[]
}

export default function CaseStudyChallenges({ challenges }: CaseStudyChallengesProps) {
  return (
    <section className="relative w-full py-20 lg:py-32 bg-white border-t border-border overflow-hidden">
      {/* Watermark */}
      <div className="absolute right-8 top-8 text-[10rem] lg:text-[16rem] font-semibold text-[rgba(28,28,28,0.05)] leading-none select-none pointer-events-none">
        03
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="mb-14 md:mb-20"
        >
          <div className="flex items-center gap-2 mb-4">
            <div className="w-2 h-2 rounded-full bg-[rgba(28,28,28,0.4)]" />
            <span className="text-muted-foreground font-semibold tracking-wider text-sm uppercase">
              Execution Hurdles
            </span>
          </div>
          <h2 className="display-xl text-foreground max-w-xl">
            Key Challenges We Conquered
          </h2>
        </motion.div>

        {/* Numbered list */}
        <div className="space-y-0 divide-y divide-border">
          {challenges.map((challenge, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className="group grid grid-cols-[64px_1fr] md:grid-cols-[100px_1fr] gap-6 md:gap-10 py-8 md:py-10 hover:bg-[rgba(28,28,28,0.02)] transition-colors -mx-6 px-6 lg:-mx-8 lg:px-8"
            >
              {/* Number */}
              <div className="flex-shrink-0 pt-1">
                <span className="font-mono text-2xl md:text-3xl font-semibold text-[rgba(28,28,28,0.15)] group-hover:text-foreground transition-colors">
                  {String(i + 1).padStart(2, "0")}
                </span>
              </div>

              {/* Content */}
              <div>
                <h3 className="text-xl md:text-2xl font-semibold text-foreground tracking-tight mb-2">
                  {challenge.title}
                </h3>
                <p className="text-base text-muted-foreground leading-relaxed max-w-2xl">
                  {challenge.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

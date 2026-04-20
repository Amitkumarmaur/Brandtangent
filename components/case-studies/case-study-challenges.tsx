"use client"

import { motion } from "framer-motion"

interface Challenge {
  title: string
  description: string
}

interface CaseStudyChallengesProps {
  challenges: Challenge[]
}

export default function CaseStudyChallenges({ challenges }: CaseStudyChallengesProps) {
  return (
    <section className="relative w-full py-20 lg:py-32 bg-background border-t border-grey-200 overflow-hidden">
      {/* Large "03" watermark */}
      <div className="absolute right-8 top-8 font-heading text-[10rem] lg:text-[16rem] font-black text-grey-200 leading-none select-none pointer-events-none">
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
            <div className="w-2 h-2 rounded-full bg-ignite-orange" />
            <span className="font-heading text-ignite-orange font-medium tracking-wider text-sm uppercase">
              Execution Hurdles
            </span>
          </div>
          <h2 className="font-heading text-3xl md:text-4xl lg:text-5xl font-semibold text-foreground tracking-tight leading-tight max-w-xl">
            Key Challenges We Conquered
          </h2>
        </motion.div>

        {/* Numbered list — editorial style */}
        <div className="space-y-0 divide-y divide-grey-200">
          {challenges.map((challenge, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className="group grid grid-cols-[64px_1fr] md:grid-cols-[100px_1fr] gap-6 md:gap-10 py-8 md:py-10 hover:bg-grey-50 transition-colors -mx-6 px-6 lg:-mx-8 lg:px-8"
            >
              {/* Number */}
              <div className="flex-shrink-0 pt-1">
                <span className="font-mono text-2xl md:text-3xl font-bold text-grey-200 group-hover:text-ignite-orange transition-colors">
                  {String(i + 1).padStart(2, "0")}
                </span>
              </div>

              {/* Content */}
              <div>
                <h3 className="font-heading text-xl md:text-2xl font-semibold text-foreground tracking-tight mb-2 group-hover:text-ignite-orange transition-colors">
                  {challenge.title}
                </h3>
                <p className="text-base text-grey-400 leading-relaxed max-w-2xl">
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

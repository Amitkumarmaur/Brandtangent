"use client"

import { motion } from "framer-motion"
import { ArrowRight } from "lucide-react"

interface ServiceHeroProps {
  badge: string
  title: string
  highlightedWord: string
  description: string
  stats: { value: string; label: string }[]
}

export default function ServiceHero({ badge, title, highlightedWord, description, stats }: ServiceHeroProps) {
  return (
    <section className="relative w-full min-h-[90vh] bg-foreground flex items-center overflow-hidden pt-28 pb-16 md:pt-32 md:pb-20">
      {/* Cosmic gradient background effects */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[600px] bg-ignite-orange/10 rounded-full blur-[180px]" />
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-ignite-orange/5 rounded-full blur-[120px]" />
        <div className="absolute top-1/3 left-0 w-[300px] h-[300px] bg-ignite-orange/5 rounded-full blur-[100px]" />
        {/* Star-like dot pattern */}
        <div
          className="absolute inset-0 opacity-[0.15]"
          style={{
            backgroundImage: `radial-gradient(1px 1px at 20px 30px, white, transparent),
                              radial-gradient(1px 1px at 40px 70px, rgba(255,255,255,0.5), transparent),
                              radial-gradient(1px 1px at 90px 40px, white, transparent),
                              radial-gradient(1px 1px at 130px 80px, rgba(255,255,255,0.4), transparent),
                              radial-gradient(1px 1px at 160px 30px, white, transparent)`,
            backgroundSize: '200px 100px',
          }}
        />
      </div>

      {/* Glow line at top */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-ignite-orange/40 to-transparent" />

      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10 w-full">
        <div className="max-w-4xl">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex items-center gap-2 mb-8"
          >
            <div className="w-2 h-2 rounded-full bg-ignite-orange animate-pulse" />
            <span className="text-ignite-orange font-semibold tracking-widest uppercase text-xs md:text-sm">
              {badge}
            </span>
          </motion.div>

          {/* Title */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-[1.05] tracking-tight mb-8"
          >
            {title}{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-ignite-orange to-orange-400">
              {highlightedWord}
            </span>
          </motion.h1>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="text-lg md:text-xl text-white/60 max-w-2xl leading-relaxed mb-10"
          >
            {description}
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-4 mb-16"
          >
            <a
              href="#contact"
              className="group inline-flex items-center gap-2 bg-ignite-orange hover:bg-ignite-orange/90 text-white px-8 py-4 rounded-full font-semibold text-base transition-all shadow-[0_4px_20px_rgba(255,87,34,0.3)] hover:shadow-[0_8px_30px_rgba(255,87,34,0.4)]"
            >
              Get a Free Audit
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </a>
            <a
              href="#process"
              className="inline-flex items-center gap-2 bg-white/5 hover:bg-white/10 text-white px-8 py-4 rounded-full font-semibold text-base transition-all border border-white/10 hover:border-white/20"
            >
              See Our Process
            </a>
          </motion.div>

          {/* Stats Row */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.4 }}
            className="flex flex-wrap gap-8 md:gap-16"
          >
            {stats.map((stat, index) => (
              <div key={index} className="flex flex-col">
                <span className="text-3xl md:text-4xl font-bold text-white">{stat.value}</span>
                <span className="text-sm text-white/50 mt-1">{stat.label}</span>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  )
}

"use client"

import { motion } from "motion/react"
import Link from "next/link"
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
    <section className="relative w-full min-h-[80vh] bg-white flex items-center overflow-hidden pt-28 pb-16 md:pt-32 md:pb-20 border-b border-border">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10 w-full">
        <div className="max-w-4xl">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="micro-cap text-muted-foreground mb-8"
          >
            {badge}
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="display-xl text-foreground mb-6"
          >
            {title}{" "}
            <span className="text-muted-foreground">{highlightedWord}</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="text-lg text-muted-foreground max-w-2xl leading-relaxed mb-10"
          >
            {description}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-4 mb-16"
          >
            <Link
              href="/#contact"
              className="inline-flex items-center gap-2 h-11 px-6 rounded-sm bg-primary text-primary-foreground text-sm font-semibold shadow-[rgba(255,255,255,0.2)_0px_0.5px_0px_0px_inset,rgba(0,0,0,0.2)_0px_0px_0px_0.5px_inset,rgba(0,0,0,0.05)_0px_1px_2px_0px] hover:opacity-90 active:opacity-80 transition-opacity group"
            >
              Get started
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </Link>
            <Link
              href="#process"
              className="inline-flex items-center gap-2 h-11 px-6 rounded-sm border border-[rgba(28,28,28,0.4)] text-foreground text-sm font-semibold hover:bg-[rgba(83,58,253,0.04)] active:opacity-80 transition-colors"
            >
              See our process
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.4 }}
            className="flex flex-wrap gap-8 md:gap-16"
          >
            {stats.map((stat, index) => (
              <div key={index} className="flex flex-col">
                <span className="display-lg text-foreground">{stat.value}</span>
                <span className="text-sm text-muted-foreground mt-1">{stat.label}</span>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  )
}

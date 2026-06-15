"use client"

import { motion } from "motion/react"
import { Zap } from "lucide-react"

export default function ServicesDirectoryHero() {
  return (
    <section className="relative w-full pt-32 pb-24 md:pt-40 md:pb-32 lg:pt-48 lg:pb-40 bg-gradient-to-br from-white via-white to-secondary overflow-hidden border-t border-border">
      {/* Background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-accent-orange/5 to-transparent rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-br from-accent-blue/10/5 to-transparent rounded-full blur-3xl" />
      </div>

      <div className="w-full max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="flex flex-col items-start lg:items-center text-left lg:text-center max-w-4xl mx-auto"
        >
          {/* Icon */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="flex items-center gap-3 mb-6"
          >
            <div className="w-12 h-12 rounded-full bg-accent-orange/10 flex items-center justify-center">
              <Zap className="w-6 h-6 text-accent-orange" />
            </div>
            <span className="text-sm font-semibold text-accent-orange uppercase tracking-widest">Capabilities</span>
          </motion.div>

          <h1 className="display-xxl text-foreground mb-6 text-balance">
            Services built<br className="hidden lg:block" /> for brands that<br className="hidden lg:block" /> lead categories
          </h1>

          <p className="text-subtitle max-w-3xl mx-auto text-balance mb-8">
            From brand strategy and identity to performance creative and digital experiences â€” pick a category to explore our capabilities, methodology, and proof.
          </p>

          {/* Quick stats */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-6 sm:gap-10"
          >
            {[
              { label: "Services", value: "20+" },
              { label: "Categories", value: "8" },
              { label: "Industries", value: "12+" },
            ].map((stat, i) => (
              <div key={i} className="flex items-center gap-4">
                <div>
                  <span className="display-md text-accent-orange">{stat.value}</span>
                  <p className="text-sm text-muted-foreground mt-1">{stat.label}</p>
                </div>
              </div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}

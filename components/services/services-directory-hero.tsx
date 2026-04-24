"use client"

import { motion } from "framer-motion"

export default function ServicesDirectoryHero() {
  return (
    <section className="relative w-full pt-32 pb-16 md:pt-40 md:pb-20 bg-background overflow-hidden border-t border-grey-200">
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.03]"
        aria-hidden
        style={{
          backgroundImage:
            "linear-gradient(#0A0A0A 1px, transparent 1px), linear-gradient(90deg, #0A0A0A 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }}
      />

      <div className="w-full max-w-7xl mx-auto px-6 lg:px-8 relative z-10 text-center">
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55 }}
          className="flex flex-col items-center"
        >
          <div className="flex items-center gap-2 mb-6">
            <div className="w-2 h-2 rounded-full bg-ignite-orange" />
            <span className="text-eyebrow text-ignite-orange">Capabilities</span>
          </div>

          <h1 className="heading-display text-foreground max-w-4xl tracking-tight mb-6 text-balance">
            Services engineered for B2B growth
          </h1>

          <p className="text-subtitle max-w-2xl mx-auto text-balance text-grey-400">
            From AI workflows and automation to performance web experiences — pick a category to open its
            dedicated page, then drill into any service for methodology, stack, and proof.
          </p>
        </motion.div>
      </div>
    </section>
  )
}

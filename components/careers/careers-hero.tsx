"use client"

import { motion } from "framer-motion"

export default function CareersHero() {
  return (
    <section className="relative w-full pt-32 pb-12 md:pt-40 md:pb-16 bg-background overflow-hidden border-t border-grey-200">
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.03]"
        aria-hidden
        style={{
          backgroundImage:
            "linear-gradient(#0A0A0A 1px, transparent 1px), linear-gradient(90deg, #0A0A0A 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }}
      />

      <div className="w-full max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55 }}
          className="max-w-3xl"
        >
          <div className="flex items-center gap-2 mb-6">
            <div className="w-2 h-2 rounded-full bg-ignite-orange" />
            <span className="text-eyebrow text-ignite-orange">Careers</span>
          </div>
          <h1 className="heading-display text-foreground tracking-tight mb-6 text-balance">
            Build with a team that ships systems, not slides
          </h1>
          <p className="text-subtitle text-grey-400 text-balance">
            We hire engineers, strategists, and operators who care about B2B outcomes. Send your resume and a short note
            — we read every submission.
          </p>
        </motion.div>
      </div>
    </section>
  )
}

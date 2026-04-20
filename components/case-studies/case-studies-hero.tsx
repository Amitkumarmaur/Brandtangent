"use client"

import { motion } from "framer-motion"

export default function CaseStudiesHero() {
  return (
    <section className="relative w-full bg-foreground pt-40 pb-20 overflow-hidden">
      <div className="absolute inset-0 opacity-10" aria-hidden>
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex flex-col items-center text-center"
        >
          <div className="flex items-center gap-2 mb-6">
            <div className="w-2 h-2 rounded-full bg-ignite-orange" />
            <span className="font-heading text-white font-medium tracking-wider uppercase text-sm">
              Portfolio
            </span>
          </div>
          <h1 className="heading-h1 text-white max-w-4xl">
            Systems that ship: <span className="text-white/90">our work</span>
          </h1>
          <p className="mt-6 max-w-2xl text-body-lg text-grey-400">
            Engineering-led marketing builds for B2B teams — from automation and AI workflows to web
            experiences that convert. Filter by topic to see how we connect strategy to measurable outcomes.
          </p>
        </motion.div>
      </div>
    </section>
  )
}

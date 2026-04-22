"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { ArrowUpRight } from "lucide-react"

export default function CaseStudyCTA() {
  return (
    <section className="relative w-full overflow-hidden bg-grey-50 border-t border-grey-200">
      {/* Orange accent glow — top centre */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-ignite-orange/15 rounded-full blur-[80px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-24 lg:py-32 relative z-10">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-10 lg:gap-16">

          {/* Left: text */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="max-w-2xl"
          >
            <div className="flex items-center gap-2 mb-6">
              <div className="w-2 h-2 rounded-full bg-ignite-orange" />
              <span className="font-heading text-ignite-orange font-medium tracking-wider text-sm uppercase">
                Work With Us
              </span>
            </div>

            <h2 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold text-foreground tracking-tight leading-[1.05] mb-5">
              Ready to write<br />your own story?
            </h2>

            <p className="text-base md:text-lg text-grey-400 leading-relaxed">
              Our team is ready to architect and execute your next digital
              transformation. Let&apos;s build something remarkable together.
            </p>
          </motion.div>

          {/* Right: button */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="flex-shrink-0"
          >
            <Link
              href="/contact"
              className="group inline-flex items-center gap-3 bg-ignite-orange text-white font-heading font-bold text-sm uppercase tracking-widest px-8 py-5 rounded-full hover:bg-ignite-orange/90 transition-all shadow-[0_8px_30px_rgba(255,87,34,0.25)] hover:shadow-[0_12px_40px_rgba(255,87,34,0.4)] hover:-translate-y-0.5 transform"
            >
              Start Your Project
              <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </Link>
          </motion.div>

        </div>
      </div>
    </section>
  )
}

"use client"

import { motion } from "motion/react"
import Link from "next/link"
import { ArrowUpRight } from "lucide-react"

export default function CaseStudyCTA() {
  return (
    <section className="relative w-full overflow-hidden bg-white border-t border-border">
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
              <div className="w-2 h-2 rounded-full bg-[rgba(28,28,28,0.4)]" />
              <span className="text-muted-foreground font-semibold tracking-wider text-sm uppercase">
                Work With Us
              </span>
            </div>

            <h2 className="display-lg text-foreground mb-4">
              Ready to write<br />your own story?
            </h2>

            <p className="text-base md:text-lg text-muted-foreground leading-relaxed">
              Our team is ready to build and execute your next brand transformation.
              Let&apos;s create something remarkable together.
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
              className="group inline-flex items-center gap-3 bg-primary text-primary-foreground font-semibold text-sm px-8 h-12 rounded-sm shadow-[rgba(255,255,255,0.2)_0px_0.5px_0px_0px_inset,rgba(0,0,0,0.2)_0px_0px_0px_0.5px_inset,rgba(0,0,0,0.05)_0px_1px_2px_0px] hover:opacity-90 active:opacity-80 transition-opacity"
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

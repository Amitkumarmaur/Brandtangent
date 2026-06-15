"use client"

import { useRef } from "react"
import Link from "next/link"
import { motion, useInView } from "motion/react"
import { ArrowRight } from "lucide-react"

import { Button } from "@/components/ui/button"
import { ElegantShapesBackground } from "@/components/landing/elegant-shapes"

export default function LandingCta() {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: "-80px" })

  return (
    <section className="relative w-full py-20 md:py-28 bg-background overflow-hidden border-t border-border">
      <ElegantShapesBackground />

      <motion.div
        className="absolute inset-0 pointer-events-none"
        aria-hidden
        style={{
          background:
            "radial-gradient(ellipse at 50% 100%, rgba(83,58,253,0.08) 0%, transparent 60%)",
        }}
      />

      <div ref={ref} className="w-full max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="relative rounded-md overflow-hidden border border-border bg-primary p-10 md:p-16 text-center"
        >
          <motion.div
            className="absolute inset-0 opacity-30 pointer-events-none"
            animate={{
              background: [
                "radial-gradient(circle at 20% 50%, rgba(83,58,253,0.4) 0%, transparent 50%)",
                "radial-gradient(circle at 80% 50%, rgba(83,58,253,0.4) 0%, transparent 50%)",
                "radial-gradient(circle at 20% 50%, rgba(83,58,253,0.4) 0%, transparent 50%)",
              ],
            }}
            transition={{ duration: 8, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
            aria-hidden
          />

          <div className="relative z-10 max-w-2xl mx-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={isInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.6, delay: 0.15 }}
              className="inline-flex mb-6"
            >
              <span className="pill-tag bg-primary/20 text-white border border-primary/30">
                Ready to grow?
              </span>
            </motion.div>

            <h2 className="heading-h2 text-white mb-4">
              Let&apos;s build something your market can&apos;t ignore
            </h2>
            <p className="text-body-lg text-white/60 mb-8 max-w-lg mx-auto">
              Book a strategy session and discover how intelligent marketing systems
              can transform your brand&apos;s trajectory.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}>
                <Button size="lg" asChild>
                  <Link href="/#contact">
                    Get in touch
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </Button>
              </motion.div>
              <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}>
                <Button size="lg" variant="secondary" asChild>
                  <Link href="/case-studies">View case studies</Link>
                </Button>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

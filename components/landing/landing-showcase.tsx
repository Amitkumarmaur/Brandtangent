"use client"

import dynamic from "next/dynamic"
import { useRef } from "react"
import Link from "next/link"
import { motion, useInView } from "motion/react"
import { ArrowRight, CheckCircle2 } from "lucide-react"

import { Button } from "@/components/ui/button"

const NetworkGraph = dynamic(() => import("@/components/three/network-graph"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[420px] rounded-md bg-white/5 animate-pulse" aria-hidden />
  ),
})

const pillars = [
  "Unified brand voice across every channel",
  "Automated lead nurturing and scoring",
  "Real-time performance intelligence",
  "Scalable content production pipelines",
]

export default function LandingShowcase() {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: "-80px" })

  return (
    <section className="relative w-full py-16 md:py-20 bg-primary overflow-hidden">
      <div
        className="absolute inset-0 opacity-20 pointer-events-none"
        aria-hidden
        style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px)
          `,
          backgroundSize: "48px 48px",
        }}
      />

      <motion.div
        className="absolute top-1/4 -left-32 w-96 h-96 bg-primary/20 rounded-full blur-[120px] pointer-events-none"
        animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.35, 0.2] }}
        transition={{ duration: 8, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
        aria-hidden
      />

      <div ref={ref} className="w-full max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="flex items-center gap-2 mb-4">
              <div className="w-2 h-2 rounded-full bg-primary" />
              <span className="text-eyebrow text-primary">Connected Systems</span>
            </div>
            <h2 className="heading-h2 text-white mb-4">
              Marketing infrastructure that thinks in networks
            </h2>
            <p className="text-body-lg text-white/60 mb-8 max-w-md">
              Every touchpoint, campaign, and conversion signal connected in one intelligent
              system — so your brand grows as a unified organism, not scattered tactics.
            </p>

            <ul className="space-y-3 mb-8">
              {pillars.map((item, i) => (
                <motion.li
                  key={item}
                  initial={{ opacity: 0, x: -16 }}
                  animate={isInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.5, delay: 0.2 + i * 0.08 }}
                  className="flex items-start gap-3 text-white/70 font-light text-sm"
                >
                  <CheckCircle2 className="w-4 h-4 text-primary shrink-0 mt-0.5" strokeWidth={1.5} />
                  {item}
                </motion.li>
              ))}
            </ul>

            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
              <Button variant="secondary" size="lg" asChild>
                <Link href="/services">
                  Explore services
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </Button>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 1, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="relative"
          >
            <div className="card-3d-wrapper">
              <div className="rounded-md overflow-hidden border border-white/10 glass-dark shadow-[var(--shadow-glass)]">
                <div className="h-[420px] w-full">
                  <NetworkGraph />
                </div>
              </div>
            </div>

            <motion.div
              className="absolute -bottom-4 -right-4 glass-dark rounded-md border border-white/10 px-4 py-3 shadow-lg"
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 4, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
            >
              <p className="text-[10px] text-white/50 uppercase tracking-wider mb-1">
                Live connections
              </p>
              <p className="text-xl text-white font-light tnum">847</p>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

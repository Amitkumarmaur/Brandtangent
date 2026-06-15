"use client"

import { motion } from "motion/react"
import { Award, CheckCircle, TrendingUp, Zap } from "lucide-react"

const recognition = [
  { icon: Award, label: "Top team — Dribbble" },
  { icon: CheckCircle, label: "Top 100 — Clutch" },
  { icon: TrendingUp, label: "5-star GoodFirms" },
  { icon: Zap, label: "100% Upwork success" },
]

const doubled = [...recognition, ...recognition]

export default function AboutRecognition() {
  return (
    <section className="overflow-hidden border-t border-border bg-background py-14 md:py-16">
      <motion.p
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="micro-cap mb-8 text-center text-muted-foreground"
      >
        Recognition
      </motion.p>

      <div className="relative">
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-background to-transparent md:w-24" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-background to-transparent md:w-24" />

        <motion.div
          className="flex w-max gap-5"
          animate={{ x: ["0%", "-50%"] }}
          transition={{
            duration: 22,
            repeat: Number.POSITIVE_INFINITY,
            ease: "linear",
          }}
        >
          {doubled.map((item, i) => {
            const Icon = item.icon
            return (
              <div
                key={`${item.label}-${i}`}
                className="flex shrink-0 items-center gap-3 border border-border bg-card px-6 py-4 shadow-[var(--shadow-1)]"
              >
                <div className="flex h-10 w-10 items-center justify-center bg-accent-orange/10">
                  <Icon className="h-5 w-5 text-accent-orange" />
                </div>
                <span className="whitespace-nowrap text-sm font-medium text-foreground">
                  {item.label}
                </span>
              </div>
            )
          })}
        </motion.div>
      </div>
    </section>
  )
}

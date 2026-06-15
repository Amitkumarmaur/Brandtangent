"use client"

import { useEffect, useRef, useState } from "react"
import { motion, useInView } from "motion/react"

import { Card } from "@/components/ui/card"

export const ABOUT_STATS = [
  { value: 12, suffix: "+", label: "Years of excellence" },
  { value: 500, suffix: "+", label: "Brands transformed" },
  { value: 98, suffix: "%", label: "Client retention" },
  { value: 45, suffix: "K+", label: "Leads delivered" },
] as const

function AnimatedStat({
  value,
  suffix,
  label,
  delay = 0,
}: {
  value: number
  suffix: string
  label: string
  delay?: number
}) {
  const [display, setDisplay] = useState(0)
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: "-40px" })

  useEffect(() => {
    if (!inView) return
    const duration = 1800
    const start = performance.now()
    let frame = 0

    const tick = (now: number) => {
      const progress = Math.min((now - start) / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      setDisplay(Math.floor(value * eased))
      if (progress < 1) frame = requestAnimationFrame(tick)
    }

    const timeout = window.setTimeout(() => {
      frame = requestAnimationFrame(tick)
    }, delay)

    return () => {
      clearTimeout(timeout)
      cancelAnimationFrame(frame)
    }
  }, [inView, value, delay])

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 16 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.55, delay: delay / 1000 }}
      className="border-t border-border pt-6 text-left"
    >
      <p className="tnum font-mono text-4xl font-light text-accent-orange md:text-5xl">
        {display.toLocaleString()}
        {suffix}
      </p>
      <p className="text-caption mt-2 max-w-[12rem]">{label}</p>
    </motion.div>
  )
}

export default function AboutHeroShowcase() {
  return (
    <Card className="relative overflow-hidden border-border bg-background p-8 shadow-[var(--shadow-layered-strong)] md:p-10">
      <div className="pointer-events-none absolute right-0 top-0 h-24 w-24 bg-accent-orange/10" aria-hidden />
      <div className="pointer-events-none absolute bottom-0 left-0 h-16 w-full bg-gradient-to-t from-secondary/80 to-transparent" />

      <div className="relative z-10">
        <div className="mb-8 flex items-end justify-between border-b border-border pb-4">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
              By the numbers
            </p>
            <p className="mt-1 text-sm font-medium text-foreground">Impact at a glance</p>
          </div>
          <span className="font-mono text-xs text-accent-orange">Since 2012</span>
        </div>

        <div className="grid grid-cols-2 gap-x-8 gap-y-2">
          {ABOUT_STATS.map((stat, i) => (
            <AnimatedStat
              key={stat.label}
              value={stat.value}
              suffix={stat.suffix}
              label={stat.label}
              delay={i * 140}
            />
          ))}
        </div>

        <motion.div
          className="absolute -bottom-2 -right-1 border border-border bg-foreground px-4 py-3 text-white shadow-[var(--shadow-2)]"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9, duration: 0.5 }}
        >
          <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-white/50">
            Global reach
          </p>
          <p className="tnum text-xl font-light">18 countries</p>
        </motion.div>
      </div>
    </Card>
  )
}

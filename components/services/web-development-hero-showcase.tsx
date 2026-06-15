"use client"

import { useEffect, useRef, useState } from "react"
import { motion, useInView } from "motion/react"

import { Card } from "@/components/ui/card"
import { TiltCard } from "@/components/motion/tilt-card"

const DEFAULT_STATS = [
  { value: 500, suffix: "+", label: "Projects delivered" },
  { value: 99, suffix: ".9%", label: "Uptime SLA" },
  { value: 98, suffix: "%", label: "Client satisfaction" },
  { value: 12, suffix: "+", label: "Years building web" },
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
    const duration = 1600
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
      initial={{ opacity: 0, y: 12 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: delay / 1000 }}
      className="border-t border-border pt-5 text-left"
    >
      <p className="tnum text-3xl font-light text-accent-orange md:text-4xl">
        {display.toLocaleString()}
        {suffix}
      </p>
      <p className="text-caption mt-1.5">{label}</p>
    </motion.div>
  )
}

export default function WebDevelopmentHeroShowcase({
  statValue,
  statLabel,
}: {
  statValue?: string | null
  statLabel?: string | null
}) {
  return (
    <TiltCard intensity={8} className="w-full">
      <Card className="relative overflow-hidden border-border/60 bg-card p-7 shadow-[var(--shadow-glass)] md:p-9">
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-accent-orange/5 via-transparent to-[rgba(122,61,255,0.06)]" />

        <div className="relative z-10">
          <div className="mb-7 flex items-end justify-between border-b border-border pb-4">
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                By the numbers
              </p>
              <p className="mt-1 text-sm font-medium text-foreground">Web development impact</p>
            </div>
            {statValue ? (
              <div className="text-right">
                <p className="tnum text-xl font-light text-accent-orange">{statValue}</p>
                {statLabel ? <p className="text-caption">{statLabel}</p> : null}
              </div>
            ) : null}
          </div>

          <div className="grid grid-cols-2 gap-x-6 gap-y-2">
            {DEFAULT_STATS.map((stat, i) => (
              <AnimatedStat
                key={stat.label}
                value={stat.value}
                suffix={stat.suffix}
                label={stat.label}
                delay={i * 120}
              />
            ))}
          </div>
        </div>
      </Card>
    </TiltCard>
  )
}

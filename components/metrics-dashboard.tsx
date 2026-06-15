"use client"

import { useRef, useEffect, useState } from "react"
import { motion, useInView } from "motion/react"
import { TrendingUp, Zap, ArrowDown, Clock } from "lucide-react"
import { SectionHeader } from "@/components/motion/section-reveal"
import { TiltCard } from "@/components/motion/tilt-card"

const metrics = [
  {
    label: "Leads Generated",
    value: 45890,
    suffix: "+",
    description: "Qualified B2B leads delivered through brand-led campaigns",
    Icon: TrendingUp,
    color: "var(--accent-orange)",
  },
  {
    label: "Brand Clarity",
    value: 94,
    suffix: "%",
    description: "Clients report stronger brand positioning after working with us",
    Icon: Zap,
    color: "var(--accent-purple)",
  },
  {
    label: "Cost Reduction",
    value: 68,
    suffix: "%",
    description: "Average savings achieved through sharper brand strategy",
    Icon: ArrowDown,
    color: "var(--accent-blue)",
  },
  {
    label: "Time to Market",
    value: 3,
    suffix: "× faster",
    description: "Speed improvement in launches when brand is clear from day one",
    Icon: Clock,
    color: "var(--accent-pink)",
  },
]

function AnimatedCounter({ value, suffix, isInView }: { value: number; suffix: string; isInView: boolean }) {
  const [display, setDisplay] = useState(0)

  useEffect(() => {
    if (!isInView) return
    const duration = 1800
    const steps = 60
    const increment = value / steps
    let current = 0
    const timer = setInterval(() => {
      current += increment
      if (current >= value) { setDisplay(value); clearInterval(timer) }
      else setDisplay(Math.floor(current))
    }, duration / steps)
    return () => clearInterval(timer)
  }, [isInView, value])

  return (
    <span className="display-lg text-white tnum">
      {display.toLocaleString()}{suffix}
    </span>
  )
}

export default function MetricsDashboard() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  return (
    <section ref={ref} className="py-16 md:py-20 bg-primary relative overflow-hidden border-t border-border">
      <motion.div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] rounded-full bg-primary/10 blur-[120px] pointer-events-none"
        animate={{ scale: [1, 1.15, 1], opacity: [0.3, 0.5, 0.3] }}
        transition={{ duration: 8, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
        aria-hidden
      />
      <div className="absolute bottom-0 right-0 w-[500px] h-[300px] rounded-full bg-[rgba(234,34,97,0.08)] blur-[100px] pointer-events-none" aria-hidden />

      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
        <SectionHeader
          align="center"
          dark
          eyebrow="Our impact"
          title="Results that speak"
          subtitle="Real metrics from brands we've shaped and campaigns we've built"
          className="mb-14"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {metrics.map(({ label, value, suffix, description, Icon, color }, index) => (
            <motion.div
              key={label}
              initial={{ opacity: 0, y: 24 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] }}
            >
              <TiltCard intensity={6}>
                <div className="glass-dark rounded-md p-7 flex flex-col gap-3 h-full hover:bg-white/10 transition-colors duration-300 cursor-default">
                  <div
                    className="w-9 h-9 rounded-full flex items-center justify-center"
                    style={{ background: `${color}20` }}
                  >
                    <Icon className="w-4 h-4" style={{ color }} strokeWidth={1.5} />
                  </div>
                  <AnimatedCounter value={value} suffix={suffix} isInView={isInView} />
                  <p className="text-[15px] font-normal text-white">{label}</p>
                  <p className="text-caption text-white/40 leading-relaxed">{description}</p>
                </div>
              </TiltCard>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

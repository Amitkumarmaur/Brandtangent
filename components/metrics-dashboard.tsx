"use client"

import { useRef, useEffect, useState } from "react"
import { motion, useInView } from "framer-motion"

const metrics = [
  { label: "Leads Generated", value: 45890, suffix: "+", color: "var(--color-ignite-orange)" },
  { label: "Automation Efficiency", value: 94, suffix: "%", color: "var(--color-success)" },
  { label: "Cost Reduction", value: 68, suffix: "%", color: "var(--color-ignite-orange)" },
  { label: "Time to Market", value: 3, suffix: "x faster", color: "var(--color-success)" },
]

function AnimatedNumber({ value, suffix, color }: { value: number; suffix: string; color: string }) {
  const [displayValue, setDisplayValue] = useState(0)
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true })

  useEffect(() => {
    if (!isInView) return

    const duration = 2000
    const steps = 60
    const increment = value / steps
    let current = 0
    const timer = setInterval(() => {
      current += increment
      if (current >= value) {
        setDisplayValue(value)
        clearInterval(timer)
      } else {
        setDisplayValue(Math.floor(current))
      }
    }, duration / steps)

    return () => clearInterval(timer)
  }, [isInView, value])

  return (
    <span ref={ref} style={{ color }} className="text-4xl md:text-5xl font-bold">
      {displayValue.toLocaleString()}
      {suffix}
    </span>
  )
}

export default function MetricsDashboard() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  return (
    <section ref={ref} className="py-16 md:py-20 bg-foreground relative">
      {/* Grid pattern background */}
      <div className="absolute inset-0 grid-pattern" />

      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-5xl font-bold text-white text-balance">Results That Speak</h2>
          <p className="mt-4 text-lg text-grey-400 max-w-2xl mx-auto">
            Real metrics from real automations powering growth worldwide
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {metrics.map((metric, index) => (
            <motion.div
              key={metric.label}
              initial={{ opacity: 0, y: 40 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="text-center p-8 bg-grey-800 rounded-2xl border border-grey-600/20"
            >
              <AnimatedNumber value={metric.value} suffix={metric.suffix} color={metric.color} />
              <p className="mt-4 text-grey-400 font-medium">{metric.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

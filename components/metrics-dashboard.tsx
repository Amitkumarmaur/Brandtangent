"use client"

import { useRef, useEffect, useState } from "react"
import { motion, useInView } from "framer-motion"
const metrics = [
  {
    label: "Leads Generated",
    value: 45890,
    suffix: "+",
    description: "Qualified B2B leads delivered through AI-powered campaigns",
    icon: "growth",
  },
  {
    label: "Automation Efficiency",
    value: 94,
    suffix: "%",
    description: "Average workflow automation rate across client operations",
    icon: "bolt",
  },
  {
    label: "Cost Reduction",
    value: 68,
    suffix: "%",
    description: "Average savings achieved through intelligent automation",
    icon: "down",
  },
  {
    label: "Time to Market",
    value: 3,
    suffix: "x faster",
    description: "Speed improvement in launches powered by our workflows",
    icon: "clock",
  },
]

function MetricIcon({ type }: { type: string }) {
  const cls = "w-6 h-6"
  switch (type) {
    case "growth":
      return (
        <svg className={cls} viewBox="0 0 24 24" fill="currentColor">
          <rect x="2" y="14" width="4" height="8" rx="1" />
          <rect x="8" y="10" width="4" height="12" rx="1" />
          <rect x="14" y="6" width="4" height="16" rx="1" />
          <rect x="20" y="2" width="4" height="20" rx="1" opacity="0.5" />
        </svg>
      )
    case "bolt":
      return (
        <svg className={cls} viewBox="0 0 24 24" fill="currentColor">
          <path d="M13 2L4.09 12.63a1 1 0 00.78 1.62H11l-1 7.75L19.91 11.37a1 1 0 00-.78-1.62H13l1-7.75z" />
        </svg>
      )
    case "down":
      return (
        <svg className={cls} viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2a1 1 0 011 1v13.59l4.3-4.3a1 1 0 111.4 1.42l-6 6a1 1 0 01-1.4 0l-6-6a1 1 0 111.4-1.42L11 16.59V3a1 1 0 011-1z" />
          <path d="M4 21a1 1 0 011-1h14a1 1 0 110 2H5a1 1 0 01-1-1z" />
        </svg>
      )
    case "clock":
      return (
        <svg className={cls} viewBox="0 0 24 24" fill="currentColor">
          <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm1 5a1 1 0 10-2 0v5a1 1 0 00.293.707l3 3a1 1 0 001.414-1.414L13 11.586V7z" />
        </svg>
      )
    default:
      return null
  }
}

function AnimatedCounter({
  value,
  suffix,
  isInView,
}: {
  value: number
  suffix: string
  isInView: boolean
}) {
  const [display, setDisplay] = useState(0)

  useEffect(() => {
    if (!isInView) return
    const duration = 2000
    const steps = 60
    const increment = value / steps
    let current = 0
    const timer = setInterval(() => {
      current += increment
      if (current >= value) {
        setDisplay(value)
        clearInterval(timer)
      } else {
        setDisplay(Math.floor(current))
      }
    }, duration / steps)
    return () => clearInterval(timer)
  }, [isInView, value])

  return (
    <span className="font-heading text-4xl md:text-5xl font-bold tabular-nums tracking-tight text-foreground">
      {display.toLocaleString()}
      {suffix}
    </span>
  )
}

function MetricCard({
  metric,
  index,
  isInView,
}: {
  metric: (typeof metrics)[number]
  index: number
  isInView: boolean
}) {
  const [isHovered, setIsHovered] = useState(false)
  const animDelay = index * 0.12

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: animDelay, ease: "easeOut" }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group relative"
    >
      <motion.div
        whileHover={{ scale: 1.03, y: -6 }}
        transition={{ type: "spring", stiffness: 400, damping: 25 }}
        className="relative bg-white border border-grey-200 rounded-[1.5rem] p-8 md:p-10 text-center overflow-hidden h-full flex flex-col items-center justify-center cursor-default shadow-[0_8px_30px_rgba(0,0,0,0.25)]"
      >
        {/* Hover glow */}
        <motion.div
          animate={{ opacity: isHovered ? 0.06 : 0 }}
          transition={{ duration: 0.4 }}
          className="absolute inset-0 rounded-[1.5rem] pointer-events-none"
          style={{
            background:
              "radial-gradient(circle at 50% 40%, var(--color-ignite-orange), transparent 70%)",
          }}
        />

        {/* Icon */}
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={isInView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.5, delay: animDelay + 0.2, ease: "backOut" }}
          className="mb-5 relative z-10 w-12 h-12 rounded-xl bg-ignite-orange/10 flex items-center justify-center text-ignite-orange"
        >
          <MetricIcon type={metric.icon} />
        </motion.div>

        {/* Number */}
        <div className="mb-2 relative z-10">
          <AnimatedCounter
            value={metric.value}
            suffix={metric.suffix}
            isInView={isInView}
          />
        </div>

        {/* Label */}
        <p className="font-heading text-foreground font-medium text-base md:text-lg tracking-tight relative z-10">
          {metric.label}
        </p>

        {/* Description — reveals on hover */}
        <motion.div
          initial={false}
          animate={{
            height: isHovered ? "auto" : 0,
            opacity: isHovered ? 1 : 0,
            marginTop: isHovered ? 12 : 0,
          }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className="overflow-hidden relative z-10"
        >
          <p className="text-grey-400 text-sm leading-relaxed text-center">
            {metric.description}
          </p>
        </motion.div>
      </motion.div>
    </motion.div>
  )
}

export default function MetricsDashboard() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })
  const [mousePos, setMousePos] = useState({ x: 50, y: 50 })

  const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    setMousePos({
      x: ((e.clientX - rect.left) / rect.width) * 100,
      y: ((e.clientY - rect.top) / rect.height) * 100,
    })
  }

  return (
    <section
      ref={ref}
      onMouseMove={handleMouseMove}
      className="py-16 md:py-20 bg-foreground relative overflow-hidden"
    >
      {/* Subtle grid background */}
      <div
        className="absolute inset-0 pointer-events-none z-0"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }}
      />

      {/* Mouse-following glow */}
      <div
        className="absolute w-[600px] h-[600px] rounded-full pointer-events-none blur-[150px] transition-all duration-1000 ease-out opacity-[0.07]"
        style={{
          background: "var(--color-ignite-orange)",
          left: `${mousePos.x}%`,
          top: `${mousePos.y}%`,
          transform: "translate(-50%, -50%)",
        }}
      />

      {/* Subtle static glow at top center */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-ignite-orange/[0.03] rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="text-center mb-8 md:mb-12"
        >
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="w-2 h-2 rounded-full bg-ignite-orange" />
            <span className="font-heading text-ignite-orange font-medium tracking-wider text-sm uppercase">
              Our Impact
            </span>
          </div>
          <h2 className="font-heading text-3xl md:text-4xl lg:text-5xl font-semibold text-white tracking-tight leading-tight">
            Results That Speak
          </h2>
          <p className="mt-4 text-lg text-grey-400 max-w-2xl mx-auto">
            Real metrics from real automations powering growth worldwide
          </p>
        </motion.div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {metrics.map((metric, index) => (
            <MetricCard
              key={metric.label}
              metric={metric}
              index={index}
              isInView={isInView}
            />
          ))}
        </div>
      </div>
    </section>
  )
}

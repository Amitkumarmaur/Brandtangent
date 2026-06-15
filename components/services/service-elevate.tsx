"use client"

import { useRef, useEffect, useState, useCallback } from "react"
import { motion, useInView, useMotionValue, useSpring, useTransform } from "motion/react"

interface StatItem {
  value: number
  suffix: string
  label: string
}

const defaultStats: StatItem[] = [
  { value: 265, suffix: "+", label: "Happy Clients" },
  { value: 325, suffix: "+", label: "Projects Completed" },
  { value: 20, suffix: "+", label: "Years of Experience" },
]

function AnimatedCounter({ target, suffix, inView }: { target: number; suffix: string; inView: boolean }) {
  const [count, setCount] = useState(0)

  useEffect(() => {
    if (!inView) return
    let start = 0
    const duration = 2000
    const increment = target / (duration / 16)
    const timer = setInterval(() => {
      start += increment
      if (start >= target) {
        setCount(target)
        clearInterval(timer)
      } else {
        setCount(Math.floor(start))
      }
    }, 16)
    return () => clearInterval(timer)
  }, [inView, target])

  return (
    <span className="tabular-nums">
      {count}{suffix}
    </span>
  )
}

function StatCard({ stat, index, inView }: { stat: StatItem; index: number; inView: boolean }) {
  const cardRef = useRef<HTMLDivElement>(null)
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)

  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [6, -6]), { stiffness: 200, damping: 20 })
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-6, 6]), { stiffness: 200, damping: 20 })

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    mouseX.set((e.clientX - rect.left) / rect.width - 0.5)
    mouseY.set((e.clientY - rect.top) / rect.height - 0.5)
  }, [mouseX, mouseY])

  const handleMouseLeave = useCallback(() => {
    mouseX.set(0)
    mouseY.set(0)
  }, [mouseX, mouseY])

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 60 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay: 0.3 + index * 0.2, ease: "easeOut" }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ rotateX, rotateY, transformStyle: "preserve-3d", perspective: 800 }}
      className="cursor-default"
    >
      <div className="relative rounded-md p-6 md:p-8 border border-border bg-white overflow-hidden">
        <div className="display-xl text-foreground mb-2" style={{ transform: "translateZ(20px)" }}>
          <AnimatedCounter target={stat.value} suffix={stat.suffix} inView={inView} />
        </div>
        <div className="text-muted-foreground text-sm md:text-base" style={{ transform: "translateZ(10px)" }}>
          {stat.label}
        </div>
      </div>
    </motion.div>
  )
}

interface ServiceElevateProps {
  title?: string
  description?: string[]
  stats?: StatItem[]
}

export default function ServiceElevate({
  title = "Elevate Your Digital Presence with a Premier Brand Agency",
  description = [
    "From brand strategists to creative directors, our talent is the heartbeat of our success. We thrive on executing complex brand projects while embracing out-of-the-box business models.",
    "Our team boasts expertise across brand strategy, identity design, content, and digital experiences. From real estate, healthcare, restaurants, and delivery services, to SaaS, entertainment, education, and fashion.",
  ],
  stats = defaultStats,
}: ServiceElevateProps) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  return (
    <section ref={ref} className="relative w-full overflow-hidden bg-white py-16 md:py-20 border-t border-border">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="max-w-3xl mb-16 md:mb-20"
        >
          <h2 className="display-xl text-foreground mb-8">
            {title}
          </h2>

          <div className="space-y-4 max-w-2xl">
            {description.map((para, i) => (
              <p key={i} className="text-muted-foreground text-sm md:text-base leading-relaxed">
                {para}
              </p>
            ))}
          </div>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 md:gap-8" style={{ perspective: 1000 }}>
          {stats.map((stat, index) => (
            <StatCard key={stat.label} stat={stat} index={index} inView={isInView} />
          ))}
        </div>
      </div>
    </section>
  )
}

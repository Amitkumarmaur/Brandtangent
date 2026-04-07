"use client"

import { useRef, useEffect, useState, useCallback } from "react"
import { motion, useInView, useMotionValue, useSpring, useTransform } from "framer-motion"
import Image from "next/image"

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

function Stat3DCard({ stat, index, inView }: { stat: StatItem; index: number; inView: boolean }) {
  const cardRef = useRef<HTMLDivElement>(null)
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)

  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [12, -12]), { stiffness: 200, damping: 20 })
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-12, 12]), { stiffness: 200, damping: 20 })

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const x = (e.clientX - rect.left) / rect.width - 0.5
    const y = (e.clientY - rect.top) / rect.height - 0.5
    mouseX.set(x)
    mouseY.set(y)
  }, [mouseX, mouseY])

  const handleMouseLeave = useCallback(() => {
    mouseX.set(0)
    mouseY.set(0)
  }, [mouseX, mouseY])

  const colors = ["#FF5722", "#FF8A65", "#FF5722"]

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 60, rotateX: -15 }}
      animate={inView ? { opacity: 1, y: 0, rotateX: 0 } : {}}
      transition={{ duration: 0.7, delay: 0.3 + index * 0.2, ease: "easeOut" }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ rotateX, rotateY, transformStyle: "preserve-3d", perspective: 800 }}
      className="group cursor-default"
    >
      <div
        className="relative rounded-3xl p-6 md:p-8 border border-white/[0.08] overflow-hidden"
        style={{
          background: "linear-gradient(135deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.01) 100%)",
          backdropFilter: "blur(20px)",
        }}
      >
        {/* Ambient glow */}
        <div
          className="absolute -top-10 -right-10 w-32 h-32 rounded-full blur-[60px] opacity-30 group-hover:opacity-60 transition-opacity duration-700"
          style={{ background: colors[index] || "#FF5722" }}
        />
        <div
          className="absolute bottom-0 left-0 right-0 h-[1px] opacity-40"
          style={{ background: `linear-gradient(90deg, transparent, ${colors[index] || "#FF5722"}, transparent)` }}
        />

        {/* Counter */}
        <div
          className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tighter mb-3"
          style={{ transform: "translateZ(30px)", color: colors[index] || "#FF5722" }}
        >
          <AnimatedCounter target={stat.value} suffix={stat.suffix} inView={inView} />
        </div>

        {/* Label */}
        <div
          className="text-white/50 text-sm md:text-base font-medium tracking-wide"
          style={{ transform: "translateZ(20px)" }}
        >
          {stat.label}
        </div>

        {/* Decorative ring */}
        <div
          className="absolute -bottom-6 -right-6 w-20 h-20 rounded-full border border-white/[0.04] opacity-0 group-hover:opacity-100 transition-opacity duration-500"
          style={{ transform: "translateZ(10px)" }}
        />
      </div>
    </motion.div>
  )
}

// Floating particle
function FloatingOrb({ delay, size, x, y, color }: { delay: number; size: number; x: string; y: string; color: string }) {
  return (
    <motion.div
      className="absolute rounded-full pointer-events-none"
      style={{ width: size, height: size, left: x, top: y, background: color, filter: `blur(${size / 2}px)` }}
      animate={{
        y: [0, -20, 0, 15, 0],
        x: [0, 10, -5, 8, 0],
        opacity: [0.2, 0.5, 0.3, 0.5, 0.2],
      }}
      transition={{
        duration: 8 + delay,
        repeat: Infinity,
        ease: "easeInOut",
        delay,
      }}
    />
  )
}

interface ServiceElevateProps {
  title?: string
  description?: string[]
  stats?: StatItem[]
}

export default function ServiceElevate({
  title = "Elevate Your Digital Presence with Premier Web Development Agency",
  description = [
    "From front-end developers to back-end engineers, our talent is the heartbeat of our success. We thrive on executing complex web projects while embracing out-of-the-box business models.",
    "Our web team boasts expertise in a range of languages and frameworks, including PHP, Java, Python, JavaScript, C#, C++, Ruby, Codeigniter, and Laravel. From real estate, healthcare, restaurants, and delivery services, to auto repair, SaaS, entertainment, education, and fashion.",
  ],
  stats = defaultStats,
}: ServiceElevateProps) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  return (
    <section ref={ref} className="relative w-full overflow-hidden">
      {/* Background Image */}
      <Image
        src="/images/cosmic-bg.png"
        alt="Cosmic background"
        fill
        className="object-cover object-center"
        quality={90}
        priority={false}
      />

      {/* Overlays */}
      <div className="absolute inset-0 bg-foreground/85 z-[1]" />
      <div className="absolute inset-0 bg-gradient-to-b from-foreground via-transparent to-foreground z-[1]" />

      {/* Floating orbs */}
      <div className="absolute inset-0 z-[2]">
        <FloatingOrb delay={0} size={60} x="10%" y="20%" color="rgba(255,87,34,0.15)" />
        <FloatingOrb delay={2} size={40} x="70%" y="60%" color="rgba(255,138,101,0.1)" />
        <FloatingOrb delay={4} size={80} x="80%" y="15%" color="rgba(255,87,34,0.08)" />
        <FloatingOrb delay={1} size={30} x="40%" y="80%" color="rgba(255,87,34,0.12)" />
        <FloatingOrb delay={3} size={50} x="25%" y="65%" color="rgba(255,138,101,0.08)" />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 py-16 md:py-20">
        {/* Top — Text */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="max-w-3xl mb-16 md:mb-20"
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white leading-tight tracking-tight mb-8">
            {title.split("Premier").map((part, i) =>
              i === 0 ? (
                <span key={i}>{part}<span className="text-ignite-orange">Premier</span></span>
              ) : (
                <span key={i}>{part}</span>
              )
            )}
          </h2>

          <div className="space-y-4 max-w-2xl">
            {description.map((para, i) => (
              <p key={i} className="text-white/40 text-sm md:text-base leading-relaxed">
                {para}
              </p>
            ))}
          </div>
        </motion.div>

        {/* Bottom — 3D Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 md:gap-8" style={{ perspective: 1000 }}>
          {stats.map((stat, index) => (
            <Stat3DCard key={stat.label} stat={stat} index={index} inView={isInView} />
          ))}
        </div>
      </div>
    </section>
  )
}

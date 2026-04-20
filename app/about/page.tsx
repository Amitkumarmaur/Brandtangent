"use client"

import { useRef, useEffect, useState, useCallback } from "react"
import {
  motion,
  useInView,
  useScroll,
  useTransform,
  useMotionValue,
  useSpring,
  AnimatePresence,
} from "framer-motion"
import Link from "next/link"
import Header from "@/components/header"
import Footer from "@/components/footer"
import {
  ArrowRight,
  Zap,
  Target,
  Users,
  TrendingUp,
  Globe,
  Shield,
  Lightbulb,
  Heart,
  Award,
  CheckCircle,
  Rocket,
  Linkedin,
  Twitter,
} from "lucide-react"

// ─────────────────────────────────────────────────────────────────────────────
// 3D Tilt Card  (mouse-tracking perspective)
// ─────────────────────────────────────────────────────────────────────────────
function TiltCard({
  children,
  className = "",
}: {
  children: React.ReactNode
  className?: string
}) {
  const ref = useRef<HTMLDivElement>(null)
  const x = useMotionValue(0)
  const y = useMotionValue(0)

  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [12, -12]), {
    stiffness: 200,
    damping: 20,
  })
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-12, 12]), {
    stiffness: 200,
    damping: 20,
  })
  const glowX = useTransform(x, [-0.5, 0.5], ["0%", "100%"])
  const glowY = useTransform(y, [-0.5, 0.5], ["0%", "100%"])

  const handleMouse = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!ref.current) return
      const rect = ref.current.getBoundingClientRect()
      x.set((e.clientX - rect.left) / rect.width - 0.5)
      y.set((e.clientY - rect.top) / rect.height - 0.5)
    },
    [x, y]
  )

  const handleLeave = useCallback(() => {
    x.set(0)
    y.set(0)
  }, [x, y])

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouse}
      onMouseLeave={handleLeave}
      style={{ rotateX, rotateY, transformStyle: "preserve-3d", perspective: 800 }}
      className={`relative cursor-pointer ${className}`}
    >
      {/* glare overlay */}
      <motion.div
        className="absolute inset-0 rounded-2xl pointer-events-none z-10"
        style={{
          background: useTransform(
            [glowX, glowY],
            ([gx, gy]) =>
              `radial-gradient(circle at ${gx} ${gy}, rgba(255,255,255,0.08) 0%, transparent 60%)`
          ),
        }}
      />
      {children}
    </motion.div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// Floating Orb
// ─────────────────────────────────────────────────────────────────────────────
function FloatingOrb({
  size,
  color,
  x,
  y,
  delay = 0,
  duration = 6,
}: {
  size: number
  color: string
  x: string
  y: string
  delay?: number
  duration?: number
}) {
  return (
    <motion.div
      className="absolute rounded-full pointer-events-none"
      style={{
        width: size,
        height: size,
        left: x,
        top: y,
        background: color,
        filter: `blur(${size / 2.5}px)`,
      }}
      animate={{
        y: [0, -30, 0, 20, 0],
        x: [0, 15, -10, 5, 0],
        scale: [1, 1.1, 0.95, 1.05, 1],
        opacity: [0.4, 0.6, 0.5, 0.65, 0.4],
      }}
      transition={{
        duration,
        delay,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    />
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// Animated Counter
// ─────────────────────────────────────────────────────────────────────────────
function AnimatedNumber({ value, suffix, className = "" }: { value: number; suffix: string, className?: string }) {
  const [displayValue, setDisplayValue] = useState(0)
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-50px" })

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
    <span ref={ref} className={`font-mono text-5xl md:text-6xl tracking-tight text-ignite-orange ${className}`}>
      {displayValue.toLocaleString()}
      {suffix}
    </span>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// Magnetic Button
// ─────────────────────────────────────────────────────────────────────────────
function MagneticButton({
  children,
  className,
  href,
}: {
  children: React.ReactNode
  className?: string
  href?: string
}) {
  const ref = useRef<HTMLDivElement>(null)
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const springX = useSpring(x, { stiffness: 150, damping: 15 })
  const springY = useSpring(y, { stiffness: 150, damping: 15 })

  const handleMouse = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return
    const rect = ref.current.getBoundingClientRect()
    const cx = rect.left + rect.width / 2
    const cy = rect.top + rect.height / 2
    x.set((e.clientX - cx) * 0.35)
    y.set((e.clientY - cy) * 0.35)
  }

  const handleLeave = () => {
    x.set(0)
    y.set(0)
  }

  const Tag = href ? "a" : "button"

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouse}
      onMouseLeave={handleLeave}
      style={{ x: springX, y: springY }}
    >
      <Tag href={href} className={className}>
        {children}
      </Tag>
    </motion.div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// Staggered word animation
// ─────────────────────────────────────────────────────────────────────────────
function AnimatedWords({ text, className }: { text: string; className?: string }) {
  const words = text.split(" ")
  return (
    <span className={className}>
      {words.map((word, i) => (
        <motion.span
          key={i}
          initial={{ opacity: 0, y: 40, rotateX: -90 }}
          animate={{ opacity: 1, y: 0, rotateX: 0 }}
          transition={{ duration: 0.6, delay: 0.1 + i * 0.07, ease: [0.22, 1, 0.36, 1] }}
          className="inline-block mr-[0.25em]"
          style={{ transformOrigin: "bottom" }}
        >
          {word}
        </motion.span>
      ))}
    </span>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// Shared Section Eyebrow
// ─────────────────────────────────────────────────────────────────────────────
function Eyebrow({ children, isDark = false }: { children: React.ReactNode, isDark?: boolean }) {
  return (
    <div className="flex items-center gap-2 mb-4">
      <div className="w-2 h-2 rounded-full bg-ignite-orange" />
      <span className={`font-heading font-medium tracking-wider text-sm uppercase ${isDark ? 'text-white' : 'text-ignite-orange'}`}>
        {children}
      </span>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// Data
// ─────────────────────────────────────────────────────────────────────────────
const stats = [
  { value: 12, suffix: "+", label: "Years of Excellence" },
  { value: 500, suffix: "+", label: "Brands Transformed" },
  { value: 98, suffix: "%", label: "Client Retention" },
  { value: 45, suffix: "K+", label: "Leads Delivered" },
]

const values = [
  {
    icon: Lightbulb,
    title: "Innovation First",
    description:
      "We don't follow trends — we engineer them. Every solution is built with forward-thinking strategy and cutting-edge AI.",
    color: "#FF5722",
    bg: "#FF57221A",
  },
  {
    icon: Target,
    title: "Results-Driven",
    description:
      "Vanity metrics don't pay bills. We obsess over pipeline, revenue, and compounding growth that moves the needle.",
    color: "#10b981",
    bg: "#10b9811A",
  },
  {
    icon: Shield,
    title: "Radical Transparency",
    description:
      "No smoke, no mirrors. You always know what we're building, why we're building it, and how it performs.",
    color: "#6366f1",
    bg: "#6366f11A",
  },
  {
    icon: Heart,
    title: "Client Partnership",
    description:
      "We treat your business like our own. We're not vendors — we're growth partners embedded in your success.",
    color: "#f59e0b",
    bg: "#f59e0b1A",
  },
  {
    icon: Globe,
    title: "Global Perspective",
    description:
      "From Silicon Valley to Saudi Arabia, campaigns are tuned to win across cultures, markets, and time zones.",
    color: "#3b82f6",
    bg: "#3b82f61A",
  },
  {
    icon: Rocket,
    title: "Speed & Scale",
    description:
      "Intelligent systems that launch fast and scale without friction. Compress years of growth into months.",
    color: "#8b5cf6",
    bg: "#8b5cf61A",
  },
]

const team = [
  {
    name: "Amit Maur",
    role: "Founder & CEO",
    bio: "12+ years building AI-first growth systems for B2B brands globally. Thinks in funnels, speaks in revenue.",
    letter: "A",
    gradient: "from-[#FF5722] via-[#FF8A50] to-[#FF5722]",
    accent: "#FF5722",
  },
  {
    name: "Sarah Chen",
    role: "Head of Automation",
    bio: "Former ML engineer turned marketing architect. Pipelines that generated $40M+ in qualified revenue.",
    letter: "S",
    gradient: "from-[#10b981] via-[#34d399] to-[#10b981]",
    accent: "#10b981",
  },
  {
    name: "Raj Sharma",
    role: "Chief Technology Officer",
    bio: "Full-stack architect specializing in agentic AI and custom CRM integrations. 9 years scaling SaaS.",
    letter: "R",
    gradient: "from-[#6366f1] via-[#818cf8] to-[#6366f1]",
    accent: "#6366f1",
  },
]

const milestones = [
  { year: "2012", title: "Founded in Bangalore", description: "Started as a 3-person design studio merging creativity with technology." },
  { year: "2015", title: "First 100 Clients", description: "Crossed 100 clients and expanded to North American markets." },
  { year: "2018", title: "AI Integration Begins", description: "Pioneered AI-driven content pipelines — 2 years before the market caught on." },
  { year: "2020", title: "Full Automation Stack", description: "Launched our proprietary automation OS — n8n, Make, and AI in one growth engine." },
  { year: "2023", title: "500+ Brands Served", description: "500+ brand transformations across 18 countries and 6 industries." },
  { year: "2024", title: "Agentic AI Era", description: "First agency deploying autonomous AI sales agents for B2B lead qualification at scale." },
]

// ─────────────────────────────────────────────────────────────────────────────
// PAGE
// ─────────────────────────────────────────────────────────────────────────────
export default function AboutPage() {
  const heroRef = useRef(null)
  const { scrollYProgress: heroScroll } = useScroll({ target: heroRef, offset: ["start start", "end start"] })
  const heroY = useTransform(heroScroll, [0, 1], ["0%", "25%"])
  const heroOpacity = useTransform(heroScroll, [0, 0.8], [1, 0])

  return (
    <main className="relative overflow-hidden bg-background">
      <Header />

      {/* ── HERO ──────────────────────────────────────────────────────────── */}
      {/* Custom bg-white/custom hero padding pt-24 */}
      <section
        ref={heroRef}
        data-theme="dark"
        className="relative min-h-screen flex items-center justify-center overflow-hidden bg-foreground pt-24 border-t border-white/10"
      >
        {/* Animated grid */}
        <div
          className="absolute inset-0 opacity-[0.07] grid-pattern pointer-events-none"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />

        {/* Orbs */}
        <FloatingOrb size={500} color="rgba(255,87,34,0.18)" x="60%" y="10%" delay={0} duration={8} />
        <FloatingOrb size={350} color="rgba(99,102,241,0.15)" x="5%" y="50%" delay={2} duration={10} />
        <FloatingOrb size={250} color="rgba(16,185,129,0.12)" x="75%" y="60%" delay={1} duration={7} />
        <FloatingOrb size={180} color="rgba(255,87,34,0.12)" x="20%" y="20%" delay={3} duration={9} />

        <motion.div
          style={{ y: heroY, opacity: heroOpacity }}
          className="w-full max-w-7xl mx-auto px-6 lg:px-8 relative z-10 text-center"
        >
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 bg-white/5 border border-white/10 backdrop-blur-sm rounded-full px-5 py-2 mb-10"
          >
            <motion.div
              animate={{ scale: [1, 1.4, 1] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
              className="w-2 h-2 rounded-full bg-ignite-orange"
            />
            <span className="font-heading text-white/70 text-sm font-medium tracking-widest uppercase">
              Our Story
            </span>
          </motion.div>

          {/* Headline - Using EXACT Style Guide h1 */}
          <h1 className="font-heading text-3xl sm:text-4xl lg:text-[3.2rem] xl:text-[3.5rem] leading-[1.0] font-bold tracking-[-0.03em] uppercase text-white mb-8 perspective-[1000px]">
            <div className="overflow-hidden pb-2">
              <AnimatedWords text="We Don't Run Ads." className="block" />
            </div>
            <div className="overflow-hidden pb-2">
              <AnimatedWords
                text="We Build Machines."
                className="block text-transparent bg-clip-text bg-gradient-to-r from-ignite-orange via-[#FF8A50] to-[#FF5722]"
              />
            </div>
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="font-sans text-lg md:text-xl text-white/60 max-w-2xl mx-auto leading-relaxed mb-12"
          >
            DigiiMark is an AI-first marketing automation agency. We engineer intelligent growth
            systems that find buyers, nurture them at scale, and convert — without extra headcount.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.75 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <MagneticButton
              href="#our-story"
              className="group inline-flex items-center gap-3 bg-ignite-orange hover:bg-ignite-orange/90 text-white font-sans px-6 py-3 rounded-full font-medium transition-colors shadow-[0_8px_40px_rgba(255,87,34,0.4)]"
            >
              Read Our Story
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </MagneticButton>
            <MagneticButton
              href="#team"
              className="inline-flex items-center gap-2 border border-white/20 text-white font-medium font-sans px-6 py-3 rounded-full hover:bg-white/10 transition-colors"
            >
              <Users className="w-4 h-4" />
              Meet the Team
            </MagneticButton>
          </motion.div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        >
          <span className="font-heading text-white/25 text-[10px] tracking-[0.3em] uppercase">Scroll</span>
          <motion.div
            animate={{ scaleY: [0, 1, 0], opacity: [0, 1, 0] }}
            transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
            className="w-[1px] h-10 bg-gradient-to-b from-ignite-orange to-transparent origin-top"
          />
        </motion.div>
      </section>

      {/* ── STATS ─────────────────────────────────────────────────────────── */}
      <section data-theme="light" className="relative w-full py-16 md:py-20 bg-grey-100 overflow-hidden border-t border-grey-200">
        <div className="w-full max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            {stats.map((stat, i) => (
              <TiltCard key={stat.label}>
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  className="text-center bg-background rounded-2xl p-6 lg:p-8 shadow-[0_4px_24px_rgba(0,0,0,0.06)] border border-grey-200"
                >
                  <AnimatedNumber value={stat.value} suffix={stat.suffix} />
                  <p className="mt-2 font-sans text-grey-400 font-medium text-sm">{stat.label}</p>
                </motion.div>
              </TiltCard>
            ))}
          </div>
        </div>
      </section>

      {/* ── OUR STORY ─────────────────────────────────────────────────────── */}
      <section id="our-story" data-theme="light" className="relative w-full py-16 md:py-20 bg-background overflow-hidden border-t border-grey-200">
        <div className="w-full max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
            {/* Left: text */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8 }}
            >
              <Eyebrow>The Origin</Eyebrow>
              <h2 className="font-heading text-3xl md:text-4xl lg:text-5xl font-semibold text-foreground tracking-tight leading-tight mb-8">
                Built By Marketers Who Were Tired of Broken Promises.
              </h2>
              <div className="space-y-5 font-sans text-grey-400 text-base md:text-lg leading-relaxed">
                <p>We started DigiiMark in 2012 with one belief: <strong className="text-foreground">marketing should create measurable, compounding business value</strong> — not just impressions and vanity metrics.</p>
                <p>For the first 6 years we ran campaigns for 100+ brands. We obsessed over conversion rates, A/B tests, and attribution. We were good. But we kept hitting a ceiling — manual work, slow feedback loops, inconsistent output.</p>
                <p>In 2018, we made a bet on AI. We rebuilt every workflow around automation pipelines, data-driven personalization, and eventually — agentic AI that could think and sell on behalf of our clients.</p>
                <p>Today, we're the agency for B2B founders who want a growth engine, not a monthly retainer that eats budget and underdelivers.</p>
              </div>
            </motion.div>

            {/* Right: 3D rotating cards */}
            <div className="grid grid-cols-2 gap-4">
              {[
                { label: "AI-Driven Campaigns", value: "100%", bg: "bg-ignite-orange text-white" },
                { label: "Avg. Pipeline Growth", value: "3.2×", bg: "bg-foreground text-white" },
                { label: "Countries Served", value: "18+", bg: "bg-grey-100 text-foreground" },
                { label: "Team Members", value: "40+", bg: "bg-peach text-foreground" },
              ].map((card, i) => (
                <TiltCard key={card.label}>
                  <motion.div
                    initial={{ opacity: 0, scale: 0.85, rotateY: -15 }}
                    whileInView={{ opacity: 1, scale: 1, rotateY: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.7, delay: i * 0.12, ease: [0.22, 1, 0.36, 1] }}
                    className={`${card.bg} rounded-2xl p-6 lg:p-8 flex flex-col justify-between aspect-square`}
                  >
                    <span className="font-mono text-4xl font-black">{card.value}</span>
                    <span className="font-sans text-sm font-medium opacity-70">{card.label}</span>
                  </motion.div>
                </TiltCard>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── TIMELINE ──────────────────────────────────────────────────────── */}
      <section data-theme="dark" className="relative w-full py-16 md:py-20 bg-dark-surface overflow-hidden border-t border-white/10">
        <div className="absolute inset-0 opacity-[0.05]"
          style={{ backgroundImage: "linear-gradient(rgba(255,255,255,0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.4) 1px, transparent 1px)", backgroundSize: "32px 32px" }}
        />
        <FloatingOrb size={400} color="rgba(255,87,34,0.12)" x="80%" y="20%" delay={0} duration={9} />
        <FloatingOrb size={300} color="rgba(99,102,241,0.1)" x="-5%" y="60%" delay={2} duration={11} />

        <div className="w-full max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-100px" }} className="mb-8 md:mb-12">
            <Eyebrow isDark>Milestones</Eyebrow>
            <h2 className="font-heading text-3xl md:text-4xl lg:text-5xl font-semibold text-white tracking-tight leading-tight">
              12 Years in the Making
            </h2>
            <p className="mt-4 font-sans text-lg text-white/60 max-w-2xl">
              From a small design studio to a global automation powerhouse.
            </p>
          </motion.div>

          {/* Timeline items */}
          <div className="space-y-0">
            {milestones.map((m, i) => (
              <motion.div
                key={m.year}
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.6, delay: 0.05, ease: [0.22, 1, 0.36, 1] }}
                className={`flex flex-col md:flex-row md:items-center gap-6 md:gap-16 py-8 border-b border-white/10 group`}
              >
                {/* Year */}
                <motion.span
                  whileHover={{ x: 4 }}
                  className="font-mono text-ignite-orange font-bold text-3xl md:text-4xl tabular-nums shrink-0 md:w-[110px]"
                >
                  {m.year}
                </motion.span>

                {/* Content */}
                <div className="flex-1">
                  <h3 className="font-heading text-xl md:text-2xl font-semibold text-white group-hover:text-ignite-orange transition-colors duration-300">
                    {m.title}
                  </h3>
                  <p className="font-sans text-white/60 text-base leading-relaxed mt-2 max-w-2xl">{m.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── VALUES ────────────────────────────────────────────────────────── */}
      <section data-theme="light" className="relative w-full py-16 md:py-20 bg-background overflow-hidden border-t border-grey-200">
        <div className="w-full max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-100px" }} className="mb-8 md:mb-12">
            <Eyebrow>What We Stand For</Eyebrow>
            <h2 className="font-heading text-3xl md:text-4xl lg:text-5xl font-semibold text-foreground tracking-tight leading-tight max-w-3xl">
              Principles That Drive Every Decision
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {values.map((v, i) => (
              <TiltCard key={v.title} className="h-full">
                <motion.div
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.5, delay: i * 0.08 }}
                  className="group bg-background rounded-2xl p-6 lg:p-8 border border-grey-200 h-full flex flex-col transition-shadow duration-500 hover:shadow-[0_24px_64px_rgba(0,0,0,0.06)] hover:border-grey-300"
                >
                  {/* Icon with 3D spin on hover */}
                  <motion.div
                    whileHover={{ rotateY: 360 }}
                    transition={{ duration: 0.7 }}
                    className="w-12 h-12 rounded-2xl flex items-center justify-center mb-6 shrink-0"
                    style={{ backgroundColor: v.bg }}
                  >
                    <v.icon className="w-6 h-6" style={{ color: v.color }} />
                  </motion.div>
                  <h3 className="font-heading text-xl md:text-2xl font-semibold text-foreground tracking-tight mb-3">{v.title}</h3>
                  <p className="font-sans text-grey-400 text-base leading-relaxed">{v.description}</p>
                  {/* Animated bottom border */}
                  <motion.div
                    className="mt-6 h-[2px] rounded-full"
                    style={{ background: v.color }}
                    initial={{ scaleX: 0, originX: 0 }}
                    whileInView={{ scaleX: 1 }}
                    viewport={{ once: true, margin: "-50px" }}
                    transition={{ duration: 0.6, delay: 0.2 + i * 0.08 }}
                  />
                </motion.div>
              </TiltCard>
            ))}
          </div>
        </div>
      </section>

      {/* ── TEAM (3D FLIP CARDS) ──────────────────────────────────────────── */}
      <section id="team" data-theme="light" className="relative w-full py-16 md:py-20 bg-grey-100 overflow-hidden border-t border-grey-200">
        <div className="w-full max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-100px" }} className="mb-8 md:mb-12">
            <Eyebrow>The People</Eyebrow>
            <h2 className="font-heading text-3xl md:text-4xl lg:text-5xl font-semibold text-foreground tracking-tight leading-tight">
              Leadership Team
            </h2>
            <p className="mt-4 font-sans text-lg text-grey-400 max-w-2xl">
              Hover the cards to flip them. Operators, builders, and strategists who've been in the trenches.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {team.map((member, i) => (
              <motion.div
                key={member.name}
                initial={{ opacity: 0, y: 50, rotateY: -15 }}
                whileInView={{ opacity: 1, y: 0, rotateY: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.7, delay: i * 0.15, ease: [0.22, 1, 0.36, 1] }}
                className="group"
                style={{ perspective: "1000px", height: "420px" }}
              >
                {/* Flip container */}
                <div
                  className="relative w-full h-full transition-transform duration-700 ease-in-out"
                  style={{
                    transformStyle: "preserve-3d",
                    transform: "rotateY(0deg)",
                  }}
                >
                  <style>{`
                    .flip-card:hover .flip-inner {
                      transform: rotateY(180deg);
                    }
                  `}</style>

                  <div className="flip-card w-full h-full" style={{ perspective: "1000px" }}>
                    <div
                      className="flip-inner relative w-full h-full transition-transform duration-700 ease-in-out"
                      style={{ transformStyle: "preserve-3d" }}
                    >
                      {/* FRONT */}
                      <div
                        className="absolute inset-0 rounded-2xl overflow-hidden border border-grey-200"
                        style={{ backfaceVisibility: "hidden" }}
                      >
                        {/* Gradient top */}
                        <div className={`bg-gradient-to-br ${member.gradient} h-[60%] flex items-end justify-center pb-0 relative`}>
                          <div className="absolute inset-0 bg-black/10" />
                          {/* 3D floating letter avatar */}
                          <motion.div
                            animate={{ y: [0, -8, 0] }}
                            transition={{ repeat: Infinity, duration: 3, ease: "easeInOut", delay: i * 0.5 }}
                            className="w-24 h-24 rounded-full bg-white/20 backdrop-blur-sm border-4 border-white/40 flex items-center justify-center font-heading text-4xl font-bold text-white translate-y-12 z-10 relative shadow-lg"
                          >
                            {member.letter}
                          </motion.div>
                        </div>
                        {/* Bottom info */}
                        <div className="bg-background h-[40%] pt-14 px-8 text-center flex flex-col justify-center">
                          <h3 className="font-heading text-xl font-semibold text-foreground">{member.name}</h3>
                          <span className="font-sans text-sm font-medium mt-1" style={{ color: member.accent }}>{member.role}</span>
                          <p className="mt-auto pb-4 font-sans text-grey-400 text-xs">Hover to learn more →</p>
                        </div>
                      </div>

                      {/* BACK */}
                      <div
                        className="absolute inset-0 rounded-2xl flex flex-col items-center justify-center p-8 text-center"
                        style={{
                          backfaceVisibility: "hidden",
                          transform: "rotateY(180deg)",
                          background: `linear-gradient(135deg, ${member.accent}22 0%, ${member.accent}08 100%)`,
                          border: `1px solid ${member.accent}33`,
                        }}
                      >
                        <div
                          className="w-16 h-16 rounded-full flex items-center justify-center font-heading text-2xl font-bold text-white mb-6 shadow-md"
                          style={{ background: `linear-gradient(135deg, ${member.accent}, ${member.accent}99)` }}
                        >
                          {member.letter}
                        </div>
                        <h3 className="font-heading text-xl font-semibold text-foreground mb-1">{member.name}</h3>
                        <span className="font-sans text-sm font-medium mb-4" style={{ color: member.accent }}>{member.role}</span>
                        <p className="font-sans text-grey-600 text-sm leading-relaxed">{member.bio}</p>
                        <div className="flex gap-3 mt-6">
                          <a href="#" className="w-10 h-10 rounded-full bg-white border border-grey-200 flex items-center justify-center hover:border-grey-300 transition-colors">
                            <Linkedin className="w-4 h-4 text-grey-600" />
                          </a>
                          <a href="#" className="w-10 h-10 rounded-full bg-white border border-grey-200 flex items-center justify-center hover:border-grey-300 transition-colors">
                            <Twitter className="w-4 h-4 text-grey-600" />
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── AWARDS ────────────────────────────────────────────────────────── */}
      <section data-theme="light" className="relative w-full py-10 lg:py-12 bg-background border-y border-grey-200 overflow-hidden">
        <div className="w-full max-w-7xl mx-auto px-6 lg:px-8 relative z-10 flex flex-wrap items-center gap-6 justify-center">
          {[
            { icon: Award, text: "Top Team on Dribbble" },
            { icon: CheckCircle, text: "Top 100 — Clutch" },
            { icon: TrendingUp, text: "5-Star GoodFirms" },
            { icon: Zap, text: "100% Upwork Success" },
          ].map((badge, i) => (
            <TiltCard key={badge.text}>
              <motion.div
                initial={{ opacity: 0, y: 20, scale: 0.9 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ delay: i * 0.1 }}
                className="flex items-center gap-3 bg-background rounded-2xl px-6 py-4 border border-grey-200 shadow-sm"
              >
                <div className="w-10 h-10 bg-peach text-ignite-orange rounded-full flex items-center justify-center shrink-0">
                  <badge.icon className="w-5 h-5 text-ignite-orange" />
                </div>
                <span className="font-sans text-foreground text-sm font-medium">{badge.text}</span>
              </motion.div>
            </TiltCard>
          ))}
        </div>
      </section>

      {/* ── CTA ───────────────────────────────────────────────────────────── */}
      <section
        data-theme="light"
        className="relative w-full py-16 md:py-20 bg-grey-100 overflow-hidden border-t-2 border-grey-400"
      >
        {/* Soft light lift toward center (reads clearly as a “light” band before the footer) */}
        <div
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_90%_70%_at_50%_0%,rgb(255_255_255)_0%,transparent_58%)] opacity-70"
          aria-hidden
        />
        {/* Light grid: fine neutral lines on grey-100 */}
        <div
          className="absolute inset-0 opacity-[0.35]"
          style={{
            backgroundImage:
              "linear-gradient(to right, rgb(10 10 10 / 0.06) 1px, transparent 1px), linear-gradient(to bottom, rgb(10 10 10 / 0.06) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />

        <FloatingOrb size={520} color="rgba(255,87,34,0.06)" x="55%" y="15%" delay={0} duration={9} />
        <FloatingOrb size={320} color="rgba(255,255,255,0.35)" x="10%" y="55%" delay={2} duration={11} />

        {/* Rotating ring decoration — light section */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 20, ease: "linear" }}
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full border border-grey-300 pointer-events-none"
        />
        <motion.div
          animate={{ rotate: -360 }}
          transition={{ repeat: Infinity, duration: 30, ease: "linear" }}
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full border border-grey-300/70 pointer-events-none"
        />

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="w-full max-w-7xl mx-auto px-6 lg:px-8 text-center relative z-10"
        >
          <h2 className="font-heading text-3xl md:text-4xl lg:text-5xl font-semibold text-foreground tracking-tight leading-tight mb-6 max-w-3xl mx-auto">
            Ready to Build Your{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-ignite-orange via-[#FF8A50] to-[#FF5722]">
              Growth Machine?
            </span>
          </h2>
          <p className="font-sans text-grey-600 text-lg mb-10 max-w-xl mx-auto leading-relaxed">
            One strategy call is all it takes to see if we're the right fit for your pipeline goals.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <MagneticButton
              href="mailto:discover@digiimark.com"
              className="group inline-flex items-center gap-3 bg-ignite-orange text-white font-sans px-8 py-4 rounded-full font-medium hover:bg-ignite-orange/90 transition-colors shadow-[0_8px_40px_rgba(255,87,34,0.4)]"
            >
              Book a Strategy Call
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </MagneticButton>
            <MagneticButton
              href="/"
              className="inline-flex items-center gap-2 border-2 border-grey-400 bg-white/70 text-foreground font-sans font-medium px-8 py-4 rounded-full hover:bg-white hover:border-grey-500 transition-colors shadow-sm"
            >
              Explore Our Work
            </MagneticButton>
          </div>
        </motion.div>
      </section>

      <Footer />
    </main>
  )
}

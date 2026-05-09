"use client"

import { useRef, useEffect, useState } from "react"
import {
  motion,
  useInView,
  useMotionValue,
  useSpring,
} from "framer-motion"
import {
  ArrowRight,
  Zap,
  Target,
  TrendingUp,
  Globe,
  Shield,
  Lightbulb,
  Heart,
  Award,
  CheckCircle,
  Rocket,
  Layers,
  Workflow,
  Cpu,
} from "lucide-react"

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
    iconBg: "bg-peach-light",
    iconColor: "text-ignite-orange",
    bar: "bg-ignite-orange",
  },
  {
    icon: Target,
    title: "Results-Driven",
    description:
      "Vanity metrics don't pay bills. We obsess over pipeline, revenue, and compounding growth that moves the needle.",
    iconBg: "bg-grey-100",
    iconColor: "text-success",
    bar: "bg-success",
  },
  {
    icon: Shield,
    title: "Radical Transparency",
    description:
      "No smoke, no mirrors. You always know what we're building, why we're building it, and how it performs.",
    iconBg: "bg-grey-100",
    iconColor: "text-foreground",
    bar: "bg-grey-600",
  },
  {
    icon: Heart,
    title: "Client Partnership",
    description:
      "We treat your business like our own. We're not vendors — we're growth partners embedded in your success.",
    iconBg: "bg-peach-light",
    iconColor: "text-ignite-orange",
    bar: "bg-peach",
  },
  {
    icon: Globe,
    title: "Global Perspective",
    description:
      "From Silicon Valley to Saudi Arabia, campaigns are tuned to win across cultures, markets, and time zones.",
    iconBg: "bg-grey-100",
    iconColor: "text-foreground",
    bar: "bg-grey-400",
  },
  {
    icon: Rocket,
    title: "Speed & Scale",
    description:
      "Intelligent systems that launch fast and scale without friction. Compress years of growth into months.",
    iconBg: "bg-peach-light",
    iconColor: "text-success",
    bar: "bg-success",
  },
]

const pillars = [
  {
    icon: Layers,
    title: "Design & build",
    description:
      "Product-grade experiences and technical foundations — performance, accessibility, and CRM-ready integrations.",
  },
  {
    icon: Workflow,
    title: "Orchestrate",
    description:
      "Make, n8n, and custom glue code so campaigns, alerts, and handoffs run without spreadsheet chaos.",
  },
  {
    icon: Cpu,
    title: "Deploy AI",
    description:
      "Agents and retrieval pipelines trained on your positioning — consistent voice, measurable outcomes.",
  },
]

const recognition = [
  { icon: Award, label: "Top team — Dribbble" },
  { icon: CheckCircle, label: "Top 100 — Clutch" },
  { icon: TrendingUp, label: "5-star GoodFirms" },
  { icon: Zap, label: "100% Upwork success" },
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
export default function AboutContent() {
  return (
    <main className="relative overflow-hidden bg-background">
      {/* ── HERO ──────────────────────────────────────────────────────────── */}
      <section
        data-theme="light"
        className="relative w-full pt-28 pb-14 md:pt-36 md:pb-16 lg:pt-40 lg:pb-20 bg-gradient-to-b from-peach-light/35 via-background to-background border-t border-grey-200 overflow-hidden"
      >
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.035]"
          aria-hidden
          style={{
            backgroundImage:
              "linear-gradient(rgb(10 10 10 / 1) 1px, transparent 1px), linear-gradient(90deg, rgb(10 10 10 / 1) 1px, transparent 1px)",
            backgroundSize: "36px 36px",
          }}
        />
        <div
          className="pointer-events-none absolute -top-24 right-[8%] h-48 w-48 rounded-full border border-grey-200 bg-peach-light/30 md:h-64 md:w-64"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute bottom-8 left-[6%] h-24 w-24 rounded-full bg-ignite-orange/10 blur-2xl md:h-32 md:w-32"
          aria-hidden
        />

        <div className="relative z-10 w-full max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row lg:items-stretch gap-10 lg:gap-0 lg:rounded-2xl lg:overflow-hidden lg:border lg:border-grey-200 lg:bg-grey-50/90 lg:shadow-[0_28px_90px_rgb(0_0_0_/_.055)]">
            <motion.aside
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
              className="flex shrink-0 flex-col justify-between gap-10 rounded-2xl border border-grey-200 bg-gradient-to-br from-ignite-orange via-ignite-orange to-peach p-8 text-white lg:w-[min(340px,34%)] lg:rounded-none lg:border-0 lg:p-10"
            >
              <div>
                <p className="font-heading text-xs uppercase tracking-[0.18em] text-white/85">DigiiMark</p>
                <p className="mt-5 font-heading text-2xl font-semibold leading-snug tracking-tight md:text-[1.65rem]">
                  Engineering-led marketing for teams who measure pipeline, not noise.
                </p>
              </div>
              <ul className="m-0 list-none space-y-4 p-0 font-sans text-sm leading-relaxed text-white/92">
                <li className="flex gap-3">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-white" aria-hidden />
                  Design, product, and automation in one engagement — fewer handoffs, faster ships.
                </li>
                <li className="flex gap-3">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-white" aria-hidden />
                  AI agents and workflows built to compound; not one-off campaigns that stall.
                </li>
                <li className="flex gap-3">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-white" aria-hidden />
                  Radical transparency: scope, stack, and performance you can audit.
                </li>
              </ul>
              <p className="font-mono text-[0.7rem] uppercase tracking-[0.14em] text-white/75">
                Est. 2012 · Remote-first · GCC & global
              </p>
            </motion.aside>

            <motion.div
              initial={{ opacity: 0, y: 22 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
              className="flex flex-1 flex-col justify-center py-1 lg:px-12 lg:py-12"
            >
              <div className="flex items-center gap-2 mb-4">
                <div className="h-2 w-2 shrink-0 rounded-full bg-ignite-orange" />
                <span className="text-eyebrow text-ignite-orange">About us</span>
              </div>
              <h1 className="heading-h1 text-foreground max-w-[22ch] tracking-tight">
                Strategy, shipped as systems your revenue team can trust
              </h1>
              <p className="mt-6 max-w-xl text-subtitle text-balance">
                For over a decade we&apos;ve built B2B growth engines: crisp web experiences, intelligent
                automation, and AI that scales outreach without diluting your brand.
              </p>
              <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:flex-wrap">
                <MagneticButton
                  href="#our-story"
                  className="group inline-flex items-center justify-center gap-3 rounded-full bg-ignite-orange px-6 py-3 font-sans font-medium text-white shadow-[0_10px_36px_rgb(255_87_34_/_.28)] transition-colors hover:bg-ignite-orange/90"
                >
                  Read our story
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </MagneticButton>
                <MagneticButton
                  href="#values"
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-grey-300 bg-background px-6 py-3 font-sans font-medium text-foreground transition-colors hover:border-grey-400 hover:bg-grey-100"
                >
                  <Heart className="h-4 w-4 text-ignite-orange" />
                  Our values
                </MagneticButton>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── METRICS ───────────────────────────────────────────────────────── */}
      <section data-theme="light" className="relative w-full border-t border-grey-200 bg-background py-16 md:py-20">
        <div className="relative z-10 mx-auto w-full max-w-7xl px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.45 }}
            className="rounded-2xl border border-grey-200 bg-grey-50/80 px-6 py-10 md:px-12 md:py-12"
          >
            <div className="grid grid-cols-2 gap-y-10 gap-x-4 lg:grid-cols-4 lg:gap-y-0">
              {stats.map((stat, i) => (
                <div
                  key={stat.label}
                  className={`text-center ${i > 0 ? "lg:border-l lg:border-grey-200 lg:pl-8" : ""} ${i >= 2 ? "max-lg:border-t max-lg:border-grey-200 max-lg:pt-10 lg:pt-0" : ""}`}
                >
                  <AnimatedNumber value={stat.value} suffix={stat.suffix} />
                  <p className="mt-2 font-sans text-sm font-medium text-grey-400">{stat.label}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── STORY ─────────────────────────────────────────────────────────── */}
      <section
        id="our-story"
        data-theme="light"
        className="relative w-full border-t border-grey-200 bg-peach-light/25 py-16 md:py-20"
      >
        <div className="relative z-10 mx-auto w-full max-w-7xl px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-14 lg:grid-cols-12 lg:gap-16">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.5 }}
              className="lg:col-span-5"
            >
              <Eyebrow>The origin</Eyebrow>
              <h2 className="font-heading text-3xl font-semibold tracking-tight text-foreground md:text-4xl lg:text-5xl">
                From campaigns to compounding systems
              </h2>
              <p className="mt-5 font-sans text-base leading-relaxed text-grey-600 md:text-lg">
                DigiiMark began as a design-led shop obsessed with conversion. Today we&apos;re the team B2B
                founders hire when they need engineering discipline{" "}
                <span className="text-foreground">and</span> marketing velocity — without hiring a village.
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.5, delay: 0.08 }}
              className="space-y-6 font-sans text-base leading-relaxed text-grey-400 md:text-lg lg:col-span-7"
            >
              <p>
                We started in 2012 with one rule:{" "}
                <strong className="font-medium text-foreground">every engagement has to tie to revenue or efficiency</strong>
                — not slides, not vanity dashboards.
              </p>
              <p>
                For years we ran performance programs for 100+ brands. The work was strong, but the bottleneck was
                always the same: manual follow-up, brittle handoffs, and reporting that arrived too late to steer.
              </p>
              <p>
                In 2018 we rebuilt the company around automation and data loops. That became AI-assisted workflows,
                agentic selling tools, and integrations that keep CRMs honest — so growth compounds instead of
                resetting every quarter.
              </p>
              <blockquote className="border-l-4 border-ignite-orange bg-background/80 py-5 pl-6 pr-5 font-heading text-lg font-medium leading-snug text-foreground shadow-sm md:text-xl">
                We&apos;re not here to rent attention. We&apos;re here to install the machine that earns it.
              </blockquote>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── JOURNEY ───────────────────────────────────────────────────────── */}
      <section data-theme="light" className="relative w-full border-t border-grey-200 bg-background py-16 md:py-20">
        <div className="relative z-10 mx-auto w-full max-w-7xl px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.45 }}
            className="mb-10 md:mb-14"
          >
            <Eyebrow>Milestones</Eyebrow>
            <h2 className="font-heading text-3xl font-semibold tracking-tight text-foreground md:text-4xl lg:text-5xl">
              Twelve years, six inflection points
            </h2>
            <p className="mt-4 max-w-2xl font-sans text-lg text-grey-400">
              A condensed arc — same team ethic, bigger leverage every chapter.
            </p>
          </motion.div>
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:gap-6">
            {milestones.map((m, i) => (
              <motion.article
                key={m.year}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.4, delay: Math.min(i * 0.05, 0.35) }}
                className="flex flex-col rounded-2xl border border-grey-200 bg-grey-50/50 p-6 transition-colors hover:border-grey-300 md:p-8"
              >
                <span className="font-mono text-sm font-semibold uppercase tracking-wider text-ignite-orange">
                  {m.year}
                </span>
                <h3 className="mt-3 font-heading text-xl font-semibold tracking-tight text-foreground md:text-2xl">
                  {m.title}
                </h3>
                <p className="mt-3 font-sans text-base leading-relaxed text-grey-400">{m.description}</p>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      {/* ── OPERATING MODEL ───────────────────────────────────────────────── */}
      <section data-theme="light" className="relative w-full border-t border-grey-200 bg-foreground py-16 md:py-20">
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.06]"
          aria-hidden
          style={{
            backgroundImage:
              "linear-gradient(rgb(255 255 255 / 0.4) 1px, transparent 1px), linear-gradient(90deg, rgb(255 255 255 / 0.4) 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />
        <div className="relative z-10 mx-auto w-full max-w-7xl px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.45 }}
            className="mb-10 md:mb-14"
          >
            <div className="flex items-center gap-2 mb-4">
              <div className="h-2 w-2 shrink-0 rounded-full bg-ignite-orange" />
              <span className="font-heading text-sm font-medium uppercase tracking-wider text-white">How we work</span>
            </div>
            <h2 className="font-heading text-3xl font-semibold tracking-tight text-white md:text-4xl lg:text-5xl">
              One partner across build, automate, and AI
            </h2>
          </motion.div>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3 md:gap-8">
            {pillars.map((p, i) => (
              <motion.div
                key={p.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.4, delay: i * 0.08 }}
                className="rounded-2xl border border-white/10 bg-white/[0.06] p-6 backdrop-blur-sm md:p-8"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-ignite-orange/20 text-ignite-orange">
                  <p.icon className="h-6 w-6" aria-hidden />
                </div>
                <h3 className="mt-6 font-heading text-xl font-semibold tracking-tight text-white">{p.title}</h3>
                <p className="mt-3 font-sans text-base leading-relaxed text-white/65">{p.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── VALUES ────────────────────────────────────────────────────────── */}
      <section id="values" data-theme="light" className="relative w-full border-t border-grey-200 bg-background py-16 md:py-20">
        <div className="relative z-10 mx-auto w-full max-w-7xl px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.45 }}
            className="mb-10 md:mb-14 max-w-3xl"
          >
            <Eyebrow>What we stand for</Eyebrow>
            <h2 className="font-heading text-3xl font-semibold tracking-tight text-foreground md:text-4xl lg:text-5xl">
              Principles we hire and fire on
            </h2>
          </motion.div>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
            {values.map((v, i) => (
              <motion.div
                key={v.title}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.4, delay: Math.min(i * 0.06, 0.3) }}
                className="flex h-full flex-col rounded-2xl border border-grey-200 bg-grey-50/40 p-6 md:p-7"
              >
                <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${v.iconBg}`}>
                  <v.icon className={`h-5 w-5 ${v.iconColor}`} aria-hidden />
                </div>
                <h3 className="mt-5 font-heading text-lg font-semibold tracking-tight text-foreground md:text-xl">
                  {v.title}
                </h3>
                <p className="mt-2 flex-1 font-sans text-sm leading-relaxed text-grey-400 md:text-base">{v.description}</p>
                <div className={`mt-5 h-1 w-12 rounded-full ${v.bar}`} aria-hidden />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── RECOGNITION ─────────────────────────────────────────────────────── */}
      <section data-theme="light" className="relative w-full border-t border-grey-200 bg-grey-100 py-12 md:py-14">
        <div className="relative z-10 mx-auto flex w-full max-w-7xl flex-wrap items-center justify-center gap-x-10 gap-y-6 px-6 lg:gap-x-14 lg:px-8">
          {recognition.map((item, i) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.35, delay: i * 0.05 }}
              className="flex items-center gap-3"
            >
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-background text-ignite-orange shadow-sm ring-1 ring-grey-200">
                <item.icon className="h-5 w-5" aria-hidden />
              </span>
              <span className="font-sans text-sm font-medium text-foreground md:text-base">{item.label}</span>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── CTA ───────────────────────────────────────────────────────────── */}
      <section
        data-theme="light"
        className="relative w-full border-t border-grey-200 bg-background py-16 md:py-20"
      >
        <div className="relative z-10 mx-auto w-full max-w-7xl px-6 text-center lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.5 }}
            className="mx-auto max-w-3xl rounded-2xl border border-grey-200 bg-gradient-to-b from-peach-light/40 to-background px-6 py-12 md:px-12 md:py-14"
          >
            <h2 className="font-heading text-3xl font-semibold tracking-tight text-foreground md:text-4xl lg:text-5xl">
              Ready for a growth engine —{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-ignite-orange via-peach to-ignite-orange">
                not another retainer?
              </span>
            </h2>
            <p className="mx-auto mt-5 max-w-xl font-sans text-lg text-grey-400">
              Tell us what pipeline looks like today. We&apos;ll map whether automation and AI are the right lever.
            </p>
            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <MagneticButton
                href="mailto:discover@digiimark.com"
                className="group inline-flex items-center gap-3 rounded-full bg-ignite-orange px-8 py-4 font-sans font-medium text-white shadow-[0_10px_40px_rgb(255_87_34_/_.25)] transition-colors hover:bg-ignite-orange/90"
              >
                Book a strategy call
                <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-0.5" />
              </MagneticButton>
              <MagneticButton
                href="/projects"
                className="inline-flex items-center gap-2 rounded-full border border-grey-300 bg-background px-8 py-4 font-sans font-medium text-foreground transition-colors hover:border-grey-400 hover:bg-grey-100"
              >
                View our work
              </MagneticButton>
            </div>
          </motion.div>
        </div>
      </section>
    </main>
  )
}

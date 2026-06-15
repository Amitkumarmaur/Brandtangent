"use client"

import { useRef, useState, useEffect, type ReactNode } from "react"
import Link from "next/link"
import { LayoutGroup, motion, useMotionValue, useScroll, useSpring, useTransform } from "motion/react"
import {
  ArrowRight,
  Sparkles,
  TrendingUp,
  Users,
  Zap,
  Activity,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { TextRotate } from "@/components/ui/text-rotate"
import { ElegantShapesBackground } from "@/components/landing/elegant-shapes"
import { cn } from "@/lib/utils"

function GradientMesh() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none select-none" aria-hidden>
      <div
        className="mesh-blob"
        style={{
          width: 700,
          height: 520,
          top: "-18%",
          left: "-8%",
          background:
            "radial-gradient(ellipse, rgba(245,233,212,0.92) 0%, rgba(245,220,180,0.4) 55%, transparent 100%)",
          animation: "mesh-1 22s ease-in-out infinite",
        }}
      />
      <div
        className="mesh-blob"
        style={{
          width: 580,
          height: 440,
          top: "-12%",
          left: "14%",
          background:
            "radial-gradient(ellipse, rgba(83,58,253,0.35) 0%, rgba(83,58,253,0.15) 55%, transparent 100%)",
          animation: "mesh-2 27s ease-in-out infinite",
          animationDelay: "-4s",
        }}
      />
      <div
        className="mesh-blob"
        style={{
          width: 640,
          height: 480,
          top: "-8%",
          left: "33%",
          background:
            "radial-gradient(ellipse, rgba(249,107,238,0.28) 0%, rgba(249,107,238,0.12) 55%, transparent 100%)",
          animation: "mesh-3 20s ease-in-out infinite",
          animationDelay: "-8s",
        }}
      />
      <div
        className="mesh-blob"
        style={{
          width: 520,
          height: 400,
          top: "0%",
          left: "56%",
          background:
            "radial-gradient(ellipse, rgba(234,34,97,0.22) 0%, rgba(234,34,97,0.08) 55%, transparent 100%)",
          animation: "mesh-4 18s ease-in-out infinite",
          animationDelay: "-12s",
        }}
      />
      <div className="absolute bottom-0 left-0 right-0 h-72 bg-gradient-to-b from-transparent to-background" />
    </div>
  )
}

interface StatCardProps {
  icon: ReactNode
  value: string
  label: string
  delay: number
}

function StatCard({ icon, value, label, delay }: StatCardProps) {
  const [count, setCount] = useState(0)
  const numeric = parseInt(value.replace(/\D/g, ""), 10)
  const suffix = value.includes("%") ? "%" : value.includes("K") ? "K" : "+"

  useEffect(() => {
    const duration = 2000
    const steps = 60
    const increment = numeric / steps
    let current = 0

    const timer = setInterval(() => {
      current += increment
      if (current >= numeric) {
        setCount(numeric)
        clearInterval(timer)
      } else {
        setCount(Math.floor(current))
      }
    }, duration / steps)

    return () => clearInterval(timer)
  }, [numeric])

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay, duration: 0.6 }}
    >
      <Card className="relative overflow-hidden glass-subtle border-border/60 p-5 hover:shadow-[var(--shadow-2)] transition-all duration-300">
        <motion.div
          animate={{ y: [0, -8, 0] }}
          transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
          className="absolute -top-4 -right-4 text-primary/10"
          aria-hidden
        >
          <div className="text-5xl opacity-60">{icon}</div>
        </motion.div>
        <div className="relative z-10">
          <div className="text-primary mb-2">{icon}</div>
          <div className="text-2xl font-light text-foreground mb-1 tnum">
            {count}
            {suffix}
          </div>
          <div className="text-caption">{label}</div>
        </div>
      </Card>
    </motion.div>
  )
}

function TiltCard({ children, className }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)

  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [12, -12]), {
    stiffness: 120,
    damping: 22,
  })
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-12, 12]), {
    stiffness: 120,
    damping: 22,
  })

  function onMouseMove(e: React.MouseEvent) {
    const rect = ref.current?.getBoundingClientRect()
    if (!rect) return
    mouseX.set((e.clientX - rect.left) / rect.width - 0.5)
    mouseY.set((e.clientY - rect.top) / rect.height - 0.5)
  }

  function onMouseLeave() {
    mouseX.set(0)
    mouseY.set(0)
  }

  return (
    <div
      ref={ref}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      className={cn("card-3d-wrapper", className)}
    >
      <motion.div
        style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
        className="card-3d"
      >
        {children}
      </motion.div>
    </div>
  )
}

function DashboardPreview() {
  return (
    <Card className="relative overflow-hidden glass border-border/50 p-0 shadow-[var(--shadow-glass)]">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent opacity-60 pointer-events-none" />

      <div className="relative z-10 flex items-center gap-2 px-5 py-3 bg-secondary/80 border-b border-border">
        <div className="w-2.5 h-2.5 rounded-full bg-border" />
        <div className="w-2.5 h-2.5 rounded-full bg-border" />
        <div className="w-2.5 h-2.5 rounded-full bg-border" />
        <div className="flex-1 mx-4 h-6 bg-background rounded-md border border-border flex items-center px-3 gap-2">
          <div className="w-2 h-2 rounded-full bg-primary/30" />
          <span className="text-[11px] text-muted-foreground font-light">
            brandtangent.com/dashboard
          </span>
        </div>
      </div>

      <div className="relative z-10 p-5 grid grid-cols-2 gap-3">
        <StatCard icon={<Zap className="w-5 h-5" />} value="300%" label="ROI Increase" delay={0.1} />
        <StatCard icon={<TrendingUp className="w-5 h-5" />} value="85%" label="Time Saved" delay={0.2} />
        <StatCard icon={<Users className="w-5 h-5" />} value="200+" label="Brands Shaped" delay={0.3} />
        <StatCard icon={<Activity className="w-5 h-5" />} value="99%" label="Client Satisfaction" delay={0.4} />
      </div>

      <motion.div
        className="absolute inset-0 rounded-md pointer-events-none"
        style={{
          background: "linear-gradient(90deg, transparent, var(--primary), transparent)",
          opacity: 0.25,
        }}
        animate={{ rotate: 360 }}
        transition={{ duration: 10, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
        aria-hidden
      />
    </Card>
  )
}

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      delay: 0.2 + i * 0.15,
      ease: [0.25, 0.4, 0.25, 1] as const,
    },
  }),
}

export default function LandingHero() {
  const containerRef = useRef<HTMLDivElement>(null)
  const { scrollY } = useScroll()
  const meshOpacity = useTransform(scrollY, [0, 500], [1, 0.2])
  const contentY = useTransform(scrollY, [0, 600], [0, -80])
  const cardY = useTransform(scrollY, [0, 600], [0, 40])

  return (
    <section
      ref={containerRef}
      className="relative min-h-[100vh] overflow-hidden bg-background pt-28 sm:pt-32 lg:pt-36 pb-16"
    >
      <motion.div className="absolute inset-0 pointer-events-none" style={{ opacity: meshOpacity }}>
        <GradientMesh />
      </motion.div>

      <ElegantShapesBackground />

      <div className="absolute inset-0 opacity-[0.04] pointer-events-none" aria-hidden>
        <div
          className="w-full h-full"
          style={{
            backgroundImage: `
              linear-gradient(var(--hairline) 1px, transparent 1px),
              linear-gradient(90deg, var(--hairline) 1px, transparent 1px)
            `,
            backgroundSize: "48px 48px",
          }}
        />
      </div>

      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <motion.div style={{ y: contentY }} className="text-left">
            <motion.div
              custom={0}
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              className="inline-flex mb-6"
            >
              <span className="pill-tag inline-flex items-center gap-2">
                <Sparkles className="w-3 h-3 text-primary" strokeWidth={1.5} />
                AI-Powered Brand Systems
              </span>
            </motion.div>

            <motion.div custom={1} variants={fadeUp} initial="hidden" animate="visible">
              <h1 className="display-xxl text-foreground max-w-xl text-balance mb-6">
                <span className="block">We engineer brands that are</span>
                <LayoutGroup>
                  <motion.span layout className="flex flex-wrap items-baseline gap-x-2">
                    <motion.span layout transition={{ type: "spring", damping: 30, stiffness: 400 }}>
                      impossible to{" "}
                    </motion.span>
                    <TextRotate
                      texts={["ignore", "forget", "outgrow", "replicate"]}
                      mainClassName="text-primary overflow-hidden"
                      staggerDuration={0.02}
                      staggerFrom="last"
                      rotationInterval={2800}
                      transition={{ type: "spring", damping: 30, stiffness: 400 }}
                    />
                  </motion.span>
                </LayoutGroup>
              </h1>
            </motion.div>

            <motion.p
              custom={2}
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              className="text-subtitle max-w-md mb-8"
            >
              Strategy-led creative and intelligent marketing systems that scale
              without limits. Built for founders who want growth with intention.
            </motion.p>

            <motion.div
              custom={3}
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              className="flex flex-col sm:flex-row items-start gap-3 mb-10"
            >
              <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                <Button size="lg" asChild>
                  <Link href="/#contact">
                    Start a project
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </Button>
              </motion.div>
              <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                <Button size="lg" variant="outline" asChild>
                  <Link href="/case-studies">See our work</Link>
                </Button>
              </motion.div>
            </motion.div>

            <motion.div
              custom={4}
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              className="flex flex-wrap items-center gap-6 text-sm text-muted-foreground font-light"
            >
              {[
                { stat: "12+", label: "years of brand craft" },
                { stat: "200+", label: "brands shaped" },
                { stat: "Top 1%", label: "on Dribbble & Clutch" },
              ].map(({ stat, label }, i) => (
                <div key={stat} className="flex items-center gap-6">
                  {i > 0 && <div className="hidden sm:block w-px h-4 bg-border" />}
                  <div>
                    <span className="text-foreground text-xl tracking-tight font-light block tnum">
                      {stat}
                    </span>
                    <span className="text-caption">{label}</span>
                  </div>
                </div>
              ))}
            </motion.div>
          </motion.div>

          <motion.div
            style={{ y: cardY }}
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="relative"
          >
            <TiltCard>
              <DashboardPreview />
            </TiltCard>

            <motion.div
              className="absolute -top-8 -right-8 w-32 h-32 bg-primary/15 rounded-full blur-3xl pointer-events-none"
              animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.55, 0.3] }}
              transition={{ duration: 4, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
              aria-hidden
            />
            <motion.div
              className="absolute -bottom-8 -left-8 w-40 h-40 bg-[rgba(249,107,238,0.15)] rounded-full blur-3xl pointer-events-none"
              animate={{ scale: [1.2, 1, 1.2], opacity: [0.25, 0.5, 0.25] }}
              transition={{ duration: 5, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
              aria-hidden
            />
          </motion.div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-24 hero-gradient pointer-events-none" />
    </section>
  )
}

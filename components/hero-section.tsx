"use client"

import { useRef } from "react"
import Link from "next/link"
import { LayoutGroup, motion, useScroll, useTransform } from "motion/react"
import { ArrowRight, TrendingUp, Zap, Activity, Users, Sparkles } from "lucide-react"

import { Button } from "@/components/ui/button"
import { TextRotate } from "@/components/ui/text-rotate"
import { ElegantShapesBackground } from "@/components/landing/elegant-shapes"
import { GradientMesh } from "@/components/motion/gradient-mesh"
import { TiltCard } from "@/components/motion/tilt-card"

function DashboardMockup() {
  return (
    <TiltCard className="w-full max-w-4xl mx-auto mt-14">
      <motion.div
        initial={{ opacity: 0, y: 80 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.55, ease: [0.22, 1, 0.36, 1] }}
        className="relative w-full rounded-md overflow-hidden shadow-[var(--shadow-glass)] border border-border/60 glass"
      >
        <div className="flex items-center gap-2 px-5 py-3 bg-secondary/80 border-b border-border">
          <div className="w-2.5 h-2.5 rounded-full bg-border" />
          <div className="w-2.5 h-2.5 rounded-full bg-border" />
          <div className="w-2.5 h-2.5 rounded-full bg-border" />
          <div className="flex-1 mx-5 h-6 bg-background rounded-md border border-border flex items-center px-3 gap-2">
            <div className="w-2 h-2 rounded-full bg-primary/30" />
            <span className="text-[11px] text-muted-foreground font-light">
              brandtangent.com/dashboard
            </span>
          </div>
        </div>

        <div className="p-6 grid grid-cols-12 gap-4 min-h-[260px]">
          <div className="col-span-8 flex flex-col gap-3">
            <div className="grid grid-cols-3 gap-3">
              {[
                { label: "Brand Score", value: "94", delta: "+12%", Icon: Activity, color: "var(--accent-purple)" },
                { label: "Organic Reach", value: "42.8K", delta: "+31%", Icon: TrendingUp, color: "var(--accent-pink)" },
                { label: "Conversions", value: "1,247", delta: "+18%", Icon: Zap, color: "var(--accent-blue)" },
              ].map(({ label, value, delta, Icon, color }) => (
                <div
                  key={label}
                  className="bg-background rounded-lg border border-border p-3.5 shadow-[var(--shadow-1)]"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[11px] text-muted-foreground font-light">{label}</span>
                    <Icon className="w-3.5 h-3.5" style={{ color }} strokeWidth={1.5} />
                  </div>
                  <div className="display-xs text-foreground tnum">{value}</div>
                  <div className="text-[11px] mt-0.5 font-normal" style={{ color }}>
                    ↑ {delta}
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-background rounded-lg border border-border p-4 shadow-[var(--shadow-1)] flex-1">
              <div className="flex items-center justify-between mb-3">
                <span className="text-[12px] font-normal text-foreground">Brand Momentum</span>
                <span className="text-[11px] text-muted-foreground font-light">Last 30 days</span>
              </div>
              <svg viewBox="0 0 300 56" className="w-full" aria-hidden>
                <defs>
                  <linearGradient id="heroChartGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#7a3dff" stopOpacity="0.18" />
                    <stop offset="100%" stopColor="#7a3dff" stopOpacity="0" />
                  </linearGradient>
                </defs>
                <path
                  d="M0,50 L18,43 L36,45 L54,33 L72,36 L90,24 L108,26 L126,17 L144,20 L162,12 L180,15 L198,9 L216,7 L234,10 L252,4 L270,6 L288,2 L300,3"
                  fill="none"
                  stroke="#7a3dff"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M0,50 L18,43 L36,45 L54,33 L72,36 L90,24 L108,26 L126,17 L144,20 L162,12 L180,15 L198,9 L216,7 L234,10 L252,4 L270,6 L288,2 L300,3 L300,56 L0,56Z"
                  fill="url(#heroChartGrad)"
                />
                <circle cx="300" cy="3" r="3" fill="#7a3dff" />
              </svg>
            </div>
          </div>

          <div className="col-span-4 flex flex-col gap-3">
            <div className="bg-background rounded-lg border border-border p-3.5 shadow-[var(--shadow-1)] flex-1">
              <div className="text-[11px] text-muted-foreground font-light mb-2.5">Recent Activity</div>
              {[
                { text: "Campaign live", time: "2m ago", color: "#7a3dff" },
                { text: "Brand mention ×3", time: "14m ago", color: "#ed52cb" },
                { text: "Report ready", time: "1h ago", color: "#3b89ff" },
                { text: "Audience ↑ 12%", time: "3h ago", color: "#7a3dff" },
              ].map(({ text, time, color }) => (
                <div
                  key={text}
                  className="flex items-center gap-2 py-1.5 border-b border-secondary last:border-0"
                >
                  <div className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: color }} />
                  <span className="text-[11px] text-foreground font-light flex-1 leading-tight">{text}</span>
                  <span className="text-[10px] text-muted-foreground font-light shrink-0">{time}</span>
                </div>
              ))}
            </div>

            <div className="bg-primary rounded-lg p-3.5">
              <div className="flex items-center justify-between mb-1">
                <span className="text-[11px] text-white/50 font-light">Q2 Campaign</span>
                <Users className="w-3 h-3 text-white/30" strokeWidth={1.5} />
              </div>
              <div className="display-sm text-primary-foreground tnum">78%</div>
              <div className="mt-2 h-1.5 bg-white/10 rounded-full overflow-hidden">
                <div className="h-full bg-accent-purple rounded-full" style={{ width: "78%" }} />
              </div>
              <div className="text-[10px] text-white/35 font-light mt-1.5">Target: 100K reach</div>
            </div>
          </div>
        </div>
      </motion.div>
    </TiltCard>
  )
}

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, delay: 0.1 + i * 0.08, ease: [0.22, 1, 0.36, 1] as const },
  }),
}

export default function HeroSection() {
  const containerRef = useRef<HTMLElement>(null)
  const { scrollY } = useScroll()
  const mockupY = useTransform(scrollY, [0, 700], [0, -90])
  const meshOpacity = useTransform(scrollY, [0, 400], [1, 0.3])

  return (
    <section
      ref={containerRef}
      className="relative bg-background overflow-hidden pt-28 sm:pt-32 lg:pt-36 pb-0"
    >
      <motion.div className="absolute inset-0 pointer-events-none" style={{ opacity: meshOpacity }}>
        <GradientMesh />
      </motion.div>

      <ElegantShapesBackground />

      <div className="absolute inset-0 opacity-[0.03] pointer-events-none" aria-hidden>
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

      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 lg:px-8 text-center">
        <motion.div custom={0} variants={fadeUp} initial="hidden" animate="visible" className="inline-flex">
          <span className="pill-tag mb-8 inline-flex items-center gap-2">
            <Sparkles className="w-3 h-3 text-accent-orange" strokeWidth={1.5} />
            Brand Strategy &amp; Growth
          </span>
        </motion.div>

        <motion.div custom={1} variants={fadeUp} initial="hidden" animate="visible">
          <h1 className="display-xxl max-w-[800px] mx-auto text-balance mb-6">
            <span className="block">We make brands impossible to</span>
            <LayoutGroup>
              <motion.span layout className="flex flex-wrap justify-center items-baseline gap-x-2">
                <TextRotate
                  texts={["ignore", "forget", "outgrow", "replicate"]}
                  mainClassName="text-accent-orange"
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
          className="text-subtitle max-w-[480px] mx-auto text-balance mb-10"
        >
          Strategy-led creative that cuts through noise and compounds over time.
          Built for founders who want to grow with intention.
        </motion.p>

        <motion.div
          custom={3}
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-14"
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
          className="flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-10 text-sm text-muted-foreground font-light mb-20"
        >
          {[
            { stat: "12+", label: "years of brand craft" },
            { stat: "200+", label: "brands shaped" },
            { stat: "Top 1%", label: "on Dribbble & Clutch" },
          ].map(({ stat, label }, i) => (
            <div key={stat} className="flex items-center gap-6">
              {i > 0 && <div className="hidden sm:block w-px h-4 bg-border" />}
              <div className="flex items-center gap-2">
                <span className="display-sm text-foreground tnum">{stat}</span>
                <span className="text-caption">{label}</span>
              </div>
            </div>
          ))}
        </motion.div>
      </div>

      <motion.div style={{ y: mockupY }} className="relative z-10 w-full max-w-7xl mx-auto px-6 lg:px-8">
        <DashboardMockup />
      </motion.div>

      <div className="relative z-20 h-24 hero-gradient pointer-events-none" />
    </section>
  )
}

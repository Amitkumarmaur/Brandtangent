"use client"

import { useRef } from "react"
import { motion, useInView, useScroll, useTransform } from "motion/react"
import { Search, PenTool, Cpu, TrendingUp, type LucideIcon } from "lucide-react"

const steps = [
  {
    icon: Search,
    step: "01",
    title: "Discover",
    description:
      "Deep-dive into your market, audience, and competitive landscape to uncover strategic opportunities.",
  },
  {
    icon: PenTool,
    step: "02",
    title: "Design",
    description:
      "Craft brand identity, messaging architecture, and creative systems that resonate and differentiate.",
  },
  {
    icon: Cpu,
    step: "03",
    title: "Engineer",
    description:
      "Build automated marketing infrastructure — workflows, integrations, and AI-powered pipelines.",
  },
  {
    icon: TrendingUp,
    step: "04",
    title: "Scale",
    description:
      "Optimize, iterate, and expand what works. Compound growth through data-driven experimentation.",
  },
]

function ProcessStep({
  step,
  index,
}: {
  step: (typeof steps)[number]
  index: number
}) {
  const cardRef = useRef<HTMLDivElement>(null)
  const cardInView = useInView(cardRef, { once: true, margin: "-60px" })
  const StepIcon = step.icon as LucideIcon

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 50 }}
      animate={cardInView ? { opacity: 1, y: 0 } : {}}
      transition={{
        duration: 0.7,
        delay: index * 0.12,
        ease: [0.22, 1, 0.36, 1],
      }}
      className="relative text-center lg:text-left group"
    >
      <motion.div
        className="relative mx-auto lg:mx-0 w-16 h-16 rounded-md bg-secondary border border-border flex items-center justify-center mb-6 group-hover:border-primary/30 transition-colors"
        whileHover={{ scale: 1.08, rotateY: 15 }}
        style={{ transformStyle: "preserve-3d" }}
      >
        <StepIcon className="w-7 h-7 text-primary" strokeWidth={1.5} />
        <span className="absolute -top-2 -right-2 text-[10px] font-mono text-primary bg-primary/10 px-1.5 py-0.5 rounded-full">
          {step.step}
        </span>
      </motion.div>

      <h3 className="heading-md text-foreground mb-3">{step.title}</h3>
      <p className="text-body">{step.description}</p>
    </motion.div>
  )
}

export default function LandingProcess() {
  const containerRef = useRef<HTMLDivElement>(null)
  const headerRef = useRef<HTMLDivElement>(null)
  const headerInView = useInView(headerRef, { once: true, margin: "-60px" })

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  })
  const lineScale = useTransform(scrollYProgress, [0.1, 0.7], [0, 1])

  return (
    <section
      ref={containerRef}
      className="relative w-full py-16 md:py-20 bg-background overflow-hidden border-t border-border"
    >
      <div className="w-full max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
        <motion.div
          ref={headerRef}
          initial={{ opacity: 0, y: 24 }}
          animate={headerInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="text-center max-w-2xl mx-auto mb-16"
        >
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="w-2 h-2 rounded-full bg-primary" />
            <span className="text-eyebrow text-primary">Our Process</span>
          </div>
          <h2 className="heading-h2 text-foreground mb-4">
            From insight to impact in four phases
          </h2>
          <p className="text-subtitle">
            A proven framework that turns brand ambition into measurable, scalable results.
          </p>
        </motion.div>

        <div className="relative">
          <div className="hidden lg:block absolute top-16 left-[12.5%] right-[12.5%] h-px bg-border overflow-hidden">
            <motion.div
              className="h-full bg-primary origin-left"
              style={{ scaleX: lineScale }}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, index) => (
              <ProcessStep key={step.step} step={step} index={index} />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

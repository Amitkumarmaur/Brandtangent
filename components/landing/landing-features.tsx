"use client"

import { useRef } from "react"
import { motion, useInView, useMotionValue, useSpring, useTransform } from "motion/react"
import { Bot, BarChart3, Layers, Rocket, Target, Workflow } from "lucide-react"

import { cn } from "@/lib/utils"

const features = [
  {
    icon: Bot,
    title: "AI Marketing Automation",
    description:
      "Intelligent workflows that nurture leads, personalize outreach, and optimize campaigns around the clock.",
  },
  {
    icon: Target,
    title: "Brand Strategy",
    description:
      "Positioning frameworks and messaging systems that make your brand unmistakable in crowded markets.",
  },
  {
    icon: BarChart3,
    title: "Performance Analytics",
    description:
      "Real-time dashboards and attribution models that connect creative decisions to revenue outcomes.",
  },
  {
    icon: Workflow,
    title: "Systems Architecture",
    description:
      "End-to-end marketing infrastructure — CRM, automation, content ops — engineered to scale.",
  },
  {
    icon: Layers,
    title: "Creative Production",
    description:
      "High-velocity design and content pipelines powered by AI, governed by brand standards.",
  },
  {
    icon: Rocket,
    title: "Growth Engineering",
    description:
      "Experimentation frameworks and conversion optimization that compound results quarter over quarter.",
  },
]

function FeatureCard({
  feature,
  index,
}: {
  feature: (typeof features)[number]
  index: number
}) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: "-80px" })
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)

  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [8, -8]), {
    stiffness: 100,
    damping: 20,
  })
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-8, 8]), {
    stiffness: 100,
    damping: 20,
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

  const Icon = feature.icon

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.08, ease: [0.22, 1, 0.36, 1] }}
      className="card-3d-wrapper h-full"
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
    >
      <motion.div
        style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
        className={cn(
          "h-full rounded-md border border-border bg-background p-6 lg:p-8",
          "shadow-[var(--shadow-1)] hover:shadow-[var(--shadow-2)] transition-shadow duration-300",
          "group relative overflow-hidden"
        )}
      >
        <div
          className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
          aria-hidden
        />

        <div className="relative z-10">
          <div className="w-12 h-12 rounded-md bg-secondary flex items-center justify-center mb-5 group-hover:bg-primary/10 transition-colors">
            <Icon className="w-6 h-6 text-primary" strokeWidth={1.5} />
          </div>
          <h3 className="heading-md text-foreground mb-3">{feature.title}</h3>
          <p className="text-body">{feature.description}</p>
        </div>

        <motion.div
          className="absolute -bottom-6 -right-6 w-24 h-24 rounded-full bg-primary/5 pointer-events-none"
          animate={{ scale: [1, 1.15, 1] }}
          transition={{ duration: 4, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
          aria-hidden
        />
      </motion.div>
    </motion.div>
  )
}

export default function LandingFeatures() {
  const headerRef = useRef<HTMLDivElement>(null)
  const headerInView = useInView(headerRef, { once: true, margin: "-60px" })

  return (
    <section className="relative w-full py-16 md:py-20 bg-secondary overflow-hidden border-t border-border">
      <div className="w-full max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
        <motion.div
          ref={headerRef}
          initial={{ opacity: 0, y: 24 }}
          animate={headerInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-2xl mb-12 md:mb-16"
        >
          <div className="flex items-center gap-2 mb-4">
            <div className="w-2 h-2 rounded-full bg-primary" />
            <span className="text-eyebrow text-primary">Capabilities</span>
          </div>
          <h2 className="heading-h2 text-foreground mb-4">
            Everything you need to scale your brand
          </h2>
          <p className="text-subtitle">
            From strategy to execution, we build marketing systems that work as hard as you do.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <FeatureCard key={feature.title} feature={feature} index={index} />
          ))}
        </div>
      </div>
    </section>
  )
}

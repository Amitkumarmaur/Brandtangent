"use client"

import { motion } from "motion/react"
import { Cpu, Layers, Workflow } from "lucide-react"

import { staggerContainer, staggerItem } from "@/components/about/about-motion"

const pillars = [
  {
    icon: Layers,
    num: "01",
    title: "Strategy & identity",
    description:
      "Category positioning, brand architecture, and visual identity systems that define how you compete.",
  },
  {
    icon: Workflow,
    num: "02",
    title: "Creative & content",
    description:
      "Campaigns, copy, and content built to the brand standard — consistent voice, measurable outcomes.",
  },
  {
    icon: Cpu,
    num: "03",
    title: "Digital & growth",
    description:
      "Web experiences, digital marketing, and performance programs that turn brand equity into revenue.",
  },
]

export default function AboutPillars() {
  return (
    <section className="relative overflow-hidden border-t border-white/10 bg-primary py-20 md:py-28">
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.07]"
        aria-hidden
        style={{
          backgroundImage: `
            linear-gradient(45deg, transparent 48%, rgba(255,107,0,0.4) 49%, rgba(255,107,0,0.4) 51%, transparent 52%),
            linear-gradient(-45deg, transparent 48%, rgba(255,255,255,0.15) 49%, rgba(255,255,255,0.15) 51%, transparent 52%)
          `,
          backgroundSize: "60px 60px",
        }}
      />

      <motion.div
        className="pointer-events-none absolute -left-32 top-1/4 h-96 w-96 rounded-full bg-accent-orange/15 blur-3xl"
        animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.55, 0.3] }}
        transition={{ duration: 7, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
        aria-hidden
      />

      <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="mb-16 max-w-2xl"
        >
          <div className="mb-4 flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-accent-orange" />
            <span className="micro-cap text-white/60">How we work</span>
          </div>
          <h2 className="display-lg text-white">
            One partner across strategy, creative, and digital
          </h2>
        </motion.div>

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          className="grid grid-cols-1 gap-6 md:grid-cols-3 md:gap-0"
        >
          {pillars.map((p, i) => {
            const Icon = p.icon
            return (
              <motion.div
                key={p.title}
                variants={staggerItem}
                whileHover={{ y: -6 }}
                className="group relative border border-white/10 bg-white/[0.04] p-8 backdrop-blur-sm transition-colors hover:border-accent-orange/40 hover:bg-white/[0.07] md:-mr-px md:translate-y-0 md:odd:translate-y-6"
                style={{ zIndex: pillars.length - i }}
              >
                <span className="font-mono text-5xl font-light text-white/10 transition-colors group-hover:text-accent-orange/30">
                  {p.num}
                </span>
                <motion.div
                  className="mb-6 mt-4 flex h-12 w-12 items-center justify-center bg-accent-orange"
                  whileHover={{ scale: 1.08, rotate: -4 }}
                >
                  <Icon className="h-6 w-6 text-white" />
                </motion.div>
                <h3 className="mb-3 text-xl font-semibold text-white">{p.title}</h3>
                <p className="text-sm leading-relaxed text-white/70">{p.description}</p>
              </motion.div>
            )
          })}
        </motion.div>
      </div>
    </section>
  )
}

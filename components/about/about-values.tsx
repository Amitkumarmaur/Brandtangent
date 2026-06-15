"use client"

import { motion } from "motion/react"
import {
  Globe,
  Heart,
  Lightbulb,
  Rocket,
  Shield,
  Target,
} from "lucide-react"

import { staggerContainer, staggerItem } from "@/components/about/about-motion"

const values = [
  {
    icon: Lightbulb,
    title: "Brand first",
    description:
      "We don't follow trends — we build category positions. Every engagement starts with strategy before it touches creative.",
    featured: true,
  },
  {
    icon: Target,
    title: "Results-driven",
    description:
      "Vanity metrics don't build brands. We obsess over recognition, conversion, and growth that compounds.",
  },
  {
    icon: Shield,
    title: "Radical transparency",
    description:
      "No smoke, no mirrors. You always know what we're building, why, and how it performs.",
  },
  {
    icon: Heart,
    title: "Client partnership",
    description:
      "We treat your brand like our own. We're not vendors — we're growth partners embedded in your success.",
  },
  {
    icon: Globe,
    title: "Global perspective",
    description:
      "From Silicon Valley to the Gulf, brand work is tuned to win across cultures, markets, and audiences.",
  },
  {
    icon: Rocket,
    title: "Speed & scale",
    description:
      "Identity systems and campaigns that launch fast and scale without friction. Compress years of growth into months.",
  },
]

export default function AboutValues() {
  return (
    <section
      id="values"
      className="relative overflow-hidden border-t border-border bg-background py-20 md:py-28"
    >
      <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="mb-14 lg:mb-16"
        >
          <div className="mb-4 flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-accent-orange" />
            <span className="micro-cap text-muted-foreground">What we stand for</span>
          </div>
          <h2 className="display-lg max-w-xl text-foreground">
            Principles we hire and fire on
          </h2>
        </motion.div>

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          className="grid auto-rows-fr grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 lg:gap-5"
        >
          {values.map((v) => {
            const Icon = v.icon
            const featured = "featured" in v && v.featured

            return (
              <motion.div
                key={v.title}
                variants={staggerItem}
                whileHover={{ y: -4 }}
                className={`group relative overflow-hidden border border-border bg-card p-8 transition-shadow hover:shadow-[var(--shadow-accent-orange-soft)] ${
                  featured
                    ? "md:col-span-2 lg:row-span-2 lg:flex lg:flex-col lg:justify-between lg:p-10"
                    : ""
                }`}
              >
                <motion.div
                  className="pointer-events-none absolute -right-8 -top-8 h-32 w-32 rounded-full bg-accent-orange/10 blur-2xl"
                  initial={{ opacity: 0 }}
                  whileHover={{ opacity: 1, scale: 1.2 }}
                />

                <div className={featured ? "relative z-10" : ""}>
                  <div className="mb-6 flex h-12 w-12 items-center justify-center border border-accent-orange/20 bg-accent-orange/10 transition-colors group-hover:bg-accent-orange group-hover:text-white">
                    <Icon className="h-6 w-6 text-accent-orange transition-colors group-hover:text-white" />
                  </div>
                  <h3
                    className={`mb-3 font-semibold text-foreground ${
                      featured ? "text-2xl md:text-3xl" : "text-xl"
                    }`}
                  >
                    {v.title}
                  </h3>
                  <p
                    className={`leading-relaxed text-muted-foreground ${
                      featured ? "max-w-lg text-base md:text-lg" : "text-base"
                    }`}
                  >
                    {v.description}
                  </p>
                </div>

                {featured ? (
                  <p className="relative z-10 mt-8 hidden font-mono text-xs uppercase tracking-[0.25em] text-muted-foreground lg:block">
                    Non-negotiable
                  </p>
                ) : null}
              </motion.div>
            )
          })}
        </motion.div>
      </div>
    </section>
  )
}

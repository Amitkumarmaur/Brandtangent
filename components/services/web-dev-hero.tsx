"use client"

import { motion } from "motion/react"
import { Code2, Zap, Shield, Gauge } from "lucide-react"

interface WebDevHeroProps {
  title?: string
  description?: string
  image?: string
  badge?: string
}

export default function WebDevHero({ title, description, image, badge }: WebDevHeroProps) {
  const features = [
    { icon: Zap, label: "Lightning Fast", text: "Optimized performance" },
    { icon: Shield, label: "Secure", text: "Enterprise-grade security" },
    { icon: Gauge, label: "Scalable", text: "Grows with your needs" },
  ]

  return (
    <section className="relative w-full py-16 md:py-20 bg-gradient-to-br from-white via-white to-secondary overflow-hidden border-b border-border">
      {/* Background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-br from-accent-orange/5 to-transparent rounded-full blur-3xl" />
      </div>

      <div className="w-full max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-12 items-start">

          {/* LEFT SIDE - CONTENT */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.5 }}
              className="flex items-center gap-2 mb-4"
            >
              <div className="w-8 h-8 rounded-full bg-accent-orange/10 flex items-center justify-center">
                <Code2 className="w-4 h-4 text-accent-orange" />
              </div>
              <span className="text-xs font-semibold text-accent-orange uppercase tracking-widest">{badge || "Development"}</span>
            </motion.div>

            {/* Heading */}
            <motion.h1
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15, duration: 0.6 }}
              className="display-xl text-foreground mb-3"
            >
              {title || "Web Development"}
            </motion.h1>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="text-sm md:text-base text-muted-foreground leading-[1.6] mb-6 max-w-md"
            >
              {description || "We engineer blazing-fast, scalable web apps using cutting-edge frameworks. Your website is your most powerful growth engine."}
            </motion.p>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25, duration: 0.6 }}
              className="flex gap-6 mb-6"
            >
              <div>
                <p className="display-md text-accent-orange">500+</p>
                <p className="text-xs text-muted-foreground mt-1">Projects</p>
              </div>
              <div className="w-px bg-border" />
              <div>
                <p className="display-md text-accent-orange">98%</p>
                <p className="text-xs text-muted-foreground mt-1">Satisfaction</p>
              </div>
            </motion.div>

            {/* CTA Button */}
            <motion.a
              href="#contact"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-flex items-center gap-2 px-5 h-10 rounded-[10px] font-semibold text-sm text-white bg-gradient-to-r from-primary to-ink-strong hover:shadow-[var(--shadow-accent-orange)] transition-all"
            >
              Start Project
              <Zap className="w-3.5 h-3.5" />
            </motion.a>
          </motion.div>

          {/* RIGHT SIDE - FEATURES CARDS */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="space-y-3"
          >
            {features.map((feature, idx) => {
              const Icon = feature.icon
              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.08, duration: 0.5 }}
                  className="rounded-md border border-border bg-gradient-to-br from-secondary to-white p-4 hover:border-accent-orange/30 hover:shadow-[rgba(83,58,253,0.1)_0_8px_20px] transition-all duration-300"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-full bg-accent-orange/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Icon className="w-5 h-5 text-accent-orange" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-foreground text-sm mb-0.5">{feature.label}</h3>
                      <p className="text-xs text-muted-foreground">{feature.text}</p>
                    </div>
                  </div>
                </motion.div>
              )
            })}

            {/* Extra info card */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.24, duration: 0.5 }}
              className="rounded-md border border-accent-orange/30 bg-gradient-to-br from-accent-orange/5 to-transparent p-4 mt-4"
            >
              <p className="text-xs text-foreground font-semibold">âœ“ Proven across industries</p>
              <p className="text-xs text-muted-foreground mt-1">From startups to enterprise</p>
            </motion.div>
          </motion.div>

        </div>
      </div>
    </section>
  )
}

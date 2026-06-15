"use client"

import { motion } from "motion/react"
import { Award, Star, Trophy, Zap } from "lucide-react"

const founders = [
  {
    initials: "AK",
    name: "Alex Kumar",
    role: "Strategy & Brand",
    color: "from-foreground to-ink-strong",
  },
  {
    initials: "SM",
    name: "Sophia Martinez",
    role: "Design Direction",
    color: "from-accent-blue/80 to-accent-blue",
  },
  {
    initials: "RP",
    name: "Rahul Patel",
    role: "Creative Lead",
    color: "from-accent-orange to-accent-yellow",
  },
]

const achievements = [
  { label: "Top team on Dribbble", badge: Award, stat: "#1" },
  { label: "Top 100 by Clutch", badge: Trophy, stat: "100" },
  { label: "5-star on GoodFirms", badge: Star, stat: "5.0" },
  { label: "100% Upwork success", badge: Zap, stat: "100%" },
]

export default function AboutLeadership() {
  return (
    <section className="relative overflow-hidden border-t border-border bg-secondary/30 py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-16 lg:grid-cols-12 lg:gap-10">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="lg:col-span-5"
          >
            <div className="mb-4 flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-accent-orange" />
              <span className="micro-cap text-muted-foreground">Leadership</span>
            </div>
            <h2 className="display-lg mb-8 text-foreground">
              Built by strategists.
              <br />
              Designed for founders.
            </h2>

            <p className="body-md mb-10 text-balance text-foreground lg:body-lg">
              Over <span className="font-semibold">12 years</span>, we&apos;ve crafted identities
              for <span className="font-semibold">500+ ambitious brands</span>. We don&apos;t just
              design — we strategize. From startup positioning to enterprise transformation, our
              approach is rooted in research, refined through craft, and proven through results.
            </p>

            <div className="space-y-3">
              {founders.map((founder, i) => (
                <motion.div
                  key={founder.initials}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.08 }}
                  whileHover={{ x: 6 }}
                  className="group flex items-center gap-5 border border-transparent py-3 transition-colors hover:border-border hover:bg-background"
                >
                  <div
                    className={`flex h-[4.5rem] w-[4.5rem] shrink-0 items-center justify-center bg-gradient-to-br ${founder.color} shadow-[var(--shadow-layered)] transition-transform group-hover:scale-105`}
                  >
                    <span className="text-lg font-semibold text-white">{founder.initials}</span>
                  </div>
                  <div>
                    <h3 className="text-base font-semibold text-foreground">{founder.name}</h3>
                    <p className="text-caption">{founder.role}</p>
                  </div>
                  <span className="ml-auto hidden font-mono text-xs text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100 md:inline">
                    0{i + 1}
                  </span>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <div className="lg:col-span-7">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {achievements.map((item, i) => {
                const Badge = item.badge
                return (
                  <motion.div
                    key={item.label}
                    initial={{ opacity: 0, y: 28, rotate: i % 2 === 0 ? -1 : 1 }}
                    whileInView={{ opacity: 1, y: 0, rotate: 0 }}
                    viewport={{ once: true, margin: "-40px" }}
                    transition={{ duration: 0.55, delay: i * 0.07 }}
                    whileHover={{ y: -6, scale: 1.02 }}
                    className={`group relative overflow-hidden border border-border bg-background p-7 shadow-[var(--shadow-1)] transition-shadow hover:border-accent-orange/30 hover:shadow-[var(--shadow-accent-orange-soft)] ${
                      i === 0 ? "sm:col-span-2 sm:flex sm:items-center sm:justify-between sm:gap-8" : ""
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex h-12 w-12 items-center justify-center bg-accent-orange/10 transition-colors group-hover:bg-accent-orange">
                        <Badge
                          className="h-6 w-6 text-accent-orange transition-colors group-hover:text-white"
                          strokeWidth={1.5}
                        />
                      </div>
                      {!item.stat.includes("#") && i !== 0 ? (
                        <span className="heading-md tnum text-accent-orange">{item.stat}</span>
                      ) : null}
                    </div>
                    <div className={i === 0 ? "sm:flex-1" : "mt-5"}>
                      {i === 0 ? (
                        <span className="tnum mb-1 block text-4xl font-light text-accent-orange">
                          {item.stat}
                        </span>
                      ) : null}
                      <p className="text-body font-medium">{item.label}</p>
                    </div>
                    <motion.div
                      className="absolute bottom-0 left-0 h-0.5 bg-accent-orange"
                      initial={{ width: 0 }}
                      whileInView={{ width: "100%" }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: 0.3 + i * 0.05 }}
                    />
                  </motion.div>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

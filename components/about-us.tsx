"use client"

import { motion } from "motion/react"
import { Award, Trophy, Star, Zap } from "lucide-react"
import { SectionHeader } from "@/components/motion/section-reveal"
import { TiltCard } from "@/components/motion/tilt-card"

const achievements = [
  {
    label: "Top Team in the world on Dribbble",
    badge: <Award className="w-6 h-6 text-accent-orange" strokeWidth={1.5} />,
    stat: "#1",
  },
  {
    label: "Top 100 Global Service Providers by Clutch",
    badge: <Trophy className="w-6 h-6 text-accent-orange" strokeWidth={1.5} />,
    stat: "100",
  },
  {
    label: "5 Stars Rating on GoodFirms",
    badge: <Star className="w-6 h-6 text-accent-orange" strokeWidth={1.5} />,
    stat: "5.0",
  },
  {
    label: "100% Job Success on Upwork",
    badge: <Zap className="w-6 h-6 text-accent-orange" strokeWidth={1.5} />,
    stat: "100%",
  },
]

const founders = [
  { initials: "AK", name: "Alex Kumar", role: "Strategy & Brand", color: "from-primary to-ink-strong" },
  { initials: "SM", name: "Sophia Martinez", role: "Design Direction", color: "from-accent-blue/80 to-accent-blue" },
  { initials: "RP", name: "Rahul Patel", role: "Creative Lead", color: "from-accent-orange to-accent-yellow" },
]

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
}

export default function AboutUs() {
  return (
    <section className="bg-background py-16 md:py-20 w-full overflow-hidden border-t border-border">
      <div className="max-w-7xl mx-auto w-full px-6 lg:px-8">
        <SectionHeader
          eyebrow="Leadership"
          title={
            <>
              Built by strategists.
              <br />
              Designed for founders.
            </>
          }
          className="mb-16 md:mb-20"
        />

        {/* Founders + Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start mb-24">

          {/* Left â€” Founders Cards */}
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="lg:col-span-4 flex flex-col gap-4"
          >
            {founders.map((founder, i) => (
              <motion.div
                key={founder.initials}
                initial={{ opacity: 0, x: -16 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.6, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }}
                className="group p-4 rounded-md hover:bg-secondary transition-colors duration-300"
              >
                <div className="flex items-center gap-4">
                  {/* Avatar */}
                  <div className={`w-16 h-16 rounded-md bg-gradient-to-br ${founder.color} flex items-center justify-center flex-shrink-0 shadow-[var(--shadow-layered)] group-hover:shadow-[var(--shadow-layered-strong)] transition-shadow duration-300`}>
                    <span className="text-white font-semibold text-[18px]">{founder.initials}</span>
                  </div>
                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <h3 className="text-[16px] font-semibold text-foreground leading-tight">{founder.name}</h3>
                    <p className="text-[13px] text-muted-foreground font-normal leading-tight mt-0.5">{founder.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Right â€” About + Achievements */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.7, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
            className="lg:col-span-8"
          >
            {/* About paragraph */}
            <div className="mb-12">
              <p className="body-md lg:body-lg text-balance text-foreground">
                Over <span className="font-semibold">12 years</span>, we&apos;ve crafted identities for <span className="font-semibold">500+ ambitious brands</span>. We don&apos;t just designâ€”we strategize. From startup positioning to enterprise transformation, our approach is rooted in research, refined through craft, and proven through results.
              </p>
            </div>

            {/* Achievements Grid */}
            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-60px" }}
              className="grid grid-cols-2 gap-5"
            >
              {achievements.map((item, index) => (
                <motion.div key={item.label} variants={itemVariants}>
                  <TiltCard intensity={6}>
                    <div className="group h-full bg-gradient-to-br from-secondary to-background border border-border rounded-md p-6 hover:border-primary/30 hover:shadow-[var(--shadow-2)] transition-all duration-300 cursor-default">
                      <div className="flex items-start gap-3 mb-6">
                        <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0 group-hover:bg-primary/15 transition-colors">
                          {item.badge}
                        </div>
                        <span className="heading-md text-primary tnum">{item.stat}</span>
                      </div>
                      <p className="text-body">{item.label}</p>
                    </div>
                  </TiltCard>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>

      </div>
    </section>
  )
}

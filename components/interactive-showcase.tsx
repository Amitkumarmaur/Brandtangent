"use client"

import { useRef } from "react"
import { motion, useScroll, useTransform, useInView } from "motion/react"
import { TrendingUp, Users, Zap, BarChart3 } from "lucide-react"

const showcaseItems = [
  {
    icon: TrendingUp,
    industry: "InsureTech",
    metric: "+340%",
    title: "Lead Conversion",
    description: "Automated claims processing increased qualified leads by 340%",
  },
  {
    icon: Users,
    industry: "FinTech",
    metric: "2.5x",
    title: "Customer Acquisition",
    description: "AI-powered onboarding reduced drop-off by 60%",
  },
  {
    icon: Zap,
    industry: "SaaS",
    metric: "85%",
    title: "Time Saved",
    description: "Marketing automation freed 85% of team capacity",
  },
  {
    icon: BarChart3,
    industry: "Ecommerce",
    metric: "$1.2M",
    title: "Revenue Recovered",
    description: "Cart abandonment automation recovered $1.2M annually",
  },
]

export default function InteractiveShowcase() {
  const containerRef = useRef<HTMLDivElement>(null)
  const isInView = useInView(containerRef, { once: true, margin: "-100px" })

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  })

  const rotate = useTransform(scrollYProgress, [0, 1], [0, 15])

  return (
    <section ref={containerRef} id="solutions" className="py-16 md:py-20 bg-white relative overflow-hidden">
      {/* Background gradient mesh */}
      <div className="absolute inset-0 gradient-mesh opacity-50" />

      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="display-lg text-foreground text-balance">
            Experience Intelligence in Motion
          </h2>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
            Discover how our AI-powered automations transform industries
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {showcaseItems.map((item, index) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 60, rotateY: 20 }}
              animate={isInView ? { opacity: 1, y: 0, rotateY: 0 } : {}}
              transition={{ duration: 0.6, delay: index * 0.15 }}
              style={{ rotateY: rotate }}
              whileHover={{
                scale: 1.05,
                boxShadow: "0 20px 40px rgba(255, 87, 34, 0.15)",
              }}
              className="group relative bg-white rounded-md p-6 border border-border hover:border-accent-orange/30 transition-all duration-300 cursor-pointer"
            >
              {/* Glow effect on hover */}
              <div className="absolute inset-0 rounded-md bg-gradient-to-br from-accent-orange/0 to-accent-orange/0 group-hover:from-accent-orange/5 group-hover:to-transparent transition-all duration-300" />

              <div className="relative z-10">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-medium text-muted-foreground bg-secondary px-3 py-1 rounded-full">
                    {item.industry}
                  </span>
                  <item.icon className="w-5 h-5 text-accent-orange" />
                </div>

                <div className="mb-4">
                  <span className="display-md text-foreground group-hover:text-accent-orange transition-colors">
                    {item.metric}
                  </span>
                  <p className="text-sm font-medium text-body mt-1">{item.title}</p>
                </div>

                <p className="text-sm text-muted-foreground">{item.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

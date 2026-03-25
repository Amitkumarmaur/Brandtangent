"use client"

import { useRef } from "react"
import { motion, useInView } from "framer-motion"
import { Brain, Workflow, LineChart, Mail, Target, Cog, ArrowRight } from "lucide-react"

const services = [
  {
    icon: Brain,
    title: "AI Integration",
    description: "Seamlessly integrate AI into your marketing stack for smarter, faster decisions.",
    link: "#",
  },
  {
    icon: Workflow,
    title: "Marketing Automation",
    description: "End-to-end automation that runs your campaigns while you focus on strategy.",
    link: "#",
  },
  {
    icon: LineChart,
    title: "Predictive Analytics",
    description: "AI-powered insights that anticipate customer behavior and market trends.",
    link: "#",
  },
  {
    icon: Mail,
    title: "Email Intelligence",
    description: "Smart email sequences that adapt and personalize in real-time.",
    link: "#",
  },
  {
    icon: Target,
    title: "Lead Scoring",
    description: "Machine learning models that identify your highest-value prospects.",
    link: "#",
  },
  {
    icon: Cog,
    title: "Custom Solutions",
    description: "Bespoke automation systems built for your unique business needs.",
    link: "#",
  },
]

export default function ServicesGrid() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  return (
    <section ref={ref} id="services" className="py-16 md:py-20 bg-grey-100">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-5xl font-bold text-foreground text-balance">Automation That Delivers</h2>
          <p className="mt-4 text-lg text-grey-400 max-w-2xl mx-auto">
            Comprehensive AI-powered solutions designed to scale your marketing
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 40 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -8 }}
              className="group relative bg-white rounded-2xl p-8 border border-grey-200 hover:border-ignite-orange/30 transition-all duration-300 cursor-pointer overflow-hidden"
            >
                {/* Orange accent line on top */}
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-ignite-orange to-ignite-orange/50 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />

                <div className="relative z-10">
                  <div className="w-14 h-14 bg-grey-100 rounded-xl flex items-center justify-center mb-6 group-hover:bg-ignite-orange/10 transition-colors">
                    <service.icon className="w-7 h-7 text-foreground group-hover:text-ignite-orange transition-colors" />
                  </div>

                  <h3 className="text-xl font-bold text-foreground mb-3">{service.title}</h3>
                  <p className="text-grey-400 mb-6">{service.description}</p>

                  <a
                    href={service.link}
                    className="inline-flex items-center text-sm font-medium text-ignite-orange group-hover:gap-2 transition-all"
                  >
                    Explore
                    <ArrowRight className="ml-1 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </a>
                </div>
              </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

"use client"

import { useRef } from "react"
import { motion, useInView } from "framer-motion"

const team = [
  { name: "Alex Rivera", role: "CEO & Founder", image: "/professional-headshot-man-ceo.jpg" },
  { name: "Sarah Chen", role: "CTO", image: "/professional-headshot-woman-cto-tech.jpg" },
  { name: "Michael Torres", role: "Head of AI", image: "/professional-headshot-man-ai-scientist.jpg" },
  { name: "Emma Watson", role: "VP Marketing", image: "/professional-headshot-woman-marketing-executive.jpg" },
  { name: "David Park", role: "Lead Engineer", image: "/professional-headshot-man-software-engineer.jpg" },
  { name: "Lisa Johnson", role: "Client Success", image: "/professional-headshot-woman-customer-success.jpg" },
]

export default function TeamSection() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  return (
    <section ref={ref} id="about" className="py-24 bg-[#F8F8F8]">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-5xl font-bold text-[#0A0A0A] text-balance">Built by Automation Architects</h2>
          <p className="mt-4 text-lg text-[#7D7D7D] max-w-2xl mx-auto">
            A team of experts passionate about transforming businesses through AI
          </p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {team.map((member, index) => (
            <motion.div
              key={member.name}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={isInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group relative"
            >
              <div className="relative overflow-hidden rounded-2xl aspect-square">
                <img
                  src={member.image || "/placeholder.svg"}
                  alt={member.name}
                  className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A]/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                  <p className="font-bold text-white text-sm">{member.name}</p>
                  <p className="text-[#E5E5E5] text-xs">{member.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

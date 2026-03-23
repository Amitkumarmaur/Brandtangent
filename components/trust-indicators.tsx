"use client"

import { motion } from "framer-motion"
import { useInView } from "framer-motion"
import { useRef } from "react"

const stats = [
  { value: "127", label: "Automations Running" },
  { value: "$2.4M", label: "Revenue Generated" },
  { value: "94%", label: "Time Saved" },
]

const clients = ["Stripe", "Notion", "Linear", "Vercel", "Supabase", "Clerk"]

export default function TrustIndicators() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true })

  return (
    <section ref={ref} className="py-16 bg-[#F8F8F8] border-y border-[#E5E5E5]">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Stats Ticker */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.8 }}
          className="flex flex-wrap justify-center gap-8 md:gap-16 mb-12"
        >
          {stats.map((stat, index) => (
            <div key={stat.label} className="text-center">
              <motion.span
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="text-2xl md:text-3xl font-bold text-[#FF5722]"
              >
                {stat.value}
              </motion.span>
              <p className="text-sm text-[#7D7D7D] mt-1">{stat.label}</p>
            </div>
          ))}
        </motion.div>

        {/* Client Logos */}
        <div className="overflow-hidden">
          <motion.div
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="flex justify-center items-center gap-12 flex-wrap"
          >
            {clients.map((client) => (
              <div
                key={client}
                className="grayscale hover:grayscale-0 transition-all duration-300 opacity-50 hover:opacity-100"
              >
                <div className="h-8 px-4 flex items-center justify-center bg-[#E5E5E5] rounded-md">
                  <span className="text-[#4A4A4A] font-medium text-sm">{client}</span>
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  )
}

"use client"

import { useRef } from "react"
import { motion, useInView } from "framer-motion"

const technologies = {
  "AI/ML": ["OpenAI", "TensorFlow", "PyTorch", "Hugging Face"],
  Automation: ["Zapier", "Make", "n8n", "Workato"],
  Analytics: ["Mixpanel", "Amplitude", "Segment", "Looker"],
  Platforms: ["Salesforce", "HubSpot", "Marketo", "Intercom"],
}

export default function TechnologyStack() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  return (
    <section ref={ref} className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-5xl font-bold text-[#0A0A0A] text-balance">
            Powered by Best-in-Class Technology
          </h2>
          <p className="mt-4 text-lg text-[#7D7D7D] max-w-2xl mx-auto">We integrate with the tools you already love</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {Object.entries(technologies).map(([category, tools], categoryIndex) => (
            <motion.div
              key={category}
              initial={{ opacity: 0, y: 40 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: categoryIndex * 0.1 }}
              className="bg-[#F8F8F8] rounded-2xl p-6"
            >
              <h3 className="text-lg font-bold text-[#0A0A0A] mb-6">{category}</h3>
              <div className="space-y-3">
                {tools.map((tool, toolIndex) => (
                  <motion.div
                    key={tool}
                    initial={{ opacity: 0, filter: "blur(10px)" }}
                    animate={isInView ? { opacity: 1, filter: "blur(0px)" } : {}}
                    transition={{ duration: 0.5, delay: categoryIndex * 0.1 + toolIndex * 0.05 }}
                    whileHover={{ x: 4 }}
                    className="flex items-center gap-3 p-3 bg-white rounded-xl hover:shadow-md transition-all cursor-pointer"
                  >
                    <div className="w-8 h-8 bg-[#E5E5E5] rounded-lg flex items-center justify-center">
                      <span className="text-xs font-bold text-[#4A4A4A]">{tool.charAt(0)}</span>
                    </div>
                    <span className="text-sm font-medium text-[#4A4A4A]">{tool}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

"use client"

import { useRef } from "react"
import { motion, useInView } from "framer-motion"
import { ArrowRight, Quote } from "lucide-react"

const caseStudies = [
  {
    company: "SecureLife Insurance",
    industry: "InsureTech",
    metric: "+340%",
    metricLabel: "Lead Conversion",
    quote: "DigiiMark's automation transformed our entire sales process. We now close deals 3x faster.",
    author: "Sarah Chen",
    role: "VP of Marketing",
  },
  {
    company: "PayFlow",
    industry: "FinTech",
    metric: "2.5x",
    metricLabel: "Customer Acquisition",
    quote: "The AI-powered personalization increased our activation rate dramatically.",
    author: "Michael Torres",
    role: "Growth Director",
  },
  {
    company: "StyleHub",
    industry: "Ecommerce",
    metric: "$1.2M",
    metricLabel: "Revenue Recovered",
    quote: "Cart abandonment recovery alone paid for our entire automation investment.",
    author: "Emma Watson",
    role: "Head of Digital",
  },
  {
    company: "CloudSync Pro",
    industry: "SaaS",
    metric: "85%",
    metricLabel: "Time Saved",
    quote: "Our team now focuses on strategy while DigiiMark handles the execution.",
    author: "David Park",
    role: "CMO",
  },
]

export default function CaseStudyCarousel() {
  const containerRef = useRef<HTMLDivElement>(null)
  const isInView = useInView(containerRef, { once: true, margin: "-100px" })

  return (
    <section ref={containerRef} className="py-24 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-5xl font-bold text-[#0A0A0A] text-balance">Transformations That Matter</h2>
          <p className="mt-4 text-lg text-[#7D7D7D] max-w-2xl mx-auto">
            See how leading companies achieved remarkable results with our automation
          </p>
        </motion.div>
      </div>

      {/* Horizontal Scroll */}
      <div className="overflow-x-auto scrollbar-hide">
        <motion.div
          initial={{ opacity: 0, x: 100 }}
          animate={isInView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="flex gap-6 px-6 lg:px-8 pb-8"
          style={{ minWidth: "max-content" }}
        >
          {caseStudies.map((study, index) => (
            <motion.div
              key={study.company}
              initial={{ opacity: 0, y: 40 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -8 }}
              className="group w-[400px] bg-[#F8F8F8] rounded-3xl p-8 flex-shrink-0 cursor-pointer transition-all duration-300 hover:shadow-xl"
            >
              <div className="flex items-center justify-between mb-6">
                <span className="text-xs font-medium text-[#7D7D7D] bg-white px-3 py-1 rounded-full">
                  {study.industry}
                </span>
                <Quote className="w-8 h-8 text-[#E5E5E5]" />
              </div>

              <div className="mb-6">
                <span className="text-4xl font-bold text-[#FF5722]">{study.metric}</span>
                <p className="text-sm text-[#7D7D7D] mt-1">{study.metricLabel}</p>
              </div>

              <h3 className="text-xl font-bold text-[#0A0A0A] mb-4">{study.company}</h3>

              <p className="text-[#4A4A4A] mb-6 italic">&ldquo;{study.quote}&rdquo;</p>

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-[#0A0A0A]">{study.author}</p>
                  <p className="text-sm text-[#7D7D7D]">{study.role}</p>
                </div>
                <span className="flex items-center gap-1 text-sm font-medium text-[#FF5722] opacity-0 group-hover:opacity-100 transition-opacity">
                  View Full Story
                  <ArrowRight className="w-4 h-4" />
                </span>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}

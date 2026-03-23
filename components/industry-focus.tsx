"use client"

import { useState, useRef } from "react"
import { motion, useInView, AnimatePresence } from "framer-motion"
import { Shield, CreditCard, ShoppingCart, Cloud } from "lucide-react"

const industries = [
  {
    id: "insuretech",
    name: "InsureTech",
    icon: Shield,
    metrics: { leads: "+340%", conversion: "45%", time: "2 weeks" },
    caseStudy: {
      company: "SecureLife Insurance",
      quote: "DigiiMark transformed our lead generation. We now close 3x more policies with half the effort.",
      result: "340% increase in qualified leads",
    },
  },
  {
    id: "fintech",
    name: "FinTech",
    icon: CreditCard,
    metrics: { leads: "+280%", conversion: "52%", time: "3 weeks" },
    caseStudy: {
      company: "PayFlow",
      quote: "The AI-powered customer journey automation doubled our user activation rate.",
      result: "2.5x customer acquisition improvement",
    },
  },
  {
    id: "ecommerce",
    name: "Ecommerce",
    icon: ShoppingCart,
    metrics: { leads: "+195%", conversion: "38%", time: "1 week" },
    caseStudy: {
      company: "StyleHub",
      quote: "Cart abandonment recovery alone generated $1.2M in recovered revenue.",
      result: "$1.2M annual revenue recovered",
    },
  },
  {
    id: "saas",
    name: "SaaS",
    icon: Cloud,
    metrics: { leads: "+420%", conversion: "61%", time: "4 weeks" },
    caseStudy: {
      company: "CloudSync Pro",
      quote: "Our marketing team now focuses on strategy while automation handles execution.",
      result: "85% time saved on repetitive tasks",
    },
  },
]

export default function IndustryFocus() {
  const [activeIndustry, setActiveIndustry] = useState(industries[0])
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  return (
    <section ref={ref} id="industries" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-5xl font-bold text-[#0A0A0A] text-balance">
            Precision-Built for Your Industry
          </h2>
          <p className="mt-4 text-lg text-[#7D7D7D] max-w-2xl mx-auto">
            Specialized automation strategies tailored to your sector&apos;s unique challenges
          </p>
        </motion.div>

        {/* Tab Navigation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex flex-wrap justify-center gap-4 mb-12"
        >
          {industries.map((industry) => (
            <button
              key={industry.id}
              onClick={() => setActiveIndustry(industry)}
              className={`flex items-center gap-2 px-6 py-3 rounded-full transition-all duration-300 ${
                activeIndustry.id === industry.id
                  ? "bg-[#0A0A0A] text-white"
                  : "bg-[#F8F8F8] text-[#4A4A4A] hover:bg-[#E5E5E5]"
              }`}
            >
              <industry.icon className="w-5 h-5" />
              {industry.name}
            </button>
          ))}
        </motion.div>

        {/* Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeIndustry.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center"
          >
            {/* Metrics */}
            <div className="bg-[#F8F8F8] rounded-3xl p-8">
              <h3 className="text-2xl font-bold text-[#0A0A0A] mb-8">Key Metrics</h3>
              <div className="space-y-6">
                <div className="flex justify-between items-center p-4 bg-white rounded-xl">
                  <span className="text-[#7D7D7D]">Lead Growth</span>
                  <span className="text-2xl font-bold text-[#FF5722]">{activeIndustry.metrics.leads}</span>
                </div>
                <div className="flex justify-between items-center p-4 bg-white rounded-xl">
                  <span className="text-[#7D7D7D]">Conversion Rate</span>
                  <span className="text-2xl font-bold text-[#10B981]">{activeIndustry.metrics.conversion}</span>
                </div>
                <div className="flex justify-between items-center p-4 bg-white rounded-xl">
                  <span className="text-[#7D7D7D]">Time to Results</span>
                  <span className="text-2xl font-bold text-[#0A0A0A]">{activeIndustry.metrics.time}</span>
                </div>
              </div>
            </div>

            {/* Case Study */}
            <div className="bg-[#0A0A0A] rounded-3xl p-8 text-white">
              <div className="flex items-center gap-3 mb-6">
                <activeIndustry.icon className="w-8 h-8 text-[#FF5722]" />
                <span className="text-[#7D7D7D]">{activeIndustry.name} Success Story</span>
              </div>
              <h3 className="text-2xl font-bold mb-4">{activeIndustry.caseStudy.company}</h3>
              <blockquote className="text-[#E5E5E5] text-lg mb-6 italic">
                &ldquo;{activeIndustry.caseStudy.quote}&rdquo;
              </blockquote>
              <div className="bg-[#1A1A1A] rounded-xl p-4">
                <span className="text-[#FF5722] font-bold text-xl">{activeIndustry.caseStudy.result}</span>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  )
}

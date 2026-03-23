"use client"

import { useRef } from "react"
import { motion, useInView } from "framer-motion"
import { Button } from "@/components/ui/button"
import { ArrowRight, Calculator } from "lucide-react"

export default function CTASection() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  return (
    <section ref={ref} className="py-32 bg-[#0A0A0A] relative overflow-hidden">
      {/* Gradient mesh background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-[#FF5722]/10 via-transparent to-[#10B981]/5" />
        <div className="absolute inset-0 grid-pattern" />
      </div>

      {/* Animated particles */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-[#FF5722]/20 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -100, 0],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Number.POSITIVE_INFINITY,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      <div className="max-w-4xl mx-auto px-6 lg:px-8 relative z-10 text-center">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-4xl md:text-6xl font-bold text-white text-balance">Ready to Scale Without Limits?</h2>
          <p className="mt-6 text-xl text-[#7D7D7D] max-w-2xl mx-auto">
            Join the companies transforming their marketing with AI-powered automation
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mt-12 flex flex-col sm:flex-row gap-4 justify-center"
        >
          <Button
            size="lg"
            className="bg-[#FF5722] hover:bg-[#FF5722]/90 text-white px-8 py-6 rounded-full text-base font-medium group transition-all hover:scale-105"
          >
            Book Strategic Session
            <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="border-[#4A4A4A] text-white px-8 py-6 rounded-full text-base font-medium hover:bg-[#1A1A1A] transition-all bg-transparent"
          >
            <Calculator className="mr-2 w-5 h-5" />
            Try ROI Calculator
          </Button>
        </motion.div>
      </div>
    </section>
  )
}

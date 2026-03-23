"use client"

import { useRef } from "react"
import { motion, useInView } from "framer-motion"
import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import NetworkGraph from "./three/network-graph"

export default function InnovationLab() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  return (
    <section ref={ref} className="py-24 bg-[#F8F8F8] overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Text Content */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8 }}
          >
            <span className="text-[#FF5722] font-medium text-sm uppercase tracking-wider">Innovation Lab</span>
            <h2 className="text-3xl md:text-5xl font-bold text-[#0A0A0A] mt-4 text-balance">
              See Your Marketing Transform in Real-Time
            </h2>
            <p className="mt-6 text-lg text-[#7D7D7D]">
              Our interactive lab visualizes how AI connects every touchpoint in your marketing ecosystem, creating a
              unified system that learns and adapts continuously.
            </p>
            <ul className="mt-8 space-y-4">
              {["Real-time data flow visualization", "AI decision pathways", "Integration health monitoring"].map(
                (item) => (
                  <li key={item} className="flex items-center gap-3 text-[#4A4A4A]">
                    <div className="w-2 h-2 bg-[#FF5722] rounded-full" />
                    {item}
                  </li>
                ),
              )}
            </ul>
            <Button
              size="lg"
              className="mt-8 bg-[#0A0A0A] hover:bg-[#1A1A1A] text-white px-8 py-6 rounded-full text-base font-medium group"
            >
              Explore the Lab
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Button>
          </motion.div>

          {/* 3D Network Graph */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="h-[500px] rounded-3xl overflow-hidden bg-[#0A0A0A]"
          >
            <NetworkGraph />
          </motion.div>
        </div>
      </div>
    </section>
  )
}

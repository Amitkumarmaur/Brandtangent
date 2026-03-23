"use client"

import { useRef } from "react"
import { motion, useScroll, useTransform } from "framer-motion"
import { Button } from "@/components/ui/button"
import { ArrowRight, Calculator } from "lucide-react"

function AnimatedBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* Base gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-white via-[#FFF8F5] to-[#FFF0EB]" />

      {/* Grid pattern */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `linear-gradient(#0A0A0A 1px, transparent 1px), linear-gradient(90deg, #0A0A0A 1px, transparent 1px)`,
          backgroundSize: "60px 60px",
        }}
      />

      {/* Animated gradient orbs */}
      <motion.div
        className="absolute -top-40 -right-40 w-[600px] h-[600px] rounded-full"
        style={{
          background: "radial-gradient(circle, rgba(255,87,34,0.08) 0%, transparent 70%)",
        }}
        animate={{
          scale: [1, 1.1, 1],
          opacity: [0.5, 0.8, 0.5],
        }}
        transition={{
          duration: 8,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
        }}
      />
      <motion.div
        className="absolute -bottom-60 -left-40 w-[800px] h-[800px] rounded-full"
        style={{
          background: "radial-gradient(circle, rgba(255,87,34,0.05) 0%, transparent 70%)",
        }}
        animate={{
          scale: [1.1, 1, 1.1],
          opacity: [0.3, 0.6, 0.3],
        }}
        transition={{
          duration: 10,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
        }}
      />

      {/* Floating geometric shapes */}
      <motion.div
        className="absolute top-20 right-[20%] w-20 h-20 border border-[#FF5722]/20 rounded-2xl"
        animate={{
          y: [0, -20, 0],
          rotate: [0, 45, 0],
        }}
        transition={{
          duration: 6,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
        }}
      />
      <motion.div
        className="absolute top-40 left-[15%] w-12 h-12 bg-[#FF5722]/5 rounded-full"
        animate={{
          y: [0, 15, 0],
          x: [0, 10, 0],
        }}
        transition={{
          duration: 5,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
        }}
      />
      <motion.div
        className="absolute bottom-40 right-[25%] w-16 h-16 border border-[#0A0A0A]/10 rotate-45"
        animate={{
          y: [0, -15, 0],
          rotate: [45, 90, 45],
        }}
        transition={{
          duration: 7,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
        }}
      />
      <motion.div
        className="absolute bottom-60 left-[20%] w-8 h-8 bg-[#FF5722]/10 rounded-full"
        animate={{
          scale: [1, 1.5, 1],
          opacity: [0.5, 1, 0.5],
        }}
        transition={{
          duration: 4,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
        }}
      />

      {/* Accent lines */}
      <svg className="absolute inset-0 w-full h-full opacity-[0.03]" xmlns="http://www.w3.org/2000/svg">
        <motion.line
          x1="0%"
          y1="30%"
          x2="100%"
          y2="70%"
          stroke="#FF5722"
          strokeWidth="1"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 2, delay: 0.5 }}
        />
        <motion.line
          x1="100%"
          y1="20%"
          x2="0%"
          y2="80%"
          stroke="#0A0A0A"
          strokeWidth="1"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 2, delay: 0.8 }}
        />
      </svg>
    </div>
  )
}

export default function HeroSection() {
  const containerRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  })

  const y = useTransform(scrollYProgress, [0, 1], [0, 200])
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0])

  return (
    <section
      ref={containerRef}
      className="relative min-h-screen flex items-center justify-center pt-20 overflow-hidden"
    >
      <AnimatedBackground />

      {/* Content */}
      <motion.div style={{ y, opacity }} className="relative z-20 max-w-7xl mx-auto px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-6"
        >
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#FF5722]/10 text-[#FF5722] text-sm font-medium">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#FF5722] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#FF5722]"></span>
            </span>
            AI-Powered Marketing Automation
          </span>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-[#0A0A0A] leading-tight tracking-tight text-balance max-w-5xl mx-auto">
            We engineer intelligent marketing systems that{" "}
            <span className="relative">
              <span className="text-[#FF5722]">scale without limits</span>
              <motion.svg
                className="absolute -bottom-2 left-0 w-full"
                viewBox="0 0 300 12"
                fill="none"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 1, delay: 1 }}
              >
                <motion.path
                  d="M2 8C50 2 100 2 150 6C200 10 250 4 298 8"
                  stroke="#FF5722"
                  strokeWidth="3"
                  strokeLinecap="round"
                  fill="none"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 1, delay: 1 }}
                />
              </motion.svg>
            </span>
          </h1>
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mt-8 text-lg md:text-xl text-[#7D7D7D] max-w-2xl mx-auto text-pretty"
        >
          AI-first automation that transforms how B2B companies grow. Drive more leads, close faster, and scale your
          revenue engine.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mt-12 flex flex-col sm:flex-row gap-4 justify-center"
        >
          <Button
            size="lg"
            className="bg-[#FF5722] hover:bg-[#FF5722]/90 text-white px-8 py-6 rounded-full text-base font-medium group transition-all hover:scale-105 shadow-lg shadow-[#FF5722]/25"
          >
            See It In Action
            <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="border-[#E5E5E5] text-[#0A0A0A] px-8 py-6 rounded-full text-base font-medium hover:bg-[#F8F8F8] transition-all bg-white/80 backdrop-blur-sm"
          >
            <Calculator className="mr-2 w-5 h-5" />
            Calculate Your ROI
          </Button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="mt-16 flex flex-col items-center gap-4"
        >
          <div className="flex -space-x-3">
            {[1, 2, 3, 4, 5].map((i) => (
              <div
                key={i}
                className="w-10 h-10 rounded-full bg-gradient-to-br from-[#E5E5E5] to-[#C4C4C4] border-2 border-white flex items-center justify-center text-xs font-medium text-[#7D7D7D]"
              >
                {String.fromCharCode(64 + i)}
              </div>
            ))}
          </div>
          <p className="text-sm text-[#7D7D7D]">
            Trusted by <span className="text-[#0A0A0A] font-medium">500+</span> B2B companies worldwide
          </p>
        </motion.div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
          className="w-6 h-10 border-2 border-[#E5E5E5] rounded-full flex justify-center bg-white/50 backdrop-blur-sm"
        >
          <motion.div
            animate={{ y: [0, 12, 0] }}
            transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
            className="w-1.5 h-3 bg-[#FF5722] rounded-full mt-2"
          />
        </motion.div>
      </motion.div>
    </section>
  )
}

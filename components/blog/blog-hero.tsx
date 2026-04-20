"use client"

import { motion } from "framer-motion"

export default function BlogHero() {
  return (
    <section className="relative w-full pt-32 pb-16 md:pt-40 md:pb-20 bg-background overflow-hidden border-t border-grey-200">
      
      {/* Subtle Grid Pattern Overlay */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage: "linear-gradient(#0A0A0A 1px, transparent 1px), linear-gradient(90deg, #0A0A0A 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }}
      />

      <div className="w-full max-w-7xl mx-auto px-6 lg:px-8 relative z-10 text-center">
        
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex flex-col items-center"
        >
          {/* Eyebrow Label */}
          <div className="flex items-center gap-2 mb-6">
            <div className="w-2 h-2 rounded-full bg-ignite-orange" />
            <span className="text-eyebrow text-ignite-orange">
              Insights & Articles
            </span>
          </div>
          
          {/* Main Heading H1 */}
          <h1 className="heading-display text-foreground max-w-4xl tracking-tight mb-6">
            THOUGHTS, STRATEGIES <br className="hidden md:block"/> & SYSTEMS
          </h1>
          
          {/* Subtitle */}
          <p className="text-subtitle max-w-2xl mx-auto text-balance">
            Explore our latest thinking on AI-first marketing, automation playbooks, and strategies to scale your B2B growth engine without limits.
          </p>
        </motion.div>
        
      </div>
    </section>
  )
}

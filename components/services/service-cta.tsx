"use client"

import { motion } from "framer-motion"
import { ArrowRight, Zap } from "lucide-react"

interface ServiceCTAProps {
  title: string
  subtitle: string
  buttonText: string
}

export default function ServiceCTA({ title, subtitle, buttonText }: ServiceCTAProps) {
  return (
    <section id="contact" className="relative w-full py-16 md:py-20 bg-foreground overflow-hidden">
      {/* Gradient glows */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] bg-ignite-orange/10 rounded-full blur-[160px]" />
      </div>

      {/* Top border glow */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-ignite-orange/30 to-transparent" />

      <div className="max-w-4xl mx-auto px-6 lg:px-8 relative z-10 text-center">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <div className="w-16 h-16 bg-ignite-orange/10 rounded-2xl flex items-center justify-center mx-auto mb-8 border border-ignite-orange/20">
            <Zap className="w-8 h-8 text-ignite-orange" />
          </div>

          <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
            {title}
          </h2>
          <p className="text-lg md:text-xl text-white/50 max-w-2xl mx-auto mb-10 leading-relaxed">
            {subtitle}
          </p>

          <a
            href="#"
            className="group inline-flex items-center gap-3 bg-ignite-orange hover:bg-ignite-orange/90 text-white px-10 py-5 rounded-full font-bold text-lg transition-all shadow-[0_4px_30px_rgba(255,87,34,0.3)] hover:shadow-[0_8px_40px_rgba(255,87,34,0.4)] hover:scale-[1.02]"
          >
            {buttonText}
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </a>

          <p className="mt-6 text-white/30 text-sm">No commitment needed. Let&apos;s just talk.</p>
        </motion.div>
      </div>
    </section>
  )
}

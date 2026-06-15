"use client"

import { motion } from "motion/react"
import type { Platform } from "@/lib/supabase"
import TechGlobe from "@/components/tech-globe"
import TechMarquee from "@/components/tech-marquee"
import { SectionHeader } from "@/components/motion/section-reveal"

export default function TrustIndicatorsView({ platforms }: { platforms: Platform[] }) {
  return (
    <section className="relative w-full py-16 md:py-20 bg-background overflow-hidden flex flex-col items-center border-t border-border">
      <div className="w-full max-w-7xl mx-auto px-6 lg:px-8 relative z-10 flex flex-col items-center">
        <SectionHeader
          align="center"
          eyebrow="Our tech stack"
          title="Fuelled 500+ brands with next-gen tools"
          className="mb-8"
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          className="relative w-full h-[220px] sm:h-[260px] md:h-[300px] lg:h-[340px] mt-2 mb-6 flex justify-center items-end overflow-hidden"
        >
          <div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-[35%] w-[300px] h-[300px] sm:w-[380px] sm:h-[380px] md:w-[420px] md:h-[420px] lg:w-[460px] lg:h-[460px] z-0 pointer-events-none rounded-full overflow-hidden"
            style={{
              maskImage: "linear-gradient(to bottom, black 50%, transparent 90%)",
              WebkitMaskImage: "linear-gradient(to bottom, black 50%, transparent 90%)",
            }}
          >
            <TechGlobe />
          </div>
          <div className="relative z-10 w-full">
            <TechMarquee platforms={platforms} />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="relative z-30 glass rounded-full px-5 sm:px-8 py-3 sm:py-3.5 flex items-center gap-5 sm:gap-6 overflow-x-auto max-w-[95vw] shadow-[var(--shadow-1)] border border-border/60"
        >
          <span className="text-foreground font-normal whitespace-nowrap hidden sm:block text-sm">
            Global presence
          </span>
          <div className="h-3.5 w-px bg-border hidden sm:block shrink-0" />
          <div className="flex gap-5 sm:gap-6 text-sm text-muted-foreground font-light whitespace-nowrap">
            {["USA", "Canada", "Saudi Arabia", "Europe"].map((region, i) => (
              <motion.span
                key={region}
                initial={{ opacity: 0, x: -10 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 + i * 0.08 }}
                className="flex items-center gap-1.5 hover:text-primary transition-colors cursor-default"
              >
                <div className="w-1.5 h-1.5 rounded-full bg-primary/40" />
                {region}
              </motion.span>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}

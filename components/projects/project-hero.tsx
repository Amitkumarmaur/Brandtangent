"use client"

import { motion } from "motion/react"
import { ArrowDown } from "lucide-react"

export default function ProjectHero() {
  return (
    <section className="relative w-full min-h-[560px] flex items-center bg-white overflow-hidden pt-32 pb-20 px-6 md:px-8 border-b border-border">

      {/* Soft ambient blobs */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-accent-orange/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-accent-orange/10/60 rounded-full blur-[100px] pointer-events-none" />

      <div className="relative w-full max-w-[1200px] mx-auto flex flex-col lg:flex-row items-start lg:items-center gap-12 lg:gap-20">

        {/* Left â€” Typography */}
        <div className="flex-1 space-y-8">
          <p className="micro-cap text-muted-foreground">Projects showcase</p>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          >
            <h1 className="display-xxl text-foreground leading-none">
              Our<br />
              best<br />
              <span className="text-accent-orange">work.</span>
            </h1>
            <p className="mt-6 max-w-md text-muted-foreground font-normal text-lg leading-relaxed">
              Precision-engineered digital experiences for global industry leaders.
            </p>
          </motion.div>

          <div className="flex items-center gap-8 pt-2">
            <div className="flex items-baseline gap-2">
              <span className="display-md text-foreground">500+</span>
              <span className="text-muted-foreground font-normal text-xs uppercase tracking-widest leading-snug">Projects<br />Completed</span>
            </div>
            <div className="w-px h-10 bg-border" />
            <button className="group flex items-center gap-2 text-xs font-normal tracking-[0.2em] uppercase text-muted-foreground hover:text-accent-orange transition-colors">
              Scroll to explore
              <ArrowDown className="w-4 h-4 group-hover:translate-y-0.5 transition-transform" />
            </button>
          </div>
        </div>

        {/* Right â€” Feature card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96, x: 30 }}
          animate={{ opacity: 1, scale: 1, x: 0 }}
          transition={{ duration: 0.9, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
          className="lg:w-5/12 w-full relative"
        >
          <div className="relative w-full aspect-[4/5] md:aspect-square lg:aspect-[4/5] rounded-md overflow-hidden border border-border shadow-[rgba(0,55,112,0.08)_0_24px_60px] group bg-secondary">
            <img
              src="/images/project-mighty.png"
              alt="Featured Project"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-x-0 bottom-0 p-8 bg-gradient-to-t from-[rgba(13,37,61,0.88)] via-[rgba(13,37,61,0.30)] to-transparent flex flex-col justify-end">
              <span className="text-[rgba(185,185,249,0.8)] font-normal uppercase text-[10px] tracking-[0.3em] mb-1.5">Featured Project</span>
              <h3 className="text-xl font-normal text-white mb-3">Mighty Buildings</h3>
              <div className="flex gap-2 flex-wrap">
                {["3D Printing", "Sustainability", "PropTech"].map(tag => (
                  <span key={tag} className="text-[9px] font-normal text-white/60 border border-white/20 px-2.5 py-1 rounded-full uppercase tracking-widest">{tag}</span>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

      </div>
    </section>
  )
}

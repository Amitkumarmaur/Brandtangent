"use client"

import { motion } from "framer-motion"
import { ArrowDown } from "lucide-react"

export default function ProjectHero() {
  return (
    <section className="relative w-full h-screen min-h-[700px] flex items-center justify-center bg-white overflow-hidden pt-20 px-4 md:px-8">
      
      {/* Soft Ambient Background Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-grey-50 rounded-full blur-[120px] opacity-60" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-ignite-orange/5 rounded-full blur-[100px] opacity-40" />

      <div className="relative w-full max-w-[1440px] flex flex-col lg:flex-row items-center gap-16 lg:gap-24">
        
        {/* Left Side — Clean Typography */}
        <div className="lg:w-1/2 space-y-10">
          <div className="flex items-center gap-3">
            <span className="w-8 h-[1px] bg-ignite-orange" />
            <span className="text-ignite-orange font-bold tracking-[0.3em] uppercase text-[10px]">Projects Showcase</span>
          </div>
          
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <h1 className="text-6xl md:text-8xl lg:text-9xl font-bold text-black leading-[0.9] tracking-tighter uppercase">
              Our <br />
              Best <br />
              <span className="text-ignite-orange">Works</span>
            </h1>
            <p className="max-w-md text-grey-400 font-medium text-lg md:text-xl mt-10 leading-relaxed">
              Precision-engineered digital experiences for global industry leaders.
            </p>
          </motion.div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 pt-4">
             <div className="flex items-baseline gap-2">
                <span className="text-5xl font-bold text-black">500+</span>
                <span className="text-grey-300 font-bold uppercase text-[10px] tracking-widest leading-tight">Projects <br /> Completed</span>
             </div>
             <div className="hidden sm:block w-[1px] h-12 bg-grey-100 mx-4" />
             <button className="group flex items-center gap-4 text-xs font-bold tracking-[0.3em] uppercase text-black hover:text-ignite-orange transition-colors">
                Scroll to Explore
                <ArrowDown className="w-4 h-4 group-hover:translate-y-1 transition-transform" />
             </button>
          </div>
        </div>

        {/* Right Side — High-Impact Feature Card */}
        <div className="lg:w-1/2 relative">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, x: 50 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="relative z-10 w-full aspect-[4/5] md:aspect-square lg:aspect-[4/5] rounded-[40px] overflow-hidden border border-grey-100 shadow-[0_40px_80px_-20px_rgba(0,0,0,0.1)] group"
          >
             <img 
               src="/images/project-mighty.png" 
               alt="Featured Project" 
               className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000" 
             />
             {/* Info Overlay */}
             <div className="absolute inset-x-0 bottom-0 p-8 md:p-12 bg-gradient-to-t from-black/80 via-black/40 to-transparent flex flex-col justify-end">
                <span className="text-white/60 font-bold uppercase text-[10px] tracking-[0.3em] mb-2">Featured Project</span>
                <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">Mighty Buildings</h3>
                <div className="flex gap-2">
                   {["3D Printing", "Sustainability", "PropTech"].map(tag => (
                      <span key={tag} className="text-[9px] font-bold text-white/40 border border-white/20 px-3 py-1 rounded-full uppercase tracking-widest">{tag}</span>
                   ))}
                </div>
             </div>
          </motion.div>
          
          {/* Decorative Floating Element */}
          <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-ignite-orange rounded-3xl -z-0 opacity-10 blur-xl" />
        </div>

      </div>
    </section>
  )
}


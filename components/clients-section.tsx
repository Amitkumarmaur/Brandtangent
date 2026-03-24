"use client"

import { motion } from "framer-motion"
import Image from "next/image"

// We use an array of objects for the logos to easily render them in a loop.
// Since actual SVGs are not provided, we use styled text and geometric shapes to simulate the logos.

const logosRow1 = [
  { name: "BEYOND", visual: <div className="font-serif tracking-[0.2em] text-lg">BEYOND</div>, tagline: "We helped them with a responsive" },
  { name: "GBM", visual: <div className="font-black text-3xl tracking-tighter outline-text">GBM</div> },
  { name: "SkillBridge", visual: <div className="font-bold text-xl flex flex-col items-center leading-none"><span>SkillBridge</span><span className="text-[0.6rem] tracking-widest font-normal uppercase">Academy</span></div> },
  { name: "EMDAD", visual: <div className="font-bold text-2xl flex items-center gap-2"><div className="w-6 h-6 border-2 border-white rotate-45 flex items-center justify-center"><div className="w-2 h-2 bg-white rounded-full"></div></div> EMDAD</div> },
  { name: "mediaPro", visual: <div className="font-semibold text-xl flex flex-col items-center leading-none"><span>mediaPro</span><span className="text-[0.6rem] tracking-widest font-normal uppercase">International</span></div> },
  { name: "SANAD", visual: <div className="font-serif text-2xl italic tracking-wider flex items-center gap-1">SANAD<div className="w-4 h-[1px] bg-white"></div></div> },
]

const logosRow2 = [
  { name: "Sharjah Investment Forum", visual: <div className="font-light text-sm text-center flex items-center gap-2"><div className="w-8 h-8 grid grid-cols-2 gap-0.5"><div className="border border-white/50 w-full h-full"></div><div className="border border-white/50 w-full h-full"></div><div className="border border-white/50 w-full h-full"></div><div className="border border-white/50 w-full h-full"></div></div><div><span>منتدى الشارقة للاستثمار</span><br/><span className="text-[0.6rem] uppercase">Sharjah Investment Forum</span></div></div> },
  { name: "ATMOSPHERE", visual: <div className="font-serif text-xl flex flex-col items-center leading-none"><div className="flex items-end gap-1"><div className="w-2 h-8 bg-white/80"></div><span>ATMOSPHERE</span></div><span className="text-[0.5rem] tracking-[0.3em] uppercase mt-1">Burj Khalifa</span></div> },
  { name: "exa", visual: <div className="font-black italic text-3xl lowercase">exa</div> },
  { name: "Terra Nexus", visual: <div className="font-serif text-xl flex flex-col items-center leading-none"><div className="w-12 h-4 border-b-2 border-white rounded-[100%] mb-1"></div><span>Terra Nexus</span></div> },
  { name: "American Legal Center", visual: <div className="w-12 h-12 rounded-full border border-white flex items-center justify-center text-[0.5rem] text-center uppercase p-1">American Legal Center</div> },
  { name: "Globe", visual: <div className="flex flex-col items-center gap-2"><Image src="/light_tech_globe.png" alt="Globe" width={60} height={60} className="object-contain drop-shadow-[0_0_15px_rgba(255,255,255,0.2)]" /><span className="text-xs font-semibold">500+ Clients worldwide</span></div> }
]

export default function ClientsSection() {
  return (
    <section className="relative w-full bg-[#0A0A0A] py-24 overflow-hidden border-t border-white/10 font-sans">
      
      {/* Subtle Grid Background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff0a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0a_1px,transparent_1px)] bg-[size:40px_40px] mix-blend-screen pointer-events-none"></div>

      {/* Lighting Accents */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-[#FF5722]/5 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="relative z-10 container mx-auto px-4 md:px-6 mb-16 flex flex-col items-center text-center">
        
        {/* Pre-heading with Animated Dot */}
        <div className="flex items-center gap-3 mb-6">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#FF5722] opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#FF5722]"></span>
          </span>
          <span className="uppercase tracking-widest text-[#FF5722] text-sm font-semibold">Our Clients</span>
        </div>

        {/* Main Heading */}
        <h2 className="text-4xl md:text-5xl lg:text-6xl font-light text-white text-balance leading-tight max-w-3xl">
          5-Star Rated, Works <br className="hidden md:block" /> with GCC Giants
        </h2>
      </div>

      {/* Marquee Section */}
      <div className="relative z-10 w-full flex flex-col gap-12 sm:gap-16 pt-8">
        
        {/* Row 1: Left to Right */}
        <div className="group relative flex overflow-hidden w-full mask-edges">
          <motion.div
            initial={{ x: 0 }}
            animate={{ x: "-50%" }}
            transition={{ duration: 40, ease: "linear", repeat: Infinity }}
            className="flex items-center gap-16 sm:gap-24 whitespace-nowrap px-8 sm:px-12 w-max"
          >
            {/* Double the array for seamless infinite looping */}
            {[...logosRow1, ...logosRow1, ...logosRow1].map((logo, idx) => (
              <div key={`row1-${idx}`} className="flex flex-col items-center justify-center text-white/70 hover:text-white transition-colors duration-300 min-w-[150px]">
                {logo.visual}
                {logo.tagline && <p className="text-[0.65rem] text-white/40 mt-3 uppercase tracking-wider">{logo.tagline}</p>}
              </div>
            ))}
          </motion.div>
        </div>

        {/* Row 2: Right to Left */}
        <div className="group relative flex overflow-hidden w-full mask-edges pb-10">
          <motion.div
            initial={{ x: "-50%" }}
            animate={{ x: 0 }}
            transition={{ duration: 45, ease: "linear", repeat: Infinity }}
            className="flex items-center gap-16 sm:gap-24 whitespace-nowrap px-8 sm:px-12 w-max"
          >
            {/* Double the array for seamless infinite looping */}
            {[...logosRow2, ...logosRow2, ...logosRow2].map((logo, idx) => (
              <div key={`row2-${idx}`} className="flex flex-col items-center justify-center text-white/70 hover:text-white transition-colors duration-300 min-w-[150px]">
                {logo.visual}
              </div>
            ))}
          </motion.div>
        </div>

      </div>

      {/* Global styles for the fade mask on the edges of the marquee */}
      <style jsx global>{`
        .mask-edges {
          mask-image: linear-gradient(
            to right,
            transparent,
            black 10%,
            black 90%,
            transparent
          );
        }
        .outline-text {
          -webkit-text-stroke: 1px rgba(255,255,255,0.7);
          color: transparent;
        }
      `}</style>
    </section>
  )
}

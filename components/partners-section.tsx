"use client"

import { motion } from "framer-motion"

const partnersRow1 = [
  "Bloomberg", "NPR", "Meta", "Zendesk", "Inc. 500", "Google Partner", "CNBC", "Clutch"
]

const partnersRow2 = [
  "Salesforce", "HubSpot", "TikTok", "Trustpilot", "Yelp", "Forbes", "TechCrunch", "Microsoft"
]

const MarqueeItem = ({ text }: { text: string }) => (
  <div className="w-[180px] h-[90px] md:w-[220px] md:h-[110px] rounded-2xl border border-[#E5E5E5] bg-[#F8F8F8] flex items-center justify-center flex-shrink-0 hover:border-[#FF5722]/30 hover:shadow-lg transition-all duration-300 group cursor-default">
    <span className="text-[#A0A0A0] font-semibold text-lg md:text-xl tracking-tight group-hover:text-[#0A0A0A] transition-colors">{text}</span>
  </div>
)

export default function PartnersSection() {
  return (
    <section className="bg-white relative py-20 md:py-24 overflow-hidden border-t border-[#E5E5E5]">
      <div className="w-full max-w-7xl mx-auto px-6 lg:px-8 relative z-10 mb-12 flex flex-col items-center">
        
        <div className="flex items-center gap-2 mb-4">
          <div className="w-2 h-2 rounded-full bg-[#FF5722]" />
          <span className="text-[#FF5722] font-medium tracking-wide uppercase text-xs md:text-sm">Partners & Recognition</span>
        </div>
        
        <h2 className="text-3xl md:text-5xl font-light text-[#0A0A0A] tracking-tight leading-tight text-center">
          Trusted by the <span className="font-medium">Best in Business</span>
        </h2>
        
      </div>

      <div className="relative w-full flex flex-col gap-6 md:gap-8 mt-12 md:mt-16">
        
        {/* Left to Right (Row 1) */}
        <div className="flex overflow-hidden w-full relative">
          <div className="absolute top-0 bottom-0 left-0 w-16 md:w-40 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />
          <div className="absolute top-0 bottom-0 right-0 w-16 md:w-40 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />
          
          <motion.div
            className="flex w-max"
            animate={{ x: ["-50%", "0%"] }}
            transition={{ repeat: Infinity, ease: "linear", duration: 45 }}
          >
            <div className="flex gap-6 md:gap-8 px-3 md:px-4">
              {partnersRow1.map((partner, idx) => <MarqueeItem key={`row1-a-${idx}`} text={partner} />)}
            </div>
            <div className="flex gap-6 md:gap-8 px-3 md:px-4">
              {partnersRow1.map((partner, idx) => <MarqueeItem key={`row1-b-${idx}`} text={partner} />)}
            </div>
          </motion.div>
        </div>

        {/* Right to Left (Row 2) */}
        <div className="flex overflow-hidden w-full relative">
          <div className="absolute top-0 bottom-0 left-0 w-16 md:w-40 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />
          <div className="absolute top-0 bottom-0 right-0 w-16 md:w-40 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />
          
          <motion.div
            className="flex w-max"
            animate={{ x: ["0%", "-50%"] }}
            transition={{ repeat: Infinity, ease: "linear", duration: 40 }}
          >
            <div className="flex gap-6 md:gap-8 px-3 md:px-4">
              {partnersRow2.map((partner, idx) => <MarqueeItem key={`row2-a-${idx}`} text={partner} />)}
            </div>
            <div className="flex gap-6 md:gap-8 px-3 md:px-4">
              {partnersRow2.map((partner, idx) => <MarqueeItem key={`row2-b-${idx}`} text={partner} />)}
            </div>
          </motion.div>
        </div>

      </div>
    </section>
  )
}

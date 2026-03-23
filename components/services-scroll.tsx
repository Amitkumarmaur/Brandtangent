"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"

const servicesData = [
  {
    id: "development",
    title: "Development",
    items: [
      "Website Development",
      "Mobile App Development",
      "E-commerce Websites",
      "UI/UX Design",
    ]
  },
  {
    id: "marketing",
    title: "Digital Marketing",
    items: [
      "SEO",
      "Digital Marketing Services",
      "Social Media Marketing",
      "Marketing Automations",
    ]
  },
  {
    id: "emerging",
    title: "Emerging Tech",
    items: [
      "AI Integration",
      "Artificial Intelligence",
      "AR / VR",
      "Digital Transformation Solution",
      "Blockchain"
    ]
  },
  {
    id: "advertising",
    title: "Advertising & Creative",
    items: [
      "Branding and Designing",
      "Brand Identity",
      "Video Production",
      "Copywriting",
    ]
  }
]

export default function ServicesScroll() {
  const [activeIndex, setActiveIndex] = useState(0)

  return (
    <section className="bg-[#0A0A0A] relative min-h-screen py-24 flex items-center overflow-hidden">
      
      {/* Background Effects (Dark Theme) */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-[60vw] h-[60vw] max-w-[800px] max-h-[800px] bg-[#A800FF]/15 rounded-full blur-[150px] mix-blend-screen -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-[40vw] h-[40vw] max-w-[600px] max-h-[600px] bg-[#A800FF]/5 rounded-full blur-[100px] mix-blend-screen translate-y-1/2 -translate-x-1/4" />
        
        <div 
          className="absolute inset-0 opacity-[0.03]" 
          style={{
            backgroundSize: '40px 40px',
            backgroundImage: `linear-gradient(to right, #FFF 1px, transparent 1px), linear-gradient(to bottom, #FFF 1px, transparent 1px)`
          }}
        />
      </div>

      <div className="w-full max-w-7xl mx-auto px-6 lg:px-8 relative z-10 flex flex-col md:flex-row gap-8 lg:gap-16 items-center">
        
        {/* Left Side: Categories */}
        <div className="flex-1 w-full pl-6 md:pl-16">
          <div className="flex items-center gap-2 mb-8 md:mb-12">
            <div className="w-2 h-2 rounded-full bg-[#A800FF]" />
            <span className="text-white font-medium tracking-wide text-sm">Our Services</span>
          </div>
          
          <div className="flex flex-col gap-6 md:gap-10">
            {servicesData.map((service, idx) => {
              const isActive = activeIndex === idx;
              return (
                <div 
                  key={service.id} 
                  className="relative flex items-center cursor-pointer group w-max py-2" 
                  onClick={() => setActiveIndex(idx)}
                >
                  <div className="absolute -left-12 md:-left-16 flex items-center justify-center w-10 h-10">
                    <AnimatePresence>
                      {isActive && (
                        <motion.span 
                          layoutId="rocketDarkFixed"
                          className="text-2xl md:text-3xl filter drop-shadow-[0_0_10px_rgba(255,87,34,0.6)]"
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -10 }}
                          transition={{ type: "spring", stiffness: 300, damping: 25 }}
                        >
                          🚀
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </div>
                  
                  <motion.h3 
                    className={`text-3xl md:text-5xl lg:text-6xl tracking-tight transition-colors duration-500 font-light ${isActive ? "text-white" : "text-white/30 hover:text-white/60"}`}
                  >
                    {service.title}
                  </motion.h3>
                </div>
              )
            })}
          </div>
        </div>
        
        {/* Right Side: Active Sub-services */}
        <div className="flex-1 w-full mt-8 md:mt-0 pr-0 md:pr-8 lg:pr-16">
          {/* Transparent border box resembling user reference */}
          <div className="border border-white/30 bg-transparent rounded-[2.5rem] p-8 md:p-12 relative overflow-hidden h-[350px] md:h-[450px] flex flex-col justify-center">
            
            <AnimatePresence mode="popLayout">
              <motion.div
                key={activeIndex}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4, ease: "easeInOut" }}
                className="flex flex-col gap-4 md:gap-6"
              >
                {servicesData[activeIndex].items.map((item, index) => (
                  <motion.div 
                    key={item}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 + 0.1, duration: 0.4 }}
                    className="text-lg md:text-2xl text-white font-light tracking-wide hover:translate-x-2 transition-transform duration-300 cursor-pointer"
                  >
                    {item}
                  </motion.div>
                ))}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
        
      </div>
    </section>
  )
}

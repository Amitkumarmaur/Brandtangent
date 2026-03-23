"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { CornerDownRight } from "lucide-react"

const categories = ["Website", "Mobile App", "SMM", "PPC", "Print", "SEO", "Branding"]

const projects = [
  { id: 1, title: "Fair Interior Design", category: "SMM", image: "https://images.unsplash.com/photo-1627398225058-20822fa6b3dc?auto=format&fit=crop&q=80&w=800&h=1000" },
  { id: 2, title: "Solaris Sunscreen Campaign", category: "SMM", image: "https://images.unsplash.com/photo-1615397323149-5b5aa7738b58?auto=format&fit=crop&q=80&w=800&h=1000" },
  { id: 3, title: "Guess The Product Social", category: "SMM", image: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?auto=format&fit=crop&q=80&w=800&h=1000" },
  { id: 4, title: "RC Real Estate Portal", category: "Website", image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=800&h=1000" },
  { id: 5, title: "TechCorp Global Site", category: "Website", image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&q=80&w=800&h=1000" },
  { id: 6, title: "FinTech Dashboard", category: "Website", image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=800&h=1000" },
  { id: 7, title: "Fitness Tracker App", category: "Mobile App", image: "https://images.unsplash.com/photo-1510148199876-8a856ee41d42?auto=format&fit=crop&q=80&w=800&h=1000" },
  { id: 8, title: "Food Delivery App", category: "Mobile App", image: "https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?auto=format&fit=crop&q=80&w=800&h=1000" },
  { id: 9, title: "EcoBrand Identity", category: "Branding", image: "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?auto=format&fit=crop&q=80&w=800&h=1000" },
  { id: 10, title: "Tech Conference Media", category: "Print", image: "https://images.unsplash.com/photo-1586075010923-2dd4570fb338?auto=format&fit=crop&q=80&w=800&h=1000" },
  { id: 11, title: "SEO Performance Boost", category: "SEO", image: "https://images.unsplash.com/photo-1432888498266-38ffec3eaf0a?auto=format&fit=crop&q=80&w=800&h=1000" },
  { id: 12, title: "PPC Conversion Campaign", category: "PPC", image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=800&h=1000" },
]

function TiltCard({ image, title }: { image: string, title: string }) {
  const [rotateX, setRotateX] = useState(0)
  const [rotateY, setRotateY] = useState(0)

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const x = e.clientX - rect.left 
    const y = e.clientY - rect.top 
    
    const centerX = rect.width / 2
    const centerY = rect.height / 2
    
    setRotateX(((y - centerY) / centerY) * -15)
    setRotateY(((x - centerX) / centerX) * 15)
  }

  const handleMouseLeave = () => {
    setRotateX(0)
    setRotateY(0)
  }

  return (
    <motion.div
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      animate={{ rotateX, rotateY, scale: rotateX === 0 && rotateY === 0 ? 1 : 1.05 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className="relative w-[85vw] sm:w-[320px] md:w-[400px] flex-shrink-0 h-[400px] md:h-[500px] rounded-[2rem] overflow-hidden cursor-pointer shadow-xl group border border-[#E5E5E5] bg-[#F8F8F8]"
      style={{ transformStyle: "preserve-3d", perspective: 1200 }}
    >
      <img
        src={image}
        alt={title}
        className="absolute inset-0 w-full h-full object-cover object-center pointer-events-none"
      />
      <div 
        className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10 flex flex-col justify-end p-8"
        style={{ transform: 'translateZ(40px)' }}
      >
        <span className="text-[#FF5722] font-medium tracking-wide uppercase text-sm mb-2 opacity-0 -translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 delay-100">Click to view</span>
        <h4 className="text-white text-2xl font-bold tracking-tight opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">{title}</h4>
      </div>
    </motion.div>
  )
}

export default function ProjectsSection() {
  const [activeCategory, setActiveCategory] = useState("SMM")

  const filteredProjects = projects.filter(p => p.category === activeCategory)
  
  const displayProjects = filteredProjects.length > 0 ? filteredProjects : projects.slice(0, 3)

  return (
    <section className="bg-[#F8F8F8] relative py-20 md:py-24 overflow-hidden border-t border-[#E5E5E5]">
      
      {/* Header Section (Contained) */}
      <div className="w-full max-w-7xl mx-auto px-6 lg:px-8 relative z-10 mb-10 md:mb-12">
        <div className="flex flex-col xl:flex-row xl:items-end justify-between gap-8 md:gap-12">
          
          <div className="flex-1 xl:flex-shrink-0 pr-4">
            <div className="flex items-center gap-2 mb-4 md:mb-6 mt-2 md:mt-4">
              <div className="w-2 h-2 rounded-full bg-[#FF5722]" />
              <span className="text-[#FF5722] font-medium tracking-wide uppercase text-xs md:text-sm">Our Work</span>
            </div>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-light text-[#0A0A0A] tracking-tight leading-tight max-w-3xl">
              10+ Years Exp but <br className="hidden md:block"/>
              <span className="font-medium tracking-tight text-[#0A0A0A]">Countless Innovations</span>
            </h2>
          </div>

          <div className="flex flex-col md:flex-row items-start md:items-center justify-start gap-6 w-full xl:w-auto xl:justify-end overflow-hidden">
            
            <div className="flex items-center gap-6 md:gap-8 whitespace-nowrap overflow-x-auto pb-4 md:pb-0 scrollbar-hide w-full justify-start px-2">
              {categories.map((cat) => {
                const isActive = activeCategory === cat;
                return (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className="relative text-base md:text-lg font-light tracking-wide transition-colors duration-300 flex items-center group flex-shrink-0"
                  >
                    {isActive && (
                      <motion.div 
                        layoutId="activeArrowProjectsLight"
                        className="absolute -left-5 md:-left-6 flex items-center justify-center text-[#FF5722]"
                        transition={{ type: "spring", stiffness: 300, damping: 25 }}
                      >
                        <CornerDownRight className="w-4 h-4 md:w-5 md:h-5 -rotate-90" />
                      </motion.div>
                    )}
                    <span className={isActive ? "text-[#0A0A0A] font-medium" : "text-[#7D7D7D] group-hover:text-[#4A4A4A]"}>
                      {cat}
                    </span>
                  </button>
                )
              })}
            </div>

            <button className="bg-[#0A0A0A] hover:bg-[#333333] transition-colors text-white font-medium tracking-wide text-sm md:text-base py-2.5 md:py-3 px-6 md:px-8 rounded-full shadow-lg flex-shrink-0 mt-2 md:mt-0">
              View More
            </button>

          </div>
        </div>
      </div>

      {/* Projects Cards Horizontal Scroll (Full Bleed) */}
      <div className="w-full pl-6 lg:pl-8 xl:pl-[calc((100vw-80rem)/2+2rem)] relative z-10">
        <div className="flex gap-6 md:gap-8 overflow-x-auto pb-12 pt-4 pr-6 lg:pr-8 xl:pr-[calc((100vw-80rem)/2+2rem)] scroll-smooth snap-x snap-mandatory hide-scroll">
          <AnimatePresence mode="popLayout">
            {displayProjects.map((project, idx) => (
              <motion.div 
                key={`${project.id}-${activeCategory}`}
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: -20 }}
                transition={{ duration: 0.4, delay: idx * 0.1 }}
                className="snap-center"
              >
                <TiltCard image={project.image} title={project.title} />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

      </div>
      
      {/* Native scrollbar hiding for horizontal scroll container */}
      <style dangerouslySetInnerHTML={{__html: `
        .hide-scroll::-webkit-scrollbar {
          display: none;
        }
        .hide-scroll {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}} />

    </section>
  )
}

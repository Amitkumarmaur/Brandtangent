"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { CornerDownRight } from "lucide-react"
import Image from "next/image"

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
      className="relative w-[85vw] sm:w-[280px] md:w-[320px] lg:w-[360px] flex-shrink-0 h-[300px] md:h-[360px] lg:h-[400px] rounded-[1.5rem] overflow-hidden cursor-pointer shadow-xl group border border-[#E5E5E5] bg-[#F8F8F8]"
      style={{ transformStyle: "preserve-3d", perspective: 1200 }}
    >
      <Image
        src={image}
        alt={title}
        fill
        sizes="(max-width: 768px) 85vw, (max-width: 1024px) 320px, 360px"
        className="absolute inset-0 object-cover object-center pointer-events-none"
      />
      <div
        className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10 flex flex-col justify-end p-8"
        style={{ transform: 'translateZ(40px)' }}
      >
        <span className="text-ignite-orange font-medium tracking-wide uppercase text-sm mb-2 opacity-0 -translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 delay-100">Click to view</span>
        <h3 className="font-heading text-white text-2xl font-semibold tracking-tight opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">{title}</h3>
      </div>
    </motion.div>
  )
}

export default function ProjectsSection() {
  const [activeCategory, setActiveCategory] = useState("SMM")

  const filteredProjects = projects.filter(p => p.category === activeCategory)

  const displayProjects = filteredProjects.length > 0 ? filteredProjects : projects.slice(0, 3)

  return (
    <section className="bg-grey-100 relative py-16 md:py-20 overflow-hidden border-t border-grey-200">

      {/* Header Section (Contained) */}
      <div className="w-full max-w-7xl mx-auto px-6 lg:px-8 relative z-10 mb-8 md:mb-10">
        <div className="flex flex-col xl:flex-row xl:items-end justify-between gap-6 md:gap-8">

          <div className="flex-1 xl:flex-shrink-0 pr-4">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-2 h-2 rounded-full bg-ignite-orange" />
              <span className="font-heading text-ignite-orange font-medium tracking-wider uppercase text-sm">Our Work</span>
            </div>
            <h2 className="font-heading text-3xl md:text-4xl lg:text-5xl font-semibold text-foreground tracking-tight leading-tight max-w-3xl">
              10+ Years Exp but <br className="hidden md:block" />
              Countless Innovations
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
                        className="absolute -left-5 md:-left-6 flex items-center justify-center text-ignite-orange"
                        transition={{ type: "spring", stiffness: 300, damping: 25 }}
                      >
                        <CornerDownRight className="w-4 h-4 md:w-5 md:h-5 -rotate-90" />
                      </motion.div>
                    )}
                    <span className={isActive ? "text-foreground font-medium" : "text-grey-400 group-hover:text-grey-600"}>
                      {cat}
                    </span>
                  </button>
                )
              })}
            </div>

            <button className="bg-foreground hover:bg-grey-800 transition-colors text-white font-medium tracking-wide text-sm md:text-base py-2.5 md:py-3 px-6 md:px-8 rounded-full shadow-lg flex-shrink-0 mt-2 md:mt-0">
              View More
            </button>

          </div>
        </div>
      </div>

      {/* Projects Cards Horizontal Scroll (Full Bleed) */}
      <div className="w-full pl-6 lg:pl-8 xl:pl-[calc((100vw-80rem)/2+2rem)] relative z-10">
        <div className="flex gap-4 md:gap-6 lg:gap-8 overflow-x-auto pb-8 pt-2 pr-6 lg:pr-8 xl:pr-[calc((100vw-80rem)/2+2rem)] scroll-smooth snap-x snap-mandatory hide-scroll">
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
      <style dangerouslySetInnerHTML={{
        __html: `
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

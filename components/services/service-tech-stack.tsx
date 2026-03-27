"use client"

import { useRef } from "react"
import { motion, useInView } from "framer-motion"

interface TechItem {
  name: string
  icon: string
  color: string
}

const defaultTechStack: TechItem[] = [
  { name: "JavaScript", icon: "JS", color: "#F7DF1E" },
  { name: "TypeScript", icon: "TS", color: "#3178C6" },
  { name: "React", icon: "⚛", color: "#61DAFB" },
  { name: "Next.js", icon: "N", color: "#ffffff" },
  { name: "Node.js", icon: "⬢", color: "#339933" },
  { name: "Python", icon: "🐍", color: "#3776AB" },
  { name: "Laravel", icon: "L", color: "#FF2D20" },
  { name: "Angular", icon: "A", color: "#DD0031" },
  { name: "Vue.js", icon: "V", color: "#4FC08D" },
  { name: "HTML5", icon: "5", color: "#E34F26" },
  { name: "CSS3", icon: "3", color: "#1572B6" },
  { name: "Tailwind", icon: "≋", color: "#06B6D4" },
  { name: "PostgreSQL", icon: "🐘", color: "#4169E1" },
  { name: "MongoDB", icon: "M", color: "#47A248" },
  { name: "AWS", icon: "☁", color: "#FF9900" },
  { name: "Docker", icon: "🐳", color: "#2496ED" },
]

interface ServiceTechStackProps {
  title?: string
  subtitle?: string
  techStack?: TechItem[]
}

export default function ServiceTechStack({
  title = "Web Development\nTechnology Stack",
  subtitle = "We are experts with highly innovative and cutting-edge digital technology, built exclusively around your business vision.",
  techStack = defaultTechStack,
}: ServiceTechStackProps) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  // Duplicate for seamless infinite scroll
  const scrollItems = [...techStack, ...techStack]

  return (
    <section ref={ref} className="relative w-full py-16 md:py-24 bg-foreground overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-14 md:mb-20"
        >
          <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight whitespace-pre-line">
            {title}
          </h2>
          <p className="text-base md:text-lg text-white/40 max-w-2xl mx-auto leading-relaxed">
            {subtitle}
          </p>
        </motion.div>
      </div>

      {/* Scrolling tech row */}
      <div className="relative w-full">
        {/* Fade edges */}
        <div className="absolute left-0 top-0 bottom-0 w-24 md:w-40 bg-gradient-to-r from-foreground to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-24 md:w-40 bg-gradient-to-l from-foreground to-transparent z-10 pointer-events-none" />

        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="flex gap-6 md:gap-8 animate-scroll-left"
        >
          {scrollItems.map((tech, index) => (
            <div key={`${tech.name}-${index}`} className="flex flex-col items-center gap-4 flex-shrink-0">
              <div
                className="w-20 h-20 md:w-24 md:h-24 rounded-2xl bg-grey-800 flex items-center justify-center text-2xl md:text-3xl font-bold border border-white/5 relative overflow-hidden group cursor-default transition-transform duration-300 hover:scale-125 hover:border-white/15 hover:shadow-lg"
              >
                {/* Colored glow */}
                <div
                  className="absolute inset-0 opacity-20 rounded-2xl"
                  style={{
                    boxShadow: `inset 0 0 30px ${tech.color}30, 0 0 20px ${tech.color}15`,
                    borderColor: tech.color,
                  }}
                />
                <div
                  className="absolute bottom-0 left-0 right-0 h-1 opacity-60"
                  style={{ background: `linear-gradient(90deg, transparent, ${tech.color}, transparent)` }}
                />
                <span style={{ color: tech.color }} className="relative z-10 select-none">
                  {tech.icon}
                </span>
              </div>
              <span className="text-white/50 text-xs md:text-sm font-medium whitespace-nowrap">
                {tech.name}
              </span>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Scroll animation keyframes */}
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes scroll-left {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-scroll-left {
          animation: scroll-left 30s linear infinite;
          will-change: transform;
        }
        .animate-scroll-left:hover {
          animation-play-state: paused;
        }
      `}} />
    </section>
  )
}

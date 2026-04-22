"use client"

import { useRef } from "react"
import { motion, useInView } from "framer-motion"
import { deviconLogoForPlatformName } from "@/lib/devicon-platform-logos"

interface TechItem {
  name: string
  logo?: string | null
  /** legacy icon support for default stack */
  icon?: string
  color: string
}

const defaultTechStack: TechItem[] = [
  { name: "JavaScript",  icon: "JS",  color: "#F7DF1E", logo: deviconLogoForPlatformName("JavaScript") },
  { name: "TypeScript",  icon: "TS",  color: "#3178C6", logo: deviconLogoForPlatformName("TypeScript") },
  { name: "React",       icon: "⚛",  color: "#61DAFB", logo: deviconLogoForPlatformName("React") },
  { name: "Next.js",     icon: "N",   color: "#ffffff", logo: deviconLogoForPlatformName("Next.js") },
  { name: "Node.js",     icon: "⬢",  color: "#339933", logo: deviconLogoForPlatformName("Node.js") },
  { name: "Python",      icon: "🐍", color: "#3776AB", logo: deviconLogoForPlatformName("Python") },
  { name: "PostgreSQL",  icon: "🐘", color: "#4169E1", logo: deviconLogoForPlatformName("PostgreSQL") },
  { name: "Tailwind CSS",icon: "≋",  color: "#06B6D4", logo: deviconLogoForPlatformName("Tailwind CSS") },
  { name: "Docker",      icon: "🐳", color: "#2496ED", logo: deviconLogoForPlatformName("Docker") },
]

// ─── Card rendered outside the parent so React never remounts it ─────────────
function TechCard({ tech }: { tech: TechItem }) {
  return (
    <div className="flex flex-col items-center gap-4 flex-shrink-0">
      <div
        className="w-20 h-20 md:w-24 md:h-24 rounded-2xl bg-grey-800 flex items-center justify-center border border-white/5 relative overflow-hidden cursor-default transition-transform duration-300 hover:scale-125 hover:border-white/15 hover:shadow-lg"
        style={{ boxShadow: `0 0 20px ${tech.color}10` }}
      >
        <div
          className="absolute inset-0 opacity-15 rounded-2xl"
          style={{ background: `radial-gradient(circle at center, ${tech.color}40, transparent 70%)` }}
        />
        <div
          className="absolute bottom-0 left-0 right-0 h-[2px] opacity-70"
          style={{ background: `linear-gradient(90deg, transparent, ${tech.color}, transparent)` }}
        />

        {tech.logo ? (
          <div className="relative z-10 w-10 h-10 md:w-12 md:h-12 flex items-center justify-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={tech.logo}
              alt={tech.name}
              className="w-full h-full object-contain"
              onError={(e) => {
                const target = e.currentTarget
                target.style.display = "none"
                const fallback = target.nextElementSibling as HTMLElement
                if (fallback) fallback.style.display = "flex"
              }}
            />
            <span
              className="hidden items-center justify-center text-xl md:text-2xl font-bold"
              style={{ color: tech.color }}
            >
              {tech.icon ?? tech.name.charAt(0)}
            </span>
          </div>
        ) : (
          <span style={{ color: tech.color }} className="relative z-10 text-2xl md:text-3xl font-bold select-none">
            {tech.icon ?? tech.name.charAt(0)}
          </span>
        )}
      </div>
      <span className="text-white/50 text-xs md:text-sm font-medium whitespace-nowrap">
        {tech.name}
      </span>
    </div>
  )
}

interface ServiceTechStackProps {
  title?: string
  subtitle?: string
  techStack?: TechItem[]
}

// Minimum number of items in one "pass" so the strip always overflows the viewport.
// Each card is ~96px + 32px gap ≈ 128px. 14 items ≈ 1792px — safely > any viewport.
const MIN_STRIP_ITEMS = 14

export default function ServiceTechStack({
  title = "Web Development\nTechnology Stack",
  subtitle = "We are experts with highly innovative and cutting-edge digital technology, built exclusively around your business vision.",
  techStack = defaultTechStack,
}: ServiceTechStackProps) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  // Repeat the source items until we have at least MIN_STRIP_ITEMS in one strip.
  // This ensures the strip is always wider than the viewport regardless of how
  // few platforms are connected.
  const repeatCount = Math.ceil(MIN_STRIP_ITEMS / techStack.length)
  const baseStrip = Array.from({ length: repeatCount }, () => techStack).flat()

  // Duplicate once: [baseStrip, baseStrip].
  // The CSS animation moves translateX(-50%), which is exactly one baseStrip width —
  // loop is perfectly seamless no matter how few items there are.
  const marqueeItems = [...baseStrip, ...baseStrip]

  // Slower for fewer unique items so it doesn't look like a blur
  const animDuration = Math.max(18, techStack.length * 3)

  return (
    <section ref={ref} className="relative w-full py-16 md:py-20 bg-foreground overflow-hidden">
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

      {/* ── Infinite Marquee ── */}
      <div className="relative w-full">
        {/* Fade edges */}
        <div className="absolute left-0 top-0 bottom-0 w-24 md:w-40 bg-gradient-to-r from-foreground to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-24 md:w-40 bg-gradient-to-l from-foreground to-transparent z-10 pointer-events-none" />

        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="flex gap-6 md:gap-8 animate-scroll-left"
          style={{ "--scroll-duration": `${animDuration}s` } as React.CSSProperties}
        >
          {marqueeItems.map((tech, index) => (
            <TechCard key={`${tech.name}-${index}`} tech={tech} />
          ))}
        </motion.div>
      </div>

      {/* Scroll animation keyframes */}
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes scroll-left {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-scroll-left {
          animation: scroll-left var(--scroll-duration, 30s) linear infinite;
          will-change: transform;
        }
        .animate-scroll-left:hover {
          animation-play-state: paused;
        }
      `}} />
    </section>
  )
}

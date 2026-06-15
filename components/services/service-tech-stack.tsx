"use client"

import { useRef } from "react"
import { motion, useInView } from "motion/react"
import { deviconLogoForPlatformName } from "@/lib/devicon-platform-logos"

interface TechItem {
  name: string
  logo?: string | null
  icon?: string
  color: string
}

const defaultTechStack: TechItem[] = [
  { name: "JavaScript", icon: "JS", color: "#F7DF1E", logo: deviconLogoForPlatformName("JavaScript") },
  { name: "TypeScript", icon: "TS", color: "#3178C6", logo: deviconLogoForPlatformName("TypeScript") },
  { name: "React", icon: "R", color: "#61DAFB", logo: deviconLogoForPlatformName("React") },
  { name: "Next.js", icon: "N", color: "#ffffff", logo: deviconLogoForPlatformName("Next.js") },
  { name: "Node.js", icon: "N", color: "#339933", logo: deviconLogoForPlatformName("Node.js") },
  { name: "Python", icon: "Py", color: "#3776AB", logo: deviconLogoForPlatformName("Python") },
  { name: "PostgreSQL", icon: "PG", color: "#4169E1", logo: deviconLogoForPlatformName("PostgreSQL") },
  { name: "Tailwind CSS", icon: "TW", color: "#06B6D4", logo: deviconLogoForPlatformName("Tailwind CSS") },
  { name: "Docker", icon: "D", color: "#2496ED", logo: deviconLogoForPlatformName("Docker") },
]

function TechCard({ tech }: { tech: TechItem }) {
  return (
    <div className="flex shrink-0 flex-col items-center gap-3">
      <div className="flex h-20 w-20 items-center justify-center border border-white/10 bg-white/[0.04] transition-colors hover:border-accent-orange/40 hover:bg-white/[0.08] md:h-24 md:w-24">
        {tech.logo ? (
          <div className="relative flex h-10 w-10 items-center justify-center md:h-12 md:w-12">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={tech.logo}
              alt={tech.name}
              className="h-full w-full object-contain"
              onError={(e) => {
                const target = e.currentTarget
                target.style.display = "none"
                const fallback = target.nextElementSibling as HTMLElement
                if (fallback) fallback.style.display = "flex"
              }}
            />
            <span
              className="hidden items-center justify-center text-lg font-semibold md:text-xl"
              style={{ color: tech.color }}
            >
              {tech.icon ?? tech.name.charAt(0)}
            </span>
          </div>
        ) : (
          <span
            style={{ color: tech.color }}
            className="select-none text-2xl font-semibold md:text-3xl"
          >
            {tech.icon ?? tech.name.charAt(0)}
          </span>
        )}
      </div>
      <span className="whitespace-nowrap font-mono text-[11px] uppercase tracking-wider text-white/50">
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

const MIN_STRIP_ITEMS = 14

export default function ServiceTechStack({
  title = "Web Development\nTechnology Stack",
  subtitle = "We are experts with highly innovative and cutting-edge digital technology, built exclusively around your business vision.",
  techStack = defaultTechStack,
}: ServiceTechStackProps) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-80px" })

  const repeatCount = Math.ceil(MIN_STRIP_ITEMS / techStack.length)
  const baseStrip = Array.from({ length: repeatCount }, () => techStack).flat()
  const marqueeItems = [...baseStrip, ...baseStrip]

  return (
    <section
      ref={ref}
      className="relative overflow-hidden border-t border-white/10 bg-primary py-20 md:py-28"
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.05]"
        aria-hidden
        style={{
          backgroundImage: `
            linear-gradient(45deg, transparent 48%, rgba(255,107,0,0.5) 49%, rgba(255,107,0,0.5) 51%, transparent 52%),
            linear-gradient(-45deg, transparent 48%, rgba(255,255,255,0.2) 49%, rgba(255,255,255,0.2) 51%, transparent 52%)
          `,
          backgroundSize: "48px 48px",
        }}
      />

      <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="mb-14 text-center md:mb-16"
        >
          <div className="mb-4 flex items-center justify-center gap-2">
            <span className="h-2 w-2 rounded-full bg-accent-orange" />
            <span className="micro-cap text-white/50">Tech stack</span>
          </div>
          <h2 className="display-lg whitespace-pre-line text-white">{title}</h2>
          <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-white/60 md:text-lg">
            {subtitle}
          </p>
        </motion.div>
      </div>

      <div className="relative w-full space-y-6">
        <div className="relative overflow-hidden">
          <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-20 bg-gradient-to-r from-primary to-transparent md:w-32" />
          <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-20 bg-gradient-to-l from-primary to-transparent md:w-32" />

          <motion.div
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex w-max gap-6 md:gap-8"
            style={{ animation: "scroll-left 28s linear infinite" }}
          >
            {marqueeItems.map((tech, index) => (
              <TechCard key={`row1-${tech.name}-${index}`} tech={tech} />
            ))}
          </motion.div>
        </div>

        <div className="relative overflow-hidden">
          <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-20 bg-gradient-to-r from-primary to-transparent md:w-32" />
          <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-20 bg-gradient-to-l from-primary to-transparent md:w-32" />

          <motion.div
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ duration: 0.6, delay: 0.35 }}
            className="flex w-max gap-6 md:gap-8"
            style={{ animation: "scroll-right 32s linear infinite" }}
          >
            {[...marqueeItems].reverse().map((tech, index) => (
              <TechCard key={`row2-${tech.name}-${index}`} tech={tech} />
            ))}
          </motion.div>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes scroll-left {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        @keyframes scroll-right {
          0%   { transform: translateX(-50%); }
          100% { transform: translateX(0); }
        }
      `}} />
    </section>
  )
}

"use client"

import { useRef, useEffect, useState, useCallback } from "react"
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from "framer-motion"
import { ArrowDown, ArrowRight, ArrowLeft, ChevronRight } from "lucide-react"
import Image from "next/image"

// ── Projects for the slider ──────────────────────────────────────
interface Project {
  id: number
  category: string
  flag: string
  title: string
  image: string
  stat: { value: string; label: string }
  accent: string
  uiColors: string[]
}

const PROJECTS: Project[] = [
  {
    id: 1,
    category: "LinkedIn Growth",
    flag: "🇦🇪",
    title: "B2B Founder — 0 to 18K followers and 3 inbound enterprise deals in 4 months",
    image: "https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?auto=format&fit=crop&w=1200&q=85",
    stat: { value: "18K", label: "New Followers" },
    accent: "#FF5722",
    uiColors: ["#EF4444","#F97316","#8B5CF6","#3B82F6","#06B6D4","#10B981","#F59E0B","#EC4899"],
  },
  {
    id: 2,
    category: "Content Automation",
    flag: "🇺🇸",
    title: "Agency — AI pipeline publishing 90 pieces of content per month with 2 hours of human input",
    image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=1200&q=85",
    stat: { value: "90", label: "Posts/Month" },
    accent: "#3B82F6",
    uiColors: ["#3B82F6","#6366F1","#8B5CF6","#EC4899","#F43F5E","#14B8A6","#F59E0B","#22C55E"],
  },
  {
    id: 3,
    category: "Visual Design",
    flag: "🇬🇧",
    title: "Fashion Brand — Visual identity overhaul driving 210% Instagram engagement increase",
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=1200&q=85",
    stat: { value: "210%", label: "Engagement Up" },
    accent: "#10B981",
    uiColors: ["#10B981","#059669","#34D399","#6EE7B7","#A7F3D0","#F59E0B","#3B82F6","#8B5CF6"],
  },
  {
    id: 4,
    category: "Thought Leadership",
    flag: "🇸🇬",
    title: "SaaS CEO — Content strategy positioning them as the #1 voice in their niche",
    image: "https://images.unsplash.com/photo-1432888498266-38ffec3eaf0a?auto=format&fit=crop&w=1200&q=85",
    stat: { value: "#1", label: "Niche Authority" },
    accent: "#8B5CF6",
    uiColors: ["#8B5CF6","#7C3AED","#A78BFA","#C4B5FD","#EDE9FE","#F43F5E","#3B82F6","#14B8A6"],
  },
]

// ── Floating UI card ─────────────────────────────────────────────
function FloatingUICard({ project }: { project: Project }) {
  return (
    <motion.div
      key={project.id}
      initial={{ opacity: 0, y: 20, x: -10, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, x: 0, scale: 1 }}
      exit={{ opacity: 0, y: -10, scale: 0.95 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="absolute top-8 left-8 z-20 w-52 rounded-2xl overflow-hidden shadow-2xl"
      style={{ background: "rgba(255,255,255,0.97)", backdropFilter: "blur(12px)" }}
    >
      <div className="px-3 py-2.5 border-b border-gray-100 flex items-center gap-2">
        <div
          className="w-5 h-5 rounded-full flex items-center justify-center"
          style={{ background: `linear-gradient(135deg, ${project.accent}, ${project.accent}88)` }}
        >
          <span className="text-white text-[8px] font-bold">D</span>
        </div>
        <span className="text-gray-700 text-xs font-semibold">Design System</span>
      </div>
      <div className="p-3 space-y-2.5">
        <div>
          <p className="text-gray-400 text-[9px] uppercase tracking-wider mb-1.5">Select Color</p>
          <div className="flex gap-1.5 flex-wrap">
            {project.uiColors.map(c => (
              <div key={c} className="w-4 h-4 rounded-full" style={{ background: c }} />
            ))}
          </div>
        </div>
        <div>
          <p className="text-gray-400 text-[9px] uppercase tracking-wider mb-1.5">Select Shade</p>
          <div className="h-4 rounded-full" style={{ background: `linear-gradient(to right, ${project.accent}33, ${project.accent})` }} />
          <div className="relative -mt-3 ml-[55%]">
            <div className="w-4 h-4 rounded-full bg-white shadow-md" style={{ border: `2px solid ${project.accent}` }} />
          </div>
        </div>
      </div>
    </motion.div>
  )
}

// ── Word cycling ─────────────────────────────────────────────────
const WORDS = ["ENGAGING", "VIRAL", "STRATEGIC", "ON-BRAND"]

// ── Main hero ────────────────────────────────────────────────────
export default function ContentSocialHero() {
  const [wordIdx, setWordIdx] = useState(0)
  const [slideIdx, setSlideIdx] = useState(0)
  const [paused, setPaused] = useState(false)

  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)
  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [6, -6]), { stiffness: 120, damping: 18 })
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-6, 6]), { stiffness: 120, damping: 18 })

  // Word cycling
  useEffect(() => {
    const t = setInterval(() => setWordIdx(i => (i + 1) % WORDS.length), 2500)
    return () => clearInterval(t)
  }, [])

  // Auto-slide every 4s
  useEffect(() => {
    if (paused) return
    const t = setInterval(() => setSlideIdx(i => (i + 1) % PROJECTS.length), 4000)
    return () => clearInterval(t)
  }, [paused])

  const next = useCallback(() => setSlideIdx(i => (i + 1) % PROJECTS.length), [])
  const prev = useCallback(() => setSlideIdx(i => (i - 1 + PROJECTS.length) % PROJECTS.length), [])

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const r = e.currentTarget.getBoundingClientRect()
    mouseX.set((e.clientX - r.left) / r.width - 0.5)
    mouseY.set((e.clientY - r.top) / r.height - 0.5)
    setPaused(true)
  }
  const handleMouseLeave = () => {
    mouseX.set(0)
    mouseY.set(0)
    setPaused(false)
  }

  const project = PROJECTS[slideIdx]

  return (
    <section
      className="relative w-full bg-background pt-32 pb-16 lg:pt-40 lg:pb-20 flex items-center overflow-hidden"
    >
      {/* Background ambient */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-[600px] h-[600px] rounded-full blur-[160px]" style={{ background: "rgba(255,87,34,0.07)" }} />
        <div className="absolute top-1/4 right-1/4 w-[400px] h-[400px] rounded-full blur-[120px]" style={{ background: "rgba(255,87,34,0.05)" }} />
        <div className="absolute inset-0 opacity-[0.04] grid-pattern" />
      </div>

      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">

          {/* ─── LEFT CARD ──────────────────────────────────── */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="relative rounded-[1.5rem] overflow-hidden flex flex-col justify-between p-8 md:p-12 bg-dark-surface border border-white/10"
          >
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-16 h-1 rounded-full" style={{ background: "rgba(255,87,34,0.3)" }} />
            <div className="absolute left-0 top-1/3 w-1 h-32 bg-ignite-orange rounded-r-full opacity-80" />
            {/* Warm glow corner */}
            <div className="absolute bottom-0 right-0 w-64 h-64 rounded-full blur-[80px] pointer-events-none" style={{ background: "rgba(255,87,34,0.12)" }} />

            {/* Animated particle orbs */}
            {[...Array(4)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute rounded-full pointer-events-none"
                style={{
                  width: 4 + i * 2,
                  height: 4 + i * 2,
                  background: "#FF5722",
                  left: `${20 + i * 20}%`,
                  top: `${15 + i * 15}%`,
                  opacity: 0.2,
                }}
                animate={{ y: [0, -12, 0], opacity: [0.2, 0.5, 0.2] }}
                transition={{ duration: 3 + i, repeat: Infinity, delay: i * 0.8, ease: "easeInOut" }}
              />
            ))}

            <div>
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="flex items-center gap-2 mb-4"
              >
                <div className="w-2 h-2 rounded-full bg-ignite-orange animate-pulse" />
                <span className="font-heading text-ignite-orange text-sm font-medium tracking-wider uppercase">Content & Social Media</span>
              </motion.div>

              <div className="mb-4">
                <motion.h1
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4, duration: 0.8 }}
                  className="font-heading text-3xl sm:text-4xl lg:text-[3.2rem] xl:text-[3.5rem] leading-[1.0] font-bold tracking-[-0.03em] uppercase text-white"
                >
                  CONTENT
                  <br />POWER
                </motion.h1>

                <div className="h-10 md:h-12 overflow-hidden mt-3">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={wordIdx}
                      initial={{ y: 50, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      exit={{ y: -50, opacity: 0 }}
                      transition={{ duration: 0.45, ease: "easeOut" }}
                      className="font-heading text-2xl md:text-3xl font-bold tracking-tight text-ignite-orange"
                    >
                      {WORDS[wordIdx]}
                    </motion.div>
                  </AnimatePresence>
                </div>
              </div>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.7 }}
                className="font-sans text-white/60 text-base md:text-lg leading-relaxed max-w-sm mt-3"
              >
                We build content systems and social presences that grow authority, attract audiences, and convert followers into customers.
              </motion.p>
            </div>

            {/* Bottom stats + CTA */}
            <div className="flex items-end justify-between mt-12 flex-wrap gap-4">
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.9 }}>
                <p className="font-mono text-4xl md:text-5xl font-black text-white leading-none">
                  50M<span className="text-ignite-orange">+</span>
                </p>
                <p className="font-sans text-white/40 text-xs tracking-widest uppercase mt-2">Impressions Generated</p>
              </motion.div>

              <motion.a
                href="#contact"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1.0 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.97 }}
                className="flex items-center gap-3 px-6 py-3 rounded-full font-sans font-medium text-white bg-ignite-orange hover:bg-ignite-orange/90 transition-colors shadow-[0_4px_24px_rgba(255,87,34,0.3)]"
              >
                <ArrowDown className="w-4 h-4" />
                ALL CASES
              </motion.a>
            </div>
          </motion.div>

          {/* ─── RIGHT CARD (SLIDER) ─────────────────────────── */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            style={{ rotateX, rotateY, perspective: 800, transformStyle: "preserve-3d" }}
            className="relative rounded-[1.5rem] overflow-hidden h-full min-h-[500px]"
          >
            <div className="relative w-full h-full min-h-[500px] lg:min-h-full">
              {/* Slide images */}
              <AnimatePresence mode="sync">
                <motion.div
                  key={`img-${project.id}`}
                  initial={{ opacity: 0, scale: 1.08 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.96 }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                  className="absolute inset-0"
                >
                  <Image
                    src={project.image}
                    alt={project.title}
                    fill
                    sizes="50vw"
                    className="object-cover object-center"
                    priority={project.id === 1}
                  />
                  {/* Dark overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0d1020]/85 via-[#0d1020]/20 to-transparent" />
                  {/* Color accent tint */}
                  <div
                    className="absolute inset-0 opacity-[0.08]"
                    style={{ background: project.accent }}
                  />
                </motion.div>
              </AnimatePresence>

              {/* Floating UI card per slide */}
              <div className="absolute top-0 left-0 right-0 bottom-0 pointer-events-none" style={{ transform: "translateZ(40px)" }}>
                <AnimatePresence mode="wait">
                  <FloatingUICard key={`ui-${project.id}`} project={project} />
                </AnimatePresence>
              </div>

              {/* Stat bubble top-right */}
              <div className="absolute top-8 right-8 z-20" style={{ transform: "translateZ(30px)" }}>
                <AnimatePresence mode="wait">
                  <motion.div
                    key={`stat-${project.id}`}
                    initial={{ opacity: 0, scale: 0.8, y: -10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.8, y: -10 }}
                    transition={{ duration: 0.4 }}
                    className="rounded-2xl px-4 py-3 text-right"
                    style={{
                      background: "rgba(13,16,32,0.85)",
                      backdropFilter: "blur(16px)",
                      border: `1px solid ${project.accent}33`,
                    }}
                  >
                    <p className="text-2xl font-black text-white">
                      {project.stat.value.replace(/\d+/, m => m)}<span style={{ color: project.accent }}>
                        {project.stat.value.match(/[+%]/)?.[ 0] ?? ""}
                      </span>
                    </p>
                    <p className="text-white/40 text-[10px] uppercase tracking-wider">{project.stat.label}</p>
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Bottom project info */}
              <div className="absolute bottom-0 left-0 right-0 z-20 p-8 md:p-10" style={{ transform: "translateZ(20px)" }}>
                <AnimatePresence mode="wait">
                  <motion.div
                    key={`info-${project.id}`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.5 }}
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <span className="text-white/50 text-xs font-semibold tracking-widest uppercase">{project.category}</span>
                      <span className="text-white/30">|</span>
                      <span className="text-sm">{project.flag}</span>
                    </div>
                    <div className="h-px bg-white/15 mb-4" />
                    <div className="flex items-end justify-between gap-4">
                      <p className="text-white text-base md:text-lg font-semibold leading-snug max-w-xs">{project.title}</p>
                      <motion.button
                        whileHover={{ scale: 1.1, rotate: -10 }}
                        className="w-10 h-10 rounded-full flex-shrink-0 flex items-center justify-center"
                        style={{ background: project.accent }}
                      >
                        <ArrowRight className="w-4 h-4 text-white" />
                      </motion.button>
                    </div>
                  </motion.div>
                </AnimatePresence>

                {/* Slider controls + dots */}
                <div className="flex items-center gap-4 mt-6">
                  {/* Prev */}
                  <motion.button
                    whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
                    onClick={prev}
                    className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 border border-white/10 flex items-center justify-center transition-colors"
                  >
                    <ArrowLeft className="w-4 h-4 text-white" />
                  </motion.button>

                  {/* Dots */}
                  <div className="flex gap-2 flex-1">
                    {PROJECTS.map((p, i) => (
                      <button
                        key={p.id}
                        onClick={() => setSlideIdx(i)}
                        className="relative h-1 rounded-full overflow-hidden transition-all duration-300"
                        style={{ background: "rgba(255,255,255,0.2)", width: i === slideIdx ? 32 : 12 }}
                      >
                        {i === slideIdx && (
                          <motion.div
                            className="absolute inset-0 rounded-full"
                            style={{ background: project.accent }}
                            layoutId="active-dot"
                          />
                        )}
                      </button>
                    ))}
                  </div>

                  {/* Next */}
                  <motion.button
                    whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
                    onClick={next}
                    className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 border border-white/10 flex items-center justify-center transition-colors"
                  >
                    <ChevronRight className="w-4 h-4 text-white" />
                  </motion.button>

                  {/* Slide counter */}
                  <span className="text-white/30 text-xs font-mono tabular-nums">
                    {String(slideIdx + 1).padStart(2,"0")} / {String(PROJECTS.length).padStart(2,"0")}
                  </span>
                </div>
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  )
}

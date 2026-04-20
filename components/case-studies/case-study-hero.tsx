"use client"

import { motion } from "framer-motion"
import Image from "next/image"
import { ArrowUpRight } from "lucide-react"

interface CaseStudyHeroProps {
  title: string
  subtitle?: string | null
  image?: string | null
  clientName?: string | null
}

export default function CaseStudyHero({
  title,
  subtitle,
  image,
  clientName,
}: CaseStudyHeroProps) {
  return (
    <section className="relative w-full min-h-[100svh] grid grid-cols-1 lg:grid-cols-2 overflow-hidden">

      {/* ── LEFT PANEL — dark ── */}
      <div className="relative bg-background flex flex-col justify-end px-8 md:px-12 lg:px-16 pt-32 pb-12 lg:pb-16 z-10 border-r border-grey-200">
        {/* Subtle grid */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage:
              "linear-gradient(rgba(0,0,0,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.04) 1px, transparent 1px)",
            backgroundSize: "36px 36px",
          }}
        />

        {/* Orange top-left glow */}
        <div className="absolute -top-20 -left-20 w-[400px] h-[400px] bg-ignite-orange/8 rounded-full blur-[100px] pointer-events-none" />

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative z-10"
        >
          {/* Eyebrow */}
          <div className="flex items-center gap-3 mb-8">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-ignite-orange/15 border border-ignite-orange/30 text-ignite-orange text-[11px] font-bold tracking-widest uppercase">
              Case Study <ArrowUpRight className="w-3 h-3" />
            </div>
            {clientName && (
              <span className="text-grey-400 text-xs font-medium uppercase tracking-widest">
                {clientName}
              </span>
            )}
          </div>

          {/* Title */}
          <h1 className="font-heading text-[2.4rem] md:text-5xl lg:text-[3.5rem] font-bold text-foreground leading-[1.05] tracking-tight mb-8">
            {title}
          </h1>

          {/* Subtitle */}
          {subtitle && (
            <p className="text-sm md:text-base text-grey-400 leading-relaxed max-w-md mb-10">
              {subtitle}
            </p>
          )}

          {/* Orange divider line */}
          <div className="w-16 h-0.5 bg-ignite-orange" />
        </motion.div>
      </div>

      {/* ── RIGHT PANEL — image ── */}
      <motion.div
        initial={{ opacity: 0, scale: 1.04 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1, ease: "easeOut" }}
        className="relative min-h-[50vh] lg:min-h-full"
      >
        {image ? (
          <>
            <Image
              src={image}
              alt={title}
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
              priority
            />
            {/* Left-edge gradient to blend into the white panel */}
            <div className="absolute inset-0 bg-gradient-to-r from-background/80 via-background/10 to-transparent" />
            {/* Bottom gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-background/40 via-transparent to-transparent" />
          </>
        ) : (
          <div className="w-full h-full bg-grey-800 flex items-center justify-center">
            <span className="text-white/20 text-sm uppercase tracking-widest">No image</span>
          </div>
        )}

        {/* Floating industry badge — bottom right of image */}
        {clientName && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.5 }}
            className="absolute bottom-8 right-8 bg-background/90 backdrop-blur-sm border border-grey-200 rounded-2xl px-5 py-4 text-right shadow-lg"
          >
            <p className="text-grey-400 text-[10px] uppercase tracking-widest font-medium mb-1">Client</p>
            <p className="text-foreground font-heading font-semibold text-base">{clientName}</p>
          </motion.div>
        )}
      </motion.div>
    </section>
  )
}

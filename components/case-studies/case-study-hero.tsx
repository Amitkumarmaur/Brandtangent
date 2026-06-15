"use client"

import { motion } from "motion/react"
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

      {/* â”€â”€ LEFT PANEL â€” cream â”€â”€ */}
      <div className="relative bg-white flex flex-col justify-end px-8 md:px-12 lg:px-16 pt-32 pb-12 lg:pb-16 z-10 border-r border-border">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative z-10"
        >
          {/* Eyebrow */}
          <div className="flex items-center gap-3 mb-8">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-border bg-white text-muted-foreground text-[11px] font-semibold tracking-widest uppercase">
              Case Study <ArrowUpRight className="w-3 h-3" />
            </div>
            {clientName && (
              <span className="text-muted-foreground text-xs font-medium uppercase tracking-widest">
                {clientName}
              </span>
            )}
          </div>

          {/* Title */}
          <h1 className="display-xl text-foreground mb-6">
            {title}
          </h1>

          {/* Subtitle */}
          {subtitle && (
            <p className="text-sm md:text-base text-muted-foreground leading-relaxed max-w-md mb-10">
              {subtitle}
            </p>
          )}

          {/* Divider */}
          <div className="w-16 h-0.5 bg-muted" />
        </motion.div>
      </div>

      {/* â”€â”€ RIGHT PANEL â€” image â”€â”€ */}
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
            <div className="absolute inset-0 bg-gradient-to-r from-secondary/60 via-secondary/10 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-t from-secondary/30 via-transparent to-transparent" />
          </>
        ) : (
          <div className="w-full h-full bg-muted flex items-center justify-center">
            <span className="text-muted-foreground text-sm uppercase tracking-widest">No image</span>
          </div>
        )}

        {/* Floating client badge */}
        {clientName && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.5 }}
            className="absolute bottom-8 right-8 bg-[rgba(247,244,237,0.92)] backdrop-blur-sm border border-border rounded-md px-5 py-4 text-right"
          >
            <p className="text-muted-foreground text-[10px] uppercase tracking-widest font-medium mb-1">Client</p>
            <p className="text-foreground font-semibold text-base">{clientName}</p>
          </motion.div>
        )}
      </motion.div>
    </section>
  )
}

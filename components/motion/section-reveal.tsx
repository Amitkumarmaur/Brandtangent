"use client"

import { useRef, type ReactNode } from "react"
import { motion, useInView } from "motion/react"
import { cn } from "@/lib/utils"

const ease = [0.22, 1, 0.36, 1] as const

interface SectionRevealProps {
  children: ReactNode
  className?: string
  delay?: number
  y?: number
}

export function SectionReveal({
  children,
  className,
  delay = 0,
  y = 24,
}: SectionRevealProps) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: "-60px" })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay, ease }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

interface SectionHeaderProps {
  eyebrow: string
  title: ReactNode
  subtitle?: ReactNode
  align?: "left" | "center"
  dark?: boolean
  className?: string
}

export function SectionHeader({
  eyebrow,
  title,
  subtitle,
  align = "left",
  dark = false,
  className,
}: SectionHeaderProps) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: "-60px" })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 28 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, ease }}
      className={cn(
        align === "center" && "text-center mx-auto",
        className
      )}
    >
      <div
        className={cn(
          "flex items-center gap-2 mb-4",
          align === "center" && "justify-center"
        )}
      >
        <div className="w-2 h-2 rounded-full bg-accent-orange" />
        <span className={cn("text-eyebrow", dark ? "text-primary-foreground/70" : "text-body-mid")}>
          {eyebrow}
        </span>
      </div>
      <h2
        className={cn(
          "heading-h2 mb-4",
          dark ? "text-white" : "text-foreground"
        )}
      >
        {title}
      </h2>
      {subtitle ? (
        <p className={cn("text-subtitle max-w-2xl", align === "center" && "mx-auto")}>
          {subtitle}
        </p>
      ) : null}
    </motion.div>
  )
}

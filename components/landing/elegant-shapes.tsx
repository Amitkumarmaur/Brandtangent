"use client"

import { motion } from "motion/react"
import { cn } from "@/lib/utils"

interface ElegantShapeProps {
  className?: string
  delay?: number
  width?: number
  height?: number
  rotate?: number
  gradient?: string
}

export function ElegantShape({
  className,
  delay = 0,
  width = 400,
  height = 100,
  rotate = 0,
  gradient = "from-primary/15",
}: ElegantShapeProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -120, rotate: rotate - 15 }}
      animate={{ opacity: 1, y: 0, rotate }}
      transition={{
        duration: 2.4,
        delay,
        ease: [0.23, 0.86, 0.39, 0.96],
        opacity: { duration: 1.2 },
      }}
      className={cn("absolute pointer-events-none", className)}
      aria-hidden
    >
      <motion.div
        animate={{ y: [0, 15, 0] }}
        transition={{
          duration: 12,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
        }}
        style={{ width, height }}
        className="relative"
      >
        <div
          className={cn(
            "absolute inset-0 rounded-full bg-gradient-to-r to-transparent backdrop-blur-[2px]",
            "border border-primary/15 shadow-[0_8px_32px_0_rgba(83,58,253,0.08)]",
            "after:absolute after:inset-0 after:rounded-full",
            "after:bg-[radial-gradient(circle_at_50%_50%,rgba(83,58,253,0.12),transparent_70%)]",
            gradient
          )}
        />
      </motion.div>
    </motion.div>
  )
}

export function ElegantShapesBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden>
      <ElegantShape
        delay={0.3}
        width={600}
        height={140}
        rotate={12}
        gradient="from-primary/20"
        className="left-[-10%] md:left-[-5%] top-[12%] md:top-[18%]"
      />
      <ElegantShape
        delay={0.5}
        width={480}
        height={120}
        rotate={-15}
        gradient="from-[rgba(234,34,97,0.15)]"
        className="right-[-5%] md:right-[0%] top-[65%] md:top-[72%]"
      />
      <ElegantShape
        delay={0.4}
        width={320}
        height={80}
        rotate={-8}
        gradient="from-primary/12"
        className="left-[5%] md:left-[10%] bottom-[8%] md:bottom-[12%]"
      />
      <ElegantShape
        delay={0.6}
        width={220}
        height={60}
        rotate={20}
        gradient="from-[rgba(249,107,238,0.14)]"
        className="right-[12%] md:right-[18%] top-[8%] md:top-[12%]"
      />
      <ElegantShape
        delay={0.7}
        width={160}
        height={40}
        rotate={-25}
        gradient="from-primary/10"
        className="left-[18%] md:left-[22%] top-[4%] md:top-[8%]"
      />
    </div>
  )
}

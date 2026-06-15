"use client"

import * as React from "react"
import Image from "next/image"
import { motion, useReducedMotion } from "motion/react"
import { cn } from "@/lib/utils"

interface BrandtangentLogoProps {
  variant?: "dark" | "light"
  className?: string
  animated?: boolean
}

/** Animated SVG wordmark (980×168, tagline cropped for nav) */
const LOGO = {
  animated: "/brand/brandtangent-logo-animated.svg",
  static: "/brand/brandtangent-logo.svg",
  width: 980,
  height: 168,
} as const

export function BrandtangentLogo({
  variant = "dark",
  className,
  animated = true,
}: BrandtangentLogoProps) {
  const reducedMotion = useReducedMotion()
  const motionOn = animated && !reducedMotion
  const src = motionOn ? LOGO.animated : LOGO.static

  return (
    <motion.span
      role="img"
      aria-label="Brandtangent"
      className={cn("inline-flex items-center", className)}
      initial={motionOn ? { opacity: 0 } : false}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
    >
      <Image
        src={src}
        alt=""
        width={LOGO.width}
        height={LOGO.height}
        priority={variant === "dark"}
        unoptimized
        className={cn(
          "h-full w-auto",
          variant === "light" && "brightness-0 invert"
        )}
      />
    </motion.span>
  )
}

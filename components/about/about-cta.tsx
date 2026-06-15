"use client"

import Link from "next/link"
import { motion, useMotionValue, useScroll, useSpring, useTransform } from "motion/react"
import { ArrowRight } from "lucide-react"
import { useRef } from "react"

import { Button } from "@/components/ui/button"

function MagneticWrap({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  const ref = useRef<HTMLDivElement>(null)
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const springX = useSpring(x, { stiffness: 150, damping: 15 })
  const springY = useSpring(y, { stiffness: 150, damping: 15 })

  return (
    <motion.div
      ref={ref}
      style={{ x: springX, y: springY }}
      onMouseMove={(e) => {
        if (!ref.current) return
        const rect = ref.current.getBoundingClientRect()
        x.set((e.clientX - (rect.left + rect.width / 2)) * 0.25)
        y.set((e.clientY - (rect.top + rect.height / 2)) * 0.25)
      }}
      onMouseLeave={() => {
        x.set(0)
        y.set(0)
      }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

export default function AboutCta() {
  const ref = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "center center"],
  })
  const clipPath = useTransform(
    scrollYProgress,
    [0, 0.6],
    ["inset(100% 0% 0% 0%)", "inset(0% 0% 0% 0%)"]
  )

  return (
    <section
      ref={ref}
      className="relative overflow-hidden border-t border-border bg-background py-20 md:py-28"
    >
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <motion.div
          style={{ clipPath }}
          className="relative overflow-hidden bg-primary px-8 py-16 text-center md:px-16 md:py-24"
        >
          <div
            className="pointer-events-none absolute inset-0 opacity-20"
            aria-hidden
            style={{
              background:
                "radial-gradient(circle at 20% 80%, var(--accent-orange) 0%, transparent 50%), radial-gradient(circle at 80% 20%, var(--accent-purple) 0%, transparent 45%)",
            }}
          />

          <motion.span
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="micro-cap relative z-10 mb-6 inline-block text-white/60"
          >
            Start a conversation
          </motion.span>

          <motion.h2
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1, duration: 0.7 }}
            className="relative z-10 mx-auto mb-5 max-w-3xl font-semibold leading-tight tracking-[-0.03em] text-white [font-size:clamp(1.75rem,4vw,3rem)]"
          >
            Ready for a brand partner — not another retainer?
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="relative z-10 mx-auto mb-12 max-w-xl text-base text-white/70 md:text-lg"
          >
            Tell us where your brand is today. We&apos;ll map whether strategy and creative
            are the right lever.
          </motion.p>

          <div className="relative z-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <MagneticWrap>
              <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                <Button
                  size="lg"
                  className="bg-accent-orange text-white hover:bg-accent-orange/90"
                  asChild
                >
                  <Link href="/#contact">
                    Book a strategy call
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
              </motion.div>
            </MagneticWrap>
            <MagneticWrap>
              <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-white/30 bg-transparent text-white hover:bg-white/10 hover:text-white"
                  asChild
                >
                  <Link href="/case-studies">View our work</Link>
                </Button>
              </motion.div>
            </MagneticWrap>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

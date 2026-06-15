"use client"

import Link from "next/link"
import { motion, useMotionValue, useSpring } from "motion/react"
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
        x.set((e.clientX - (rect.left + rect.width / 2)) * 0.2)
        y.set((e.clientY - (rect.top + rect.height / 2)) * 0.2)
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

interface ServiceDetailCtaProps {
  serviceName: string
}

export default function ServiceDetailCta({ serviceName }: ServiceDetailCtaProps) {
  return (
    <section className="relative overflow-hidden border-t border-border bg-background py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="relative overflow-hidden border border-accent-orange/20 bg-primary px-8 py-14 text-center md:px-16 md:py-20"
        >
          <div
            className="pointer-events-none absolute inset-0 opacity-25"
            aria-hidden
            style={{
              background:
                "radial-gradient(circle at 15% 85%, var(--accent-orange) 0%, transparent 45%), radial-gradient(circle at 85% 15%, var(--accent-purple) 0%, transparent 40%)",
            }}
          />

          <motion.span
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="micro-cap relative z-10 mb-4 inline-block text-white/55"
          >
            Ready to build
          </motion.span>

          <h2 className="relative z-10 mx-auto mb-4 max-w-2xl font-semibold leading-tight tracking-[-0.02em] text-white [font-size:clamp(1.5rem,3.5vw,2.5rem)]">
            Let&apos;s scope your {serviceName.toLowerCase()} project
          </h2>

          <p className="relative z-10 mx-auto mb-10 max-w-lg text-base text-white/65">
            Share where you are today — we&apos;ll tell you honestly if this is the right lever
            and what a phased build looks like.
          </p>

          <div className="relative z-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <MagneticWrap>
              <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                <Button
                  size="lg"
                  className="bg-accent-orange text-white hover:bg-accent-orange/90"
                  asChild
                >
                  <Link href="/#contact">
                    Book a discovery call
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
                  <Link href="/case-studies">View case studies</Link>
                </Button>
              </motion.div>
            </MagneticWrap>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

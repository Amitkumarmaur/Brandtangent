"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { SectionHeader } from "@/components/motion/section-reveal"
import { TiltCard } from "@/components/motion/tilt-card"

const partnersRow1 = [
  "Bloomberg",
  "NPR",
  "Meta",
  "Zendesk",
  "Inc. 500",
  "Google Partner",
  "CNBC",
  "Clutch",
]

const partnersRow2 = [
  "Salesforce",
  "HubSpot",
  "TikTok",
  "Trustpilot",
  "Yelp",
  "Forbes",
  "TechCrunch",
  "Microsoft",
]

const LEAVE_DEBOUNCE_MS = 120

type PauseHandlers = {
  onMouseEnter: () => void
  onMouseLeave: () => void
}

function useRowPauseHandlers(setPaused: (v: boolean) => void) {
  const leaveTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  const clearLeave = useCallback(() => {
    if (leaveTimer.current) {
      clearTimeout(leaveTimer.current)
      leaveTimer.current = null
    }
  }, [])

  useEffect(() => () => clearLeave(), [clearLeave])

  const onMouseEnter = useCallback(() => {
    clearLeave()
    setPaused(true)
  }, [clearLeave, setPaused])

  const onMouseLeave = useCallback(() => {
    clearLeave()
    leaveTimer.current = setTimeout(() => {
      leaveTimer.current = null
      setPaused(false)
    }, LEAVE_DEBOUNCE_MS)
  }, [clearLeave, setPaused])

  return { onMouseEnter, onMouseLeave }
}

function MarqueeItem({ text, pauseHandlers }: { text: string; pauseHandlers: PauseHandlers }) {
  return (
    <TiltCard intensity={4} className="flex-shrink-0">
      <div
        {...pauseHandlers}
        className="w-[160px] h-[80px] md:w-[200px] md:h-[96px] rounded-md border border-border bg-background flex items-center justify-center hover:border-primary/30 hover:shadow-[var(--shadow-2)] transition-all duration-300 group cursor-default"
      >
        <span className="text-muted-foreground font-light text-base md:text-lg tracking-tight group-hover:text-foreground transition-colors">
          {text}
        </span>
      </div>
    </TiltCard>
  )
}

export default function PartnersSection() {
  const [row1Paused, setRow1Paused] = useState(false)
  const [row2Paused, setRow2Paused] = useState(false)
  const row1Pause = useRowPauseHandlers(setRow1Paused)
  const row2Pause = useRowPauseHandlers(setRow2Paused)

  return (
    <section className="bg-secondary relative py-16 md:py-20 overflow-hidden border-t border-border">
      <style
        dangerouslySetInnerHTML={{
          __html: `
@keyframes partners-marquee-ltr {
  0% { transform: translateX(-50%); }
  100% { transform: translateX(0%); }
}
@keyframes partners-marquee-rtl {
  0% { transform: translateX(0%); }
  100% { transform: translateX(-50%); }
}
.partners-marquee-ltr {
  animation: partners-marquee-ltr 45s linear infinite;
}
.partners-marquee-rtl {
  animation: partners-marquee-rtl 40s linear infinite;
}
.partners-marquee-paused {
  animation-play-state: paused !important;
}
@media (prefers-reduced-motion: reduce) {
  .partners-marquee-ltr,
  .partners-marquee-rtl {
    animation: none;
    transform: none;
  }
}
`,
        }}
      />

      <div className="w-full max-w-7xl mx-auto px-6 lg:px-8 mb-10">
        <SectionHeader
          align="center"
          eyebrow="Partners & recognition"
          title="Trusted by the best in business"
        />
      </div>

      <div className="relative w-full flex flex-col gap-5 md:gap-6 mt-6">
        {/* Left to Right (Row 1) */}
        <div className="flex overflow-hidden w-full relative">
          <div className="absolute top-0 bottom-0 left-0 w-16 md:w-32 bg-gradient-to-r from-secondary to-transparent z-10 pointer-events-none" />
          <div className="absolute top-0 bottom-0 right-0 w-16 md:w-32 bg-gradient-to-l from-secondary to-transparent z-10 pointer-events-none" />

          <div
            className={`partners-marquee-ltr flex w-max ${row1Paused ? "partners-marquee-paused" : ""}`}
            style={{ willChange: "transform" }}
          >
            <div className="flex gap-4 md:gap-6 px-2 md:px-3">
              {partnersRow1.map((partner, idx) => (
                <MarqueeItem key={`row1-a-${idx}`} text={partner} pauseHandlers={row1Pause} />
              ))}
            </div>
            <div className="flex gap-4 md:gap-6 px-2 md:px-3">
              {partnersRow1.map((partner, idx) => (
                <MarqueeItem key={`row1-b-${idx}`} text={partner} pauseHandlers={row1Pause} />
              ))}
            </div>
          </div>
        </div>

        {/* Right to Left (Row 2) */}
        <div className="flex overflow-hidden w-full relative">
          <div className="absolute top-0 bottom-0 left-0 w-16 md:w-32 bg-gradient-to-r from-secondary to-transparent z-10 pointer-events-none" />
          <div className="absolute top-0 bottom-0 right-0 w-16 md:w-32 bg-gradient-to-l from-secondary to-transparent z-10 pointer-events-none" />

          <div
            className={`partners-marquee-rtl flex w-max ${row2Paused ? "partners-marquee-paused" : ""}`}
            style={{ willChange: "transform" }}
          >
            <div className="flex gap-4 md:gap-6 px-2 md:px-3">
              {partnersRow2.map((partner, idx) => (
                <MarqueeItem key={`row2-a-${idx}`} text={partner} pauseHandlers={row2Pause} />
              ))}
            </div>
            <div className="flex gap-4 md:gap-6 px-2 md:px-3">
              {partnersRow2.map((partner, idx) => (
                <MarqueeItem key={`row2-b-${idx}`} text={partner} pauseHandlers={row2Pause} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

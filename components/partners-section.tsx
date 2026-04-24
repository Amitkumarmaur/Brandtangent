"use client"

import { useCallback, useEffect, useRef, useState } from "react"

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
    <div
      {...pauseHandlers}
      className="partner-logo w-[180px] h-[90px] md:w-[220px] md:h-[110px] rounded-2xl border border-grey-200 bg-grey-100 flex items-center justify-center flex-shrink-0 hover:border-ignite-orange/30 hover:shadow-lg transition-all duration-300 group cursor-default"
    >
      <span className="text-grey-400 font-semibold text-lg md:text-xl tracking-tight group-hover:text-foreground transition-colors">
        {text}
      </span>
    </div>
  )
}

export default function PartnersSection() {
  const [row1Paused, setRow1Paused] = useState(false)
  const [row2Paused, setRow2Paused] = useState(false)
  const row1Pause = useRowPauseHandlers(setRow1Paused)
  const row2Pause = useRowPauseHandlers(setRow2Paused)

  return (
    <section className="bg-background relative py-16 md:py-20 overflow-hidden border-t border-grey-200">
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

      <div className="w-full max-w-7xl mx-auto px-6 lg:px-8 relative z-10 mb-8 md:mb-10 flex flex-col items-center">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-2 h-2 rounded-full bg-ignite-orange" />
          <span className="font-heading text-ignite-orange font-medium tracking-wider uppercase text-sm">
            Partners & Recognition
          </span>
        </div>

        <h2 className="font-heading text-3xl md:text-4xl lg:text-5xl font-semibold text-foreground tracking-tight leading-tight text-center">
          Trusted by the Best in Business
        </h2>
      </div>

      <div className="relative w-full flex flex-col gap-6 md:gap-8 mt-12 md:mt-16">
        {/* Left to Right (Row 1) */}
        <div className="flex overflow-hidden w-full relative">
          <div className="absolute top-0 bottom-0 left-0 w-16 md:w-40 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none" />
          <div className="absolute top-0 bottom-0 right-0 w-16 md:w-40 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none" />

          <div
            className={`partners-marquee-ltr flex w-max ${row1Paused ? "partners-marquee-paused" : ""}`}
            style={{ willChange: "transform" }}
          >
            <div className="flex gap-6 md:gap-8 px-3 md:px-4">
              {partnersRow1.map((partner, idx) => (
                <MarqueeItem key={`row1-a-${idx}`} text={partner} pauseHandlers={row1Pause} />
              ))}
            </div>
            <div className="flex gap-6 md:gap-8 px-3 md:px-4">
              {partnersRow1.map((partner, idx) => (
                <MarqueeItem key={`row1-b-${idx}`} text={partner} pauseHandlers={row1Pause} />
              ))}
            </div>
          </div>
        </div>

        {/* Right to Left (Row 2) */}
        <div className="flex overflow-hidden w-full relative">
          <div className="absolute top-0 bottom-0 left-0 w-16 md:w-40 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none" />
          <div className="absolute top-0 bottom-0 right-0 w-16 md:w-40 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none" />

          <div
            className={`partners-marquee-rtl flex w-max ${row2Paused ? "partners-marquee-paused" : ""}`}
            style={{ willChange: "transform" }}
          >
            <div className="flex gap-6 md:gap-8 px-3 md:px-4">
              {partnersRow2.map((partner, idx) => (
                <MarqueeItem key={`row2-a-${idx}`} text={partner} pauseHandlers={row2Pause} />
              ))}
            </div>
            <div className="flex gap-6 md:gap-8 px-3 md:px-4">
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

"use client"

import { useCallback, useEffect, useRef, useState, type ReactNode } from "react"
import Image from "next/image"
import { motion } from "motion/react"
import { resolveClientWebsiteUrl, type ClientMarqueeRow } from "@/lib/clients-marquee"
import { SectionHeader } from "@/components/motion/section-reveal"

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

function namedBrandVisual(clientName: string): ReactNode | null {
  const n = clientName.trim().toLowerCase()
  if (n === "beyond") {
    return <div className="font-serif tracking-[0.2em] text-lg text-foreground">BEYOND</div>
  }
  if (n === "gbm") {
    return <div className="font-black text-3xl tracking-tighter outline-text-dark">GBM</div>
  }
  if (n === "skillbridge") {
    return (
      <div className="font-semibold text-xl flex flex-col items-center leading-none text-foreground">
        <span>SkillBridge</span>
        <span className="text-[0.6rem] tracking-widest font-normal uppercase">Academy</span>
      </div>
    )
  }
  if (n === "emdad") {
    return (
      <div className="font-semibold text-2xl flex items-center gap-2 text-foreground">
        <div className="w-6 h-6 border-2 border-primary rotate-45 flex items-center justify-center">
          <div className="w-2 h-2 bg-primary rounded-full"></div>
        </div>
        EMDAD
      </div>
    )
  }
  if (n === "mediapro") {
    return (
      <div className="font-semibold text-xl flex flex-col items-center leading-none text-foreground">
        <span>mediaPro</span>
        <span className="text-[0.6rem] tracking-widest font-normal uppercase">International</span>
      </div>
    )
  }
  if (n === "sanad") {
    return (
      <div className="font-serif text-2xl italic tracking-wider flex items-center gap-1 text-foreground">
        SANAD<div className="w-4 h-[1px] bg-primary"></div>
      </div>
    )
  }
  if (n.includes("sharjah") || n.includes("investment forum")) {
    return (
      <div className="font-light text-sm text-center flex items-center gap-2 text-foreground">
        <div className="w-8 h-8 grid grid-cols-2 gap-0.5">
          <div className="border border-[rgba(28,28,28,0.3)] w-full h-full"></div>
          <div className="border border-[rgba(28,28,28,0.3)] w-full h-full"></div>
          <div className="border border-[rgba(28,28,28,0.3)] w-full h-full"></div>
          <div className="border border-[rgba(28,28,28,0.3)] w-full h-full"></div>
        </div>
        <div>
          <span>منتدى الشارقة للاستثمار</span>
          <br />
          <span className="text-[0.65rem] uppercase">Sharjah Investment Forum</span>
        </div>
      </div>
    )
  }
  if (n === "atmosphere") {
    return (
      <div className="font-serif text-xl flex flex-col items-center leading-none text-foreground">
        <div className="flex items-end gap-1">
          <div className="w-2 h-8 bg-[rgba(28,28,28,0.6)]"></div>
          <span>ATMOSPHERE</span>
        </div>
        <span className="text-[0.5rem] tracking-[0.3em] uppercase mt-1">Burj Khalifa</span>
      </div>
    )
  }
  if (n === "exa") {
    return <div className="font-black italic text-3xl lowercase text-foreground">exa</div>
  }
  if (n.includes("terra nexus")) {
    return (
      <div className="font-serif text-xl flex flex-col items-center leading-none text-foreground">
        <div className="w-12 h-4 border-b-2 border-primary rounded-full mb-1"></div>
        <span>Terra Nexus</span>
      </div>
    )
  }
  if (n.includes("american legal")) {
    return (
      <div className="w-12 h-12 rounded-full border border-[rgba(28,28,28,0.4)] flex items-center justify-center text-[0.5rem] text-center uppercase p-1 text-foreground">
        American Legal Center
      </div>
    )
  }
  if (n === "globe" || n.includes("500+") || n.includes("worldwide")) {
    return (
      <div className="flex flex-col items-center gap-2 text-foreground">
        <Image src="/light_tech_globe.png" alt="Globe" width={60} height={60} className="object-contain opacity-60" />
        <span className="text-xs font-semibold">500+ Clients worldwide</span>
      </div>
    )
  }
  return null
}

function ClientMarqueeCell({
  client,
  pauseHandlers,
  tagline,
}: {
  client: ClientMarqueeRow
  pauseHandlers: PauseHandlers
  tagline?: string | null
}) {
  const href = resolveClientWebsiteUrl(client.website_url)
  const logoSrc = (client.logo ?? "").trim()
  const named = namedBrandVisual(client.client_name)
  const mark =
    logoSrc.length > 0 ? (
      <Image
        src={logoSrc}
        alt={client.client_name}
        width={200}
        height={80}
        className="max-h-14 w-auto max-w-[180px] object-contain opacity-60 group-hover:opacity-100 transition-opacity"
      />
    ) : (
      (named ?? (
        <span className="font-semibold text-lg md:text-xl tracking-tight text-center text-foreground opacity-60 group-hover:opacity-100 transition-opacity px-2">
          {client.client_name}
        </span>
      ))
    )

  const shellClass =
    "flex flex-col items-center justify-center text-[rgba(28,28,28,0.6)] hover:text-foreground transition-colors duration-200 min-w-[140px] shrink-0 group outline-none focus-visible:shadow-[rgba(0,0,0,0.1)_0px_4px_12px]"

  const body = (
    <>
      {mark}
      {tagline ? <p className="text-[0.65rem] text-[rgba(28,28,28,0.35)] mt-3 uppercase tracking-wider">{tagline}</p> : null}
    </>
  )

  if (href) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" {...pauseHandlers} className={`${shellClass} cursor-pointer`}>
        {body}
      </a>
    )
  }

  return <div {...pauseHandlers} className={`${shellClass} cursor-default`}>{body}</div>
}

type Props = {
  row1: ClientMarqueeRow[]
  row2: ClientMarqueeRow[]
  loadError?: string | null
}

export default function ClientsSectionClient({ row1, row2, loadError }: Props) {
  const [row1Paused, setRow1Paused] = useState(false)
  const [row2Paused, setRow2Paused] = useState(false)
  const row1Pause = useRowPauseHandlers(setRow1Paused)
  const row2Pause = useRowPauseHandlers(setRow2Paused)

  return (
    <section className="relative w-full bg-background py-16 md:py-20 overflow-hidden border-t border-border">
      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 mb-10">
        <SectionHeader
          align="center"
          eyebrow="Our clients"
          title={
            <>
              5-star rated, trusted by
              <br className="hidden md:block" /> category leaders
            </>
          }
        />
        {loadError ? (
          <p className="mt-3 text-sm text-red-600" role="alert">
            Could not refresh clients ({loadError}).
          </p>
        ) : null}
      </div>

      <div className="relative z-10 w-full flex flex-col gap-10 pt-4">
        <div className="group relative flex overflow-hidden w-full mask-edges">
          <div
            className={`clients-marquee-row1 flex w-max items-center ${row1Paused ? "clients-marquee-paused" : ""}`}
            style={{ willChange: "transform" }}
          >
            <div className="flex items-center gap-16 sm:gap-24 whitespace-nowrap px-8 sm:px-12">
              {row1.map((client) => (
                <ClientMarqueeCell key={client.id} client={client} pauseHandlers={row1Pause}
                  tagline={client.client_name.trim().toLowerCase() === "beyond" ? "We helped them grow" : null}
                />
              ))}
            </div>
            <div className="flex items-center gap-16 sm:gap-24 whitespace-nowrap px-8 sm:px-12" aria-hidden>
              {row1.map((client) => (
                <ClientMarqueeCell key={`dup-${client.id}`} client={client} pauseHandlers={row1Pause}
                  tagline={client.client_name.trim().toLowerCase() === "beyond" ? "We helped them grow" : null}
                />
              ))}
            </div>
          </div>
        </div>

        <div className="group relative flex overflow-hidden w-full mask-edges pb-8">
          <div
            className={`clients-marquee-row2 flex w-max items-center ${row2Paused ? "clients-marquee-paused" : ""}`}
            style={{ willChange: "transform" }}
          >
            <div className="flex items-center gap-16 sm:gap-24 whitespace-nowrap px-8 sm:px-12">
              {row2.map((client) => (
                <ClientMarqueeCell key={client.id} client={client} pauseHandlers={row2Pause} />
              ))}
            </div>
            <div className="flex items-center gap-16 sm:gap-24 whitespace-nowrap px-8 sm:px-12" aria-hidden>
              {row2.map((client) => (
                <ClientMarqueeCell key={`dup-${client.id}`} client={client} pauseHandlers={row2Pause} />
              ))}
            </div>
          </div>
        </div>
      </div>

      <style jsx global>{`
        .mask-edges {
          mask-image: linear-gradient(to right, transparent, black 8%, black 92%, transparent);
        }
        .outline-text-dark {
          -webkit-text-stroke: 1px rgba(28, 28, 28, 0.6);
          color: transparent;
        }
        @keyframes clients-marquee-row1 {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        @keyframes clients-marquee-row2 {
          0% { transform: translateX(-50%); }
          100% { transform: translateX(0); }
        }
        .clients-marquee-row1 {
          animation: clients-marquee-row1 40s linear infinite;
        }
        .clients-marquee-row2 {
          animation: clients-marquee-row2 45s linear infinite;
        }
        .clients-marquee-paused {
          animation-play-state: paused !important;
        }
        @media (prefers-reduced-motion: reduce) {
          .clients-marquee-row1,
          .clients-marquee-row2 {
            animation: none;
            transform: none;
          }
        }
      `}</style>
    </section>
  )
}

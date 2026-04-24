"use client"

import { useCallback, useEffect, useRef, useState, type ReactNode } from "react"
import Image from "next/image"
import { resolveClientWebsiteUrl, type ClientMarqueeRow } from "@/lib/clients-marquee"

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

/** Custom mark for legacy homepage names; falls back to plain text when no match. */
function namedBrandVisual(clientName: string): ReactNode | null {
  const n = clientName.trim().toLowerCase()
  if (n === "beyond") {
    return <div className="font-serif tracking-[0.2em] text-lg">BEYOND</div>
  }
  if (n === "gbm") {
    return <div className="font-black text-3xl tracking-tighter outline-text">GBM</div>
  }
  if (n === "skillbridge") {
    return (
      <div className="font-bold text-xl flex flex-col items-center leading-none">
        <span>SkillBridge</span>
        <span className="text-[0.6rem] tracking-widest font-normal uppercase">Academy</span>
      </div>
    )
  }
  if (n === "emdad") {
    return (
      <div className="font-bold text-2xl flex items-center gap-2">
        <div className="w-6 h-6 border-2 border-white rotate-45 flex items-center justify-center">
          <div className="w-2 h-2 bg-white rounded-full"></div>
        </div>{" "}
        EMDAD
      </div>
    )
  }
  if (n === "mediapro") {
    return (
      <div className="font-semibold text-xl flex flex-col items-center leading-none">
        <span>mediaPro</span>
        <span className="text-[0.6rem] tracking-widest font-normal uppercase">International</span>
      </div>
    )
  }
  if (n === "sanad") {
    return (
      <div className="font-serif text-2xl italic tracking-wider flex items-center gap-1">
        SANAD<div className="w-4 h-[1px] bg-white"></div>
      </div>
    )
  }
  if (n.includes("sharjah") || n.includes("investment forum")) {
    return (
      <div className="font-light text-sm text-center flex items-center gap-2">
        <div className="w-8 h-8 grid grid-cols-2 gap-0.5">
          <div className="border border-white/50 w-full h-full"></div>
          <div className="border border-white/50 w-full h-full"></div>
          <div className="border border-white/50 w-full h-full"></div>
          <div className="border border-white/50 w-full h-full"></div>
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
      <div className="font-serif text-xl flex flex-col items-center leading-none">
        <div className="flex items-end gap-1">
          <div className="w-2 h-8 bg-white/80"></div>
          <span>ATMOSPHERE</span>
        </div>
        <span className="text-[0.5rem] tracking-[0.3em] uppercase mt-1">Burj Khalifa</span>
      </div>
    )
  }
  if (n === "exa") {
    return <div className="font-black italic text-3xl lowercase">exa</div>
  }
  if (n.includes("terra nexus")) {
    return (
      <div className="font-serif text-xl flex flex-col items-center leading-none">
        <div className="w-12 h-4 border-b-2 border-white rounded-[100%] mb-1"></div>
        <span>Terra Nexus</span>
      </div>
    )
  }
  if (n.includes("american legal")) {
    return (
      <div className="w-12 h-12 rounded-full border border-white flex items-center justify-center text-[0.5rem] text-center uppercase p-1">
        American Legal Center
      </div>
    )
  }
  if (n === "globe" || n.includes("500+") || n.includes("worldwide")) {
    return (
      <div className="flex flex-col items-center gap-2">
        <Image
          src="/light_tech_globe.png"
          alt="Globe"
          width={60}
          height={60}
          className="object-contain drop-shadow-[0_0_15px_rgba(255,255,255,0.2)]"
        />
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
  /** Optional line under mark (e.g. BEYOND). */
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
        className="max-h-16 w-auto max-w-[200px] object-contain opacity-80 group-hover:opacity-100 transition-opacity"
      />
    ) : (
      (named ?? (
        <span className="font-semibold text-lg md:text-xl tracking-tight text-center text-white/90 px-2">
          {client.client_name}
        </span>
      ))
    )

  const shellClass =
    "flex flex-col items-center justify-center text-white/70 hover:text-white transition-colors duration-300 min-w-[150px] shrink-0 group outline-none focus-visible:ring-2 focus-visible:ring-ignite-orange focus-visible:ring-offset-2 focus-visible:ring-offset-foreground"

  const body = (
    <>
      {mark}
      {tagline ? <p className="text-[0.65rem] text-white/40 mt-3 uppercase tracking-wider">{tagline}</p> : null}
    </>
  )

  if (href) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        {...pauseHandlers}
        className={`${shellClass} cursor-pointer`}
      >
        {body}
      </a>
    )
  }

  return (
    <div {...pauseHandlers} className={`${shellClass} cursor-default`}>
      {body}
    </div>
  )
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
    <section className="relative w-full bg-foreground py-16 lg:py-20 overflow-hidden border-t border-white/10 font-sans">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff0a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0a_1px,transparent_1px)] bg-[size:40px_40px] mix-blend-screen pointer-events-none"></div>

      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-ignite-orange/5 rounded-full blur-[100px] pointer-events-none"></div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 mb-8 md:mb-10 flex flex-col items-center text-center">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-2 h-2 rounded-full bg-ignite-orange" />
          <span className="font-heading text-ignite-orange font-medium tracking-wider text-sm uppercase">Our Clients</span>
        </div>

        <h2 className="font-heading text-3xl md:text-4xl lg:text-5xl font-semibold text-white text-balance leading-tight max-w-3xl">
          5-Star Rated, Works <br className="hidden md:block" /> with GCC Giants
        </h2>
        {loadError ? (
          <p className="mt-3 text-sm text-red-300/90" role="alert">
            Could not refresh clients ({loadError}).
          </p>
        ) : null}
      </div>

      <div className="relative z-10 w-full flex flex-col gap-8 sm:gap-12 pt-4">
        <div className="group relative flex overflow-hidden w-full mask-edges">
          <div
            className={`clients-marquee-row1 flex w-max items-center ${row1Paused ? "clients-marquee-paused" : ""}`}
            style={{ willChange: "transform" }}
          >
            <div className="flex items-center gap-16 sm:gap-24 whitespace-nowrap px-8 sm:px-12">
              {row1.map((client) => (
                <ClientMarqueeCell
                  key={client.id}
                  client={client}
                  pauseHandlers={row1Pause}
                  tagline={client.client_name.trim().toLowerCase() === "beyond" ? "We helped them with a responsive" : null}
                />
              ))}
            </div>
            <div className="flex items-center gap-16 sm:gap-24 whitespace-nowrap px-8 sm:px-12" aria-hidden>
              {row1.map((client) => (
                <ClientMarqueeCell
                  key={`dup-${client.id}`}
                  client={client}
                  pauseHandlers={row1Pause}
                  tagline={client.client_name.trim().toLowerCase() === "beyond" ? "We helped them with a responsive" : null}
                />
              ))}
            </div>
          </div>
        </div>

        <div className="group relative flex overflow-hidden w-full mask-edges pb-10">
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
          mask-image: linear-gradient(to right, transparent, black 10%, black 90%, transparent);
        }
        .outline-text {
          -webkit-text-stroke: 1px rgba(255, 255, 255, 0.7);
          color: transparent;
        }
        @keyframes clients-marquee-row1 {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        @keyframes clients-marquee-row2 {
          0% {
            transform: translateX(-50%);
          }
          100% {
            transform: translateX(0);
          }
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

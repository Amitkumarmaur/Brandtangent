"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import Image from "next/image"
import Link from "next/link"

export interface BlogMarqueeItem {
  id: string
  slug: string
  title: string
  category: string
  image: string
  date: string
}

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

function BlogCard({ item, pauseHandlers }: { item: BlogMarqueeItem; pauseHandlers: PauseHandlers }) {
  return (
    <Link
      href={`/blog/${item.slug}`}
      {...pauseHandlers}
      className="w-[85vw] sm:w-[300px] md:w-[360px] h-[280px] md:h-[340px] flex-shrink-0 rounded-md overflow-hidden group cursor-pointer relative border border-border block shadow-[var(--shadow-layered)] hover:shadow-[rgba(0,55,112,0.10)_0_8px_24px] transition-shadow duration-300"
    >
      <Image
        src={item.image}
        alt={item.title}
        fill
        sizes="(max-width: 768px) 85vw, 360px"
        className="object-cover group-hover:scale-105 transition-transform duration-500 pointer-events-none"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-[rgba(13,37,61,0.90)] via-[rgba(13,37,61,0.35)] to-transparent flex flex-col justify-end p-5 opacity-90 group-hover:opacity-100 transition-opacity duration-200">
        <div className="flex items-center gap-2 mb-3">
          <span className="bg-accent-orange/80 text-white text-[11px] px-2.5 py-0.5 rounded-full font-normal">
            {item.category}
          </span>
          <span className="text-white/50 text-[11px] font-normal">{item.date}</span>
        </div>
        <h3 className="text-white text-base md:text-[17px] font-normal leading-snug group-hover:-translate-y-0.5 transition-transform duration-200">
          {item.title}
        </h3>
      </div>
    </Link>
  )
}

interface BlogSectionMarqueeProps {
  items: BlogMarqueeItem[]
}

export default function BlogSectionMarquee({ items }: BlogSectionMarqueeProps) {
  const [paused, setPaused] = useState(false)
  const pauseHandlers = useRowPauseHandlers(setPaused)

  if (!items.length) return null

  return (
    <div className="relative w-full flex overflow-hidden pt-4 pb-8">
      <style
        dangerouslySetInnerHTML={{
          __html: `
@keyframes blog-marquee-scroll {
  0% { transform: translateX(0); }
  100% { transform: translateX(-50%); }
}
.blog-marquee-track {
  animation: blog-marquee-scroll 45s linear infinite;
}
.blog-marquee-paused {
  animation-play-state: paused !important;
}
@media (prefers-reduced-motion: reduce) {
  .blog-marquee-track {
    animation: none;
    transform: none;
  }
}
`,
        }}
      />

      <div className="absolute top-0 bottom-0 left-0 w-12 md:w-32 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />
      <div className="absolute top-0 bottom-0 right-0 w-12 md:w-32 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />

      <div
        className={`blog-marquee-track flex w-max ${paused ? "blog-marquee-paused" : ""}`}
        style={{ willChange: "transform" }}
      >
        <div className="flex gap-5 md:gap-6 px-3 md:px-4">
          {items.map((item) => (
            <BlogCard key={`a-${item.id}`} item={item} pauseHandlers={pauseHandlers} />
          ))}
        </div>
        <div className="flex gap-5 md:gap-6 px-3 md:px-4" aria-hidden>
          {items.map((item) => (
            <BlogCard key={`b-${item.id}`} item={item} pauseHandlers={pauseHandlers} />
          ))}
        </div>
      </div>
    </div>
  )
}

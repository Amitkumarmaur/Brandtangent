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
      className="w-[85vw] sm:w-[320px] md:w-[400px] h-[300px] md:h-[360px] flex-shrink-0 rounded-[2rem] overflow-hidden group cursor-pointer relative shadow-xl border border-grey-200 block"
    >
      <Image
        src={item.image}
        alt={item.title}
        fill
        sizes="(max-width: 768px) 85vw, 400px"
        className="object-cover group-hover:scale-105 transition-transform duration-700 pointer-events-none"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent flex flex-col justify-end p-6 opacity-90 group-hover:opacity-100 transition-opacity duration-300">
        <div className="flex items-center gap-3 mb-4">
          <span className="bg-ignite-orange text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
            {item.category}
          </span>
          <span className="text-grey-200 text-sm font-medium">{item.date}</span>
        </div>
        <h3 className="font-heading text-white text-xl md:text-2xl font-semibold tracking-tight leading-snug group-hover:-translate-y-1 transition-transform duration-300">
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

      <div className="absolute top-0 bottom-0 left-0 w-12 md:w-32 bg-gradient-to-r from-grey-100 to-transparent z-10 pointer-events-none" />
      <div className="absolute top-0 bottom-0 right-0 w-12 md:w-32 bg-gradient-to-l from-grey-100 to-transparent z-10 pointer-events-none" />

      <div
        className={`blog-marquee-track flex w-max ${paused ? "blog-marquee-paused" : ""}`}
        style={{ willChange: "transform" }}
      >
        <div className="flex gap-6 md:gap-8 px-3 md:px-4">
          {items.map((item) => (
            <BlogCard key={`a-${item.id}`} item={item} pauseHandlers={pauseHandlers} />
          ))}
        </div>
        <div className="flex gap-6 md:gap-8 px-3 md:px-4" aria-hidden>
          {items.map((item) => (
            <BlogCard key={`b-${item.id}`} item={item} pauseHandlers={pauseHandlers} />
          ))}
        </div>
      </div>
    </div>
  )
}

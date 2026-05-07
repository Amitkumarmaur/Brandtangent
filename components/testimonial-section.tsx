"use client"

import { useEffect, useState } from "react"
import { Quote, Star } from "lucide-react"
import { supabase } from "@/lib/supabase"

/** Shape we render in the marquee — mirrors `public.testimonials` (minus image/video). */
type Testimonial = {
  id: string
  client_name: string
  role: string | null
  quote: string
  rating: number
}

type RawTestimonialRow = {
  id: string
  client_name: string
  role: string | null
  quote: string
  rating: number
  sort_order: number | null
  created_at: string | null
}

export default function TestimonialSection() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([])
  const [loadError, setLoadError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false

    async function load() {
      const { data, error } = await supabase
        .from("testimonials")
        .select("id, client_name, role, quote, rating, sort_order, created_at")
        .order("sort_order", { ascending: true, nullsFirst: false })
        .order("created_at", { ascending: true })

      if (cancelled) return
      if (error) {
        setLoadError(error.message)
        return
      }

      const rows = (data as RawTestimonialRow[] | null) ?? []
      setTestimonials(
        rows.map((r) => ({
          id: r.id,
          client_name: r.client_name,
          role: r.role,
          quote: r.quote,
          rating: r.rating,
        }))
      )
    }

    void load()
    return () => {
      cancelled = true
    }
  }, [])

  if (loadError || testimonials.length === 0) {
    return null
  }

  const duplicated = [...testimonials, ...testimonials, ...testimonials]
  const marqueeDurationSec = Math.max(24, testimonials.length * 7)

  return (
    <section className="py-16 lg:py-20 bg-background overflow-hidden relative">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 mb-10 relative z-10">
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-2 h-2 rounded-full bg-ignite-orange" />
            <span className="font-heading text-ignite-orange font-medium tracking-wider text-sm uppercase">
              Client Testimonials &amp; Reviews
            </span>
          </div>

          <div className="relative inline-block mt-2">
            <h2 className="font-heading text-3xl md:text-4xl lg:text-5xl font-semibold text-foreground tracking-tight leading-tight max-w-2xl relative z-10">
              What Our Happy Clients <br />
              Say About Us
            </h2>
            <div className="absolute -top-6 lg:-top-10 -left-4 lg:-left-6 text-[#F4F4F4]/80 text-6xl lg:text-8xl font-black uppercase tracking-tighter z-[-1] pointer-events-none select-none">
              digii
              <br />
              mark
            </div>
          </div>
        </div>
      </div>

      <div className="relative flex overflow-hidden">
        <style>{`
          @keyframes testimonial-marquee {
            from { transform: translate3d(0, 0, 0); }
            to { transform: translate3d(-33.333333%, 0, 0); }
          }
          .testimonial-marquee-track {
            animation: testimonial-marquee ${marqueeDurationSec}s linear infinite;
            will-change: transform;
          }
          @media (hover: hover) and (pointer: fine) {
            .testimonial-marquee-track:hover {
              animation-play-state: paused;
            }
          }
          @media (prefers-reduced-motion: reduce) {
            .testimonial-marquee-track {
              animation: none;
              transform: translate3d(0, 0, 0);
            }
          }
        `}</style>
        {/* Soft fade edges to hint at the infinite loop */}
        <div
          className="pointer-events-none absolute inset-y-0 left-0 w-16 md:w-24 z-10 bg-gradient-to-r from-background to-transparent"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute inset-y-0 right-0 w-16 md:w-24 z-10 bg-gradient-to-l from-background to-transparent"
          aria-hidden
        />

        <div
          className="testimonial-marquee-track flex gap-6 px-3 w-max"
          style={{ width: "max-content" }}
        >
          {duplicated.map((t, idx) => (
            <TestimonialCard key={`${t.id}-${idx}`} testimonial={t} />
          ))}
        </div>
      </div>
    </section>
  )
}

function TestimonialCard({ testimonial }: { testimonial: Testimonial }) {
  return (
    <figure className="flex flex-col justify-between w-[300px] md:w-[360px] lg:w-[400px] min-h-[260px] flex-shrink-0 rounded-2xl border border-grey-200 bg-white p-8 shadow-sm transition-all hover:border-ignite-orange/40 hover:shadow-md">
      <div>
        <Quote className="w-8 h-8 text-ignite-orange/80" aria-hidden />
        <blockquote className="mt-4 text-body text-foreground leading-relaxed">
          &ldquo;{testimonial.quote}&rdquo;
        </blockquote>
      </div>

      <figcaption className="mt-6 pt-5 border-t border-grey-200 flex items-start justify-between gap-4">
        <div>
          <p className="font-heading font-semibold text-foreground text-sm md:text-base">
            {testimonial.client_name}
          </p>
          {testimonial.role ? (
            <p className="mt-1 text-sm text-grey-400">{testimonial.role}</p>
          ) : null}
        </div>

        {testimonial.rating > 0 ? (
          <div
            className="flex items-center gap-0.5 shrink-0"
            aria-label={`${testimonial.rating} out of 5 stars`}
          >
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                className={`w-3.5 h-3.5 ${
                  i < testimonial.rating
                    ? "fill-ignite-orange text-ignite-orange"
                    : "text-grey-200"
                }`}
                aria-hidden
              />
            ))}
          </div>
        ) : null}
      </figcaption>
    </figure>
  )
}

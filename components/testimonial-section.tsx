"use client"

import { useEffect, useState } from "react"
import { Star } from "lucide-react"
import { supabase } from "@/lib/supabase"
import { SectionHeader } from "@/components/motion/section-reveal"
import { TiltCard } from "@/components/motion/tilt-card"

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
      if (error) { setLoadError(error.message); return }
      const rows = (data as RawTestimonialRow[] | null) ?? []
      setTestimonials(rows.map((r) => ({
        id: r.id, client_name: r.client_name,
        role: r.role, quote: r.quote, rating: r.rating,
      })))
    }
    void load()
    return () => { cancelled = true }
  }, [])

  // Use placeholder testimonials if none are loaded
  const displayTestimonials = testimonials.length > 0 ? testimonials : [
    {
      id: "1",
      client_name: "David Miller",
      role: "CEO, InnovateAI",
      quote: "The UI/UX team has an eye for detail. Our engagement increased by 40%.",
      rating: 5,
    },
    {
      id: "2",
      client_name: "Sarah Jenkins",
      role: "CTO at TechFlow",
      quote: "The AI integration was a game changer for our automation processes.",
      rating: 5,
    },
    {
      id: "3",
      client_name: "Michael Chen",
      role: "Founder, RetailPro",
      quote: "DigiMark transformed our online presence. Our new platform handles 10x the traffic with zero downtime.",
      rating: 5,
    },
    {
      id: "4",
      client_name: "Jessica Parker",
      role: "Marketing Director",
      quote: "The SEO strategy produced an immediate impact. We saw a 300% increase in organic traffic within 3 months.",
      rating: 5,
    },
  ]

  const duplicated = [...displayTestimonials, ...displayTestimonials, ...displayTestimonials]
  const marqueeDurationSec = Math.max(24, displayTestimonials.length * 7)

  return (
    <section className="py-16 md:py-20 bg-secondary overflow-hidden relative border-t border-border">
      <div className="w-full max-w-7xl mx-auto px-6 lg:px-8 mb-12">
        <SectionHeader
          eyebrow="What clients say"
          title={
            <>
              Happy clients make
              <br className="hidden sm:block" /> the work worthwhile
            </>
          }
        />
      </div>

      {/* Marquee */}
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
            .testimonial-marquee-track:hover { animation-play-state: paused; }
          }
          @media (prefers-reduced-motion: reduce) {
            .testimonial-marquee-track { animation: none; transform: translate3d(0, 0, 0); }
          }
        `}</style>

        <div className="pointer-events-none absolute inset-y-0 left-0 w-20 md:w-32 z-10 bg-gradient-to-r from-secondary to-transparent" aria-hidden />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-20 md:w-32 z-10 bg-gradient-to-l from-secondary to-transparent" aria-hidden />

        <div className="testimonial-marquee-track flex gap-4 px-3" style={{ width: "max-content" }}>
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
    <TiltCard intensity={5} className="flex-shrink-0">
      <figure className="flex flex-col justify-between w-[300px] md:w-[340px] lg:w-[380px] min-h-[230px] rounded-md border border-border bg-background p-6 shadow-[var(--shadow-1)] hover:shadow-[var(--shadow-2)] transition-shadow duration-300">
        <div>
          <div className="text-primary/20 text-4xl font-normal leading-none mb-2 select-none">&ldquo;</div>
          <blockquote className="text-body text-foreground/80 leading-relaxed">
            {testimonial.quote}
          </blockquote>
        </div>

        <figcaption className="mt-5 pt-4 border-t border-border flex items-start justify-between gap-4">
          <div>
            <p className="font-normal text-foreground text-sm">{testimonial.client_name}</p>
            {testimonial.role && (
              <p className="mt-0.5 text-caption">{testimonial.role}</p>
            )}
          </div>
          {testimonial.rating > 0 && (
            <div className="flex items-center gap-0.5 shrink-0" aria-label={`${testimonial.rating} out of 5 stars`}>
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={`w-3 h-3 ${i < testimonial.rating ? "fill-primary text-primary" : "text-border fill-border"}`}
                  aria-hidden
                />
              ))}
            </div>
          )}
        </figcaption>
      </figure>
    </TiltCard>
  )
}

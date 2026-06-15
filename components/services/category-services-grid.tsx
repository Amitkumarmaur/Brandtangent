"use client"

import Image from "next/image"
import Link from "next/link"
import { motion, useInView } from "motion/react"
import { ArrowUpRight } from "lucide-react"
import { useRef } from "react"

import { serviceUrl } from "@/lib/services-urls"
import { staggerContainer, staggerItem } from "@/components/about/about-motion"

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1551434678-e076c223a692?auto=format&fit=crop&q=80&w=1200&h=675"

export interface CategoryService {
  id: string
  slug: string
  name: string
  hero_h1?: string | null
  hero_image?: string | null
  short_description?: string | null
  hero_description?: string | null
  description?: string | null
  display_order?: number | null
}

interface CategoryServicesGridProps {
  badge?: string
  title: string
  subtitle?: string
  categorySlug: string
  services: CategoryService[]
}

export default function CategoryServicesGrid({
  badge = "What's Inside",
  title,
  subtitle,
  categorySlug,
  services,
}: CategoryServicesGridProps) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-60px" })

  if (!services.length) return null

  const sorted = [...services].sort(
    (a, b) => (a.display_order ?? 999) - (b.display_order ?? 999),
  )

  return (
    <section
      id="capabilities"
      ref={ref}
      className="relative overflow-hidden border-t border-border bg-background py-20 md:py-28"
    >
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="mb-14 max-w-3xl"
        >
          <div className="mb-4 flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-accent-orange" />
            <span className="micro-cap text-muted-foreground">{badge}</span>
          </div>
          <h2 className="display-lg text-foreground">{title}</h2>
          {subtitle ? (
            <p className="mt-5 max-w-2xl text-lg text-muted-foreground">{subtitle}</p>
          ) : null}
        </motion.div>

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3 xl:gap-6"
        >
          {sorted.map((service, index) => {
            const displayTitle = (service.hero_h1 ?? service.name).trim() || "Service"
            const blurb = (
              service.short_description ??
              service.hero_description ??
              service.description ??
              ""
            ).trim()
            const image = (service.hero_image ?? "").trim() || FALLBACK_IMAGE
            const featured = index === 0

            return (
              <motion.div
                key={service.id}
                variants={staggerItem}
                className={featured ? "md:col-span-2 xl:col-span-2" : ""}
              >
                <Link
                  href={serviceUrl(categorySlug, service.slug)}
                  className="group relative flex h-full flex-col overflow-hidden border border-border bg-card transition-shadow hover:shadow-[var(--shadow-accent-orange-soft)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-orange/40"
                >
                  <div
                    className={`relative w-full overflow-hidden bg-muted ${
                      featured ? "aspect-[21/9] md:aspect-[2.4/1]" : "aspect-[16/10]"
                    }`}
                  >
                    <Image
                      src={image}
                      alt={displayTitle}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-[1.05]"
                      sizes={
                        featured
                          ? "(max-width: 768px) 100vw, 66vw"
                          : "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      }
                    />
                    <div
                      className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"
                      aria-hidden
                    />
                    <span className="absolute left-5 top-5 font-mono text-xs text-white/50">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <div className="absolute bottom-4 left-5 right-5 flex items-end justify-between gap-3">
                      <span className="micro-cap line-clamp-1 text-white/80">{service.name}</span>
                      <span className="flex h-10 w-10 shrink-0 items-center justify-center bg-white text-foreground transition-colors group-hover:bg-accent-orange group-hover:text-white">
                        <ArrowUpRight className="h-4 w-4" aria-hidden />
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-grow flex-col p-6 md:p-7">
                    <h3
                      className={`font-semibold leading-snug text-foreground ${
                        featured ? "text-2xl md:text-3xl" : "text-xl md:text-2xl"
                      }`}
                    >
                      {displayTitle}
                    </h3>
                    {blurb ? (
                      <p
                        className={`mt-3 flex-grow leading-relaxed text-muted-foreground ${
                          featured ? "line-clamp-2 text-base" : "line-clamp-3 text-sm"
                        }`}
                      >
                        {blurb}
                      </p>
                    ) : null}
                    <span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground transition-all group-hover:gap-3 group-hover:text-accent-orange">
                      View service details
                      <ArrowUpRight className="h-3.5 w-3.5" aria-hidden />
                    </span>
                    <span
                      className="absolute bottom-0 left-0 h-0.5 w-0 bg-accent-orange transition-all duration-300 group-hover:w-full"
                      aria-hidden
                    />
                  </div>
                </Link>
              </motion.div>
            )
          })}
        </motion.div>
      </div>
    </section>
  )
}

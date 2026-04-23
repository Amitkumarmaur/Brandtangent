"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import {
  ArrowUpRight,
  Code2,
  Cpu,
  Megaphone,
  Search,
  Share2,
  Sparkles,
  TrendingUp,
  type LucideIcon,
} from "lucide-react"
import { supabase } from "@/lib/supabase"
import { categoryUrl, serviceUrl } from "@/lib/services-urls"

type CategoryRow = {
  id: string
  name: string
  slug: string | null
  icon: string | null
  display_order: number | null
}

type ServiceRow = {
  id: string
  category_id: string | null
  name: string
  slug: string | null
  short_description: string | null
  description: string | null
  display_order: number | null
}

type Category = CategoryRow & { services: ServiceRow[] }

/** Lucide icon per `service_categories.slug` — used when `service_categories.icon` is null. */
const CATEGORY_ICON_BY_SLUG: Record<string, LucideIcon> = {
  "web-development": Code2,
  "ai-automation": Cpu,
  "seo-search-visibility": Search,
  "growth-revenue-systems": TrendingUp,
  "content-social-media": Share2,
  "social-media-management": Share2,
  "digital-marketing": Megaphone,
}

function categoryIcon(cat: CategoryRow): LucideIcon {
  if (cat.slug && CATEGORY_ICON_BY_SLUG[cat.slug]) return CATEGORY_ICON_BY_SLUG[cat.slug]
  return Sparkles
}

function categoryHref(cat: CategoryRow): string {
  return categoryUrl(cat.slug?.trim() || null)
}

function serviceHref(cat: CategoryRow, svc: ServiceRow): string {
  return serviceUrl(cat.slug?.trim() || null, svc.slug?.trim() || null)
}

export default function ServicesScroll() {
  const [categories, setCategories] = useState<Category[]>([])
  const [activeId, setActiveId] = useState<string | null>(null)
  const [loadError, setLoadError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false

    async function load() {
      const [catsRes, svcRes] = await Promise.all([
        supabase
          .from("service_categories")
          .select("id, name, slug, icon, display_order")
          .order("display_order", { ascending: true, nullsFirst: false }),
        supabase
          .from("services")
          .select("id, category_id, name, slug, short_description, description, display_order")
          .order("display_order", { ascending: true, nullsFirst: false }),
      ])

      if (cancelled) return

      if (catsRes.error) {
        setLoadError(catsRes.error.message)
        return
      }

      const cats = (catsRes.data as CategoryRow[] | null) ?? []
      const svcs = (svcRes.data as ServiceRow[] | null) ?? []

      const grouped: Category[] = cats
        .map((c) => ({
          ...c,
          services: svcs.filter((s) => s.category_id === c.id),
        }))
        .filter((c) => c.services.length > 0)

      setCategories(grouped)
      setActiveId(grouped[0]?.id ?? null)
    }

    void load()
    return () => {
      cancelled = true
    }
  }, [])

  const active = useMemo(
    () => categories.find((c) => c.id === activeId) ?? categories[0] ?? null,
    [categories, activeId]
  )

  if (loadError || categories.length === 0 || !active) {
    return null
  }

  return (
    <section className="bg-foreground relative min-h-[500px] lg:min-h-[600px] py-16 md:py-20 flex items-center overflow-hidden">
      <div
        className="absolute inset-0 z-0 overflow-hidden pointer-events-none"
        aria-hidden
      >
        <div className="absolute top-0 right-0 w-[60vw] h-[60vw] max-w-[800px] max-h-[800px] bg-ignite-orange/15 rounded-full blur-[150px] mix-blend-screen -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-[40vw] h-[40vw] max-w-[600px] max-h-[600px] bg-ignite-orange/5 rounded-full blur-[100px] mix-blend-screen translate-y-1/2 -translate-x-1/4" />
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundSize: "40px 40px",
            backgroundImage:
              "linear-gradient(to right, #FFF 1px, transparent 1px), linear-gradient(to bottom, #FFF 1px, transparent 1px)",
          }}
        />
      </div>

      <div className="w-full max-w-7xl mx-auto px-6 lg:px-8 relative z-10 flex flex-col lg:flex-row gap-10 lg:gap-16 items-stretch">
        <div className="flex-1 w-full pl-6 md:pl-16">
          <div className="flex items-center gap-2 mb-6 mt-4 md:mt-0">
            <div className="w-2 h-2 rounded-full bg-ignite-orange" />
            <span className="font-heading text-white font-medium tracking-wider text-sm uppercase">
              Our Services
            </span>
          </div>

          <h2 className="font-heading text-white text-2xl md:text-3xl font-semibold tracking-tight mb-8 max-w-md">
            Systems we build to compound your growth
          </h2>

          <div className="flex flex-col gap-3 md:gap-4">
            {categories.map((cat) => {
              const Icon = categoryIcon(cat)
              const isActive = active.id === cat.id
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setActiveId(cat.id)}
                  onMouseEnter={() => setActiveId(cat.id)}
                  className="relative flex items-center cursor-pointer group w-max py-2 text-left"
                  aria-pressed={isActive}
                >
                  <div className="absolute -left-12 md:-left-16 flex items-center justify-center w-10 h-10">
                    <AnimatePresence>
                      {isActive ? (
                        <motion.div
                          layoutId="serviceIconIndicator"
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -10 }}
                          transition={{ type: "spring", stiffness: 300, damping: 25 }}
                        >
                          <Icon
                            className="w-6 h-6 text-white drop-shadow-[0_0_10px_rgba(255,87,34,0.6)]"
                            strokeWidth={2}
                          />
                        </motion.div>
                      ) : null}
                    </AnimatePresence>
                  </div>

                  <h3
                    className={`font-heading text-2xl md:text-3xl lg:text-4xl tracking-tight transition-colors duration-300 font-light ${
                      isActive ? "text-white" : "text-white/30 group-hover:text-white/60"
                    }`}
                  >
                    {cat.name}
                  </h3>
                </button>
              )
            })}
          </div>
        </div>

        <div className="flex-1 w-full mt-6 lg:mt-0 lg:pr-8">
          <div className="border border-white/15 bg-white/[0.03] backdrop-blur-sm rounded-[2rem] p-6 lg:p-8 relative overflow-hidden min-h-[420px] lg:h-[560px] flex flex-col">
            <AnimatePresence mode="wait">
              <motion.div
                key={active.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -16 }}
                transition={{ duration: 0.35, ease: "easeInOut" }}
                className="flex flex-col h-full"
              >
                <div className="flex items-start justify-between gap-4 mb-6">
                  <div>
                    <p className="text-caption text-white/45 uppercase tracking-wider font-medium mb-1">
                      {active.services.length} service{active.services.length === 1 ? "" : "s"}
                    </p>
                    <h4 className="font-heading text-white text-xl md:text-2xl font-semibold tracking-tight">
                      {active.name}
                    </h4>
                  </div>
                  <Link
                    href={categoryHref(active)}
                    className="shrink-0 inline-flex items-center gap-1.5 text-sm font-semibold text-ignite-orange hover:text-white transition-colors"
                  >
                    View all
                    <ArrowUpRight className="w-4 h-4" aria-hidden />
                  </Link>
                </div>

                <ul className="flex-1 flex flex-col gap-2 overflow-y-auto pr-1">
                  {active.services.map((svc, index) => (
                    <motion.li
                      key={svc.id}
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.04 + 0.1, duration: 0.3 }}
                    >
                      <Link
                        href={serviceHref(active, svc)}
                        className="group/svc flex items-start justify-between gap-4 py-3 px-4 rounded-xl border border-transparent hover:border-white/15 hover:bg-white/5 transition-all"
                      >
                        <div className="min-w-0">
                          <p className="font-heading text-white text-base md:text-lg font-medium tracking-tight group-hover/svc:text-ignite-orange transition-colors">
                            {svc.name}
                          </p>
                          {svc.short_description ? (
                            <p className="mt-1 text-sm text-white/55 leading-relaxed line-clamp-2">
                              {svc.short_description}
                            </p>
                          ) : null}
                        </div>
                        <ArrowUpRight
                          className="w-4 h-4 mt-1.5 text-white/40 shrink-0 group-hover/svc:text-ignite-orange group-hover/svc:-translate-y-0.5 group-hover/svc:translate-x-0.5 transition-all"
                          aria-hidden
                        />
                      </Link>
                    </motion.li>
                  ))}
                </ul>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  )
}

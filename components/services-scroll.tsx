"use client"

import { useEffect, useMemo, useState, useRef } from "react"
import Link from "next/link"
import { motion, AnimatePresence, useInView } from "motion/react"
import {
  ArrowRight,
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
import { SectionHeader } from "@/components/motion/section-reveal"
import { TiltCard } from "@/components/motion/tilt-card"

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
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-80px" })

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
      if (catsRes.error) { setLoadError(catsRes.error.message); return }

      const cats = (catsRes.data as CategoryRow[] | null) ?? []
      const svcs = (svcRes.data as ServiceRow[] | null) ?? []

      const grouped: Category[] = cats
        .map((c) => ({ ...c, services: svcs.filter((s) => s.category_id === c.id) }))
        .filter((c) => c.services.length > 0 && Boolean((c.slug ?? "").trim()))

      setCategories(grouped)
      setActiveId(grouped[0]?.id ?? null)
    }

    void load()
    return () => { cancelled = true }
  }, [])

  // Fallback placeholder categories if none are loaded
  const displayCategories = categories.length > 0 ? categories : [
    {
      id: "1",
      name: "Web Development",
      slug: "web-development",
      icon: "Code2",
      display_order: 1,
      services: [
        { id: "s1", category_id: "1", name: "Full-Stack Development", slug: "full-stack", short_description: "Custom web applications built with modern frameworks", description: "", display_order: 1 },
        { id: "s2", category_id: "1", name: "Frontend Design & Development", slug: "frontend", short_description: "Beautiful, responsive interfaces that convert", description: "", display_order: 2 },
        { id: "s3", category_id: "1", name: "API Integration", slug: "api", short_description: "Seamless integration with third-party services", description: "", display_order: 3 },
      ]
    },
    {
      id: "2",
      name: "AI & Automation",
      slug: "ai-automation",
      icon: "Cpu",
      display_order: 2,
      services: [
        { id: "s4", category_id: "2", name: "AI Integration", slug: "ai-integration", short_description: "Leverage AI to automate and enhance workflows", description: "", display_order: 1 },
        { id: "s5", category_id: "2", name: "Machine Learning Solutions", slug: "ml", short_description: "Custom ML models for predictive analytics", description: "", display_order: 2 },
      ]
    },
    {
      id: "3",
      name: "SEO & Search Visibility",
      slug: "seo-search-visibility",
      icon: "Search",
      display_order: 3,
      services: [
        { id: "s6", category_id: "3", name: "Technical SEO", slug: "technical-seo", short_description: "Optimize your site's technical foundation", description: "", display_order: 1 },
        { id: "s7", category_id: "3", name: "Content Strategy", slug: "content-seo", short_description: "High-ranking, conversion-focused content", description: "", display_order: 2 },
      ]
    },
  ]

  const active = useMemo(
    () => displayCategories.find((c) => c.id === activeId) ?? displayCategories[0] ?? null,
    [displayCategories, activeId]
  )

  if (!active) return null

  return (
    <section ref={ref} className="bg-secondary py-16 md:py-20 relative overflow-hidden border-t border-border">
      <div className="w-full max-w-7xl mx-auto px-6 lg:px-8 flex flex-col gap-12">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <SectionHeader
            eyebrow="What we do"
            title={
              <>
                Systems built to
                <br className="hidden sm:block" /> compound your growth
              </>
            }
          />
          <motion.div
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Link
              href="/services"
              className="inline-flex items-center gap-1.5 text-[14px] text-accent-orange hover:text-accent-orange transition-colors font-normal shrink-0 self-end sm:self-auto mb-1"
            >
              All services
              <ArrowRight className="w-4 h-4" aria-hidden />
            </Link>
          </motion.div>
        </div>

        {/* Category selector + detail panel */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
          className="flex flex-col lg:flex-row gap-6 lg:gap-8 items-stretch"
        >

          {/* Left â€” category list */}
          <div className="flex flex-col gap-1 lg:w-2/5">
            {displayCategories.map((cat) => {
              const Icon = categoryIcon(cat)
              const isActive = active.id === cat.id
              return (
                <button
                  key={cat.id}
                  onMouseEnter={() => setActiveId(cat.id)}
                  onFocus={() => setActiveId(cat.id)}
                  onClick={() => setActiveId(cat.id)}
                  className={`group flex items-center gap-3 py-3 px-4 rounded-md transition-all duration-200 text-left w-full ${
                    isActive
                      ? "bg-accent-orange text-white"
                      : "text-muted-foreground hover:bg-white hover:text-foreground hover:shadow-[rgba(0,55,112,0.06)_0_1px_3px]"
                  }`}
                >
                  <Icon
                    className={`w-4 h-4 shrink-0 transition-colors ${isActive ? "text-white" : "text-muted-foreground group-hover:text-accent-orange"}`}
                    strokeWidth={1.5}
                  />
                  <span className={`text-[15px] font-normal transition-colors`}>
                    {cat.name}
                  </span>
                </button>
              )
            })}
          </div>

          {/* Right — service detail card */}
          <div className="flex-1">
            <TiltCard intensity={4}>
              <div className="border border-border bg-background rounded-md p-6 lg:p-8 min-h-[380px] lg:min-h-[440px] flex flex-col shadow-[var(--shadow-2)]">
              <AnimatePresence mode="wait">
                <motion.div
                  key={active.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  transition={{ duration: 0.22, ease: "easeInOut" }}
                  className="flex flex-col h-full"
                >
                  {/* Card header */}
                  <div className="flex items-start justify-between gap-4 mb-6">
                    <div>
                      <p className="micro-cap text-muted-foreground mb-1">
                        {active.services.length} service{active.services.length === 1 ? "" : "s"}
                      </p>
                      <h3 className="heading-md text-foreground">{active.name}</h3>
                    </div>
                    <Link
                      href={categoryHref(active)}
                      className="shrink-0 inline-flex items-center gap-1 text-[13px] text-accent-orange hover:text-accent-orange transition-colors font-normal"
                    >
                      View all
                      <ArrowRight className="w-3.5 h-3.5" aria-hidden />
                    </Link>
                  </div>

                  {/* Service list */}
                  <ul className="flex-1 flex flex-col gap-1 overflow-y-auto">
                    {active.services.map((svc, index) => (
                      <motion.li
                        key={svc.id}
                        initial={{ opacity: 0, x: -6 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.04 + 0.06, duration: 0.22 }}
                      >
                        <Link
                          href={serviceHref(active, svc)}
                          className="group/svc flex items-start justify-between gap-4 py-3 px-3 rounded-md border border-transparent hover:border-border hover:bg-secondary transition-all"
                        >
                          <div className="min-w-0">
                            <p className="text-[15px] text-foreground font-normal group-hover/svc:text-accent-orange transition-colors">
                              {svc.name}
                            </p>
                            {svc.short_description ? (
                              <p className="mt-0.5 text-[13px] text-muted-foreground font-normal leading-relaxed line-clamp-2">
                                {svc.short_description}
                              </p>
                            ) : null}
                          </div>
                          <ArrowRight
                            className="w-4 h-4 mt-0.5 text-muted-foreground shrink-0 group-hover/svc:text-accent-orange group-hover/svc:translate-x-0.5 transition-all"
                            aria-hidden
                          />
                        </Link>
                      </motion.li>
                    ))}
                  </ul>
                </motion.div>
              </AnimatePresence>
              </div>
            </TiltCard>
          </div>

        </motion.div>
      </div>
    </section>
  )
}

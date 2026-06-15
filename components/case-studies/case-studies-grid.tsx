"use client"

import { useState, useEffect, useMemo } from "react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import Image from "next/image"
import { ArrowRight } from "lucide-react"
import { motion, AnimatePresence } from "motion/react"
import {
  caseStudyRowToListItem,
  fetchAllPublishedCaseStudies,
  type CaseStudyListItem,
} from "@/lib/content-categories"
import { fetchIndustries, sortIndustries, type Industry } from "@/lib/industries"
import CaseStudiesFilterSidebar, {
  type FilterOption,
} from "@/components/case-studies/case-studies-filter-sidebar"

function industryBadgeForCard(item: CaseStudyListItem): string {
  return item.industry || "Case study"
}

function includesCaseInsensitive(source: string | null | undefined, query: string): boolean {
  if (!query) return true
  if (!source) return false
  return source.toLowerCase().includes(query.toLowerCase())
}

function TiltCard({
  slug,
  image,
  title,
  category,
  excerpt,
}: {
  slug: string
  image: string
  title: string
  category: string
  excerpt: string
}) {
  const [rotateX, setRotateX] = useState(0)
  const [rotateY, setRotateY] = useState(0)

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    setRotateX(((y - rect.height / 2) / rect.height) * -8)
    setRotateY(((x - rect.width / 2) / rect.width) * 8)
  }

  const handleMouseLeave = () => { setRotateX(0); setRotateY(0) }

  return (
    <Link
      href={`/case-studies/${slug}`}
      className="block h-full rounded-md outline-none focus-visible:shadow-[var(--shadow-accent-orange-soft)]"
    >
      <motion.div
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        animate={{ rotateX, rotateY, scale: rotateX === 0 && rotateY === 0 ? 1 : 1.02 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
        className="group relative h-[380px] w-full cursor-pointer overflow-hidden rounded-md border border-border md:h-[440px] hover:border-accent-orange/30 hover:shadow-[var(--shadow-accent-orange-soft)] transition-all duration-300"
        style={{ transformStyle: "preserve-3d", perspective: 1200 }}
      >
        <Image
          src={image}
          alt={title}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="pointer-events-none absolute inset-0 object-cover object-center transition-transform duration-700 group-hover:scale-110"
        />
        <div
          className="absolute inset-0 z-[1] bg-gradient-to-t from-[rgba(13,37,61,0.9)] via-[rgba(13,37,61,0.4)] to-transparent"
          aria-hidden
        />
        <div className="absolute bottom-0 left-0 right-0 z-[2] flex flex-col p-6 md:p-8">
          <span className="mb-3 inline-flex items-center gap-2 bg-accent-orange text-white text-xs font-semibold px-3 py-1.5 rounded-full uppercase tracking-widest shadow-lg w-fit">
            {category}
          </span>
          <h3 className="text-2xl font-semibold leading-tight tracking-tight text-white md:text-[1.65rem]">
            {title}
          </h3>
          {excerpt ? (
            <p className="mt-3 text-sm text-white/80 line-clamp-2">
              {excerpt}
            </p>
          ) : null}
          <span className="mt-4 flex items-center gap-2 text-sm font-semibold text-white group-hover:gap-3 transition-all">
            View case study
            <ArrowRight className="w-4 h-4" aria-hidden />
          </span>
        </div>
      </motion.div>
    </Link>
  )
}

export default function CaseStudiesGrid() {
  const searchParams = useSearchParams()
  const [query, setQuery] = useState("")
  const [activeIndustrySlug, setActiveIndustrySlug] = useState<string | null>(null)
  const [activeServiceSlug, setActiveServiceSlug] = useState<string | null>(null)
  const [allStudies, setAllStudies] = useState<CaseStudyListItem[]>([])
  const [industryOrder, setIndustryOrder] = useState<Industry[]>([])
  const [loadError, setLoadError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      setLoading(true)
      setLoadError(null)

      const [studiesRes, industries] = await Promise.all([
        fetchAllPublishedCaseStudies(),
        fetchIndustries(),
      ])

      if (cancelled) return

      if (studiesRes.error) {
        setLoadError(studiesRes.error.message)
        setAllStudies([])
        setLoading(false)
        return
      }

      const mapped = (studiesRes.data ?? []).map(caseStudyRowToListItem)
      setAllStudies(mapped)
      setIndustryOrder(sortIndustries(industries))
      setLoading(false)
    })()
    return () => { cancelled = true }
  }, [])

  useEffect(() => {
    const raw = searchParams.get("industry")?.trim()
    if (!raw) return
    try { setActiveIndustrySlug(decodeURIComponent(raw)) }
    catch { setActiveIndustrySlug(raw) }
  }, [searchParams])

  const industryOptions = useMemo<FilterOption[]>(() => {
    const bySlug = new Map<string, { slug: string; name: string; order: number }>()
    for (const s of allStudies) {
      if (!s.industry_slug) continue
      const idx = industryOrder.findIndex((i) => i.slug === s.industry_slug)
      bySlug.set(s.industry_slug, { slug: s.industry_slug, name: s.industry, order: idx === -1 ? 999 : idx })
    }
    return [...bySlug.values()]
      .sort((a, b) => a.order - b.order)
      .filter((o) => includesCaseInsensitive(o.name, query))
      .map(({ slug, name }) => ({ slug, name }))
  }, [allStudies, industryOrder, query])

  const serviceOptions = useMemo<FilterOption[]>(() => {
    const bySlug = new Map<string, FilterOption>()
    for (const s of allStudies) {
      if (!s.service_slug || !s.service_name) continue
      if (!bySlug.has(s.service_slug)) bySlug.set(s.service_slug, { slug: s.service_slug, name: s.service_name })
    }
    return [...bySlug.values()].sort((a, b) => a.name.localeCompare(b.name)).filter((o) => includesCaseInsensitive(o.name, query))
  }, [allStudies, query])

  useEffect(() => {
    if (!activeIndustrySlug || loading || industryOptions.length === 0) return
    if (!industryOptions.some((o) => o.slug === activeIndustrySlug)) setActiveIndustrySlug(null)
  }, [loading, industryOptions, activeIndustrySlug])

  const studies = useMemo(() => {
    return allStudies.filter((s) => {
      if (activeIndustrySlug && s.industry_slug !== activeIndustrySlug) return false
      if (activeServiceSlug && s.service_slug !== activeServiceSlug) return false
      if (query) {
        const matches = includesCaseInsensitive(s.industry, query) || includesCaseInsensitive(s.service_name, query) || includesCaseInsensitive(s.title, query)
        if (!matches) return false
      }
      return true
    })
  }, [allStudies, activeIndustrySlug, activeServiceSlug, query])

  const activeCount = (query ? 1 : 0) + (activeIndustrySlug ? 1 : 0) + (activeServiceSlug ? 1 : 0)
  const handleClearAll = () => { setQuery(""); setActiveIndustrySlug(null); setActiveServiceSlug(null) }

  return (
    <section id="portfolio-grid" className="bg-white py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[18rem_1fr] lg:gap-10 xl:grid-cols-[20rem_1fr] xl:gap-12">
          <aside className="lg:sticky lg:top-28 lg:self-start">
            <CaseStudiesFilterSidebar
              query={query}
              onQueryChange={setQuery}
              industries={industryOptions}
              activeIndustrySlug={activeIndustrySlug}
              onIndustryChange={setActiveIndustrySlug}
              services={serviceOptions}
              activeServiceSlug={activeServiceSlug}
              onServiceChange={setActiveServiceSlug}
              activeCount={activeCount}
              onClearAll={handleClearAll}
              loading={loading}
            />
          </aside>

          <div>
            <div className="mb-8 flex items-baseline justify-between gap-4">
              <p className="text-sm font-semibold text-muted-foreground">
                {loading
                  ? "Loading case studiesâ€¦"
                  : studies.length === 1
                    ? "Showing 1 case study"
                    : `Showing ${studies.length} case studies`}
                {activeCount > 0 && !loading ? ` Â· ${activeCount} filter${activeCount === 1 ? "" : "s"} applied` : ""}
              </p>
            </div>

            {loadError && (
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-sm text-red-600 mb-8 bg-red-50 border border-red-200 rounded-lg p-4"
                role="alert"
              >
                Could not load case studies: {loadError}
              </motion.p>
            )}

            {loading ? (
              <div className="flex min-h-[360px] items-center justify-center">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  className="w-8 h-8 border-3 border-border border-t-accent-orange rounded-full"
                />
              </div>
            ) : studies.length === 0 && !loadError ? (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-md border border-border bg-gradient-to-br from-secondary to-white p-10 text-center"
              >
                <p className="text-xl font-semibold text-foreground mb-2">No case studies match your filters</p>
                <p className="text-sm text-muted-foreground mx-auto max-w-md leading-relaxed">
                  Try adjusting the search, picking a different industry / service, or clear all filters to see the full portfolio.
                </p>
                {activeCount > 0 && (
                  <motion.button
                    type="button"
                    onClick={handleClearAll}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="mt-6 inline-flex items-center justify-center rounded-md bg-accent-orange px-6 h-10 text-sm font-semibold text-white shadow-[var(--shadow-accent-orange)] hover:shadow-[var(--shadow-accent-orange)] transition-all"
                  >
                    Clear all filters
                  </motion.button>
                )}
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:gap-8"
              >
                <AnimatePresence mode="popLayout">
                  {studies.map((study, idx) => (
                    <motion.div
                      key={study.id}
                      layout
                      initial={{ opacity: 0, scale: 0.95, y: 20 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.4, delay: Math.min(idx * 0.05, 0.25), ease: [0.22, 1, 0.36, 1] }}
                      className="h-full"
                    >
                      <TiltCard
                        slug={study.slug}
                        image={study.image_url}
                        title={study.title}
                        category={industryBadgeForCard(study)}
                        excerpt={study.excerpt}
                      />
                    </motion.div>
                  ))}
                </AnimatePresence>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}

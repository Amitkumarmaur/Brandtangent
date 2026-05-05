"use client"

import { useState, useEffect, useMemo } from "react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"
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
    const centerX = rect.width / 2
    const centerY = rect.height / 2
    setRotateX(((y - centerY) / centerY) * -15)
    setRotateY(((x - centerX) / centerX) * 15)
  }

  const handleMouseLeave = () => {
    setRotateX(0)
    setRotateY(0)
  }

  return (
    <Link
      href={`/case-studies/${slug}`}
      className="block h-full rounded-[1.5rem] outline-none focus-visible:ring-2 focus-visible:ring-ignite-orange focus-visible:ring-offset-2"
    >
      <motion.div
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        animate={{ rotateX, rotateY, scale: rotateX === 0 && rotateY === 0 ? 1 : 1.02 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
        className="group relative h-[380px] w-full cursor-pointer overflow-hidden rounded-[1.5rem] border border-grey-200 shadow-xl md:h-[440px]"
        style={{ transformStyle: "preserve-3d", perspective: 1200 }}
      >
        <Image
          src={image}
          alt={title}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="pointer-events-none absolute inset-0 object-cover object-center transition-transform duration-700 group-hover:scale-105"
        />
        <div
          className="absolute inset-0 z-[1] bg-gradient-to-t from-black/85 via-black/35 to-transparent"
          aria-hidden
        />
        <div className="absolute bottom-0 left-0 right-0 z-[2] flex flex-col p-6 md:p-8">
          <span className="mb-2 text-xs font-medium uppercase tracking-wide text-ignite-orange">
            {category}
          </span>
          <h3 className="font-heading text-2xl font-semibold leading-tight tracking-tight text-white md:text-[1.65rem]">
            {title}
          </h3>
          {excerpt ? (
            <p className="mt-3 text-sm text-white/70 line-clamp-2 md:opacity-90 md:group-hover:opacity-100 transition-opacity">
              {excerpt}
            </p>
          ) : null}
          <span className="mt-4 flex items-center gap-2 text-sm font-medium text-white transition-all group-hover:gap-3">
            View case study
            <span className="text-ignite-orange" aria-hidden>
              →
            </span>
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

  // One-time fetch of every published case study with both FK joins
  // (industry + service). All filtering is done client-side against this list.
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

    return () => {
      cancelled = true
    }
  }, [])

  useEffect(() => {
    const raw = searchParams.get("industry")?.trim()
    if (!raw) return
    try {
      setActiveIndustrySlug(decodeURIComponent(raw))
    } catch {
      setActiveIndustrySlug(raw)
    }
  }, [searchParams])

  /**
   * Industry options for the sidebar. Only includes industries that actually
   * have at least one published case study, and narrows further when the user
   * types in the search box.
   */
  const industryOptions = useMemo<FilterOption[]>(() => {
    const bySlug = new Map<string, { slug: string; name: string; order: number }>()
    for (const s of allStudies) {
      if (!s.industry_slug) continue
      const idx = industryOrder.findIndex((i) => i.slug === s.industry_slug)
      bySlug.set(s.industry_slug, {
        slug: s.industry_slug,
        name: s.industry,
        order: idx === -1 ? 999 : idx,
      })
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
      if (!bySlug.has(s.service_slug)) {
        bySlug.set(s.service_slug, { slug: s.service_slug, name: s.service_name })
      }
    }
    return [...bySlug.values()]
      .sort((a, b) => a.name.localeCompare(b.name))
      .filter((o) => includesCaseInsensitive(o.name, query))
  }, [allStudies, query])

  useEffect(() => {
    if (!activeIndustrySlug || loading) return
    if (industryOptions.length === 0) return
    const valid = industryOptions.some((o) => o.slug === activeIndustrySlug)
    if (!valid) setActiveIndustrySlug(null)
  }, [loading, industryOptions, activeIndustrySlug])

  /**
   * Visible case studies. Combines three facets with AND logic:
   *   - active industry chip
   *   - active service chip
   *   - free-text search against industry name, service name, or title
   */
  const studies = useMemo(() => {
    return allStudies.filter((s) => {
      if (activeIndustrySlug && s.industry_slug !== activeIndustrySlug) return false
      if (activeServiceSlug && s.service_slug !== activeServiceSlug) return false
      if (query) {
        const matches =
          includesCaseInsensitive(s.industry, query) ||
          includesCaseInsensitive(s.service_name, query) ||
          includesCaseInsensitive(s.title, query)
        if (!matches) return false
      }
      return true
    })
  }, [allStudies, activeIndustrySlug, activeServiceSlug, query])

  const activeCount =
    (query ? 1 : 0) +
    (activeIndustrySlug ? 1 : 0) +
    (activeServiceSlug ? 1 : 0)

  const handleClearAll = () => {
    setQuery("")
    setActiveIndustrySlug(null)
    setActiveServiceSlug(null)
  }

  return (
    <section className="bg-grey-100 py-16 md:py-20">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* Intro credibility strip — full-width before the filter / grid layout. */}
        <div className="mb-12 grid grid-cols-1 gap-6 md:mb-14 md:grid-cols-3">
          <div className="rounded-2xl border border-grey-200 bg-white p-6">
            <p className="font-heading text-3xl font-semibold text-foreground">AI-first</p>
            <p className="mt-2 text-body text-grey-400">
              Workflows, agents, and integrations that scale with your GTM motion.
            </p>
          </div>
          <div className="rounded-2xl border border-grey-200 bg-white p-6">
            <p className="font-heading text-3xl font-semibold text-foreground">Measurable</p>
            <p className="mt-2 text-body text-grey-400">
              Every engagement ties back to pipeline, retention, or efficiency you can report on.
            </p>
          </div>
          <div className="rounded-2xl border border-grey-200 bg-white p-6">
            <p className="font-heading text-3xl font-semibold text-foreground">B2B depth</p>
            <p className="mt-2 text-body text-grey-400">
              Complex buying journeys, compliance-aware stacks, and stakeholder-ready storytelling.
            </p>
          </div>
        </div>

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
            <div className="mb-6 flex items-baseline justify-between gap-4">
              <p className="text-sm text-grey-500">
                {loading
                  ? "Loading case studies…"
                  : studies.length === 1
                    ? "Showing 1 case study"
                    : `Showing ${studies.length} case studies`}
                {activeCount > 0 && !loading ? ` · ${activeCount} filter${activeCount === 1 ? "" : "s"} applied` : ""}
              </p>
            </div>

            {loadError && (
              <p className="mb-8 text-sm text-red-600" role="alert">
                Could not load case studies: {loadError}
              </p>
            )}

            {loading ? (
              <div className="flex min-h-[360px] items-center justify-center">
                <div
                  className="h-10 w-10 animate-spin rounded-full border-4 border-ignite-orange border-t-transparent"
                  role="status"
                  aria-label="Loading case studies"
                />
              </div>
            ) : studies.length === 0 && !loadError ? (
              <div className="rounded-2xl border border-grey-200 bg-white p-10 text-center">
                <p className="font-heading text-xl font-semibold text-foreground mb-2">
                  No case studies match your filters
                </p>
                <p className="text-body text-grey-400 mx-auto max-w-md">
                  Try adjusting the search, picking a different industry / service, or clear all
                  filters to see the full portfolio.
                </p>
                {activeCount > 0 && (
                  <button
                    type="button"
                    onClick={handleClearAll}
                    className="mt-6 inline-flex items-center justify-center rounded-full bg-foreground px-6 py-2.5 text-sm font-semibold text-white hover:bg-grey-800 transition-colors"
                  >
                    Clear all filters
                  </button>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 md:gap-7">
                <AnimatePresence mode="popLayout">
                  {studies.map((study, idx) => (
                    <motion.div
                      key={study.id}
                      layout
                      initial={{ opacity: 0, scale: 0.96 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.96 }}
                      transition={{ duration: 0.35, delay: Math.min(idx * 0.05, 0.25) }}
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
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}

"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"
import { CornerDownRight } from "lucide-react"
import {
  ALL_CASE_STUDIES_LABEL,
  buildCaseStudyFilterCategoryList,
  caseStudyMatchesContentCategorySlug,
  caseStudyRowToListItem,
  fetchCaseStudiesForCategoryFilter,
  fetchContentCategories,
  flattenCaseStudyContentCategories,
  primaryCaseStudyCategoryBadge,
  sortContentCategories,
  type CaseStudyListItem,
  type CaseStudyRowWithCategories,
} from "@/lib/content-categories"

function categoryBadgeForCard(item: CaseStudyListItem, activeCategorySlug: string | null): string {
  if (activeCategorySlug && item.content_categories?.some((c) => c.slug === activeCategorySlug)) {
    const hit = item.content_categories.find((c) => c.slug === activeCategorySlug)
    if (hit?.name) return hit.name
  }
  return primaryCaseStudyCategoryBadge(item.content_categories, item.industry)
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
    <Link href={`/case-studies/${slug}`} className="block h-full outline-none focus-visible:ring-2 focus-visible:ring-ignite-orange focus-visible:ring-offset-2 rounded-[1.5rem]">
      <motion.div
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        animate={{ rotateX, rotateY, scale: rotateX === 0 && rotateY === 0 ? 1 : 1.02 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
        className="relative w-full h-[400px] md:h-[450px] lg:h-[500px] rounded-[1.5rem] overflow-hidden cursor-pointer shadow-xl group border border-grey-200"
        style={{ transformStyle: "preserve-3d", perspective: 1200 }}
      >
        <Image
          src={image}
          alt={title}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="absolute inset-0 object-cover object-center pointer-events-none transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-transparent z-[1]" aria-hidden />
        <div className="absolute bottom-0 left-0 right-0 z-[2] p-6 md:p-8 flex flex-col">
          <span className="text-ignite-orange font-medium tracking-wide uppercase text-xs mb-2">
            {category}
          </span>
          <h3 className="font-heading text-white text-2xl md:text-3xl font-semibold tracking-tight leading-tight">
            {title}
          </h3>
          {excerpt ? (
            <p className="mt-3 text-sm text-white/70 line-clamp-2 md:opacity-90 md:group-hover:opacity-100 transition-opacity">
              {excerpt}
            </p>
          ) : null}
          <span className="mt-4 text-sm font-medium text-white flex items-center gap-2 group-hover:gap-3 transition-all">
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
  const [activeCategorySlug, setActiveCategorySlug] = useState<string | null>(null)
  const [studies, setStudies] = useState<CaseStudyListItem[]>([])
  const [filterCategories, setFilterCategories] = useState<{ name: string; slug: string }[]>([])
  const [loadError, setLoadError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const fetchGeneration = useRef(0)

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      const fromDb = await fetchContentCategories()
      if (cancelled) return
      if (fromDb.length > 0) {
        setFilterCategories(sortContentCategories(fromDb).map((c) => ({ name: c.name, slug: c.slug })))
        return
      }
      const res = await fetchCaseStudiesForCategoryFilter(null)
      if (cancelled) return
      const mappedAll = (res.data ?? []).map(caseStudyRowToListItem)
      setFilterCategories(
        buildCaseStudyFilterCategoryList([], mappedAll).map((c) => ({ name: c.name, slug: c.slug }))
      )
    })()
    return () => {
      cancelled = true
    }
  }, [])

  useEffect(() => {
    const gen = ++fetchGeneration.current
    let cancelled = false

    ;(async () => {
      setLoading(true)
      setLoadError(null)

      const res = await fetchCaseStudiesForCategoryFilter(activeCategorySlug)

      if (cancelled || fetchGeneration.current !== gen) return

      if (res.error) {
        setLoadError(res.error.message)
        setStudies([])
        setLoading(false)
        return
      }

      const rowsRaw = (res.data ?? []) as CaseStudyRowWithCategories[]
      const slug = activeCategorySlug
      const rowsFiltered = slug
        ? rowsRaw.filter((row) =>
            flattenCaseStudyContentCategories(row).some((c) => c.slug === slug)
          )
        : rowsRaw

      const mapped = rowsFiltered.map(caseStudyRowToListItem)
      const studiesFiltered = slug
        ? mapped.filter((s) => caseStudyMatchesContentCategorySlug(s, slug))
        : mapped

      setStudies(studiesFiltered)
      setLoading(false)
    })()

    return () => {
      cancelled = true
    }
  }, [activeCategorySlug])

  return (
    <section className="py-16 md:py-20 bg-grey-100">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-14">
          <div className="rounded-2xl border border-grey-200 bg-white p-6">
            <p className="font-heading text-3xl font-semibold text-foreground">AI-first</p>
            <p className="mt-2 text-body text-grey-400">Workflows, agents, and integrations that scale with your GTM motion.</p>
          </div>
          <div className="rounded-2xl border border-grey-200 bg-white p-6">
            <p className="font-heading text-3xl font-semibold text-foreground">Measurable</p>
            <p className="mt-2 text-body text-grey-400">Every engagement ties back to pipeline, retention, or efficiency you can report on.</p>
          </div>
          <div className="rounded-2xl border border-grey-200 bg-white p-6">
            <p className="font-heading text-3xl font-semibold text-foreground">B2B depth</p>
            <p className="mt-2 text-body text-grey-400">Complex buying journeys, compliance-aware stacks, and stakeholder-ready storytelling.</p>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-3 md:gap-6 mb-14 border-b border-grey-200 pb-6">
          <button
            type="button"
            onClick={() => setActiveCategorySlug(null)}
            className={`relative text-base md:text-lg font-light tracking-wide transition-colors duration-300 flex items-center group py-2 px-1 ${
              activeCategorySlug === null ? "text-foreground font-medium" : "text-grey-400 hover:text-grey-600"
            }`}
          >
            {activeCategorySlug === null && (
              <motion.div
                layoutId="caseStudiesActiveArrow"
                className="absolute -left-5 md:-left-6 flex items-center justify-center text-ignite-orange"
                transition={{ type: "spring", stiffness: 300, damping: 25 }}
              >
                <CornerDownRight className="w-4 h-4 md:w-5 md:h-5 -rotate-90" />
              </motion.div>
            )}
            <span>{ALL_CASE_STUDIES_LABEL}</span>
            {activeCategorySlug === null && (
              <motion.div
                layoutId="caseStudiesActiveUnderline"
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-foreground"
                style={{ y: 24 }}
              />
            )}
          </button>
          {filterCategories.map((cat) => {
            const isActive = activeCategorySlug === cat.slug
            return (
              <button
                type="button"
                key={cat.slug}
                onClick={() => setActiveCategorySlug(cat.slug)}
                className={`relative text-base md:text-lg font-light tracking-wide transition-colors duration-300 flex items-center group py-2 px-1 ${
                  isActive ? "text-foreground font-medium" : "text-grey-400 hover:text-grey-600"
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="caseStudiesActiveArrow"
                    className="absolute -left-5 md:-left-6 flex items-center justify-center text-ignite-orange"
                    transition={{ type: "spring", stiffness: 300, damping: 25 }}
                  >
                    <CornerDownRight className="w-4 h-4 md:w-5 md:h-5 -rotate-90" />
                  </motion.div>
                )}
                <span>{cat.name}</span>
                {isActive && (
                  <motion.div
                    layoutId="caseStudiesActiveUnderline"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-foreground"
                    style={{ y: 24 }}
                  />
                )}
              </button>
            )
          })}
        </div>

        {loadError && (
          <p className="text-sm text-red-600 mb-8 text-center" role="alert">
            Could not load case studies: {loadError}
          </p>
        )}

        {loading ? (
          <div className="min-h-[360px] flex items-center justify-center">
            <div
              className="w-10 h-10 border-4 border-ignite-orange border-t-transparent rounded-full animate-spin"
              role="status"
              aria-label="Loading case studies"
            />
          </div>
        ) : (
          <>
            {!loadError && studies.length === 0 && (
              <p className="text-body text-grey-400 text-center py-16 max-w-lg mx-auto">
                {activeCategorySlug
                  ? "No published case studies are tagged with this topic yet. Try another filter or view all work."
                  : "No published case studies yet. Add rows in Supabase (`case_studies` with published = true) to populate this grid."}
              </p>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
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
                      category={categoryBadgeForCard(study, activeCategorySlug)}
                      excerpt={study.excerpt}
                    />
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </>
        )}
      </div>
    </section>
  )
}

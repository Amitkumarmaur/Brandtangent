"use client"

import { useMemo, useState } from "react"
import Link from "next/link"
import { motion, AnimatePresence } from "motion/react"
import { ArrowUpRight } from "lucide-react"
import Image from "next/image"
import {
  pickInitialCategorySlug,
  type HomeProjectCard,
  type ProjectSectionServiceCategory,
} from "@/lib/projects-section-data"
import { SectionHeader } from "@/components/motion/section-reveal"
import { TiltCard } from "@/components/motion/tilt-card"

type Props = {
  cards: HomeProjectCard[]
  categories: ProjectSectionServiceCategory[]
  loadError?: string | null
}

function ProjectCard({ image, title, href }: { image: string; title: string; href: string }) {
  return (
    <Link
      href={href}
      className="block shrink-0 snap-center rounded-md outline-none focus-visible:ring-2 focus-visible:ring-primary"
    >
      <TiltCard intensity={8}>
        <div className="relative w-[85vw] sm:w-[280px] md:w-[320px] lg:w-[360px] flex-shrink-0 h-[280px] md:h-[340px] lg:h-[380px] rounded-md overflow-hidden cursor-pointer border border-border bg-secondary group shadow-[var(--shadow-1)] hover:shadow-[var(--shadow-glass)] transition-shadow duration-300">
          <Image
            src={image}
            alt={title}
            fill
            sizes="(max-width: 768px) 85vw, (max-width: 1024px) 320px, 360px"
            className="absolute inset-0 object-cover object-center pointer-events-none"
          />
          <div
            className="absolute inset-0 bg-gradient-to-t from-navy/92 via-navy/25 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10 flex flex-col justify-end p-6"
            style={{ transform: "translateZ(30px)" }}
          >
            <span className="text-primary-subdued text-xs font-normal tracking-widest uppercase mb-2 opacity-0 group-hover:opacity-100 transition-all duration-200">
              View case study
            </span>
            <h3 className="text-white text-lg lg:text-xl font-semibold opacity-0 translate-y-3 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 leading-tight">
              {title}
            </h3>
          </div>
        </div>
      </TiltCard>
    </Link>
  )
}

export default function ProjectsSectionClient({ cards, categories, loadError }: Props) {
  const countBySlug = useMemo(() => {
    const m = new Map<string, number>()
    for (const c of cards) m.set(c.serviceCategorySlug, (m.get(c.serviceCategorySlug) ?? 0) + 1)
    return m
  }, [cards])

  const [activeSlug, setActiveSlug] = useState<string>(() => pickInitialCategorySlug(categories, cards))

  const activeLabel = categories.find((c) => c.slug === activeSlug)?.name ?? "This category"
  const filteredProjects = cards.filter((p) => p.serviceCategorySlug === activeSlug)

  return (
    <section className="bg-background py-16 md:py-20 overflow-hidden border-t border-border">
      <div className="w-full max-w-7xl mx-auto px-6 lg:px-8 mb-12">
        <div className="flex flex-col xl:flex-row xl:items-end justify-between gap-8 lg:gap-12">
          <div>
            <SectionHeader
              eyebrow="Our work"
              title={
                <>
                  12+ years of craft,
                  <br className="hidden md:block" /> countless innovations
                </>
              }
            />
            {loadError ? (
              <p className="mt-4 text-sm text-red-600" role="alert">
                Could not load projects ({loadError}).
              </p>
            ) : null}
          </div>

          {/* Category filter + link */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.7, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-col md:flex-row items-start md:items-center gap-6 w-full xl:w-auto xl:justify-end"
          >
            <div className="flex items-center gap-2 whitespace-nowrap overflow-x-auto pb-3 md:pb-0 scrollbar-hide bg-secondary rounded-full p-1.5">
              {categories.map((cat) => {
                const isActive = activeSlug === cat.slug
                const isEmpty = (countBySlug.get(cat.slug) ?? 0) === 0
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setActiveSlug(cat.slug)}
                    disabled={isEmpty}
                    className={`text-[14px] font-normal transition-all duration-200 flex-shrink-0 px-4 py-2 rounded-full ${
                      isActive
                        ? "bg-accent-orange text-white shadow-[rgba(83,58,253,0.2)_0_4px_12px]"
                        : isEmpty
                          ? "text-muted-foreground/40 cursor-not-allowed"
                          : "text-muted-foreground hover:text-foreground hover:bg-white transition-colors"
                    }`}
                  >
                    {cat.name}
                  </button>
                )
              })}
            </div>

            <Link
              href="/case-studies"
              className="inline-flex items-center gap-1.5 text-[14px] text-accent-orange hover:text-accent-orange transition-colors shrink-0 font-[500] group"
            >
              View all
              <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" aria-hidden />
            </Link>
          </motion.div>
        </div>
      </div>

      {/* Project cards */}
      <div className="w-full pl-6 lg:pl-12 xl:pl-[calc((100vw-80rem)/2+3rem)]">
        {cards.length === 0 ? (
          <div className="max-w-2xl pr-6 text-body-mid text-base">
            <p>
              No published case studies yet. Add rows in Supabase{" "}
              <code className="text-sm font-mono">case_studies</code> with{" "}
              <code className="text-sm font-mono">published = true</code>.
            </p>
          </div>
        ) : categories.length === 0 ? (
          <div className="max-w-2xl pr-6 text-body-mid text-base">
            <p>Case studies exist but none are linked to a service category.</p>
          </div>
        ) : filteredProjects.length === 0 ? (
          <div className="max-w-2xl pr-6 text-body-mid text-base">
            <p>No published work in <strong className="text-foreground">{activeLabel}</strong> yet.</p>
            <Link href="/case-studies" className="mt-3 inline-flex items-center gap-1 text-sm text-foreground hover:underline">
              View all case studies <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        ) : (
          <div className="scrollbar-hide flex gap-5 md:gap-6 overflow-x-auto pb-8 pt-2 pr-6 lg:pr-12 xl:pr-[calc((100vw-80rem)/2+3rem)] scroll-smooth snap-x snap-mandatory">
            <AnimatePresence mode="popLayout">
              {filteredProjects.map((project, idx) => (
                <motion.div
                  key={`${project.id}-${activeSlug}`}
                  initial={{ opacity: 0, scale: 0.92, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.92, y: -20 }}
                  transition={{ duration: 0.4, delay: idx * 0.08, ease: [0.22, 1, 0.36, 1] }}
                  className="snap-center"
                >
                  <ProjectCard
                    image={project.image}
                    title={project.title}
                    href={`/case-studies/${project.slug}`}
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </section>
  )
}

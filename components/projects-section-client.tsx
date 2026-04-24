"use client"

import { useMemo, useState } from "react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { CornerDownRight } from "lucide-react"
import Image from "next/image"
import {
  pickInitialCategorySlug,
  type HomeProjectCard,
  type ProjectSectionServiceCategory,
} from "@/lib/projects-section-data"

type Props = {
  cards: HomeProjectCard[]
  categories: ProjectSectionServiceCategory[]
  loadError?: string | null
}

function TiltCard({ image, title, href }: { image: string; title: string; href: string }) {
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
      href={href}
      className="block shrink-0 snap-center rounded-[1.5rem] outline-none focus-visible:ring-2 focus-visible:ring-ignite-orange focus-visible:ring-offset-2"
    >
      <motion.div
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        animate={{ rotateX, rotateY, scale: rotateX === 0 && rotateY === 0 ? 1 : 1.05 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
        className="relative w-[85vw] sm:w-[280px] md:w-[320px] lg:w-[360px] flex-shrink-0 h-[300px] md:h-[360px] lg:h-[400px] rounded-[1.5rem] overflow-hidden cursor-pointer shadow-xl group border border-grey-200 bg-grey-100"
        style={{ transformStyle: "preserve-3d", perspective: 1200 }}
      >
        <Image
          src={image}
          alt={title}
          fill
          sizes="(max-width: 768px) 85vw, (max-width: 1024px) 320px, 360px"
          className="absolute inset-0 object-cover object-center pointer-events-none"
        />
        <div
          className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10 flex flex-col justify-end p-8"
          style={{ transform: "translateZ(40px)" }}
        >
          <span className="text-ignite-orange font-medium tracking-wide uppercase text-sm mb-2 opacity-0 -translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 delay-100">
            Click to view
          </span>
          <h3 className="font-heading text-white text-2xl font-semibold tracking-tight opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
            {title}
          </h3>
        </div>
      </motion.div>
    </Link>
  )
}

export default function ProjectsSectionClient({ cards, categories, loadError }: Props) {
  const countBySlug = useMemo(() => {
    const m = new Map<string, number>()
    for (const c of cards) {
      m.set(c.serviceCategorySlug, (m.get(c.serviceCategorySlug) ?? 0) + 1)
    }
    return m
  }, [cards])

  const [activeSlug, setActiveSlug] = useState<string>(() => pickInitialCategorySlug(categories, cards))

  const activeLabel = categories.find((c) => c.slug === activeSlug)?.name ?? "This category"

  const filteredProjects = cards.filter((p) => p.serviceCategorySlug === activeSlug)
  const displayProjects = filteredProjects

  return (
    <section className="bg-grey-100 relative py-16 md:py-20 overflow-hidden border-t border-grey-200">
      <div className="w-full max-w-7xl mx-auto px-6 lg:px-8 relative z-10 mb-8 md:mb-10">
        <div className="flex flex-col xl:flex-row xl:items-end justify-between gap-6 md:gap-8">
          <div className="flex-1 xl:flex-shrink-0 pr-4">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-2 h-2 rounded-full bg-ignite-orange" />
              <span className="font-heading text-ignite-orange font-medium tracking-wider uppercase text-sm">
                Our Work
              </span>
            </div>
            <h2 className="font-heading text-3xl md:text-4xl lg:text-5xl font-semibold text-foreground tracking-tight leading-tight max-w-3xl">
              10+ Years Exp but <br className="hidden md:block" />
              Countless Innovations
            </h2>
            {loadError ? (
              <p className="mt-3 text-sm text-red-600" role="alert">
                Could not load projects ({loadError}). Showing cached layout if available.
              </p>
            ) : null}
          </div>

          <div className="flex flex-col md:flex-row items-start md:items-center justify-start gap-6 w-full xl:w-auto xl:justify-end overflow-hidden">
            <div className="flex items-center gap-6 md:gap-8 whitespace-nowrap overflow-x-auto pb-4 md:pb-0 scrollbar-hide w-full justify-start px-2">
              {categories.map((cat) => {
                const isActive = activeSlug === cat.slug
                const count = countBySlug.get(cat.slug) ?? 0
                const isEmpty = count === 0
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setActiveSlug(cat.slug)}
                    className="relative text-base md:text-lg font-light tracking-wide transition-colors duration-300 flex items-center group flex-shrink-0"
                  >
                    {isActive && (
                      <motion.div
                        layoutId="activeArrowProjectsLight"
                        className="absolute -left-5 md:-left-6 flex items-center justify-center text-ignite-orange"
                        transition={{ type: "spring", stiffness: 300, damping: 25 }}
                      >
                        <CornerDownRight className="w-4 h-4 md:w-5 md:h-5 -rotate-90" />
                      </motion.div>
                    )}
                    <span
                      className={
                        isActive
                          ? "text-foreground font-medium"
                          : isEmpty
                            ? "text-grey-300 group-hover:text-grey-500"
                            : "text-grey-400 group-hover:text-grey-600"
                      }
                    >
                      {cat.name}
                    </span>
                  </button>
                )
              })}
            </div>

            <Link
              href="/case-studies"
              className="bg-foreground hover:bg-grey-800 transition-colors text-white font-medium tracking-wide text-sm md:text-base py-2.5 md:py-3 px-6 md:px-8 rounded-full shadow-lg flex-shrink-0 mt-2 md:mt-0 text-center"
            >
              View More
            </Link>
          </div>
        </div>
      </div>

      <div className="w-full pl-6 lg:pl-8 xl:pl-[calc((100vw-80rem)/2+2rem)] relative z-10">
        {cards.length === 0 ? (
          <div className="max-w-2xl pr-6 text-body text-grey-400">
            <p>
              No published case studies yet. Add rows in Supabase{" "}
              <code className="text-sm font-mono">case_studies</code> with{" "}
              <code className="text-sm font-mono">published = true</code>, link a{" "}
              <code className="text-sm font-mono">service</code> (so a{" "}
              <code className="text-sm font-mono">service_categories</code> tab appears), and add a hero image.
            </p>
            <Link
              href="/case-studies"
              className="mt-4 inline-block text-sm font-semibold text-ignite-orange hover:underline"
            >
              Open case studies →
            </Link>
          </div>
        ) : categories.length === 0 ? (
          <div className="max-w-2xl pr-6 text-body text-grey-400">
            <p>
              Case studies exist but none are linked to a service category. Set{" "}
              <code className="text-sm font-mono">linked_service_id</code> on each published case study to a service
              that belongs to a <code className="text-sm font-mono">service_categories</code> row.
            </p>
          </div>
        ) : displayProjects.length === 0 ? (
          <div className="max-w-2xl pr-6 text-body text-grey-400">
            <p>
              No published work in <strong className="text-foreground">{activeLabel}</strong> yet. Pick another
              category above or browse the full library.
            </p>
            <Link
              href="/case-studies"
              className="mt-4 inline-block text-sm font-semibold text-ignite-orange hover:underline"
            >
              View all case studies →
            </Link>
          </div>
        ) : (
          <div className="hide-scroll flex gap-4 md:gap-6 lg:gap-8 overflow-x-auto pb-8 pt-2 pr-6 lg:pr-8 xl:pr-[calc((100vw-80rem)/2+2rem)] scroll-smooth snap-x snap-mandatory">
            <AnimatePresence mode="popLayout">
              {displayProjects.map((project, idx) => (
                <motion.div
                  key={`${project.id}-${activeSlug}`}
                  initial={{ opacity: 0, scale: 0.9, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9, y: -20 }}
                  transition={{ duration: 0.4, delay: idx * 0.1 }}
                  className="snap-center"
                >
                  <TiltCard
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

      <style
        dangerouslySetInnerHTML={{
          __html: `
        .hide-scroll::-webkit-scrollbar {
          display: none;
        }
        .hide-scroll {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `,
        }}
      />
    </section>
  )
}

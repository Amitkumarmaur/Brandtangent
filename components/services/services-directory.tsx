"use client"

import Image from "next/image"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { categoryUrl, serviceUrl } from "@/lib/services-urls"
import { motion } from "motion/react"

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1551434678-e076c223a692?auto=format&fit=crop&q=80&w=1200&h=675"

export type ServiceCategoryRow = {
  id: string
  name: string
  slug: string
  display_order: number | null
  hero_description?: string | null
}

export type ServiceListRow = {
  id: string
  slug: string
  name: string
  hero_h1: string | null
  hero_description: string | null
  hero_image: string | null
  short_description: string | null
  description: string | null
  category_id: string | null
  display_order: number | null
}

function sortByDisplayOrder<T extends { display_order: number | null }>(rows: T[]): T[] {
  return [...rows].sort((a, b) => (a.display_order ?? 999) - (b.display_order ?? 999))
}

type CategoryIndexEntry = {
  category: ServiceCategoryRow
  slug: string
  services: ServiceListRow[]
}

function categoriesForDirectory(
  categories: ServiceCategoryRow[],
  services: ServiceListRow[],
): CategoryIndexEntry[] {
  const sorted = sortByDisplayOrder(categories)
  const out: CategoryIndexEntry[] = []
  for (const c of sorted) {
    const slug = (c.slug ?? "").trim()
    const list = sortByDisplayOrder(services.filter((s) => s.category_id === c.id))
    if (!slug || list.length === 0) continue
    out.push({ category: c, slug, services: list })
  }
  return out
}

function uncategorizedServices(
  categories: ServiceCategoryRow[],
  services: ServiceListRow[],
): ServiceListRow[] {
  const slugByCatId = new Map(categories.map((c) => [c.id, (c.slug ?? "").trim()] as const))
  return sortByDisplayOrder(
    services.filter((s) => {
      if (!s.category_id) return true
      const slug = slugByCatId.get(s.category_id)
      return !slug
    }),
  )
}

function ServiceCard({
  service,
  categorySlug,
  idx,
}: {
  service: ServiceListRow
  categorySlug: string | null
  idx: number
}) {
  const title = (service.hero_h1 ?? service.name).trim() || "Service"
  const blurb =
    (service.short_description ?? service.hero_description ?? service.description ?? "").trim() || ""
  const image = (service.hero_image ?? "").trim() || FALLBACK_IMAGE

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.5, delay: idx * 0.08, ease: [0.22, 1, 0.36, 1] }}
    >
      <Link
        href={serviceUrl(categorySlug, service.slug)}
        className="group flex flex-col h-full rounded-md overflow-hidden border border-border bg-white hover:border-accent-orange/30 hover:shadow-[var(--shadow-accent-orange-soft)] transition-all duration-300 focus-visible:shadow-[var(--shadow-accent-orange-soft)] outline-none"
      >
        <div className="relative aspect-[16/10] w-full overflow-hidden bg-gradient-to-br from-secondary to-border">
          <Image
            src={image}
            alt={title}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-110"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          <div
            className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            aria-hidden
          />
          <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between gap-3">
            <span className="text-xs font-semibold uppercase tracking-widest text-white/80 group-hover:text-white transition-colors line-clamp-1">
              {service.name}
            </span>
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-accent-orange text-white group-hover:scale-110 transition-transform shadow-lg">
              <ArrowRight className="w-4 h-4" aria-hidden />
            </span>
          </div>
        </div>
        <div className="flex flex-col flex-grow p-6 md:p-7">
          <h3 className="text-xl md:text-2xl font-semibold text-foreground leading-snug group-hover:text-accent-orange transition-colors">
            {title}
          </h3>
          {blurb ? <p className="mt-3 text-sm text-muted-foreground line-clamp-3 flex-grow leading-relaxed">{blurb}</p> : null}
          <span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-accent-orange group-hover:gap-3 transition-all">
            View service details
            <ArrowRight className="w-3.5 h-3.5" aria-hidden />
          </span>
        </div>
      </Link>
    </motion.div>
  )
}

function CategoryDirectoryCard({ entry, idx }: { entry: CategoryIndexEntry; idx: number }) {
  const { category, slug, services } = entry
  const title = (category.name ?? "").trim() || "Category"
  const blurb = ((category.hero_description ?? "").trim() || "").slice(0, 220)
  const previewImage =
    (services[0]?.hero_image ?? "").trim() || FALLBACK_IMAGE
  const count = services.length

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.5, delay: idx * 0.08, ease: [0.22, 1, 0.36, 1] }}
    >
      <Link
        href={categoryUrl(slug)}
        className="group flex flex-col h-full rounded-md overflow-hidden border border-border bg-white hover:border-accent-orange/30 hover:shadow-[var(--shadow-accent-orange-soft)] transition-all duration-300 focus-visible:shadow-[var(--shadow-accent-orange-soft)] outline-none"
      >
        <div className="relative aspect-[16/10] w-full overflow-hidden bg-gradient-to-br from-secondary to-border">
          <Image
            src={previewImage}
            alt={`${title} â€” category preview`}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-110"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          <div
            className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            aria-hidden
          />
          <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between gap-3">
            <span className="text-xs font-semibold uppercase tracking-widest text-white/80 group-hover:text-white transition-colors">
              {count} service{count === 1 ? "" : "s"}
            </span>
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-accent-orange text-white group-hover:scale-110 transition-transform shadow-lg">
              <ArrowRight className="w-4 h-4" aria-hidden />
            </span>
          </div>
        </div>
        <div className="flex flex-col flex-grow p-6 md:p-7">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-2 h-2 rounded-full bg-accent-orange" />
            <span className="text-xs uppercase tracking-widest text-accent-orange font-semibold">Category</span>
          </div>
          <h2 className="display-sm text-foreground leading-snug group-hover:text-accent-orange transition-colors">
            {title}
          </h2>
          {blurb ? (
            <p className="mt-4 text-sm text-muted-foreground line-clamp-3 flex-grow leading-relaxed">{blurb}</p>
          ) : (
            <p className="mt-4 text-sm text-muted-foreground flex-grow leading-relaxed">
              Open the full category page for methodology, capabilities, industries, and every service we deliver in this lane.
            </p>
          )}
          <span className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-accent-orange group-hover:gap-3 transition-all">
            View category
            <ArrowRight className="w-3.5 h-3.5" aria-hidden />
          </span>
        </div>
      </Link>
    </motion.div>
  )
}

export default function ServicesDirectory({
  categories,
  services,
}: {
  categories: ServiceCategoryRow[]
  services: ServiceListRow[]
}) {
  const categoryEntries = categoriesForDirectory(categories, services)
  const uncategorized = uncategorizedServices(categories, services)
  const hasAnyServices = services.length > 0

  return (
    <div className="bg-white py-24 md:py-32">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Intro section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="mb-16 lg:mb-20"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                title: "Strategy â†’ identity",
                body: "We map brand positioning first, then craft identity, content, and digital experiences that stay coherent.",
              },
              {
                title: "Creative-native delivery",
                body: "Design, strategy, and brand systems baked together â€” not siloed after the brief is written.",
              },
              {
                title: "Category depth",
                body: "Long sales cycles, complex stakeholders, and prestige markets: narrative and UX built for real decision-makers.",
              },
            ].map((item, i) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.5, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }}
                className="rounded-md border border-border bg-gradient-to-br from-secondary to-white px-8 py-7 hover:border-accent-orange/30 hover:shadow-[var(--shadow-accent-orange-soft)] transition-all duration-300"
              >
                <p className="text-lg font-semibold text-foreground">{item.title}</p>
                <p className="mt-3 text-sm text-muted-foreground leading-relaxed">{item.body}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {!hasAnyServices ? (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-md border border-border bg-gradient-to-br from-secondary to-white p-12 text-center"
          >
            <p className="text-2xl font-semibold text-foreground mb-3">Services are on the way</p>
            <p className="text-sm text-muted-foreground max-w-lg mx-auto mb-8 leading-relaxed">
              We could not load offerings from the database yet. Once your services rows are live in Supabase,
              they will appear here automatically.
            </p>
            <Link
              href="/"
              className="inline-flex items-center justify-center rounded-md bg-accent-orange px-8 h-11 text-sm font-semibold text-white shadow-[var(--shadow-accent-orange)] hover:shadow-[var(--shadow-accent-orange)] transition-all hover:scale-105 active:scale-95"
            >
              Back to home
            </Link>
          </motion.div>
        ) : (
          <div className="space-y-20 md:space-y-24">
            {categoryEntries.length > 0 ? (
              <section className="scroll-mt-28">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-60px" }}
                  transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                  className="mb-12 md:mb-16 max-w-3xl"
                >
                  <p className="text-xs md:text-sm font-semibold text-accent-orange uppercase tracking-widest mb-4">Browse</p>
                  <h2 className="display-lg text-foreground mb-4">
                    Service categories
                  </h2>
                  <p className="text-lg text-muted-foreground max-w-2xl">
                    Each category opens its own page with hero, capabilities, process, tech stack, and proof â€” all
                    driven from your Supabase content.
                  </p>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true, margin: "-60px" }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                  className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 lg:gap-8"
                >
                  {categoryEntries.map((entry, idx) => (
                    <CategoryDirectoryCard key={entry.category.id} entry={entry} idx={idx} />
                  ))}
                </motion.div>
              </section>
            ) : null}

            {uncategorized.length > 0 ? (
              <section className="scroll-mt-28">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-60px" }}
                  transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                  className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-12 md:mb-16"
                >
                  <div>
                    <p className="text-xs md:text-sm font-semibold text-accent-orange uppercase tracking-widest mb-4">Portfolio</p>
                    <h2 className="display-lg text-foreground mb-3">
                      More capabilities
                    </h2>
                    <p className="text-sm text-muted-foreground max-w-2xl leading-relaxed">
                      These offerings are not grouped under a category yet. Each card still opens the full service detail page.
                    </p>
                  </div>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true, margin: "-60px" }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                  className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 lg:gap-8"
                >
                  {uncategorized.map((s, idx) => (
                    <ServiceCard
                      key={s.id}
                      service={s}
                      categorySlug={categories.find((c) => c.id === s.category_id)?.slug?.trim() || null}
                      idx={idx}
                    />
                  ))}
                </motion.div>
              </section>
            ) : null}
          </div>
        )}

        {hasAnyServices ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="mt-24 md:mt-28 rounded-md bg-gradient-to-br from-primary to-ink-strong px-8 py-12 md:px-14 md:py-14 text-center shadow-[rgba(83,58,253,0.3)_0_16px_48px]"
          >
            <h2 className="text-2xl md:text-3xl font-semibold text-white mb-4 text-balance">
              Not sure which service fits first?
            </h2>
            <p className="text-sm text-white/80 max-w-2xl mx-auto mb-8 leading-relaxed">
              Tell us about your brand, goals, and timeline â€” we will recommend a phased roadmap that compounds over quarters.
            </p>
            <Link
              href="/#contact"
              className="inline-flex items-center justify-center rounded-md bg-white px-8 h-11 text-sm font-semibold text-accent-orange hover:shadow-[rgba(255,255,255,0.3)_0_8px_24px] transition-all hover:scale-105 active:scale-95"
            >
              Work with Brandtangent
            </Link>
          </motion.div>
        ) : null}
      </div>
    </div>
  )
}

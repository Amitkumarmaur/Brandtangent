import Image from "next/image"
import Link from "next/link"
import { ArrowUpRight } from "lucide-react"
import { categoryUrl, serviceUrl } from "@/lib/services-urls"

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
}: {
  service: ServiceListRow
  categorySlug: string | null
}) {
  const title = (service.hero_h1 ?? service.name).trim() || "Service"
  const blurb =
    (service.short_description ?? service.hero_description ?? service.description ?? "").trim() || ""
  const image = (service.hero_image ?? "").trim() || FALLBACK_IMAGE

  return (
    <Link
      href={serviceUrl(categorySlug, service.slug)}
      className="group flex flex-col h-full rounded-[1.5rem] overflow-hidden border border-grey-200 bg-white shadow-sm hover:shadow-md hover:border-grey-300 transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ignite-orange focus-visible:ring-offset-2"
    >
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-grey-100">
        <Image
          src={image}
          alt={title}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        <div
          className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-80"
          aria-hidden
        />
        <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between gap-3">
          <span className="text-xs font-semibold uppercase tracking-wider text-white/90 line-clamp-1">
            {service.name}
          </span>
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/95 text-foreground group-hover:bg-ignite-orange group-hover:text-white transition-colors">
            <ArrowUpRight className="w-4 h-4" aria-hidden />
          </span>
        </div>
      </div>
      <div className="flex flex-col flex-grow p-6 md:p-7">
        <h3 className="font-heading text-xl md:text-2xl font-semibold text-foreground leading-snug group-hover:text-ignite-orange transition-colors">
          {title}
        </h3>
        {blurb ? <p className="mt-3 text-body text-grey-400 line-clamp-3 flex-grow">{blurb}</p> : null}
        <span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-foreground group-hover:gap-3 transition-all">
          View service details
          <span className="text-ignite-orange" aria-hidden>
            →
          </span>
        </span>
      </div>
    </Link>
  )
}

function CategoryDirectoryCard({ entry }: { entry: CategoryIndexEntry }) {
  const { category, slug, services } = entry
  const title = (category.name ?? "").trim() || "Category"
  const blurb = ((category.hero_description ?? "").trim() || "").slice(0, 220)
  const previewImage =
    (services[0]?.hero_image ?? "").trim() || FALLBACK_IMAGE
  const count = services.length

  return (
    <Link
      href={categoryUrl(slug)}
      className="group flex flex-col h-full rounded-[1.5rem] overflow-hidden border border-grey-200 bg-white shadow-sm hover:shadow-md hover:border-grey-300 transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ignite-orange focus-visible:ring-offset-2"
    >
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-grey-100">
        <Image
          src={previewImage}
          alt={`${title} — category preview`}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        <div
          className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent opacity-90"
          aria-hidden
        />
        <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between gap-3">
          <span className="text-xs font-semibold uppercase tracking-wider text-white/90">
            {count} service{count === 1 ? "" : "s"}
          </span>
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/95 text-foreground group-hover:bg-ignite-orange group-hover:text-white transition-colors">
            <ArrowUpRight className="w-4 h-4" aria-hidden />
          </span>
        </div>
      </div>
      <div className="flex flex-col flex-grow p-6 md:p-7">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-2 h-2 rounded-full bg-ignite-orange" />
          <span className="text-sm uppercase tracking-wider text-ignite-orange font-medium">Category</span>
        </div>
        <h2 className="font-heading text-2xl md:text-3xl font-semibold text-foreground leading-snug group-hover:text-ignite-orange transition-colors">
          {title}
        </h2>
        {blurb ? (
          <p className="mt-4 text-body text-grey-400 line-clamp-3 flex-grow">{blurb}</p>
        ) : (
          <p className="mt-4 text-body text-grey-400 flex-grow">
            Open the full category page for methodology, stack, industries, and every capability we ship in this
            lane.
          </p>
        )}
        <span className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-foreground group-hover:gap-3 transition-all">
          View category
          <span className="text-ignite-orange" aria-hidden>
            →
          </span>
        </span>
      </div>
    </Link>
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
    <div className="bg-grey-100 pb-20 md:pb-24">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-6 mb-16 md:mb-20">
          {[
            {
              title: "Strategy → systems",
              body: "We map GTM constraints first, then ship automation, content, and data flows that stay maintainable.",
            },
            {
              title: "AI-native delivery",
              body: "Agents, integrations, and measurement baked in — not bolted on after launch.",
            },
            {
              title: "B2B depth",
              body: "Long cycles, compliance, and multi-stakeholder buying: UX and narrative built for real committees.",
            },
          ].map((item) => (
            <div
              key={item.title}
              className="rounded-2xl border border-grey-200 bg-white px-6 py-7 shadow-sm"
            >
              <p className="font-heading text-lg font-semibold text-foreground">{item.title}</p>
              <p className="mt-2 text-body text-grey-400">{item.body}</p>
            </div>
          ))}
        </div>

        {!hasAnyServices ? (
          <div className="rounded-2xl border border-grey-200 bg-white p-12 text-center">
            <p className="font-heading text-2xl text-foreground mb-3">Services are on the way</p>
            <p className="text-body text-grey-400 max-w-lg mx-auto mb-8">
              We could not load offerings from the database yet. Once your `services` rows are live in Supabase,
              they will appear here automatically.
            </p>
            <Link
              href="/"
              className="inline-flex items-center justify-center rounded-full bg-foreground px-8 py-3 text-sm font-semibold text-white hover:bg-grey-800 transition-colors"
            >
              Back to home
            </Link>
          </div>
        ) : (
          <div className="space-y-16 md:space-y-20">
            {categoryEntries.length > 0 ? (
              <section className="scroll-mt-28">
                <div className="mb-10 md:mb-12 max-w-3xl">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-2 h-2 rounded-full bg-ignite-orange" />
                    <span className="text-sm uppercase tracking-wider text-grey-400 font-medium">Browse</span>
                  </div>
                  <h2 className="heading-h2 text-foreground">Service categories</h2>
                  <p className="mt-5 text-subtitle text-grey-400 max-w-2xl">
                    Each category opens its own page with hero, capabilities, process, tech stack, and proof — all
                    driven from your Supabase content.
                  </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 lg:gap-8">
                  {categoryEntries.map((entry) => (
                    <CategoryDirectoryCard key={entry.category.id} entry={entry} />
                  ))}
                </div>
              </section>
            ) : null}

            {uncategorized.length > 0 ? (
              <section className="scroll-mt-28">
                <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8 md:mb-10">
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-2 h-2 rounded-full bg-ignite-orange" />
                      <span className="text-sm uppercase tracking-wider text-grey-400 font-medium">Portfolio</span>
                    </div>
                    <h2 className="heading-h2 text-foreground">More capabilities</h2>
                    <p className="mt-3 text-body text-grey-400 max-w-2xl">
                      These offerings are not grouped under a category yet in the database. Each card still opens
                      the full service detail page.
                    </p>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 lg:gap-8">
                  {uncategorized.map((s) => (
                    <ServiceCard
                      key={s.id}
                      service={s}
                      categorySlug={categories.find((c) => c.id === s.category_id)?.slug?.trim() || null}
                    />
                  ))}
                </div>
              </section>
            ) : null}
          </div>
        )}

        {hasAnyServices ? (
          <div className="mt-20 md:mt-24 rounded-[2rem] bg-foreground px-8 py-12 md:px-14 md:py-14 text-center">
            <h2 className="font-heading text-2xl md:text-3xl font-semibold text-white mb-4 text-balance">
              Not sure which service fits first?
            </h2>
            <p className="text-body text-white/65 max-w-2xl mx-auto mb-8">
              Tell us about your stack, pipeline goals, and timeline — we will recommend a phased roadmap that
              compounds over quarters, not weeks of vanity work.
            </p>
            <Link
              href="/#contact"
              className="inline-flex items-center justify-center rounded-full bg-ignite-orange px-8 py-3.5 text-sm font-semibold text-white hover:bg-ignite-orange/90 transition-colors shadow-[0_8px_24px_rgba(255,87,34,0.35)]"
            >
              Talk to DigiiMark
            </Link>
          </div>
        ) : null}
      </div>
    </div>
  )
}

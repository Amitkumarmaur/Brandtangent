import Image from "next/image"
import Link from "next/link"
import { ArrowUpRight } from "lucide-react"
import { serviceUrl } from "@/lib/services-urls"

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
  if (!services.length) return null

  const sorted = [...services].sort(
    (a, b) => (a.display_order ?? 999) - (b.display_order ?? 999),
  )

  return (
    <section className="relative w-full py-16 md:py-20 bg-background border-t border-grey-200">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="mb-12 md:mb-16 max-w-3xl">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-2 h-2 rounded-full bg-ignite-orange" />
            <span className="text-eyebrow text-ignite-orange">{badge}</span>
          </div>
          <h2 className="heading-h2 text-foreground">{title}</h2>
          {subtitle ? (
            <p className="mt-5 text-subtitle text-grey-400 max-w-2xl">{subtitle}</p>
          ) : null}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 lg:gap-8">
          {sorted.map((service) => {
            const displayTitle = (service.hero_h1 ?? service.name).trim() || "Service"
            const blurb =
              (service.short_description ?? service.hero_description ?? service.description ?? "").trim()
            const image = (service.hero_image ?? "").trim() || FALLBACK_IMAGE

            return (
              <Link
                key={service.id}
                href={serviceUrl(categorySlug, service.slug)}
                className="group flex flex-col h-full rounded-[1.5rem] overflow-hidden border border-grey-200 bg-white shadow-sm hover:shadow-md hover:border-grey-300 transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ignite-orange focus-visible:ring-offset-2"
              >
                <div className="relative aspect-[16/10] w-full overflow-hidden bg-grey-100">
                  <Image
                    src={image}
                    alt={displayTitle}
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
                    {displayTitle}
                  </h3>
                  {blurb ? (
                    <p className="mt-3 text-body text-grey-400 line-clamp-3 flex-grow">{blurb}</p>
                  ) : null}
                  <span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-foreground group-hover:gap-3 transition-all">
                    View service details
                    <span className="text-ignite-orange" aria-hidden>
                      →
                    </span>
                  </span>
                </div>
              </Link>
            )
          })}
        </div>
      </div>
    </section>
  )
}

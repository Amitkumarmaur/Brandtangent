import { slugifyLabel } from "@/lib/content-categories"
import { supabase } from "@/lib/supabase"
import { categoryUrl, serviceUrl } from "@/lib/services-urls"

export type FooterColumnData = {
  title: string
  links: { label: string; href: string }[]
}

/** Services shown under “Our Services” — technology / build capabilities (matches nav pillars). */
const OUR_SERVICES_CATEGORY_SLUGS = ["ai-automation", "web-development"] as const

type ServiceRow = {
  slug: string | null
  name: string | null
  category_id: string | null
  display_order: number | null
}

type CategoryRow = { id: string; slug: string | null; display_order: number | null }

type FooterServiceSpec = {
  label: string
  slugCandidates: string[]
  fallbackCategorySlug: string
}

const OVERVIEW_COLUMN: FooterColumnData = {
  title: "Overview",
  links: [
    { label: "About Us", href: "/about" },
    { label: "Services", href: "/services" },
    { label: "Our Work", href: "/case-studies" },
    { label: "Blog", href: "/blog" },
    { label: "Contact us", href: "mailto:discover@digiimark.com" },
    { label: "Careers", href: "/careers" },
    { label: "Privacy Policy", href: "/privacy-policy" },
  ],
}

const DIGITAL_GROWTH_SPECS: FooterServiceSpec[] = [
  {
    label: "B2B Lead Generation",
    slugCandidates: ["b2b-lead-generation", "lead-generation"],
    fallbackCategorySlug: "growth-revenue-systems",
  },
  {
    label: "Search Engine Optimization (SEO)",
    slugCandidates: ["search-engine-optimization", "seo-services", "seo"],
    fallbackCategorySlug: "seo-search-visibility",
  },
  {
    label: "Generative Engine Optimization (GEO)",
    slugCandidates: ["generative-engine-optimization", "geo"],
    fallbackCategorySlug: "seo-search-visibility",
  },
  {
    label: "Pay-Per-Click Advertising (PPC)",
    slugCandidates: ["pay-per-click", "ppc-advertising", "ppc"],
    fallbackCategorySlug: "growth-revenue-systems",
  },
  {
    label: "Conversion Rate Optimization",
    slugCandidates: ["conversion-rate-optimization", "cro"],
    fallbackCategorySlug: "growth-revenue-systems",
  },
  {
    label: "Content Marketing",
    slugCandidates: ["content-marketing", "content-strategy"],
    fallbackCategorySlug: "content-social-media",
  },
]

const INDUSTRY_LABELS = ["SaaS", "FinTech", "InsureTech", "Enterprise Tech", "Healthcare", "Education"]

function buildCategorySlugMap(rows: { id: string; slug: string | null }[]): Map<string, string> {
  const m = new Map<string, string>()
  for (const r of rows) {
    const slug = (r.slug ?? "").trim()
    if (r.id && slug) m.set(r.id, slug)
  }
  return m
}

function resolveServiceHref(
  services: ServiceRow[],
  catSlugById: Map<string, string>,
  candidates: string[],
): string | null {
  const want = new Set(candidates.map((c) => c.trim()).filter(Boolean))
  for (const s of services) {
    const svcSlug = (s.slug ?? "").trim()
    if (!want.has(svcSlug)) continue
    const catSlug = (catSlugById.get(s.category_id ?? "") ?? "").trim()
    return serviceUrl(catSlug || null, svcSlug)
  }
  return null
}

function columnFromSpecs(
  title: string,
  specs: FooterServiceSpec[],
  services: ServiceRow[],
  catSlugById: Map<string, string>,
): FooterColumnData {
  return {
    title,
    links: specs.map((spec) => ({
      label: spec.label,
      href:
        resolveServiceHref(services, catSlugById, spec.slugCandidates) ??
        categoryUrl(spec.fallbackCategorySlug),
    })),
  }
}

function buildOurServicesColumn(services: ServiceRow[], categories: CategoryRow[]): FooterColumnData {
  const catSlugById = buildCategorySlugMap(categories)
  const allowedSlugs = new Set<string>(OUR_SERVICES_CATEGORY_SLUGS)

  const categoryMeta = new Map<string, { order: number }>()
  for (const c of categories) {
    const slug = (c.slug ?? "").trim()
    if (!slug || !allowedSlugs.has(slug)) continue
    categoryMeta.set(c.id, { order: c.display_order ?? 999 })
  }

  const allowedCatIds = new Set(categoryMeta.keys())

  const rows = services.filter((s) => {
    const cid = s.category_id
    return Boolean(cid && allowedCatIds.has(cid) && (s.slug ?? "").trim())
  })

  rows.sort((a, b) => {
    const oa = categoryMeta.get(a.category_id ?? "")?.order ?? 999
    const ob = categoryMeta.get(b.category_id ?? "")?.order ?? 999
    if (oa !== ob) return oa - ob
    return (a.display_order ?? 999) - (b.display_order ?? 999)
  })

  const links = rows.map((s) => {
    const svcSlug = (s.slug ?? "").trim()
    const catSlug = (catSlugById.get(s.category_id ?? "") ?? "").trim()
    const label = (s.name ?? "").trim() || svcSlug.replace(/-/g, " ")
    return {
      label,
      href: serviceUrl(catSlug || null, svcSlug),
    }
  })

  if (links.length === 0) {
    return {
      title: "Our Services",
      links: OUR_SERVICES_CATEGORY_SLUGS.map((slug) => ({
        label:
          slug === "ai-automation"
            ? "AI & Automation"
            : slug === "web-development"
              ? "Web Development"
              : slug.replace(/-/g, " ").replace(/\b\w/g, (ch) => ch.toUpperCase()),
        href: categoryUrl(slug),
      })),
    }
  }

  return { title: "Our Services", links }
}

function industryColumn(): FooterColumnData {
  return {
    title: "Industry",
    links: INDUSTRY_LABELS.map((label) => ({
      label,
      href: `/case-studies?industry=${encodeURIComponent(slugifyLabel(label))}`,
    })),
  }
}

/** Footer columns: overview, live services from Supabase, growth links, industries. */
export async function getFooterNavColumns(): Promise<FooterColumnData[]> {
  const [{ data: categoriesData }, { data: servicesData }] = await Promise.all([
    supabase.from("service_categories").select("id, slug, display_order").order("display_order", { ascending: true }),
    supabase.from("services").select("slug, name, category_id, display_order").order("display_order", { ascending: true }),
  ])

  const categories = (categoriesData ?? []) as CategoryRow[]
  const services = (servicesData ?? []) as ServiceRow[]
  const catSlugById = buildCategorySlugMap(categories)

  return [
    OVERVIEW_COLUMN,
    buildOurServicesColumn(services, categories),
    columnFromSpecs("Digital Growth & Marketing", DIGITAL_GROWTH_SPECS, services, catSlugById),
    industryColumn(),
  ]
}

import { notFound, redirect } from "next/navigation"
import type { Metadata } from "next"
import Header from "@/components/header"
import Footer from "@/components/footer"
import CategoryHero, { type CategoryHeroProject } from "@/components/services/category-hero"
import WebDevelopmentHero from "@/components/services/web-development-hero"
import ServiceFeatures from "@/components/services/service-features"
import CategoryServicesGrid, { type CategoryService } from "@/components/services/category-services-grid"
import ServiceProcessGrid from "@/components/services/service-process-grid"
import ServiceIndustries from "@/components/services/service-industries"
import ServiceTechStack from "@/components/services/service-tech-stack"
import { supabase } from "@/lib/supabase"
import { deviconLogoForPlatformName } from "@/lib/devicon-platform-logos"
import { normalizeRouteSlug } from "@/lib/services-urls"
import {
  fetchServiceAsCategoryRedirect,
  fetchServiceCategoryBySlug,
  fetchServicesForCategory,
} from "@/lib/service-catalog"
import { FALLBACK_CATEGORIES } from "@/lib/service-catalog-fallback"

export const revalidate = 60
export const dynamicParams = true

type ServiceCategoryRecord = {
  id: string
  name: string
  slug: string
  icon: string | null
  display_order: number | null
  hero_display_title: string | null
  hero_description: string | null
  hero_animated_words: string[] | null
  hero_stat_value: string | null
  hero_stat_label: string | null
  featured_projects: unknown
  expertise_badge: string | null
  expertise_title: string | null
  expertise_subtitle: string | null
  process_heading: string | null
  process_description: string | null
  process_steps: unknown
  tech_stack_ids: string[] | null
  target_industries: unknown
  seo_title: string | null
  meta_description: string | null
  created_at: string | null
}

type ProcessStepRow = {
  title?: string | null
  h3_title?: string | null
  items?: string[] | null
  description?: string | null
  bullet_points?: string[] | null
}
type IndustryRow = {
  industry?: string | null
  headline?: string | null
  services?: string | null
  yearsExp?: number | null
  clients?: number | null
  clientLabel?: string | null
  image?: string | null
  caseStudies?: { name?: string | null; bg?: string | null }[] | null
}
type FeaturedProjectRow = {
  id?: number | string
  title?: string
  image?: string
  cover_image?: string
  hero_image?: string
  category?: string
  flag?: string
  accent?: string
  uiColors?: string[]
  stat?: { value?: string; label?: string }
}

function asArray<T>(value: unknown): T[] {
  return Array.isArray(value) ? (value as T[]) : []
}

function categoryIconAsUrl(icon: string | null | undefined): string | null {
  const t = (icon ?? "").trim()
  if (!t) return null
  const low = t.toLowerCase()
  if (low.startsWith("http://") || low.startsWith("https://")) return t
  return null
}

function categoryIconAsGlyph(icon: string | null | undefined): string | null {
  const t = (icon ?? "").trim()
  if (!t || categoryIconAsUrl(icon)) return null
  if (t.length > 12) return null
  return t
}

export async function generateStaticParams() {
  const { data } = await supabase.from("service_categories").select("slug")
  const dbSlugs = (data ?? [])
    .map((row: { slug: string | null }) => row.slug?.trim())
    .filter((slug): slug is string => Boolean(slug))

  const fallbackSlugs = FALLBACK_CATEGORIES.map((c) => c.slug)
  const slugs = [...new Set([...dbSlugs, ...fallbackSlugs])]

  return slugs.map((slug) => ({ category: slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string }>
}): Promise<Metadata> {
  const category = normalizeRouteSlug((await params).category)
  const { category: data } = await fetchServiceCategoryBySlug(category)

  if (!data) return { title: "Services | Brandtangent" }

  const title = data.seo_title || `${data.name} Services | Brandtangent`
  const description =
    data.meta_description || data.hero_description || `Explore ${data.name} services from Brandtangent.`

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "website",
      ...(data.created_at ? { publishedTime: data.created_at } : {}),
    },
  }
}

export default async function ServiceCategoryPage({
  params,
}: {
  params: Promise<{ category: string }>
}) {
  const category = normalizeRouteSlug((await params).category)

  const { category: categoryRow, fromFallback } = await fetchServiceCategoryBySlug(category)

  if (!categoryRow) {
    const redirectTarget = await fetchServiceAsCategoryRedirect(category)
    if (redirectTarget) {
      redirect(`/services/${redirectTarget.categorySlug}/${redirectTarget.serviceSlug}`)
    }
    notFound()
  }

  const [{ data: servicesData }, platformsRes] = await Promise.all([
    fromFallback
      ? Promise.resolve({ data: await fetchServicesForCategory(categoryRow.id, true) })
      : supabase
          .from("services")
          .select(
            "id, slug, name, hero_h1, hero_description, hero_image, short_description, description, display_order",
          )
          .eq("category_id", categoryRow.id)
          .order("display_order", { ascending: true, nullsFirst: false }),
    categoryRow.tech_stack_ids && categoryRow.tech_stack_ids.length > 0
      ? supabase
          .from("platforms")
          .select("id, platform_name, logo")
          .in("id", categoryRow.tech_stack_ids)
      : Promise.resolve({ data: [] as { id: string; platform_name: string; logo: string | null }[] }),
  ])

  const services = (servicesData ?? []) as CategoryService[]

  // Featured projects → hero slider
  const featured = asArray<FeaturedProjectRow>(categoryRow.featured_projects)
  const projects: CategoryHeroProject[] = featured
    .map((p, i): CategoryHeroProject | null => {
      const image = (p?.image ?? p?.cover_image ?? p?.hero_image ?? "").trim()
      if (!p?.title || !image) return null
      return {
        id: p.id ?? i + 1,
        title: p.title,
        image,
        category: p.category ?? categoryRow.name,
        flag: p.flag,
        accent: p.accent ?? "#FF5722",
        uiColors: p.uiColors,
        stat: {
          value: p.stat?.value ?? "",
          label: p.stat?.label ?? "",
        },
      }
    })
    .filter((p): p is CategoryHeroProject => p !== null)

  // Expertise accordion uses the category's child services as "features"
  const expertiseFeatures = services
    .map((s) => ({
      title: s.name,
      description:
        (s.short_description ?? s.hero_description ?? s.description ?? "").trim() ||
        `Learn more about ${s.name} at Brandtangent.`,
    }))
    .slice(0, 8)

  // Process steps
  const processPhases = asArray<ProcessStepRow>(categoryRow.process_steps)
    .map((step) => {
      const title = (step.title ?? step.h3_title ?? "").trim()
      let items: string[] = []
      if (Array.isArray(step.items)) items = step.items.filter((i): i is string => Boolean(i))
      else if (Array.isArray(step.bullet_points))
        items = step.bullet_points.filter((i): i is string => Boolean(i))
      else if (typeof step.description === "string" && step.description.trim()) {
        items = step.description
          .split(/\n+|•|;/)
          .map((s) => s.trim())
          .filter(Boolean)
      }
      return { title, items }
    })
    .filter((step) => step.title && step.items.length > 0)

  // Target industries (matches ServiceIndustries shape exactly)
  const industryRows = asArray<IndustryRow>(categoryRow.target_industries)
  const industries = industryRows
    .map((row) => ({
      industry: (row.industry ?? "").trim(),
      headline: (row.headline ?? "").trim(),
      services: (row.services ?? "").trim(),
      yearsExp: row.yearsExp ?? 0,
      clients: row.clients ?? 0,
      clientLabel: (row.clientLabel ?? "").trim(),
      image: (row.image ?? "").trim() ||
        "https://images.unsplash.com/photo-1486325212027-8081e485255e?auto=format&fit=crop&w=900&q=80",
      caseStudies: Array.isArray(row.caseStudies)
        ? row.caseStudies
            .map((cs) => ({ name: (cs?.name ?? "").trim(), bg: (cs?.bg ?? "#111").trim() || "#111" }))
            .filter((cs) => cs.name)
        : [],
    }))
    .filter((i) => i.industry && i.headline)

  // Tech stack
  const platforms = (platformsRes.data ?? []) as {
    id: string
    platform_name: string
    logo: string | null
  }[]
  const techStackData = platforms.length
    ? platforms.map((p) => {
        const n = p.platform_name.toLowerCase()
        let color = "#ffffff"
        if (n.includes("hubspot")) color = "#FF7A59"
        else if (n.includes("salesforce")) color = "#00A1E0"
        else if (n.includes("zapier")) color = "#FF4A00"
        else if (n.includes("make")) color = "#5C0099"
        else if (n.includes("n8n")) color = "#EA4B71"
        else if (n.includes("wordpress")) color = "#21759B"
        else if (n.includes("shopify")) color = "#95BF47"
        else if (n.includes("chatgpt")) color = "#10A37F"
        else if (n.includes("claude")) color = "#D97757"
        else if (n.includes("next")) color = "#ffffff"
        else if (n.includes("react")) color = "#61DAFB"
        else if (n.includes("node")) color = "#339933"
        else if (n.includes("postgres")) color = "#4169E1"
        else if (n.includes("tailwind")) color = "#06B6D4"
        else if (n.includes("google")) color = "#4285F4"
        else if (n.includes("meta")) color = "#0081FB"
        else if (n.includes("linkedin")) color = "#0A66C2"
        else if (n.includes("instagram")) color = "#E1306C"
        else if (n.includes("facebook")) color = "#1877F2"
        return {
          name: p.platform_name,
          logo: deviconLogoForPlatformName(p.platform_name) ?? p.logo ?? null,
          color,
        }
      })
    : undefined

  const heroDisplayTitle = (categoryRow.hero_display_title ?? categoryRow.name).trim() || categoryRow.name
  const heroDescription =
    (categoryRow.hero_description ?? "").trim() ||
    `Explore our ${categoryRow.name.toLowerCase()} capabilities.`
  const expertiseTitle =
    (categoryRow.expertise_title ?? "").trim() || `End-to-End ${categoryRow.name}`
  const expertiseSubtitle =
    (categoryRow.expertise_subtitle ?? "").trim() ||
    `Our complete suite of ${categoryRow.name.toLowerCase()} capabilities, built to compound over time.`
  const processHeading =
    (categoryRow.process_heading ?? "").trim() || `Our ${categoryRow.name} Process`
  const processDescription =
    (categoryRow.process_description ?? "").trim() ||
    `A transparent, phased approach to delivering ${categoryRow.name.toLowerCase()} outcomes that stay maintainable.`

  const capabilitiesSubtitle =
    (categoryRow.meta_description ?? "").trim() ||
    `Drill into any capability below to see methodology, tech stack, and proof points specific to that ${categoryRow.name.toLowerCase()} offering.`

  return (
    <main data-service-category-slug={categoryRow.slug} data-display-order={categoryRow.display_order ?? ""}>
      <Header />
      {categoryRow.slug === "web-development" ? (
        <div data-theme="light">
          <WebDevelopmentHero
            badge={categoryRow.name}
            badgeIconUrl={categoryIconAsUrl(categoryRow.icon)}
            badgeIconGlyph={categoryIconAsGlyph(categoryRow.icon)}
            displayTitle={heroDisplayTitle}
            description={heroDescription}
            animatedWords={categoryRow.hero_animated_words ?? undefined}
            statValue={categoryRow.hero_stat_value}
            statLabel={categoryRow.hero_stat_label}
            projects={projects}
          />
        </div>
      ) : (
        <div data-theme="dark">
          <CategoryHero
            badge={categoryRow.name}
            badgeIconUrl={categoryIconAsUrl(categoryRow.icon)}
            badgeIconGlyph={categoryIconAsGlyph(categoryRow.icon)}
            displayTitle={heroDisplayTitle}
            description={heroDescription}
            animatedWords={categoryRow.hero_animated_words ?? undefined}
            statValue={categoryRow.hero_stat_value}
            statLabel={categoryRow.hero_stat_label}
            projects={projects}
          />
        </div>
      )}

      {expertiseFeatures.length > 0 ? (
        <div data-theme="light">
          <ServiceFeatures
            badge={(categoryRow.expertise_badge ?? "Our Expertise").trim() || "Our Expertise"}
            title={expertiseTitle}
            subtitle={expertiseSubtitle}
            features={expertiseFeatures}
          />
        </div>
      ) : null}

      {services.length > 0 ? (
        <div data-theme="light">
          <CategoryServicesGrid
            badge="Capabilities"
            title={`${categoryRow.name} services we deliver`}
            subtitle={capabilitiesSubtitle}
            categorySlug={categoryRow.slug}
            services={services}
          />
        </div>
      ) : null}

      {processPhases.length > 0 ? (
        <div data-theme="light">
          <ServiceProcessGrid
            title={processHeading}
            description={processDescription}
            phases={processPhases}
          />
        </div>
      ) : null}

      {techStackData && techStackData.length > 0 ? (
        <div data-theme="dark">
          <ServiceTechStack
            title={`${categoryRow.name}\nTechnology Stack`}
            techStack={techStackData}
          />
        </div>
      ) : null}

      {industries.length > 0 ? (
        <div data-theme="dark">
          <ServiceIndustries
            title={`Proven ${categoryRow.name} results across industries`}
            industries={industries}
          />
        </div>
      ) : null}

      <Footer />
    </main>
  )
}

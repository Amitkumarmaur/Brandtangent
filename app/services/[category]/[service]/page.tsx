import { notFound, redirect } from "next/navigation"
import type { Metadata } from "next"
import { supabase } from "@/lib/supabase"
import { normalizeRouteSlug } from "@/lib/services-urls"
import { deviconLogoForPlatformName } from "@/lib/devicon-platform-logos"
import Header from "@/components/header"
import Footer from "@/components/footer"
import WebDevHero from "@/components/services/web-dev-hero"
import ServiceFeatures from "@/components/services/service-features"
import ProjectsSection from "@/components/projects-section"
import ServiceTechStack from "@/components/services/service-tech-stack"
import ServiceWebServices from "@/components/services/service-web-services"
import ServiceProcessGrid from "@/components/services/service-process-grid"
import ServiceIndustries from "@/components/services/service-industries"

export const revalidate = 60
export const dynamicParams = true

type ServiceDetailRow = {
  id: string
  category_id: string | null
  name: string
  slug: string
  hero_h1: string | null
  hero_description: string | null
  hero_image: string | null
  seo_title: string | null
  meta_description: string | null
  service_details: unknown
  methodology: unknown
  what_we_provide: unknown
  platform_ids: string[] | null
}

type JsonObj = Record<string, unknown>

function asArray(v: unknown): JsonObj[] {
  return Array.isArray(v) ? (v as JsonObj[]) : []
}

function str(v: unknown): string {
  return typeof v === "string" ? v : ""
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string; service: string }>
}): Promise<Metadata> {
  const serviceSlugParam = normalizeRouteSlug((await params).service)
  const { data } = await supabase
    .from("services")
    .select("seo_title, meta_description, name")
    .eq("slug", serviceSlugParam)
    .maybeSingle()

  if (!data) return { title: "Service | DigiiMark" }

  return {
    title: data.seo_title || `${data.name} | DigiiMark`,
    description:
      data.meta_description || `Learn more about our ${data.name} services at DigiiMark.`,
  }
}

export default async function ServiceDetailPage({
  params,
}: {
  params: Promise<{ category: string; service: string }>
}) {
  const categoryParam = normalizeRouteSlug((await params).category)
  const serviceSlug = normalizeRouteSlug((await params).service)

  const { data: service } = await supabase
    .from("services")
    .select(
      "id, category_id, name, slug, hero_h1, hero_description, hero_image, seo_title, meta_description, service_details, methodology, what_we_provide, platform_ids",
    )
    .eq("slug", serviceSlug)
    .maybeSingle<ServiceDetailRow>()

  if (!service) {
    notFound()
  }

  let dbCategorySlug: string | null = null
  if (service.category_id) {
    const { data: cat } = await supabase
      .from("service_categories")
      .select("slug")
      .eq("id", service.category_id)
      .maybeSingle<{ slug: string | null }>()
    dbCategorySlug = (cat?.slug ?? "").trim() || null
  }

  if (dbCategorySlug && dbCategorySlug !== categoryParam) {
    redirect(`/services/${dbCategorySlug}/${service.slug}`)
  }

  const mappedFeatures = asArray(service.service_details).map((detail) => ({
    title: str(detail.title) || str(detail.h3_title) || "",
    description: str(detail.description),
  }))

  const mappedPhases = asArray(service.methodology).map((m) => ({
    title: str(m.title) || str(m.h3_title) || "",
    items: [str(m.description) || ""],
  }))

  const providedRows = asArray(service.what_we_provide)
  const mappedServices = providedRows.length
    ? providedRows.map((item) => ({
        title: str(item.title),
        shortDescription: str(item.description),
        fullDescription: [str(item.description)],
      }))
    : undefined

  // Platforms → tech stack
  let techStackData: { name: string; logo: string | null; color: string }[] | undefined
  if (service.platform_ids && service.platform_ids.length > 0) {
    const { data: platformsData } = await supabase
      .from("platforms")
      .select("platform_name, logo")
      .in("id", service.platform_ids)

    if (platformsData && platformsData.length > 0) {
      techStackData = platformsData.map((p) => {
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
        else if (n.includes("twitter") || n.includes("x (tw")) color = "#1DA1F2"
        else if (n.includes("webflow")) color = "#4353FF"
        else if (n.includes("woocommerce")) color = "#7F54B3"
        else if (n.includes("perplexity")) color = "#20B2AA"
        else if (n.includes("resend")) color = "#000000"
        else if (n.includes("outlook")) color = "#0078D4"

        return {
          name: p.platform_name,
          logo: deviconLogoForPlatformName(p.platform_name) ?? p.logo ?? null,
          color,
        }
      })
    }
  }

  return (
    <main>
      <Header />
      <div data-theme="dark">
        <WebDevHero
          title={service.hero_h1 || service.name}
          description={service.hero_description ?? undefined}
          image={service.hero_image ?? undefined}
          badge={service.name}
        />
      </div>
      <div data-theme="light">
        <ServiceFeatures
          badge="Our Expertise"
          title={`End-to-End ${service.name}`}
          subtitle={
            service.hero_description ||
            "From concept to deployment, we build digital products that are fast, beautiful, and built to scale."
          }
          features={
            mappedFeatures.length > 0
              ? mappedFeatures
              : [{ title: "Service Feature", description: "Details coming soon." }]
          }
        />
      </div>
      <div data-theme="light">
        <ProjectsSection />
      </div>
      <div data-theme="dark">
        <ServiceTechStack title={`${service.name}\nTechnology Stack`} techStack={techStackData} />
      </div>
      <div data-theme="light">
        <ServiceWebServices title={`Our ${service.name} Services`} services={mappedServices} />
      </div>
      <div data-theme="light">
        <ServiceProcessGrid
          title={`Our ${service.name} Process`}
          description={`We follow a meticulous, transparent process that ensures your ${service.name.toLowerCase()} project is delivered flawlessly, securely, and completely tailored to your business goals.`}
          phases={mappedPhases.length > 0 ? mappedPhases : undefined}
        />
      </div>
      <div data-theme="dark">
        <ServiceIndustries />
      </div>
      <Footer />
    </main>
  )
}

import { notFound } from "next/navigation"
import { supabase } from "@/lib/supabase"
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
import { Metadata } from "next"

export const revalidate = 60

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const resolvedParams = await params
  const { data: service } = await supabase
    .from("services")
    .select("seo_title, meta_description, name")
    .eq("slug", resolvedParams.slug)
    .single()

  if (!service) return { title: "Service | DigiiMark" }

  return {
    title: service.seo_title || `${service.name} | DigiiMark`,
    description: service.meta_description || `Learn more about our ${service.name} services at DigiiMark.`,
  }
}

export default async function DynamicServicePage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params
  const { data: service, error } = await supabase
    .from("services")
    .select("*")
    .eq("slug", resolvedParams.slug)
    .single()

  console.log("Supabase fetch for:", resolvedParams.slug, "\nService:", service ? service.id : "NONE", "\nError:", error)

  if (error || !service) {
    notFound()
  }

  // Map service_details from Supabase to match the ServiceFeatures expected props
  const mappedFeatures = Array.isArray(service.service_details) 
    ? service.service_details.map((detail: any) => ({
        title: detail.title || detail.h3_title || "",
        description: detail.description || "",
      }))
    : []

  // Map methodology from Supabase to match ServiceProcessGrid expected props
  const mappedPhases = Array.isArray(service.methodology)
    ? service.methodology.map((m: any) => ({
        title: m.title || m.h3_title || "",
        items: [m.description || ""],
      }))
    : []

  // Map what_we_provide from Supabase
  const mappedServices = Array.isArray(service.what_we_provide)
    ? service.what_we_provide.map((item: any) => ({
        title: item.title || "",
        shortDescription: item.description || "",
        fullDescription: [item.description || ""],
      }))
    : undefined

  // Fetch actual platforms
  let techStackData = undefined;
  
  if (service.platform_ids && service.platform_ids.length > 0) {
    const { data: platformsData } = await supabase
      .from("platforms")
      .select("platform_name, logo")
      .in("id", service.platform_ids);

    if (platformsData && platformsData.length > 0) {
      techStackData = platformsData.map((p) => {
        // Derive a brand color per platform for the glow effect
        const nameLower = p.platform_name.toLowerCase();
        let color = "#ffffff";
        if (nameLower.includes('hubspot'))    color = "#FF7A59";
        else if (nameLower.includes('salesforce')) color = "#00A1E0";
        else if (nameLower.includes('zapier'))     color = "#FF4A00";
        else if (nameLower.includes('make'))       color = "#5C0099";
        else if (nameLower.includes('n8n'))        color = "#EA4B71";
        else if (nameLower.includes('wordpress'))  color = "#21759B";
        else if (nameLower.includes('shopify'))    color = "#95BF47";
        else if (nameLower.includes('chatgpt'))    color = "#10A37F";
        else if (nameLower.includes('claude'))     color = "#D97757";
        else if (nameLower.includes('next'))       color = "#ffffff";
        else if (nameLower.includes('react'))      color = "#61DAFB";
        else if (nameLower.includes('node'))       color = "#339933";
        else if (nameLower.includes('postgres'))   color = "#4169E1";
        else if (nameLower.includes('tailwind'))   color = "#06B6D4";
        else if (nameLower.includes('google'))     color = "#4285F4";
        else if (nameLower.includes('meta'))       color = "#0081FB";
        else if (nameLower.includes('linkedin'))   color = "#0A66C2";
        else if (nameLower.includes('instagram'))  color = "#E1306C";
        else if (nameLower.includes('facebook'))   color = "#1877F2";
        else if (nameLower.includes('twitter') || nameLower.includes('x (tw')) color = "#1DA1F2";
        else if (nameLower.includes('webflow'))    color = "#4353FF";
        else if (nameLower.includes('woocommerce')) color = "#7F54B3";
        else if (nameLower.includes('perplexity')) color = "#20B2AA";
        else if (nameLower.includes('resend'))     color = "#000000";
        else if (nameLower.includes('outlook'))    color = "#0078D4";

        return {
          name: p.platform_name,
          logo:
            deviconLogoForPlatformName(p.platform_name) ?? p.logo ?? null,
          color,
        };
      });
    }
  }

  return (
    <main>
      <Header />
      <div data-theme="dark">
        <WebDevHero 
          title={service.hero_h1 || service.name} 
          description={service.hero_description}
          image={service.hero_image}
          badge={service.name}
        />
      </div>
      <div data-theme="light">
        <ServiceFeatures
          badge="Our Expertise"
          title={`End-to-End ${service.name}`}
          subtitle={service.hero_description || "From concept to deployment, we build digital products that are fast, beautiful, and built to scale."}
          features={mappedFeatures.length > 0 ? mappedFeatures : [
            { title: "Service Feature", description: "Details coming soon." }
          ]}
        />
      </div>
      <div data-theme="light">
        <ProjectsSection />
      </div>
      <div data-theme="dark">
        <ServiceTechStack 
          title={`${service.name}\nTechnology Stack`} 
          techStack={techStackData}
        />
      </div>
      <div data-theme="light">
        <ServiceWebServices 
          title={`Our ${service.name} Services`}
          services={mappedServices?.length ? mappedServices : undefined}
        />
      </div>
      <div data-theme="light">
        <ServiceProcessGrid 
          title={`Our ${service.name} Process`}
          subtitle={`We follow a meticulous, transparent process that ensures your ${service.name.toLowerCase()} project is delivered flawlessly, securely, and completely tailored to your business goals.`}
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

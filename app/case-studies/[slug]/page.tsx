import { notFound } from "next/navigation"
import { supabase } from "@/lib/supabase"
import { Metadata } from "next"
import Header from "@/components/header"
import Footer from "@/components/footer"
import CaseStudyHero from "@/components/case-studies/case-study-hero"
import CaseStudyOverview from "@/components/case-studies/case-study-overview"
import CaseStudyAbout from "@/components/case-studies/case-study-about"
import CaseStudyProblems from "@/components/case-studies/case-study-problems"
import CaseStudyChallenges from "@/components/case-studies/case-study-challenges"
import CaseStudyTechStack from "@/components/case-studies/case-study-tech-stack"
import CaseStudyResults from "@/components/case-studies/case-study-results"
import CaseStudyTestimonial from "@/components/case-studies/case-study-testimonial"
import CaseStudyCTA from "@/components/case-studies/case-study-cta"
import { fetchCaseStudyContentCategories } from "@/lib/content-categories"

export const revalidate = 0

/* ── SEO Metadata ─────────────────────────────────────────────────────────── */

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const resolvedParams = await params
  const { data: cs } = await supabase
    .from("case_studies")
    .select("h1_title, brief_description, slug")
    .eq("slug", resolvedParams.slug)
    .single()

  if (!cs) return { title: "Case Study | DigiiMark" }

  return {
    title: `${cs.h1_title} | DigiiMark`,
    description:
      cs.brief_description ||
      `Read how DigiiMark delivered results in this case study.`,
  }
}

/* ── Page Component ───────────────────────────────────────────────────────── */

export default async function CaseStudyPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const resolvedParams = await params

  const { data: cs, error } = await supabase
    .from("case_studies")
    .select("*")
    .eq("slug", resolvedParams.slug)
    .single()

  if (error || !cs) return notFound()

  const contentCategories = await fetchCaseStudyContentCategories(cs.id)
  const contentTopicNames =
    contentCategories.length > 0 ? contentCategories.map((c) => c.name) : null

  // Fetch linked client info if available
  const { data: client } = await supabase
    .from("clients")
    .select("client_name, logo, website_url")
    .eq("case_study_id", cs.id)
    .single()

  // Fetch linked testimonial if available
  let testimonial: { quote: string; client_name: string; role: string | null } | null = null
  if (cs.testimonial_id) {
    const { data: t } = await supabase
      .from("testimonials")
      .select("quote, client_name, role")
      .eq("id", cs.testimonial_id)
      .single()
    if (t) testimonial = t
  }

  // Fetch linked service info if available
  let serviceName: string | null = null
  if (cs.linked_service_id) {
    const { data: svc } = await supabase
      .from("services")
      .select("name, slug")
      .eq("id", cs.linked_service_id)
      .single()
    if (svc) serviceName = svc.name
  }

  // Parse JSONB fields safely
  const challenges: { title: string; description: string }[] = Array.isArray(
    cs.challenges
  )
    ? cs.challenges
    : []

  const results: {
    metric: string
    label: string
    description?: string
  }[] = Array.isArray(cs.results) ? cs.results : []

  const techStack: {
    name: string
    logo?: string
    color: string
  }[] = Array.isArray(cs.tech_stack_used) ? cs.tech_stack_used : []

  return (
    <main className="bg-white min-h-screen text-foreground overflow-hidden font-sans selection:bg-ignite-orange selection:text-white">
      <Header />

      <div className="w-full bg-white relative">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(255,87,34,0.05),transparent_50%)] pointer-events-none" />

        {/* 1. HERO — kept from existing design */}
        <CaseStudyHero
          title={cs.h1_title}
          subtitle={cs.brief_description}
          image={cs.hero_image}
          clientName={client?.client_name}
        />

        {/* 2. OVERVIEW ROW — industry, service, client */}
        <CaseStudyOverview
          industry={cs.industry}
          serviceName={serviceName}
          clientName={client?.client_name}
          clientWebsite={client?.website_url}
          contentTopics={contentTopicNames}
        />

        {/* 3. ABOUT THE CLIENT */}
        {cs.about_client_heading && (
          <CaseStudyAbout
            heading={cs.about_client_heading}
            description={cs.about_client_description}
          />
        )}

        {/* 4. THE PROBLEM */}
        {cs.problems_heading && (
          <CaseStudyProblems
            heading={cs.problems_heading}
            description={cs.problems_description}
          />
        )}

        {/* 5. CHALLENGES GRID */}
        {challenges.length > 0 && (
          <CaseStudyChallenges challenges={challenges} />
        )}

        {/* 6. TECH STACK USED */}
        {techStack.length > 0 && (
          <CaseStudyTechStack techStack={techStack} />
        )}

        {/* 7. RESULTS — big metric cards */}
        {results.length > 0 && <CaseStudyResults results={results} />}

        {/* 8. CLIENT TESTIMONIAL */}
        {testimonial && (
          <CaseStudyTestimonial
            quote={testimonial.quote}
            clientName={testimonial.client_name}
            clientRole={testimonial.role}
          />
        )}

        {/* 9. CTA */}
        <CaseStudyCTA />
      </div>

      <Footer />
    </main>
  )
}

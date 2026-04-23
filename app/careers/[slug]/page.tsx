import type { Metadata } from "next"
import { notFound } from "next/navigation"
import Header from "@/components/header"
import Footer from "@/components/footer"
import CareerJobDetailView from "@/components/careers/career-job-detail-view"
import { fetchCareerPageData, fetchOpenCareerSlugs } from "@/lib/careers"

/** Match listing: no static cache so closing a role drops the page from the open set immediately. */
export const dynamic = "force-dynamic"

function stripHtml(html: string): string {
  return html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim()
}

export async function generateStaticParams() {
  const slugs = await fetchOpenCareerSlugs()
  return slugs.map((slug) => ({ slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const { career } = await fetchCareerPageData(slug)
  if (!career) return { title: "Role | DigiiMark" }

  const plain = career.description ? stripHtml(career.description).slice(0, 155) : null
  return {
    title: `${career.job_title} | Careers — DigiiMark`,
    description:
      plain && plain.length > 0
        ? plain
        : `Apply for ${career.job_title} at DigiiMark — AI-first marketing systems for B2B.`,
  }
}

export default async function CareerJobPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const { career, allCareers, error } = await fetchCareerPageData(slug)
  if (!career) notFound()

  const fallbackCareerId = process.env.CAREERS_FALLBACK_CAREER_ID?.trim() || null

  return (
    <main className="min-h-screen bg-background">
      <Header />
      <CareerJobDetailView
        career={career}
        allCareers={allCareers}
        listError={error}
        fallbackCareerId={fallbackCareerId}
        fetchError={error}
      />
      <Footer />
    </main>
  )
}

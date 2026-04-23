import type { Metadata } from "next"
import Header from "@/components/header"
import Footer from "@/components/footer"
import CareersHero from "@/components/careers/careers-hero"
import CareersOpeningsLive from "@/components/careers/careers-openings-live"
import { fetchOpenCareers } from "@/lib/careers"

export const metadata: Metadata = {
  title: "Careers | DigiiMark",
  description:
    "Join DigiiMark — submit your resume for open roles or our general talent pool. AI-first marketing and engineering team.",
}

/** Always read fresh `careers` rows so closed roles disappear as soon as status is updated in Supabase. */
export const dynamic = "force-dynamic"

export default async function CareersPage() {
  const { careers, error } = await fetchOpenCareers()
  const fallbackCareerId = process.env.CAREERS_FALLBACK_CAREER_ID?.trim() || null

  return (
    <main className="min-h-screen bg-grey-100">
      <Header />
      <div className="bg-background">
        <CareersHero />
      </div>

      <CareersOpeningsLive initialCareers={careers} initialListError={error} fallbackCareerId={fallbackCareerId} />

      <Footer />
    </main>
  )
}

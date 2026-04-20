import type { Metadata } from "next"
import Header from "@/components/header"
import Footer from "@/components/footer"
import CareersHero from "@/components/careers/careers-hero"
import CareersApplicationForm from "@/components/careers/careers-application-form"
import { fetchOpenCareers } from "@/lib/careers"

export const metadata: Metadata = {
  title: "Careers | DigiiMark",
  description:
    "Join DigiiMark — submit your resume for open roles or our general talent pool. AI-first marketing and engineering team.",
}

export default async function CareersPage() {
  const { careers, error } = await fetchOpenCareers()
  const fallbackCareerId = process.env.CAREERS_FALLBACK_CAREER_ID?.trim() || null

  return (
    <main className="min-h-screen bg-grey-100">
      <Header />
      <div className="bg-background">
        <CareersHero />
      </div>

      <section className="max-w-7xl mx-auto px-6 lg:px-8 py-16 md:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 lg:gap-16 items-start">
          <div className="lg:col-span-2 space-y-6">
            <h2 className="font-heading text-2xl md:text-3xl font-semibold text-foreground leading-tight">
              How we hire
            </h2>
            <ul className="space-y-4 text-body text-grey-400">
              <li className="flex gap-3">
                <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-ignite-orange" aria-hidden />
                <span>
                  <strong className="text-foreground">Small teams, high ownership.</strong> You will touch production
                  systems and client outcomes early.
                </span>
              </li>
              <li className="flex gap-3">
                <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-ignite-orange" aria-hidden />
                <span>
                  <strong className="text-foreground">Async-first interviews.</strong> We respect your time and share
                  clear expectations for each step.
                </span>
              </li>
              <li className="flex gap-3">
                <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-ignite-orange" aria-hidden />
                <span>
                  <strong className="text-foreground">Inclusive by design.</strong> We welcome applicants across
                  regions aligned with how we work remotely.
                </span>
              </li>
            </ul>
          </div>
          <div className="lg:col-span-3">
            <CareersApplicationForm careers={careers} listError={error} fallbackCareerId={fallbackCareerId} />
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}

import type { Metadata } from "next"
import { Suspense } from "react"
import Header from "@/components/header"
import Footer from "@/components/footer"
import CaseStudiesHero from "@/components/case-studies/case-studies-hero"
import CaseStudiesGrid from "@/components/case-studies/case-studies-grid"

export const metadata: Metadata = {
  title: "Case Studies & Portfolio | DigiiMark",
  description:
    "Explore DigiiMark case studies across AI, automation, web, and growth — filterable by the same content topics we use across the site.",
}

function CaseStudiesGridFallback() {
  return (
    <section className="bg-grey-100 py-16 md:py-20">
      <div className="mx-auto flex min-h-[360px] max-w-7xl items-center justify-center px-6 lg:px-8">
        <div
          className="h-10 w-10 animate-spin rounded-full border-4 border-ignite-orange border-t-transparent"
          role="status"
          aria-label="Loading case studies"
        />
      </div>
    </section>
  )
}

export default function CaseStudiesPage() {
  return (
    <main className="min-h-screen bg-background">
      <Header />
      <CaseStudiesHero />
      <Suspense fallback={<CaseStudiesGridFallback />}>
        <CaseStudiesGrid />
      </Suspense>
      <Footer />
    </main>
  )
}

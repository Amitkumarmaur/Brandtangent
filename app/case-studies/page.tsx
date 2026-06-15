import type { Metadata } from "next"
import { Suspense } from "react"
import Header from "@/components/header"
import Footer from "@/components/footer"
import CaseStudiesHero from "@/components/case-studies/case-studies-hero"
import CaseStudiesGrid from "@/components/case-studies/case-studies-grid"

export const metadata: Metadata = {
  title: "Case Studies & Portfolio | Brandtangent",
  description:
    "Explore Brandtangent case studies across brand strategy, identity, web design, and digital marketing — filterable by industry and service.",
}

function CaseStudiesGridFallback() {
  return (
    <section className="bg-white py-16 md:py-20">
      <div className="mx-auto flex min-h-[360px] max-w-7xl items-center justify-center px-6 lg:px-8">
        <div
          className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent"
          role="status"
          aria-label="Loading case studies"
        />
      </div>
    </section>
  )
}

export default function CaseStudiesPage() {
  return (
    <main className="min-h-screen bg-white">
      <Header />
      <CaseStudiesHero />
      <Suspense fallback={<CaseStudiesGridFallback />}>
        <CaseStudiesGrid />
      </Suspense>
      <Footer />
    </main>
  )
}

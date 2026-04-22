import type { Metadata } from "next"
import Header from "@/components/header"
import Footer from "@/components/footer"
import CaseStudiesHero from "@/components/case-studies/case-studies-hero"
import CaseStudiesGrid from "@/components/case-studies/case-studies-grid"

export const metadata: Metadata = {
  title: "Case Studies & Portfolio | DigiiMark",
  description:
    "Explore DigiiMark case studies across AI, automation, web, and growth — filterable by the same content topics we use across the site.",
}

export default function CaseStudiesPage() {
  return (
    <main className="min-h-screen bg-background">
      <Header />
      <CaseStudiesHero />
      <CaseStudiesGrid />
      <Footer />
    </main>
  )
}

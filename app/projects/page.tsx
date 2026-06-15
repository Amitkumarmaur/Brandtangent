import Header from "@/components/header"
import Footer from "@/components/footer"
import ProjectHero from "@/components/projects/project-hero"
import ProjectGrid from "@/components/projects/project-grid"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Our Work | Brandtangent — Portfolio",
  description: "Explore our portfolio of brand strategy, identity, and creative work across industries — from fintech to consumer and B2B.",
}

export default function ProjectsPage() {
  return (
    <main className="bg-white min-h-screen">
      <Header />
      
      {/* Hero Section */}
      <div data-theme="light">
        <ProjectHero />
      </div>

      {/* Project Grid with Sidebar Filters */}
      <ProjectGrid />

      <Footer />
    </main>
  )
}

import Header from "@/components/header"
import Footer from "@/components/footer"
import ProjectHero from "@/components/projects/project-hero"
import ProjectGrid from "@/components/projects/project-grid"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Industries Projects | DigiiMark — Our Best Works",
  description: "Explore our diverse portfolio of high-impact digital solutions across various industries, from manufacturing to fintech.",
}

export default function ProjectsPage() {
  return (
    <main className="bg-grey-100 min-h-screen">
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

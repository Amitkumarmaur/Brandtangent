import Header from "@/components/header"
import Footer from "@/components/footer"
import BlogHero from "@/components/blog/blog-hero"
import BlogGrid from "@/components/blog/blog-grid"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Blog & Insights | Brandtangent",
  description:
    "Explore our thoughts, strategies, and perspectives on brand strategy, creative direction, and what makes brands lead their category.",
}

export default function BlogPage() {
  return (
    <main className="min-h-screen bg-background">
      <Header />

      <div data-theme="light">
        <BlogHero />
      </div>

      <BlogGrid />

      <Footer />
    </main>
  )
}

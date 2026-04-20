import Header from "@/components/header"
import Footer from "@/components/footer"
import BlogHero from "@/components/blog/blog-hero"
import BlogGrid from "@/components/blog/blog-grid"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Blog & Insights | DigiiMark",
  description: "Explore our thoughts, strategies, and systems for scaling B2B companies with AI-first marketing automation.",
}

export default function BlogPage() {
  return (
    <main className="bg-grey-100 min-h-screen">
      <Header />
      
      {/* Hero Section */}
      <div data-theme="light">
        <BlogHero />
      </div>

      {/* Blog Grid */}
      <BlogGrid />

      <Footer />
    </main>
  )
}

import type { Metadata } from "next"

import Header from "@/components/header"
import Footer from "@/components/footer"
import LandingHero from "@/components/landing/landing-hero"
import LandingFeatures from "@/components/landing/landing-features"
import LandingShowcase from "@/components/landing/landing-showcase"
import LandingProcess from "@/components/landing/landing-process"
import LandingCta from "@/components/landing/landing-cta"

export const metadata: Metadata = {
  title: "Brandtangent | Intelligent Brand & Marketing Systems",
  description:
    "Experience Brandtangent's AI-powered brand strategy and marketing automation. Animated showcase of how we engineer brands that scale without limits.",
  openGraph: {
    title: "Brandtangent | Intelligent Brand & Marketing Systems",
    description:
      "Strategy-led creative and intelligent marketing systems that scale without limits.",
    type: "website",
  },
}

export default function LandingPage() {
  return (
    <main className="relative overflow-hidden">
      <Header />
      <LandingHero />
      <LandingFeatures />
      <LandingShowcase />
      <LandingProcess />
      <LandingCta />
      <Footer />
    </main>
  )
}

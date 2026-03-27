"use client"

import Header from "@/components/header"
import Footer from "@/components/footer"
import ServiceHero from "@/components/services/service-hero"
import ServiceFeatures from "@/components/services/service-features"
import ServiceProcess from "@/components/services/service-process"
import ServicePortfolio from "@/components/services/service-portfolio"
import ServiceCTA from "@/components/services/service-cta"
import {
  Search,
  FileText,
  BarChart3,
  Globe,
  Link2,
  MapPin,
} from "lucide-react"

const heroStats = [
  { value: "300%", label: "Avg. Organic Traffic Increase" },
  { value: "150+", label: "Keywords on Page 1" },
  { value: "45%", label: "Lower Cost-Per-Lead" },
  { value: "12+", label: "Years of SEO Expertise" },
]

const features = [
  {
    icon: Search,
    title: "Technical SEO Audits",
    description:
      "Deep-dive crawl analysis uncovering indexation issues, Core Web Vitals bottlenecks, and site architecture gaps holding back your rankings.",
  },
  {
    icon: FileText,
    title: "Content Strategy & Optimization",
    description:
      "AI-assisted keyword research and topic clustering to create content that ranks, converts, and positions you as an industry authority.",
  },
  {
    icon: BarChart3,
    title: "Rank Tracking & Analytics",
    description:
      "Real-time SERP monitoring dashboards with actionable insights, competitor analysis, and ROI attribution tied to every campaign.",
  },
  {
    icon: Globe,
    title: "International & Multilingual SEO",
    description:
      "Hreflang strategy, geo-targeted content, and regional search engine optimization for brands expanding into global markets.",
  },
  {
    icon: Link2,
    title: "Link Building & Digital PR",
    description:
      "Earning high-authority backlinks through data-driven outreach, digital PR campaigns, and strategic content partnerships.",
  },
  {
    icon: MapPin,
    title: "Local SEO & Map Pack",
    description:
      "Google Business Profile optimization, local citation building, and review management to dominate your service area.",
  },
]

const processSteps = [
  {
    step: "01",
    title: "Discovery & Competitive Audit",
    description:
      "We start with a comprehensive technical audit of your site and a deep competitive analysis to understand where you stand and where the biggest growth opportunities lie.",
  },
  {
    step: "02",
    title: "Keyword Research & Mapping",
    description:
      "AI-powered keyword discovery identifies high-intent search terms. We map them to your site architecture, creating a content calendar that targets every stage of the buyer journey.",
  },
  {
    step: "03",
    title: "On-Page & Technical Optimization",
    description:
      "We fix crawl errors, optimize meta data, improve site speed, implement structured data, and ensure your site is technically flawless for search engine crawlers.",
  },
  {
    step: "04",
    title: "Content Creation & Link Acquisition",
    description:
      "Our team produces SEO-optimized content while simultaneously executing outreach campaigns to earn authoritative backlinks that boost your domain authority.",
  },
  {
    step: "05",
    title: "Monitor, Report & Scale",
    description:
      "Monthly performance reports with transparent KPIs. We continuously refine the strategy based on data, scaling what works and pivoting quickly when needed.",
  },
]

const portfolioItems = [
  {
    title: "SaaS Platform Organic Growth",
    category: "B2B SaaS",
    result: "350% increase in organic signups in 8 months",
    image: "/placeholder.svg",
  },
  {
    title: "E-Commerce SEO Overhaul",
    category: "Retail & E-Commerce",
    result: "200+ product pages ranking on Page 1",
    image: "/placeholder.svg",
  },
  {
    title: "Healthcare Lead Generation",
    category: "Healthcare",
    result: "5x increase in qualified patient inquiries",
    image: "/placeholder.svg",
  },
  {
    title: "FinTech Authority Building",
    category: "Financial Services",
    result: "Domain Authority improved from 25 to 58",
    image: "/placeholder.svg",
  },
]

export default function SEOServicePage() {
  return (
    <main>
      <Header />
      <ServiceHero
        badge="Search Engine Optimization"
        title="Outrank Your Competition with AI-Powered"
        highlightedWord="SEO"
        description="We don't just optimize for search engines — we engineer sustainable organic growth systems that deliver compounding returns month after month."
        stats={heroStats}
      />
      <ServiceFeatures
        badge="What We Deliver"
        title="Full-Spectrum SEO Services"
        subtitle="Every angle of search optimization, powered by data, driven by results."
        features={features}
      />
      <ServiceProcess
        badge="Our Methodology"
        title="How We Drive Organic Growth"
        subtitle="A proven, transparent, 5-step process that turns search into your strongest acquisition channel."
        steps={processSteps}
      />
      <ServicePortfolio
        badge="Case Studies"
        title="SEO Success Stories"
        subtitle="Real results from real campaigns — here's how we've helped brands dominate search."
        items={portfolioItems}
      />
      <ServiceCTA
        title="Ready to Own Page 1?"
        subtitle="Get a free, no-obligation SEO audit of your website. We'll show you exactly where you're losing traffic and how to fix it."
        buttonText="Get Your Free SEO Audit"
      />
      <Footer />
    </main>
  )
}

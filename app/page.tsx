import Header from "@/components/header"
import HeroSection from "@/components/hero-section"
import TrustIndicators from "@/components/trust-indicators"
import AboutUs from "@/components/about-us"
import TestimonialSection from "@/components/testimonial-section"
import ServicesScroll from "@/components/services-scroll"
import ProjectsSection from "@/components/projects-section"
import PartnersSection from "@/components/partners-section"
import MetricsDashboard from "@/components/metrics-dashboard"
import BlogSection from "@/components/blog-section"
import ClientsSection from "@/components/clients-section"
import FAQSection from "@/components/faq-section"
import Footer from "@/components/footer"

/** Refresh homepage data (including `ProjectsSection` case studies) periodically from Supabase. */
export const revalidate = 120

export default function Home() {
  return (
    <main className="relative overflow-hidden">
      <Header />
      <HeroSection />
      <TrustIndicators />
      <AboutUs />
      <TestimonialSection />
      <ServicesScroll />
      <ProjectsSection />
      <PartnersSection />
      <MetricsDashboard />
      <BlogSection />
      <ClientsSection />
      <FAQSection />
      <Footer />
    </main>
  )
}

import Header from "@/components/header"
import HeroSection from "@/components/hero-section"
import TrustIndicators from "@/components/trust-indicators"
import AboutUs from "@/components/about-us"
import ServicesGrid from "@/components/services-grid"
import IndustryFocus from "@/components/industry-focus"
import InnovationLab from "@/components/innovation-lab"
import MetricsDashboard from "@/components/metrics-dashboard"
import CaseStudyCarousel from "@/components/case-study-carousel"
import TeamSection from "@/components/team-section"
import TechnologyStack from "@/components/technology-stack"
import CTASection from "@/components/cta-section"
import Footer from "@/components/footer"

export default function Home() {
  return (
    <main className="relative overflow-hidden">
      <Header />
      <HeroSection />
      <TrustIndicators />
      <AboutUs />
      <ServicesGrid />
      <IndustryFocus />
      <InnovationLab />
      <MetricsDashboard />
      <CaseStudyCarousel />
      <TeamSection />
      <TechnologyStack />
      <CTASection />
      <Footer />
    </main>
  )
}

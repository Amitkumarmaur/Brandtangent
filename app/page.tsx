import Header from "@/components/header"
import HeroSection from "@/components/hero-section"
import TrustIndicators from "@/components/trust-indicators"
import AboutUs from "@/components/about-us"
import TestimonialSection from "@/components/testimonial-section"
import ServicesScroll from "@/components/services-scroll"
import ProjectsSection from "@/components/projects-section"
import PartnersSection from "@/components/partners-section"
import IndustryFocus from "@/components/industry-focus"
import InnovationLab from "@/components/innovation-lab"
import MetricsDashboard from "@/components/metrics-dashboard"
import CaseStudyCarousel from "@/components/case-study-carousel"
import BlogSection from "@/components/blog-section"
import TeamSection from "@/components/team-section"
import TechnologyStack from "@/components/technology-stack"
import FAQSection from "@/components/faq-section"
import CTASection from "@/components/cta-section"
import Footer from "@/components/footer"

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
      <IndustryFocus />
      <InnovationLab />
      <MetricsDashboard />
      <CaseStudyCarousel />
      <BlogSection />
      <TeamSection />
      <TechnologyStack />
      <FAQSection />
      <CTASection />
      <Footer />
    </main>
  )
}

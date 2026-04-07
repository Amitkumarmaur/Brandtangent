"use client"

import Header from "@/components/header"
import Footer from "@/components/footer"
import WebDevHero from "@/components/services/web-dev-hero"
import ServiceFeatures from "@/components/services/service-features"
import ProjectsSection from "@/components/projects-section"
import ServiceTechStack from "@/components/services/service-tech-stack"
import ServiceWebServices from "@/components/services/service-web-services"
import ServiceProcessGrid from "@/components/services/service-process-grid"
import ServiceIndustries from "@/components/services/service-industries"
import {
  Code2,
  ShoppingCart,
  Layers,
  Smartphone,
  Plug,
  Gauge,
} from "lucide-react"


const features = [
  {
    icon: Code2,
    title: "Custom Web Applications",
    description:
      "Bespoke, scalable web applications built with React, Next.js, and TypeScript — engineered to handle millions of users without breaking a sweat.",
  },
  {
    icon: ShoppingCart,
    title: "E-Commerce Solutions",
    description:
      "High-converting online stores with seamless checkout flows, inventory management, and payment gateway integrations that maximize revenue.",
  },
  {
    icon: Layers,
    title: "CMS & Content Platforms",
    description:
      "Headless CMS architectures with Sanity, Strapi, or custom solutions — giving your team full content control without developer dependency.",
  },
  {
    icon: Smartphone,
    title: "Progressive Web Apps",
    description:
      "PWAs that deliver native-app experiences on the web: offline capability, push notifications, and instant loading on any device.",
  },
  {
    icon: Plug,
    title: "API & System Integration",
    description:
      "Connect your entire tech stack with robust REST and GraphQL APIs. CRM, ERP, payment gateways, AI models — we integrate it all.",
  },
  {
    icon: Gauge,
    title: "Performance Optimization",
    description:
      "Core Web Vitals optimization, code splitting, image optimization, and server-side rendering for lightning-fast user experiences.",
  },
]



export default function WebDevelopmentServicePage() {
  return (
    <main>
      <Header />
      <div data-theme="dark">
        <WebDevHero />
      </div>
      <div data-theme="light">
        <ServiceFeatures
          badge="Our Expertise"
          title="End-to-End Web Development"
          subtitle="From concept to deployment, we build digital products that are fast, beautiful, and built to scale."
          features={features}
        />
      </div>
      <div data-theme="light">
        <ProjectsSection />
      </div>
      <div data-theme="dark">
        <ServiceTechStack />
      </div>
      <div data-theme="light">
        <ServiceWebServices />
      </div>
      <div data-theme="light">
        <ServiceProcessGrid />
      </div>
      <div data-theme="dark">
        <ServiceIndustries />
      </div>
      <Footer />
    </main>
  )
}

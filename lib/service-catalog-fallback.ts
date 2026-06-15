/**
 * Static service catalog used when Supabase is unreachable or not seeded yet.
 * Keeps `/services/[category]` and `/services/[category]/[service]` from 404ing in dev.
 */

export type FallbackCategory = {
  id: string
  name: string
  slug: string
  icon: string | null
  display_order: number | null
  hero_display_title: string | null
  hero_description: string | null
  hero_animated_words: string[] | null
  hero_stat_value: string | null
  hero_stat_label: string | null
  featured_projects: unknown
  expertise_badge: string | null
  expertise_title: string | null
  expertise_subtitle: string | null
  process_heading: string | null
  process_description: string | null
  process_steps: unknown
  tech_stack_ids: string[] | null
  target_industries: unknown
  seo_title: string | null
  meta_description: string | null
  created_at: string | null
}

export type FallbackService = {
  id: string
  category_id: string | null
  name: string
  slug: string
  hero_h1: string | null
  hero_description: string | null
  hero_image: string | null
  seo_title: string | null
  meta_description: string | null
  short_description: string | null
  description: string | null
  display_order: number | null
  service_details: unknown
  methodology: unknown
  what_we_provide: unknown
  platform_ids: string[] | null
}

/** Legacy / mistyped URLs → canonical service slug. */
export const SERVICE_SLUG_ALIASES: Record<string, string> = {
  "website-development": "custom-web-applications",
}

const WEB_DEV_CATEGORY_ID = "fallback-cat-web-development"

const WEB_DEV_SERVICES: FallbackService[] = [
  {
    id: "fallback-svc-custom-web",
    category_id: WEB_DEV_CATEGORY_ID,
    name: "Custom Web Applications",
    slug: "custom-web-applications",
    hero_h1: "Custom Web Applications Built to Scale Your Business",
    hero_description:
      "Dashboards, portals, booking systems, calculators, and interactive tools — built on React and Next.js.",
    hero_image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80",
    seo_title: "Custom Web Applications: React & Next.js Development",
    meta_description: "Custom web applications built with React, Next.js, and TypeScript.",
    short_description: "Full-stack website design and build across Webflow, WordPress, Next.js, and React.",
    description: null,
    display_order: 1,
    service_details: [
      {
        title: "React & Next.js Application Builds",
        description:
          "Modern full-stack applications using Next.js App Router for server-side rendering, edge performance, and seamless client interactivity.",
      },
      {
        title: "Complex State & Data Management",
        description:
          "Handling intricate data flows, real-time updates, and multi-user interactions without compromising on speed or reliability.",
      },
      {
        title: "Cloud-Native Infrastructure",
        description:
          "Auto-scaling, serverless foundations with 99.9%+ uptime — deployed on Vercel or AWS with monitoring and CI/CD.",
      },
      {
        title: "Security, Auth & Compliance",
        description:
          "Enterprise-grade authentication, encryption, role-based access control, and compliance-ready architecture.",
      },
    ],
    methodology: [
      {
        title: "Requirements Engineering",
        description: "We translate business goals into technical specifications and user flow maps.",
      },
      {
        title: "UI/UX Design & Prototyping",
        description: "High-fidelity prototypes validate the experience before production code.",
      },
      {
        title: "Agile Development Sprints",
        description: "Iterative sprints with continuous visibility and feedback loops.",
      },
      {
        title: "QA Testing & Cloud Deployment",
        description: "Cross-browser testing and automated CI/CD deployments to production.",
      },
    ],
    what_we_provide: [
      { title: "Scalable SaaS Platforms", description: "Multi-tenant architectures built for growth." },
      { title: "Interactive Dashboards & Portals", description: "Data-rich interfaces for teams and customers." },
      { title: "Booking & Custom Tools", description: "Calculators, configurators, and workflow tools." },
      { title: "Custom API & Backend Architecture", description: "Secure APIs and integrations that scale." },
    ],
    platform_ids: null,
  },
  {
    id: "fallback-svc-ecommerce",
    category_id: WEB_DEV_CATEGORY_ID,
    name: "E-Commerce Solutions",
    slug: "e-commerce-solutions",
    hero_h1: "E-Commerce Solutions That Turn Browsers Into Buyers",
    hero_description: "Online stores with payment integration, inventory management, and conversion-optimised checkout.",
    hero_image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=1200&q=80",
    seo_title: null,
    meta_description: null,
    short_description: "Online stores with payment integration and conversion-optimised checkout.",
    description: null,
    display_order: 2,
    service_details: [],
    methodology: [],
    what_we_provide: null,
    platform_ids: null,
  },
  {
    id: "fallback-svc-cms",
    category_id: WEB_DEV_CATEGORY_ID,
    name: "CMS & Content Platforms",
    slug: "cms-content-platforms",
    hero_h1: "CMS & Content Platforms",
    hero_description: "Dashboards, portals, booking systems, and interactive tools built in React/Next.js.",
    hero_image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1200&q=80",
    seo_title: null,
    meta_description: null,
    short_description: "Content platforms and CMS builds on modern stacks.",
    description: null,
    display_order: 3,
    service_details: [],
    methodology: [],
    what_we_provide: null,
    platform_ids: null,
  },
  {
    id: "fallback-svc-pwa",
    category_id: WEB_DEV_CATEGORY_ID,
    name: "Progressive Web Apps",
    slug: "progressive-web-apps",
    hero_h1: "Progressive Web Apps That Feel Like Native",
    hero_description: "MVP and SaaS platform builds for startups launching software products.",
    hero_image: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?auto=format&fit=crop&w=1200&q=80",
    seo_title: null,
    meta_description: null,
    short_description: "PWAs with offline support and app-like experiences.",
    description: null,
    display_order: 4,
    service_details: [],
    methodology: [],
    what_we_provide: null,
    platform_ids: null,
  },
  {
    id: "fallback-svc-perf",
    category_id: WEB_DEV_CATEGORY_ID,
    name: "Performance Optimization",
    slug: "performance-optimization",
    hero_h1: "Web Performance Optimisation for Speed & Scale",
    hero_description: "Core Web Vitals, edge caching, and infrastructure tuning for faster experiences.",
    hero_image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80",
    seo_title: null,
    meta_description: null,
    short_description: "Speed and Core Web Vitals optimisation.",
    description: null,
    display_order: 5,
    service_details: [],
    methodology: [],
    what_we_provide: null,
    platform_ids: null,
  },
  {
    id: "fallback-svc-api",
    category_id: WEB_DEV_CATEGORY_ID,
    name: "API & System Integration",
    slug: "api-system-integration",
    hero_h1: "API & System Integration That Unifies Your Business",
    hero_description: "Custom APIs and third-party integrations — CRMs, payments, data syncing, and webhooks.",
    hero_image: "https://images.unsplash.com/photo-1555949963-aa79dcee981c?auto=format&fit=crop&w=1200&q=80",
    seo_title: null,
    meta_description: null,
    short_description: "API design and system integrations.",
    description: null,
    display_order: 6,
    service_details: [],
    methodology: [],
    what_we_provide: null,
    platform_ids: null,
  },
]

export const FALLBACK_CATEGORIES: FallbackCategory[] = [
  {
    id: WEB_DEV_CATEGORY_ID,
    name: "Web Development",
    slug: "web-development",
    icon: "Code2",
    display_order: 1,
    hero_display_title: "Web Development",
    hero_description:
      "We engineer blazing-fast, scalable web apps using cutting-edge frameworks. Your website is your most powerful growth engine.",
    hero_animated_words: ["WEB", "DEV"],
    hero_stat_value: "99.9%",
    hero_stat_label: "Uptime SLA",
    featured_projects: [
      {
        id: 1,
        title: "DigiiMark — The leading agency for premium web development",
        image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=1200&q=80",
        category: "Web Development",
        accent: "#FF5722",
        stat: { value: "500+", label: "Projects Done" },
      },
    ],
    expertise_badge: "Our Expertise",
    expertise_title: "End-to-End Web Development",
    expertise_subtitle:
      "From concept to deployment, we build digital products that are fast, beautiful, and built to scale.",
    process_heading: "Elevate Your Web Experience with Our Seamless Process",
    process_description:
      "Our process involves in-depth business analysis, documenting specifications, creating wireframes, and obtaining your approval before moving forward.",
    process_steps: [
      {
        title: "Planning",
        items: ["Business Analysis", "Document Specifications", "Preparing Wireframes", "Getting Client Approval"],
      },
      {
        title: "Development",
        items: ["Coding", "Mockup & Page Layout Creation", "Review", "Approval Cycle"],
      },
      {
        title: "Testing",
        items: ["Preparing Test Cases", "Testing", "Review By The QA Team", "Approval Cycle"],
      },
      {
        title: "Deployment",
        items: ["Launch", "Opinion Monitoring", "Maintenance", "Post-Deployment Support"],
      },
    ],
    tech_stack_ids: null,
    target_industries: null,
    seo_title: "Development Services | Brandtangent",
    meta_description: "Web development services — custom apps, e-commerce, CMS, and performance.",
    created_at: null,
  },
]

export const FALLBACK_SERVICES: FallbackService[] = [...WEB_DEV_SERVICES]

export function resolveServiceSlug(slug: string): string {
  const normalized = slug.trim().toLowerCase()
  return SERVICE_SLUG_ALIASES[normalized] ?? normalized
}

export function getFallbackCategory(slug: string): FallbackCategory | null {
  const normalized = slug.trim().toLowerCase()
  return FALLBACK_CATEGORIES.find((c) => c.slug === normalized) ?? null
}

export function getFallbackService(slug: string): FallbackService | null {
  const resolved = resolveServiceSlug(slug)
  return FALLBACK_SERVICES.find((s) => s.slug === resolved) ?? null
}

export function getFallbackServicesForCategory(categoryId: string): FallbackService[] {
  return FALLBACK_SERVICES.filter((s) => s.category_id === categoryId).sort(
    (a, b) => (a.display_order ?? 0) - (b.display_order ?? 0),
  )
}

export function getFallbackCategoryForService(service: FallbackService): FallbackCategory | null {
  if (!service.category_id) return null
  return FALLBACK_CATEGORIES.find((c) => c.id === service.category_id) ?? null
}

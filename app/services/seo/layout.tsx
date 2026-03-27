import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "SEO Services | DigiiMark — Dominate Search Rankings",
  description:
    "Our AI-powered SEO strategies drive sustainable organic growth. From technical audits to content optimization, we help brands dominate search engine results pages.",
  keywords: [
    "SEO services",
    "search engine optimization",
    "organic growth",
    "technical SEO",
    "link building",
    "local SEO",
    "SEO audit",
    "DigiiMark",
  ],
  openGraph: {
    title: "SEO Services | DigiiMark — Dominate Search Rankings",
    description:
      "AI-powered SEO strategies that drive sustainable organic growth for ambitious brands.",
    type: "website",
  },
}

export default function SEOLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}

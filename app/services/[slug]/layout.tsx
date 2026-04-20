import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Web Development Services | DigiiMark — High-Performance Digital Experiences",
  description:
    "We build blazing-fast, conversion-focused web applications using Next.js, React, and modern frameworks. Custom web development for ambitious brands.",
  keywords: [
    "web development",
    "custom web applications",
    "Next.js development",
    "React development",
    "e-commerce development",
    "progressive web apps",
    "DigiiMark",
  ],
  openGraph: {
    title: "Web Development Services | DigiiMark",
    description:
      "Blazing-fast, conversion-focused web applications built with Next.js, React, and AI-powered workflows.",
    type: "website",
  },
}

export default function WebDevLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}

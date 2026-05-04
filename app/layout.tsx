import type React from "react"
import { Suspense } from "react"
import type { Metadata, Viewport } from "next"
import { Inter, Poppins } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { ChatWidget } from "@/components/chat-widget"
import ScrollToTop from "@/components/scroll-to-top"
import "./globals.css"

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
})

const poppins = Poppins({
  subsets: ["latin"],
  display: "swap",
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-poppins",
})

export const metadata: Metadata = {
  title: "DigiiMark | AI-First Marketing Automation Agency",
  description:
    "We engineer intelligent marketing systems that scale without limits. AI-first automation that transforms how B2B companies grow.",
  keywords: ["AI marketing", "marketing automation", "B2B growth", "automation agency"],
  authors: [{ name: "DigiiMark" }],
  openGraph: {
    title: "DigiiMark | AI-First Marketing Automation Agency",
    description: "We engineer intelligent marketing systems that scale without limits.",
    type: "website",
  },
    generator: 'v0.app'
}

export const viewport: Viewport = {
  themeColor: "#0A0A0A",
  width: "device-width",
  initialScale: 1,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${poppins.variable}`}>
      <body className="font-sans antialiased">
        <Suspense fallback={null}>
          <ScrollToTop />
        </Suspense>
        {children}
        <ChatWidget />
        <Analytics />
      </body>
    </html>
  )
}

import type React from "react"
import type { Metadata, Viewport } from "next"
import { Inter } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
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
    <html lang="en" className={inter.variable}>
      <body className="font-sans antialiased">
        {children}
        <Analytics />
      </body>
    </html>
  )
}

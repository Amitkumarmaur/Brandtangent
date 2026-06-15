import type React from "react"
import { Suspense } from "react"
import type { Metadata, Viewport } from "next"
import { Inter, Inconsolata } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { ContactWidget } from "@/components/contact-widget"
import ScrollToTop from "@/components/scroll-to-top"
import "./globals.css"

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
  weight: ["400", "500", "600"],
})

const inconsolata = Inconsolata({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inconsolata",
  weight: ["400"],
})

export const metadata: Metadata = {
  title: "Brandtangent | Brand Strategy & Creative Agency",
  description:
    "We craft brand identities and marketing systems that make businesses impossible to ignore. Strategy-led creative that drives real growth.",
  keywords: ["brand strategy", "creative agency", "brand identity", "marketing", "design"],
  authors: [{ name: "Brandtangent" }],
  openGraph: {
    title: "Brandtangent | Brand Strategy & Creative Agency",
    description: "We craft brand identities and marketing systems that make businesses impossible to ignore.",
    type: "website",
  },
}

export const viewport: Viewport = {
  themeColor: "#ffffff",
  width: "device-width",
  initialScale: 1,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${inconsolata.variable}`}>
      <body className="font-sans antialiased bg-background text-foreground">
        <Suspense fallback={null}>
          <ScrollToTop />
        </Suspense>
        {children}
        <ContactWidget />
        <Analytics />
      </body>
    </html>
  )
}

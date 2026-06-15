import type { Metadata } from "next"
import Header from "@/components/header"
import Footer from "@/components/footer"
import AboutContent from "./about-content"

export const metadata: Metadata = {
  title: "About Us | Brandtangent",
  description:
    "Brandtangent is a brand strategy and creative agency. Over 12 years crafting identities for 500+ ambitious brands — strategy, identity, and activation that compounds.",
}

export default function AboutPage() {
  return (
    <>
      <Header />
      <div data-theme="light">
        <AboutContent />
      </div>
      <Footer />
    </>
  )
}

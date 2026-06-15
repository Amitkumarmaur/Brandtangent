import AboutHero from "@/components/about/about-hero"
import AboutStory from "@/components/about/about-story"
import AboutMilestones from "@/components/about/about-milestones"
import AboutPillars from "@/components/about/about-pillars"
import AboutValues from "@/components/about/about-values"
import AboutLeadership from "@/components/about/about-leadership"
import AboutRecognition from "@/components/about/about-recognition"
import AboutCta from "@/components/about/about-cta"

export default function AboutContent() {
  return (
    <main className="relative overflow-x-hidden bg-background">
      <AboutHero />
      <AboutStory />
      <AboutMilestones />
      <AboutPillars />
      <AboutValues />
      <AboutLeadership />
      <AboutRecognition />
      <AboutCta />
    </main>
  )
}

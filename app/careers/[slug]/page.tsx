import { notFound } from "next/navigation"
import Link from "next/link"
import type { Metadata } from "next"
import { ArrowLeft } from "lucide-react"
import Header from "@/components/header"
import Footer from "@/components/footer"
import { Button } from "@/components/ui/button"
import CareersJobDescription from "@/components/careers/careers-job-description"
import {
  careerSlugFromTitle,
  fetchOpenCareerBySlug,
  fetchOpenCareers,
  careerDescriptionPlainExcerpt,
} from "@/lib/careers"

export const revalidate = 60

export async function generateStaticParams() {
  const { careers } = await fetchOpenCareers()
  return careers.map((c) => ({ slug: careerSlugFromTitle(c.job_title) }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const { career } = await fetchOpenCareerBySlug(slug)
  if (!career) {
    return { title: "Careers | DigiiMark" }
  }
  const description =
    careerDescriptionPlainExcerpt(career.description ?? null, 165) ||
    `Apply for ${career.job_title} at DigiiMark.`
  return {
    title: `${career.job_title} | Careers | DigiiMark`,
    description,
    openGraph: {
      title: `${career.job_title} | DigiiMark`,
      description,
      type: "website",
    },
  }
}

export default async function CareerJobPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const { career, error } = await fetchOpenCareerBySlug(slug)

  if (error) {
    throw new Error(error)
  }
  if (!career) {
    notFound()
  }

  const metaLine = [career.type, career.location].filter(Boolean).join(" · ")
  const bodyHtml = (career.description ?? "").trim()

  return (
    <main className="min-h-screen bg-grey-100">
      <Header />

      <section className="relative w-full pt-28 pb-10 md:pt-36 md:pb-14 bg-background border-b border-grey-200">
        <div className="w-full max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
          <Link
            href="/careers"
            className="inline-flex items-center gap-2 text-sm font-medium text-grey-400 hover:text-ignite-orange transition-colors mb-8"
          >
            <ArrowLeft className="w-4 h-4" aria-hidden />
            Back to careers
          </Link>

          <div className="flex items-center gap-2 mb-4">
            <div className="w-2 h-2 rounded-full bg-ignite-orange" />
            <span className="text-eyebrow text-ignite-orange">Open role</span>
          </div>

          <h1 className="heading-h1 text-foreground tracking-tight mb-4 text-balance max-w-4xl">
            {career.job_title}
          </h1>
          {metaLine ? <p className="text-subtitle text-grey-400">{metaLine}</p> : null}

          <div className="mt-10 flex flex-wrap gap-4">
            <Button
              asChild
              className="rounded-full bg-ignite-orange hover:bg-ignite-orange/90 text-white px-8 py-6 text-base font-semibold shadow-[0_4px_14px_rgba(255,87,34,0.25)]"
            >
              <Link href={`/careers?career=${career.id}#apply`}>Apply for this role</Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="relative py-16 md:py-20 bg-background">
        <div className="w-full max-w-3xl mx-auto px-6 lg:px-8">
          {bodyHtml ? (
            <CareersJobDescription html={bodyHtml} />
          ) : (
            <p className="text-body text-grey-400">Full job description will be published soon.</p>
          )}
        </div>
      </section>

      <Footer />
    </main>
  )
}

import Link from "next/link"
import { ArrowUpRight } from "lucide-react"
import { careerSlugFromTitle, careerDescriptionPlainExcerpt, type CareerRow } from "@/lib/careers"

type Props = {
  careers: CareerRow[]
}

export default function CareersOpenPositions({ careers }: Props) {
  if (!careers.length) return null

  return (
    <section className="relative w-full py-16 md:py-20 bg-background overflow-hidden border-t border-grey-200">
      <div className="w-full max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-2 h-2 rounded-full bg-ignite-orange" />
          <span className="text-eyebrow text-ignite-orange">Open roles</span>
        </div>
        <h2 className="font-heading text-3xl md:text-4xl lg:text-5xl font-semibold text-foreground tracking-tight leading-tight mb-4">
          Positions we are hiring for
        </h2>
        <p className="text-subtitle text-grey-400 max-w-2xl mb-12 text-balance">
          Each listing includes a full job description. Apply from this page and pick the role that matches you best.
        </p>

        <ul className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 list-none p-0 m-0">
          {careers.map((c) => {
            const slug = careerSlugFromTitle(c.job_title)
            const excerpt = careerDescriptionPlainExcerpt(c.description ?? null, 200)
            return (
              <li key={c.id}>
                <Link
                  href={`/careers/${slug}`}
                  className="group flex h-full flex-col rounded-2xl border border-grey-200 bg-grey-50 p-6 md:p-8 shadow-sm transition-shadow hover:shadow-md hover:border-grey-300"
                >
                  <div className="flex items-start justify-between gap-4 mb-3">
                    <h3 className="font-heading text-xl md:text-2xl font-semibold text-foreground leading-snug group-hover:text-ignite-orange transition-colors">
                      {c.job_title}
                    </h3>
                    <ArrowUpRight
                      className="w-5 h-5 shrink-0 text-grey-400 group-hover:text-ignite-orange transition-colors"
                      aria-hidden
                    />
                  </div>
                  <p className="text-sm text-grey-400 mb-4">
                    {[c.type, c.location].filter(Boolean).join(" · ")}
                  </p>
                  {excerpt ? (
                    <p className="text-body text-grey-600 leading-relaxed flex-1">{excerpt}</p>
                  ) : (
                    <p className="text-body text-grey-400 flex-1">View role details</p>
                  )}
                  <span className="mt-6 text-sm font-semibold text-ignite-orange group-hover:underline">
                    Read job description
                  </span>
                </Link>
              </li>
            )
          })}
        </ul>
      </div>
    </section>
  )
}

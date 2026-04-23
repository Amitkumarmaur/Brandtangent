"use client"

import Link from "next/link"
import { filterOpenCareers, type CareerRow } from "@/lib/careers"
import { ArrowRight } from "lucide-react"

type Props = {
  careers: CareerRow[]
}

export default function CareersOpenRoles({ careers }: Props) {
  const openRoles = filterOpenCareers(careers)
  if (!openRoles.length) return null

  return (
    <section className="relative w-full py-16 md:py-20 bg-grey-100 overflow-hidden border-t border-grey-200">
      <div className="w-full max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-2 h-2 rounded-full bg-ignite-orange" />
          <span className="font-heading text-ignite-orange font-medium tracking-wider text-sm uppercase">Open roles</span>
        </div>
        <h2 className="font-heading text-3xl md:text-4xl lg:text-5xl font-semibold text-foreground tracking-tight leading-tight mb-10">
          Positions we are hiring for
        </h2>
        <ul className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {openRoles.map((c) => (
            <li key={c.id}>
              <Link
                href={`/careers/${c.slug}`}
                className="group flex flex-col h-full rounded-2xl border border-grey-200 bg-white p-8 shadow-sm hover:border-ignite-orange/40 hover:shadow-md transition-all"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="font-heading text-xl md:text-2xl font-semibold text-foreground group-hover:text-ignite-orange transition-colors">
                      {c.job_title}
                    </h3>
                    <p className="mt-2 text-sm text-grey-400">
                      {[c.location, c.type].filter(Boolean).join(" · ") || "Details on the role page"}
                    </p>
                    {c.team ? <p className="mt-1 text-xs font-medium text-grey-400">{c.team}</p> : null}
                  </div>
                  <ArrowRight
                    className="shrink-0 w-5 h-5 text-grey-300 group-hover:text-ignite-orange group-hover:translate-x-0.5 transition-all"
                    aria-hidden
                  />
                </div>
                {c.short_description ? (
                  <p className="mt-4 text-body text-grey-400 line-clamp-3">{c.short_description}</p>
                ) : null}
                <span className="mt-6 text-sm font-semibold text-ignite-orange">
                  View role
                  <span className="sr-only">: {c.job_title}</span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

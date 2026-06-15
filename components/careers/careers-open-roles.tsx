"use client"

import Link from "next/link"
import { motion } from "motion/react"
import { ArrowRight, MapPin } from "lucide-react"

import { filterOpenCareers, type CareerRow } from "@/lib/careers"

type Props = {
  careers: CareerRow[]
}

export default function CareersOpenRoles({ careers }: Props) {
  const openRoles = filterOpenCareers(careers)
  if (!openRoles.length) return null

  return (
    <section
      id="open-roles"
      className="relative w-full overflow-hidden border-t border-border bg-background py-16 md:py-20"
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.35]"
        aria-hidden
        style={{
          background:
            "radial-gradient(ellipse 80% 50% at 50% 0%, rgba(83,58,253,0.06), transparent 70%)",
        }}
      />

      <div className="relative mx-auto w-full max-w-7xl px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="mb-10 flex flex-col gap-4 lg:mb-14 lg:flex-row lg:items-end lg:justify-between"
        >
          <div>
            <div className="mb-4 flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-primary" />
              <span className="micro-cap text-muted-foreground">Open roles</span>
            </div>
            <h2 className="display-lg text-foreground">Positions we&apos;re hiring for</h2>
            <p className="text-subtitle mt-2 max-w-lg">
              Strategy, design, and creative roles for people who want to shape brands
              — not just deliver assets.
            </p>
          </div>
          <p className="text-sm text-muted-foreground">
            {openRoles.length} open position{openRoles.length === 1 ? "" : "s"}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:gap-8">
          {openRoles.map((role, i) => (
            <CareerRoleCard key={role.id} role={role} index={i} />
          ))}
        </div>
      </div>
    </section>
  )
}

function CareerRoleCard({ role, index }: { role: CareerRow; index: number }) {
  const meta = [role.location, role.type].filter(Boolean).join(" · ")

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{
        duration: 0.5,
        delay: index * 0.08,
        ease: [0.22, 1, 0.36, 1],
      }}
      whileHover={{ y: -6 }}
    >
      <Link
        href={`/careers/${role.slug}`}
        className="group relative flex h-full flex-col overflow-hidden rounded-md border border-border bg-card p-8 shadow-[var(--shadow-1)] transition-colors duration-300 hover:border-accent-orange/30 hover:shadow-[var(--shadow-accent-orange-soft)] lg:p-10"
      >
        <div className="pointer-events-none absolute -right-8 -top-8 h-32 w-32 rounded-full bg-primary/5 blur-2xl transition-opacity group-hover:opacity-100 opacity-60" />

        <div className="relative z-10 mb-4 flex items-start justify-between gap-4">
          <div className="flex-1">
            <h3 className="text-xl font-semibold leading-tight text-foreground lg:text-2xl">
              <span className="bg-gradient-to-r from-primary to-primary bg-[length:0%_2px] bg-left-bottom bg-no-repeat transition-[background-size] duration-500 group-hover:bg-[length:100%_2px]">
                {role.job_title}
              </span>
            </h3>
            {role.team ? (
              <p className="mt-2 text-xs font-semibold uppercase tracking-widest text-primary">
                {role.team}
              </p>
            ) : null}
          </div>
          <motion.div
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10"
            whileHover={{ scale: 1.1 }}
          >
            <ArrowRight
              className="h-5 w-5 text-primary transition-transform group-hover:translate-x-0.5"
              aria-hidden
            />
          </motion.div>
        </div>

        {role.short_description ? (
          <p className="relative z-10 mb-6 line-clamp-3 text-sm leading-relaxed text-muted-foreground md:text-base">
            {role.short_description}
          </p>
        ) : null}

        <div className="relative z-10 mt-auto flex flex-wrap items-center justify-between gap-3 border-t border-border pt-5">
          <span className="text-sm font-semibold text-foreground transition-colors group-hover:text-primary">
            View role details
          </span>
          {meta ? (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-secondary px-3 py-1 text-xs text-muted-foreground">
              <MapPin className="h-3 w-3 shrink-0" />
              {meta}
            </span>
          ) : (
            <span className="rounded-full bg-secondary px-3 py-1 text-xs text-muted-foreground">
              Open
            </span>
          )}
        </div>
      </Link>
    </motion.div>
  )
}

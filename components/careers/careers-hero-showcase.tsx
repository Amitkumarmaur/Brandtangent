"use client"

import Link from "next/link"
import { motion } from "motion/react"
import { ArrowUpRight, Briefcase, MapPin } from "lucide-react"

import { Card } from "@/components/ui/card"
import { TiltCard } from "@/components/motion/tilt-card"
import { filterOpenCareers, type CareerRow } from "@/lib/careers"

function RolePreviewCard({
  role,
  className,
  floatDelay = 0,
  large = false,
}: {
  role: CareerRow
  className?: string
  floatDelay?: number
  large?: boolean
}) {
  const meta = [role.location, role.type].filter(Boolean).join(" · ")

  return (
    <motion.div
      animate={{ y: [0, large ? -8 : -5, 0] }}
      transition={{
        duration: 4 + floatDelay,
        repeat: Number.POSITIVE_INFINITY,
        ease: "easeInOut",
        delay: floatDelay,
      }}
      className={className}
    >
      <Link
        href={`/careers/${role.slug}`}
        className="group block h-full overflow-hidden rounded-md outline-none focus-visible:ring-2 focus-visible:ring-primary"
      >
        <div
          className={`relative flex h-full flex-col justify-between overflow-hidden rounded-md border border-border/50 bg-gradient-to-br from-primary/10 via-secondary to-background p-5 shadow-[var(--shadow-2)] ${large ? "min-h-[180px]" : "min-h-[120px]"}`}
        >
          <div>
            {role.team ? (
              <span className="pill-tag mb-3 w-fit border-0 bg-primary/90 text-[10px] text-white">
                {role.team}
              </span>
            ) : (
              <span className="pill-tag mb-3 w-fit border-0 bg-primary/90 text-[10px] text-white">
                Open role
              </span>
            )}
            <p
              className={`font-light leading-tight text-foreground ${large ? "text-lg" : "text-sm line-clamp-2"}`}
            >
              {role.job_title}
            </p>
          </div>
          <div className="mt-4 flex items-center justify-between gap-2">
            {meta ? (
              <span className="flex items-center gap-1 text-[11px] text-muted-foreground">
                <MapPin className="h-3 w-3 shrink-0" />
                {meta}
              </span>
            ) : (
              <span />
            )}
            <span className="flex items-center gap-1 text-xs text-primary opacity-0 transition-opacity group-hover:opacity-100">
              View
              <ArrowUpRight className="h-3 w-3" />
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
  )
}

export default function CareersHeroShowcase({ careers }: { careers: CareerRow[] }) {
  const openRoles = filterOpenCareers(careers).slice(0, 3)

  if (openRoles.length === 0) {
    return (
      <TiltCard intensity={6} className="w-full">
        <Card className="glass relative flex h-[320px] items-center justify-center overflow-hidden border-border/50 p-8 shadow-[var(--shadow-glass)] sm:h-[380px]">
          <div className="text-center">
            <Briefcase className="mx-auto mb-3 h-8 w-8 text-primary" strokeWidth={1.5} />
            <p className="text-subtitle">We&apos;re always open to great talent.</p>
            <p className="text-caption mt-2">Send a general application below.</p>
          </div>
        </Card>
      </TiltCard>
    )
  }

  const [featured, second, third] = openRoles

  return (
    <TiltCard intensity={8} className="w-full">
      <Card className="glass relative overflow-hidden border-border/50 p-4 shadow-[var(--shadow-glass)]">
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-primary/8 via-transparent to-[rgba(249,107,238,0.06)]" />

        <motion.div
          className="pointer-events-none absolute inset-0 rounded-md"
          style={{
            background:
              "linear-gradient(90deg, transparent, var(--primary), transparent)",
            opacity: 0.16,
          }}
          animate={{ rotate: 360 }}
          transition={{
            duration: 14,
            repeat: Number.POSITIVE_INFINITY,
            ease: "linear",
          }}
          aria-hidden
        />

        <div className="relative z-10">
          <div className="mb-4 flex items-center justify-between px-1">
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 animate-pulse rounded-full bg-primary" />
              <span className="text-caption text-muted-foreground">Open roles</span>
            </div>
            <span className="text-caption flex items-center gap-1 text-primary">
              <Briefcase className="h-3 w-3" />
              {openRoles.length} hiring
            </span>
          </div>

          {openRoles.length === 1 ? (
            <RolePreviewCard role={featured} large className="h-[320px] sm:h-[380px]" />
          ) : openRoles.length === 2 ? (
            <div className="grid h-[320px] grid-cols-2 gap-3 sm:h-[380px]">
              <RolePreviewCard role={featured} large className="h-full" />
              <RolePreviewCard role={second} floatDelay={0.5} className="h-full" />
            </div>
          ) : (
            <div className="grid h-[320px] grid-cols-2 grid-rows-2 gap-3 sm:h-[380px]">
              <RolePreviewCard
                role={featured}
                large
                floatDelay={0}
                className="col-span-1 row-span-2"
              />
              <RolePreviewCard
                role={second!}
                floatDelay={0.5}
                className="col-span-1 row-span-1"
              />
              <RolePreviewCard
                role={third!}
                floatDelay={1}
                className="col-span-1 row-span-1"
              />
            </div>
          )}

          <motion.div
            className="glass-dark absolute -bottom-3 -right-2 rounded-lg border border-white/10 px-3 py-2 shadow-lg"
            animate={{ y: [0, -6, 0] }}
            transition={{
              duration: 3.5,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
            }}
          >
            <p className="text-[10px] uppercase tracking-wider text-white/50">Remote-first</p>
            <p className="tnum text-lg font-light text-white">Global team</p>
          </motion.div>
        </div>
      </Card>
    </TiltCard>
  )
}

"use client"

import { useCallback, useEffect, useState } from "react"
import CareersOpenRoles from "@/components/careers/careers-open-roles"
import CareersApplicationForm from "@/components/careers/careers-application-form"
import { fetchOpenCareers, type CareerRow } from "@/lib/careers"

const POLL_MS = 6000

type Props = {
  initialCareers: CareerRow[]
  initialListError: string | null
  fallbackCareerId: string | null
}

/** Keeps the careers grid + apply form in sync with Supabase when status toggles open/closed (anon Realtime often misses closed rows due to RLS). */
export default function CareersOpeningsLive({
  initialCareers,
  initialListError,
  fallbackCareerId,
}: Props) {
  const [careers, setCareers] = useState<CareerRow[]>(initialCareers)
  const [listError, setListError] = useState<string | null>(initialListError)

  const sync = useCallback(async () => {
    const { careers: next, error } = await fetchOpenCareers()
    setCareers(next)
    setListError(error)
  }, [])

  useEffect(() => {
    const interval = setInterval(() => {
      void sync()
    }, POLL_MS)

    const onVisible = () => {
      if (document.visibilityState === "visible") void sync()
    }
    document.addEventListener("visibilitychange", onVisible)

    return () => {
      clearInterval(interval)
      document.removeEventListener("visibilitychange", onVisible)
    }
  }, [sync])

  const formKey = careers
    .map((c) => `${c.id}:${c.status}`)
    .sort()
    .join("|")

  return (
    <>
      <CareersOpenRoles careers={careers} />

      <section className="max-w-7xl mx-auto px-6 lg:px-8 py-16 md:py-20 bg-background border-t border-grey-200">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 lg:gap-16 items-start">
          <div className="lg:col-span-2 space-y-6">
            <h2 className="font-heading text-2xl md:text-3xl font-semibold text-foreground leading-tight">
              How we hire
            </h2>
            <ul className="space-y-4 text-body text-grey-400">
              <li className="flex gap-3">
                <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-ignite-orange" aria-hidden />
                <span>
                  <strong className="text-foreground">Small teams, high ownership.</strong> You will touch production
                  systems and client outcomes early.
                </span>
              </li>
              <li className="flex gap-3">
                <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-ignite-orange" aria-hidden />
                <span>
                  <strong className="text-foreground">Async-first interviews.</strong> We respect your time and share
                  clear expectations for each step.
                </span>
              </li>
              <li className="flex gap-3">
                <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-ignite-orange" aria-hidden />
                <span>
                  <strong className="text-foreground">Inclusive by design.</strong> We welcome applicants across regions
                  aligned with how we work remotely.
                </span>
              </li>
            </ul>
          </div>
          <div className="lg:col-span-3">
            <CareersApplicationForm
              key={formKey}
              careers={careers}
              listError={listError}
              fallbackCareerId={fallbackCareerId}
            />
          </div>
        </div>
      </section>
    </>
  )
}

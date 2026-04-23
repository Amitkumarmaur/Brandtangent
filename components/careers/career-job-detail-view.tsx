import Link from "next/link"
import { filterOpenCareers, type CareerRow } from "@/lib/careers"
import CareersApplicationForm from "@/components/careers/careers-application-form"
import CareerDescriptionHtml from "@/components/careers/career-description-html"
import type { LucideIcon } from "lucide-react"
import { ArrowLeft, Briefcase, Clock, MapPin, Users } from "lucide-react"

type Props = {
  career: CareerRow
  allCareers: CareerRow[]
  listError: string | null
  fallbackCareerId: string | null
  fetchError: string | null
}

function FactPill({ icon: Icon, label, value }: { icon: LucideIcon; label: string; value: string }) {
  return (
    <div className="flex items-start gap-3 rounded-xl border border-white/10 bg-white/5 px-4 py-3">
      <Icon className="mt-0.5 h-4 w-4 shrink-0 text-ignite-orange" aria-hidden />
      <div>
        <p className="text-caption font-medium uppercase tracking-wider text-white/50">{label}</p>
        <p className="text-sm font-semibold text-white">{value}</p>
      </div>
    </div>
  )
}

export default function CareerJobDetailView({
  career,
  allCareers,
  listError,
  fallbackCareerId,
  fetchError,
}: Props) {
  const openCareers = filterOpenCareers(allCareers)
  const otherRoles = openCareers.filter((c) => c.id !== career.id)

  return (
    <>
      {/* Hero — dark */}
      <section className="relative w-full overflow-hidden border-t border-grey-200 bg-foreground pt-24 pb-16 md:pt-32 md:pb-20">
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.04]"
          aria-hidden
          style={{
            backgroundImage:
              "linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />
        <div
          className="pointer-events-none absolute -right-32 top-1/2 h-[min(80vw,520px)] w-[min(80vw,520px)] -translate-y-1/2 rounded-full bg-ignite-orange/15 blur-3xl"
          aria-hidden
        />

        <div className="relative z-10 mx-auto w-full max-w-7xl px-6 lg:px-8">
          <Link
            href="/careers"
            className="group mb-10 inline-flex items-center gap-2 text-sm font-medium text-white/60 transition-colors hover:text-ignite-orange"
          >
            <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" aria-hidden />
            All careers
          </Link>

          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl">
              <div className="mb-4 flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-ignite-orange" />
                <span className="font-heading text-sm font-medium uppercase tracking-wider text-ignite-orange">
                  Open role
                </span>
              </div>
              <h1 className="heading-h1 text-balance text-white tracking-tight">{career.job_title}</h1>
              <p className="mt-6 max-w-2xl text-subtitle text-white/65">
                {career.short_description?.trim()
                  ? career.short_description
                  : "Join a team that ships AI-first marketing systems for B2B—small teams, high ownership, and outcomes measured in pipeline and retention, not vanity metrics."}
              </p>
            </div>
            <a
              href="#apply"
              className="inline-flex shrink-0 items-center justify-center rounded-full bg-ignite-orange px-8 py-4 text-base font-semibold text-white shadow-[0_8px_32px_rgba(255,87,34,0.35)] transition hover:bg-ignite-orange/90 lg:mb-2"
            >
              Apply for this role
            </a>
          </div>

          <div className="mt-10 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {career.location ? <FactPill icon={MapPin} label="Location" value={career.location} /> : null}
            {career.type ? <FactPill icon={Clock} label="Employment" value={career.type} /> : null}
            {career.team ? <FactPill icon={Users} label="Team" value={career.team} /> : null}
            <FactPill icon={Briefcase} label="Company" value="DigiiMark" />
          </div>

          {fetchError ? <p className="mt-6 text-sm text-red-400">{fetchError}</p> : null}
        </div>
      </section>

      {/* Main + sidebar */}
      <section className="relative w-full border-t border-grey-200 bg-background py-16 md:py-20">
        <div className="mx-auto w-full max-w-7xl px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-16">
            <div className="lg:col-span-8">
              <div className="mb-6 flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-ignite-orange" />
                <span className="font-heading text-sm font-medium uppercase tracking-wider text-ignite-orange">
                  Role overview
                </span>
              </div>
              <h2 className="font-heading text-3xl font-semibold tracking-tight text-foreground md:text-4xl">
                What you will do here
              </h2>
              <p className="mt-4 max-w-2xl text-body text-grey-400">
                Everything below comes straight from our hiring team—no generic templates. Read it, then tell us what
                you have shipped that maps to it.
              </p>

              <div className="mt-10 rounded-2xl border border-grey-200 bg-grey-50/80 p-8 md:p-10">
                {career.description ? (
                  <CareerDescriptionHtml html={career.description} />
                ) : (
                  <p className="text-body text-grey-400">
                    Full description is being finalized. You can still apply—mention this role in your cover note.
                  </p>
                )}
              </div>
            </div>

            <aside id="apply" className="scroll-mt-24 lg:col-span-4">
              <div className="space-y-4 lg:sticky lg:top-28">
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-ignite-orange" />
                  <span className="font-heading text-sm font-medium uppercase tracking-wider text-ignite-orange">
                    Apply for this role
                  </span>
                </div>
                <h3 className="font-heading text-2xl font-semibold tracking-tight text-foreground">
                  Send us your application
                </h3>
                <p className="text-sm text-grey-400">
                  Resume PDF or Word (5 MB max). A human reviews every application.
                </p>
                <CareersApplicationForm
                  careers={openCareers}
                  listError={listError}
                  fallbackCareerId={fallbackCareerId}
                  preferredCareerId={career.id}
                  compact
                />
              </div>
            </aside>
          </div>
        </div>
      </section>

      {/* Why join — light band */}
      <section className="relative w-full border-t border-grey-200 bg-grey-100 py-16 md:py-20">
        <div className="mx-auto w-full max-w-7xl px-6 lg:px-8">
          <div className="mb-10 flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-ignite-orange" />
            <span className="font-heading text-sm font-medium uppercase tracking-wider text-ignite-orange">
              Why DigiiMark
            </span>
          </div>
          <h2 className="font-heading text-3xl font-semibold tracking-tight text-foreground md:text-4xl lg:text-5xl">
            Built for people who like shipping
          </h2>
          <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-3">
            {[
              {
                title: "Systems, not campaigns",
                body: "We engineer durable pipelines—sites, automation, data—so clients compound results instead of restarting every quarter.",
              },
              {
                title: "AI where it earns trust",
                body: "We deploy models and agents with evaluation, guardrails, and human-in-the-loop review—not hype slides.",
              },
              {
                title: "Craft + velocity",
                body: "Premium UX and strict TypeScript can coexist. We optimize for clarity, observability, and calm deploys.",
              },
            ].map((card) => (
              <div
                key={card.title}
                className="rounded-2xl border border-grey-200 bg-white p-8 shadow-sm transition hover:border-grey-300"
              >
                <h3 className="font-heading text-xl font-semibold text-foreground">{card.title}</h3>
                <p className="mt-3 text-body text-grey-400">{card.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* More roles */}
      {otherRoles.length > 0 ? (
        <section className="relative w-full border-t border-grey-200 bg-background py-16 md:py-20">
          <div className="mx-auto w-full max-w-7xl px-6 lg:px-8">
            <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <div className="mb-4 flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-ignite-orange" />
                  <span className="font-heading text-sm font-medium uppercase tracking-wider text-ignite-orange">
                    More openings
                  </span>
                </div>
                <h2 className="font-heading text-3xl font-semibold tracking-tight text-foreground md:text-4xl">
                  Explore other roles
                </h2>
              </div>
              <Link
                href="/careers"
                className="text-sm font-semibold text-ignite-orange hover:underline"
              >
                View all careers →
              </Link>
            </div>
            <ul className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              {otherRoles.map((c) => (
                <li key={c.id}>
                  <Link
                    href={`/careers/${c.slug}`}
                    className="group flex h-full flex-col rounded-2xl border border-grey-200 bg-grey-50/50 p-6 transition hover:border-ignite-orange/40 hover:bg-white hover:shadow-md"
                  >
                    <span className="font-heading text-lg font-semibold text-foreground transition group-hover:text-ignite-orange">
                      {c.job_title}
                    </span>
                    <span className="mt-2 text-sm text-grey-400">
                      {[c.location, c.type].filter(Boolean).join(" · ")}
                    </span>
                    <span className="mt-4 text-sm font-semibold text-ignite-orange">View role →</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>
      ) : null}

    </>
  )
}

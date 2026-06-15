import Link from "next/link"
import { filterOpenCareers, type CareerRow } from "@/lib/careers"
import CareersApplicationForm from "@/components/careers/careers-application-form"
import CareerDescriptionHtml from "@/components/careers/career-description-html"
import type { LucideIcon } from "lucide-react"
import { ArrowLeft, ArrowRight, Briefcase, Clock, MapPin, Users } from "lucide-react"

type Props = {
  career: CareerRow
  allCareers: CareerRow[]
  listError: string | null
  fallbackCareerId: string | null
  fetchError: string | null
}

function FactPill({ icon: Icon, label, value }: { icon: LucideIcon; label: string; value: string }) {
  return (
    <div className="flex items-start gap-3 rounded-sm border border-[rgba(252,251,248,0.12)] bg-[rgba(252,251,248,0.06)] px-4 py-3">
      <Icon className="mt-0.5 h-4 w-4 shrink-0 text-[rgba(252,251,248,0.5)]" aria-hidden />
      <div>
        <p className="text-[10px] font-semibold uppercase tracking-wider text-[rgba(252,251,248,0.4)]">{label}</p>
        <p className="text-sm font-semibold text-primary-foreground">{value}</p>
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
      {/* Hero — dark charcoal for contrast */}
      <section className="relative w-full overflow-hidden border-t border-border bg-primary pt-24 pb-16 md:pt-32 md:pb-20">
        <div className="relative z-10 mx-auto w-full max-w-7xl px-6 lg:px-8">
          <Link
            href="/careers"
            className="group mb-10 inline-flex items-center gap-2 text-sm font-medium text-[rgba(252,251,248,0.6)] transition-colors hover:text-primary-foreground"
          >
            <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" aria-hidden />
            All careers
          </Link>

          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl">
              <div className="mb-4 flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-[rgba(252,251,248,0.4)]" />
                <span className="text-sm font-semibold uppercase tracking-wider text-[rgba(252,251,248,0.5)]">
                  Open role
                </span>
              </div>
              <h1 className="display-xl text-balance text-primary-foreground tracking-tight">{career.job_title}</h1>
              <p className="mt-6 max-w-2xl text-lg text-[rgba(252,251,248,0.65)] leading-relaxed">
                {career.short_description?.trim()
                  ? career.short_description
                  : "Join a team that crafts brand strategy and creative for businesses that mean it — small teams, high ownership, and outcomes measured in recognition, conversion, and growth."}
              </p>
            </div>
            <a
              href="#apply"
              className="inline-flex shrink-0 items-center justify-center rounded-sm bg-background text-foreground px-8 h-12 text-sm font-semibold shadow-[rgba(255,255,255,0.2)_0px_0.5px_0px_0px_inset,rgba(0,0,0,0.2)_0px_0px_0px_0.5px_inset,rgba(0,0,0,0.05)_0px_1px_2px_0px] hover:opacity-90 transition-opacity lg:mb-2"
            >
              Apply for this role
            </a>
          </div>

          <div className="mt-10 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {career.location ? <FactPill icon={MapPin} label="Location" value={career.location} /> : null}
            {career.type ? <FactPill icon={Clock} label="Employment" value={career.type} /> : null}
            {career.team ? <FactPill icon={Users} label="Team" value={career.team} /> : null}
            <FactPill icon={Briefcase} label="Company" value="Brandtangent" />
          </div>

          {fetchError ? <p className="mt-6 text-sm text-red-400">{fetchError}</p> : null}
        </div>
      </section>

      {/* Main + sidebar */}
      <section className="relative w-full border-t border-border bg-white py-16 md:py-20">
        <div className="mx-auto w-full max-w-7xl px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-16">
            <div className="lg:col-span-8">
              <div className="mb-6 flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-[rgba(28,28,28,0.4)]" />
                <span className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                  Role overview
                </span>
              </div>
              <h2 className="display-lg text-foreground">
                What you will do here
              </h2>
              <p className="mt-4 max-w-2xl text-sm text-muted-foreground leading-relaxed">
                Everything below comes straight from our hiring team — no generic templates. Read it, then tell us what
                you have built that maps to it.
              </p>

              <div className="mt-10 rounded-md border border-border bg-[rgba(28,28,28,0.02)] p-8 md:p-10">
                {career.description ? (
                  <CareerDescriptionHtml html={career.description} />
                ) : (
                  <p className="text-sm text-muted-foreground">
                    Full description is being finalized. You can still apply — mention this role in your cover note.
                  </p>
                )}
              </div>
            </div>

            <aside id="apply" className="scroll-mt-24 lg:col-span-4">
              <div className="space-y-4 lg:sticky lg:top-28">
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-[rgba(28,28,28,0.4)]" />
                  <span className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                    Apply for this role
                  </span>
                </div>
                <h3 className="text-2xl font-semibold tracking-tight text-foreground">
                  Send us your application
                </h3>
                <p className="text-sm text-muted-foreground">
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

      {/* Why Brandtangent */}
      <section className="relative w-full border-t border-border bg-white py-16 md:py-20">
        <div className="mx-auto w-full max-w-7xl px-6 lg:px-8">
          <div className="mb-10 flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-[rgba(28,28,28,0.4)]" />
            <span className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
              Why Brandtangent
            </span>
          </div>
          <h2 className="display-xl text-foreground">
            Built for people who love craft
          </h2>
          <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-3">
            {[
              {
                title: "Brand, not templates",
                body: "We build identity systems and campaigns that define category leaders — not commodity deliverables.",
              },
              {
                title: "Strategy-led creativity",
                body: "Every brief starts with the business question. Creative work earns its place by moving the metrics that matter.",
              },
              {
                title: "Craft + velocity",
                body: "Premium design thinking and clear processes coexist here. We optimise for quality, clarity, and calm delivery.",
              },
            ].map((card) => (
              <div
                key={card.title}
                className="rounded-md border border-border bg-white p-8 transition hover:border-[rgba(28,28,28,0.3)]"
              >
                <h3 className="text-xl font-semibold text-foreground">{card.title}</h3>
                <p className="mt-3 text-sm text-muted-foreground leading-relaxed">{card.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* More roles */}
      {otherRoles.length > 0 ? (
        <section className="relative w-full border-t border-border bg-white py-16 md:py-20">
          <div className="mx-auto w-full max-w-7xl px-6 lg:px-8">
            <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <div className="mb-4 flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-[rgba(28,28,28,0.4)]" />
                  <span className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                    More openings
                  </span>
                </div>
                <h2 className="display-xl text-foreground">
                  Explore other roles
                </h2>
              </div>
              <Link
                href="/careers"
                className="inline-flex items-center gap-2 text-sm font-semibold text-foreground hover:opacity-70 transition-opacity"
              >
                View all careers
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            <ul className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              {otherRoles.map((c) => (
                <li key={c.id}>
                  <Link
                    href={`/careers/${c.slug}`}
                    className="group flex h-full flex-col rounded-md border border-border bg-white p-6 transition hover:border-[rgba(28,28,28,0.3)] hover:shadow-sm"
                  >
                    <span className="text-lg font-semibold text-foreground">
                      {c.job_title}
                    </span>
                    <span className="mt-2 text-sm text-muted-foreground">
                      {[c.location, c.type].filter(Boolean).join(" · ")}
                    </span>
                    <span className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-foreground">
                      View role <ArrowRight className="w-3.5 h-3.5" />
                    </span>
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

import { supabase } from "@/lib/supabase"
import { careerSlugFromTitle } from "@/lib/career-slug"

/**
 * Careers listing + job detail pages read from Supabase `public.careers`
 * (anon client, subject to RLS). Expected columns:
 * `id`, `job_title`, `location`, `type`, `status` (enum `open` | `closed`), `created_at`, `team`,
 * `"Job description"` (HTML), `"Short description"` (optional text).
 * Optional: `slug` (unique URL segment) — see `scripts/careers-add-slug-column.sql`.
 */

/** Postgres enum `public.career_opening_status`: whether the listing is open for applications. */
export type CareerOpeningStatus = "open" | "closed"

/** Columns returned by PostgREST (legacy DB uses spaced column names). */
type CareersRawRow = {
  id: string
  job_title: string
  location: string | null
  type: string | null
  status: CareerOpeningStatus
  created_at?: string
  team?: string | null
  slug?: string | null
  /** Present after backfilling from `Job description`. */
  description?: string | null
  "Job description"?: string | null
  "Short description"?: string | null
}

export type CareerRow = {
  id: string
  job_title: string
  location: string | null
  type: string | null
  status: CareerOpeningStatus
  /** HTML job description from Supabase (`description` or legacy `Job description`). */
  description: string | null
  team: string | null
  short_description: string | null
  /** From `careers.slug` when set; otherwise derived from `job_title` (must match `/careers/[slug]`). */
  slug: string
}

const CAREERS_COLUMNS_CORE =
  'id, job_title, location, type, status, created_at, team, "Job description", "Short description"'

function isMissingDbColumnMessage(message: string, column: string): boolean {
  const m = message.toLowerCase()
  const col = column.toLowerCase()
  return m.includes(col) && (m.includes("does not exist") || m.includes("schema cache") || m.includes("column"))
}

async function queryOpenCareersFromSupabase() {
  const withSlug = `${CAREERS_COLUMNS_CORE}, slug`
  let res = await supabase
    .from("careers")
    .select(withSlug)
    .eq("status", "open")
    .order("created_at", { ascending: true })

  if (res.error && isMissingDbColumnMessage(res.error.message, "slug")) {
    res = await supabase
      .from("careers")
      .select(CAREERS_COLUMNS_CORE)
      .eq("status", "open")
      .order("created_at", { ascending: true })
  }

  return res
}

function normalizeCareerRow(raw: CareersRawRow): CareerRow {
  const jd = raw.description ?? raw["Job description"] ?? null
  const short = raw["Short description"] ?? null
  const dbSlug = typeof raw.slug === "string" ? raw.slug.trim().toLowerCase() : ""
  return {
    id: raw.id,
    job_title: raw.job_title,
    location: raw.location,
    type: raw.type,
    status: raw.status,
    description: jd,
    team: raw.team ?? null,
    short_description: short,
    slug: dbSlug.length > 0 ? dbSlug : careerSlugFromTitle(raw.job_title),
  }
}

/** Only `status === "open"` roles — use anywhere we render or select listings (grid, sidebar, apply form). */
export function filterOpenCareers(careers: CareerRow[]): CareerRow[] {
  return careers.filter((c) => c.status === "open")
}

/** Public read of open roles (respects RLS on `careers`). */
export async function fetchOpenCareers(): Promise<{
  careers: CareerRow[]
  error: string | null
}> {
  const { data, error } = await queryOpenCareersFromSupabase()

  if (error) {
    return { careers: [], error: error.message }
  }

  const rows = (data as CareersRawRow[] | null) ?? []
  return { careers: filterOpenCareers(rows.map(normalizeCareerRow)), error: null }
}

/** One Supabase round-trip for `/careers/[slug]` (metadata + page). */
export async function fetchCareerPageData(slug: string): Promise<{
  career: CareerRow | null
  allCareers: CareerRow[]
  error: string | null
}> {
  const { careers, error } = await fetchOpenCareers()
  if (error) {
    return { career: null, allCareers: [], error }
  }
  const career = careers.find((c) => c.slug === slug) ?? null
  return { career, allCareers: careers, error: null }
}

export async function fetchOpenCareerSlugs(): Promise<string[]> {
  const { careers, error } = await fetchOpenCareers()
  if (error) return []
  return careers.map((c) => c.slug)
}

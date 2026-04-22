import { supabase } from "@/lib/supabase"

export type CareerRow = {
  id: string
  job_title: string
  location: string | null
  type: string | null
  status: string
  /** HTML from Supabase */
  description?: string | null
}

/** URL slug for `/careers/[slug]` — derived from `job_title` (stable while the title is unchanged). */
export function careerSlugFromTitle(title: string): string {
  return title
    .toLowerCase()
    .normalize("NFKD")
    .replace(/\p{M}/gu, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
}

export function careerDescriptionPlainExcerpt(html: string | null | undefined, max = 180): string {
  if (!html) return ""
  const text = html.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim()
  if (text.length <= max) return text
  return `${text.slice(0, max).trim()}…`
}

/** Public read of open roles (respects RLS on `careers`). Includes `description` for listings and job pages. */
export async function fetchOpenCareers(): Promise<{
  careers: CareerRow[]
  error: string | null
}> {
  const { data, error } = await supabase
    .from("careers")
    .select("id, job_title, location, type, status, description")
    .eq("status", "open")
    .order("created_at", { ascending: true })

  if (error) {
    return { careers: [], error: error.message }
  }

  return { careers: (data as CareerRow[]) ?? [], error: null }
}

export async function fetchOpenCareerBySlug(slug: string): Promise<{
  career: CareerRow | null
  error: string | null
}> {
  const { careers, error } = await fetchOpenCareers()
  if (error) {
    return { career: null, error }
  }
  const career = careers.find((c) => careerSlugFromTitle(c.job_title) === slug) ?? null
  return { career, error: null }
}

import { supabase } from "@/lib/supabase"

/**
 * Controlled vocabulary of industries, stored in public.industries.
 * Powers the Industries filter on the /case-studies index and the Industry
 * badge on each case study detail page.
 */
export interface Industry {
  id: string
  name: string
  slug: string
  display_order: number
}

/** Join shape when selecting `industries ( … )` through the case_studies FK. */
export type IndustryJoin = Industry | null

export function sortIndustries(list: Industry[]): Industry[] {
  return [...list].sort((a, b) => a.display_order - b.display_order)
}

export async function fetchIndustries(): Promise<Industry[]> {
  const { data, error } = await supabase
    .from("industries")
    .select("id, name, slug, display_order")
    .order("display_order", { ascending: true })

  if (error || !data?.length) return []
  return data as Industry[]
}

/**
 * Resolve an industry slug → id. Returns null when the slug is not found.
 * Cached per call; the caller is expected to memoize across renders if needed.
 */
export async function fetchIndustryIdBySlug(slug: string): Promise<string | null> {
  const { data, error } = await supabase
    .from("industries")
    .select("id")
    .eq("slug", slug)
    .maybeSingle()

  if (error || !data?.id) return null
  return data.id
}

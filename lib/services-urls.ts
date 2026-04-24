/**
 * URL helpers for the nested services routes.
 *
 * Route structure:
 *   /services                                    → Services index (all categories)
 *   /services/[category]                         → Individual category landing page
 *   /services/[category]/[service]               → Service detail page (nested under its category)
 */

export function categoryUrl(categorySlug: string | null | undefined): string {
  const slug = (categorySlug ?? "").trim()
  if (!slug) return "/services"
  return `/services/${slug}`
}

export function serviceUrl(
  categorySlug: string | null | undefined,
  serviceSlug: string | null | undefined,
): string {
  const cat = (categorySlug ?? "").trim()
  const svc = (serviceSlug ?? "").trim()
  if (!svc) return "/services"
  if (!cat) return `/services/${svc}`
  return `/services/${cat}/${svc}`
}

/** Decode and trim a dynamic route segment (e.g. `%26` → safe slug for Supabase `eq`). */
export function normalizeRouteSlug(param: string | undefined | null): string {
  if (param == null) return ""
  const s = String(param).trim()
  if (!s) return ""
  try {
    return decodeURIComponent(s).trim()
  } catch {
    return s
  }
}

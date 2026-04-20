/**
 * Fragment IDs for `/services#…` links (header nav + services directory sections).
 */
export function servicesCategorySectionId(slug: string | null, heading: string): string {
  if (slug && slug.trim()) return `services-category-${slug.trim()}`
  if (heading === "More capabilities") return "services-category-more"
  return "services-all"
}

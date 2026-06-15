import { supabase } from "@/lib/supabase"
import {
  getFallbackCategory,
  getFallbackCategoryForService,
  getFallbackService,
  getFallbackServicesForCategory,
  resolveServiceSlug,
  type FallbackCategory,
  type FallbackService,
} from "@/lib/service-catalog-fallback"

function isFetchFailure(error: { message?: string } | null): boolean {
  const msg = (error?.message ?? "").toLowerCase()
  return msg.includes("fetch failed") || msg.includes("network") || msg.includes("econnrefused")
}

export async function fetchServiceCategoryBySlug(slug: string): Promise<{
  category: FallbackCategory | null
  fromFallback: boolean
}> {
  const normalized = slug.trim().toLowerCase()

  const { data, error } = await supabase
    .from("service_categories")
    .select(
      "id, name, slug, icon, display_order, hero_display_title, hero_description, hero_animated_words, hero_stat_value, hero_stat_label, featured_projects, expertise_badge, expertise_title, expertise_subtitle, process_heading, process_description, process_steps, tech_stack_ids, target_industries, seo_title, meta_description, created_at",
    )
    .eq("slug", normalized)
    .maybeSingle<FallbackCategory>()

  if (data) return { category: data, fromFallback: false }

  const fallback = getFallbackCategory(normalized)
  if (fallback) {
    return { category: fallback, fromFallback: true }
  }

  return { category: null, fromFallback: false }
}

export async function fetchServicesForCategory(
  categoryId: string,
  fromFallback: boolean,
): Promise<Pick<FallbackService, "id" | "slug" | "name" | "hero_h1" | "hero_description" | "hero_image" | "short_description" | "description" | "display_order">[]> {
  if (fromFallback) {
    return getFallbackServicesForCategory(categoryId)
  }

  const { data, error } = await supabase
    .from("services")
    .select(
      "id, slug, name, hero_h1, hero_description, hero_image, short_description, description, display_order",
    )
    .eq("category_id", categoryId)
    .order("display_order", { ascending: true, nullsFirst: false })

  if (data && data.length > 0) return data

  if (isFetchFailure(error) || !data?.length) {
    return getFallbackServicesForCategory(categoryId)
  }

  return []
}

export async function fetchServiceBySlug(slug: string): Promise<{
  service: FallbackService | null
  category: FallbackCategory | null
  fromFallback: boolean
}> {
  const resolved = resolveServiceSlug(slug)

  const { data, error } = await supabase
    .from("services")
    .select(
      "id, category_id, name, slug, hero_h1, hero_description, hero_image, seo_title, meta_description, service_details, methodology, what_we_provide, platform_ids, short_description, description, display_order",
    )
    .eq("slug", resolved)
    .maybeSingle<FallbackService>()

  if (data) {
    let category: FallbackCategory | null = null
    if (data.category_id) {
      const { data: cat } = await supabase
        .from("service_categories")
        .select(
          "id, name, slug, icon, display_order, hero_display_title, hero_description, hero_animated_words, hero_stat_value, hero_stat_label, featured_projects, expertise_badge, expertise_title, expertise_subtitle, process_heading, process_description, process_steps, tech_stack_ids, target_industries, seo_title, meta_description, created_at",
        )
        .eq("id", data.category_id)
        .maybeSingle<FallbackCategory>()
      category = cat
    }
    return { service: data, category, fromFallback: false }
  }

  const fallbackService = getFallbackService(resolved)
  if (fallbackService) {
    const fallbackCategory = getFallbackCategoryForService(fallbackService)
    return { service: fallbackService, category: fallbackCategory, fromFallback: true }
  }

  return { service: null, category: null, fromFallback: false }
}

/** Resolve flat `/services/[slug]` links that point at a service rather than a category. */
export async function fetchServiceAsCategoryRedirect(slug: string): Promise<{
  categorySlug: string
  serviceSlug: string
} | null> {
  const resolved = resolveServiceSlug(slug)

  const { data: svc, error } = await supabase
    .from("services")
    .select("slug, category_id")
    .eq("slug", resolved)
    .maybeSingle<{ slug: string; category_id: string | null }>()

  if (svc?.slug && svc.category_id) {
    const { data: cat } = await supabase
      .from("service_categories")
      .select("slug")
      .eq("id", svc.category_id)
      .maybeSingle<{ slug: string | null }>()
    const catSlug = (cat?.slug ?? "").trim()
    if (catSlug) return { categorySlug: catSlug, serviceSlug: svc.slug }
  }

  const fallback = getFallbackService(resolved)
  const cat = fallback ? getFallbackCategoryForService(fallback) : null
  if (fallback && cat?.slug) {
    return { categorySlug: cat.slug, serviceSlug: fallback.slug }
  }

  return null
}
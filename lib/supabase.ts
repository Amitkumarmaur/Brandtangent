import { createClient } from "@supabase/supabase-js"

/**
 * Browser + Server Component client (no cookies).
 * Accepts the same env names as `utils/supabase/server.ts` / middleware so `.env.local` is not tied to one key name.
 */
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? ""
const supabaseAnonKey =
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  ""

// Only create client if both URL and key are available (skip during build if env vars not set)
export const supabase = (supabaseUrl && supabaseAnonKey)
  ? createClient(supabaseUrl, supabaseAnonKey)
  : (null as any)

// ─── Type helpers ───────────────────────────────────────────────────────────

export interface Platform {
  id: string
  platform_name: string
  url: string
  logo: string | null
  display_style: {
    color?: string
    weight?: 'bold' | 'black'
    tracking?: string
    prefix_icon?: string
    prefix_style?: 'box' | 'circle'
  } | null
  display_order: number
}

export interface ContentCategory {
  id: string
  name: string
  slug: string
  display_order: number
}

export interface BlogPost {
  id: string
  title: string
  slug: string
  /** Primary label for compact UI (first linked category or legacy text). */
  category: string
  excerpt: string
  content: string
  image_url: string
  published_at: string
  author_name?: string
  author_image?: string
  read_time?: string
  /** Populated when `blog_content_categories` rows exist in Supabase. */
  content_categories?: ContentCategory[]
}

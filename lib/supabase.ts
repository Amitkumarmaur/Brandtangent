import { createClient } from "@supabase/supabase-js"

/**
 * Browser + Server Component client (no cookies).
 * Returns a stub during build/SSR if env vars aren't available.
 */
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey =
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

let _client: ReturnType<typeof createClient> | null = null

// Stub query builder for build time when credentials aren't available
const stubQuery = {
  select: () => ({ data: [], error: null }),
  insert: () => ({ data: [], error: null }),
  update: () => ({ data: [], error: null }),
  delete: () => ({ data: [], error: null }),
  upsert: () => ({ data: [], error: null }),
  rpc: () => ({ data: null, error: null }),
}

export const supabase = {
  from(table: string) {
    if (!_client) {
      if (!supabaseUrl || !supabaseAnonKey) {
        // Return stub during build/SSR when env vars aren't available
        if (typeof window === "undefined") {
          console.warn(`[build] Supabase unavailable for table "${table}" - using stub`)
          return stubQuery as any
        }
        throw new Error(
          "Supabase not configured. Ensure NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY are set."
        )
      }
      _client = createClient(supabaseUrl, supabaseAnonKey)
    }
    return _client.from(table)
  },
  auth: {
    onAuthStateChange: () => ({
      data: { subscription: null },
      unsubscribe: () => {},
    }),
  },
} as ReturnType<typeof createClient>

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

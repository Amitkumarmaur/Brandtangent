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

// Stub query builder that supports method chaining
const createStubQuery = () => {
  const stub = {
    select: function() { return this },
    eq: function() { return this },
    neq: function() { return this },
    in: function() { return this },
    gt: function() { return this },
    gte: function() { return this },
    lt: function() { return this },
    lte: function() { return this },
    like: function() { return this },
    ilike: function() { return this },
    is: function() { return this },
    contains: function() { return this },
    order: function() { return this },
    limit: function() { return this },
    offset: function() { return this },
    range: function() { return this },
    insert: function() { return this },
    update: function() { return this },
    delete: function() { return this },
    upsert: function() { return this },
    rpc: function() { return this },
    maybeSingle: function() { return this },
    single: function() { return this },
    then: function(resolve: any) { return resolve({ data: [], error: null }) },
    catch: function() { return Promise.resolve({ data: [], error: null }) },
  }
  return stub as any
}

export const supabase = {
  from(table: string) {
    if (!_client) {
      if (!supabaseUrl || !supabaseAnonKey) {
        // Return stub during build/SSR when env vars aren't available
        if (typeof window === "undefined") {
          console.warn(`[build] Supabase unavailable for table "${table}" - using stub`)
          return createStubQuery()
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

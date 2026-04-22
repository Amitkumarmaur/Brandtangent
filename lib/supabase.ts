import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

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

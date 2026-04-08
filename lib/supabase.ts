import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

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

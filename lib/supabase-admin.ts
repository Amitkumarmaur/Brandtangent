import { createClient, type SupabaseClient } from "@supabase/supabase-js"

/**
 * Service-role client for server-only routes (bypasses RLS). Never import in client components.
 * Set `SUPABASE_SERVICE_ROLE_KEY` in the environment (Vercel / .env.local — not `NEXT_PUBLIC_*`).
 */
export function createSupabaseAdmin(): SupabaseClient | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !key) return null
  return createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  })
}

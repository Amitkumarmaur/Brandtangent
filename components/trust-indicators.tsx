import { createClient } from '@supabase/supabase-js'
import type { Platform } from '@/lib/supabase'
import TrustIndicatorsView from '@/components/trust-indicators-view'

async function getPlatforms(): Promise<Platform[]> {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY!
  )

  const full = await supabase
    .from('platforms')
    .select('id, platform_name, url, logo, display_style, display_order')
    .order('display_order', { ascending: true })

  if (!full.error) return (full.data as Platform[]) ?? []

  const msg = full.error.message ?? ''
  const missingDisplayStyle =
    full.error.code === '42703' ||
    /display_style/.test(msg) ||
    /column .* does not exist/i.test(msg)

  if (!missingDisplayStyle) return []

  const minimal = await supabase
    .from('platforms')
    .select('id, platform_name, url, logo, display_order')
    .order('display_order', { ascending: true })

  if (minimal.error) return []
  return (minimal.data ?? []).map((row) => ({ ...row, display_style: null })) as Platform[]
}

export default async function TrustIndicators() {
  const platforms = await getPlatforms()

  return <TrustIndicatorsView platforms={platforms} />
}

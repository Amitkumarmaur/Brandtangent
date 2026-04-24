import { supabase } from "@/lib/supabase"

export type ClientMarqueeRow = {
  id: string
  client_name: string
  logo: string | null
  website_url: string | null
}

/**
 * Homepage “Our clients” marquee — visible rows from `public.clients`.
 */
export async function fetchClientsForMarquee(): Promise<{
  clients: ClientMarqueeRow[]
  error: string | null
}> {
  const { data, error } = await supabase
    .from("clients")
    .select("id, client_name, logo, website_url")
    .eq("is_visible", true)
    .order("sort_order", { ascending: true, nullsFirst: false })

  if (error) {
    return { clients: [], error: error.message }
  }

  return { clients: (data ?? []) as ClientMarqueeRow[], error: null }
}

export function splitClientsIntoTwoRows(clients: ClientMarqueeRow[]): {
  row1: ClientMarqueeRow[]
  row2: ClientMarqueeRow[]
} {
  if (!clients.length) {
    return { row1: [], row2: [] }
  }
  const half = Math.ceil(clients.length / 2)
  const row1 = clients.slice(0, half)
  let row2 = clients.slice(half)
  if (row2.length === 0) {
    row2 = row1
  }
  return { row1, row2 }
}

const BLOCKED_PROTOCOL = /^(javascript|data|vbscript):/i

/**
 * Returns a string safe for `<a href>` or `null` if the value cannot be turned into a working link.
 * - Trims whitespace and wrapping quotes
 * - Blocks `javascript:`, `data:`, etc.
 * - Allows `http(s)`, `mailto`, `tel`, same-origin paths (`/…`), and protocol-relative `//…`
 * - Prepends `https://` when the host is given without a scheme (e.g. `www.example.com`)
 */
export function resolveClientWebsiteUrl(url: string | null | undefined): string | null {
  let raw = (url ?? "").trim()
  if (!raw) return null

  raw = raw.replace(/^['"]+|['"]+$/g, "").trim()
  raw = raw.replace(/[\s\u00a0]+$/g, "").replace(/[),.;]+$/g, "")
  if (!raw) return null

  if (BLOCKED_PROTOCOL.test(raw)) return null

  if (raw.startsWith("mailto:") || raw.startsWith("tel:")) {
    try {
      const parsed = new URL(raw)
      if (parsed.protocol === "mailto:" || parsed.protocol === "tel:") return parsed.href
    } catch {
      return null
    }
    return null
  }

  // Protocol-relative URL (must run before single-`/` path check).
  if (raw.startsWith("//")) {
    raw = `https:${raw}`
  }

  if (raw.startsWith("/")) {
    try {
      new URL(raw, "https://example.org")
      return raw
    } catch {
      return null
    }
  }

  let candidate = raw
  if (!/^[a-z][a-z0-9+.-]*:/i.test(candidate)) {
    candidate = `https://${candidate}`
  }

  try {
    const parsed = new URL(candidate)
    if (parsed.protocol !== "http:" && parsed.protocol !== "https:") return null
    if (!parsed.hostname) return null
    return parsed.href
  } catch {
    return null
  }
}

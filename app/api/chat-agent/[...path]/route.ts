import { NextResponse, type NextRequest } from "next/server"

export const runtime = "nodejs"

/**
 * Forwards the browser to the Python chat agent so the site can call `/api/chat-agent/v1/...`
 * same-origin (no CORS, no exposed backend URL).
 *
 * Set `CHAT_AGENT_URL` in production on Vercel (e.g. https://chat.yourdomain.com).
 * When unset, the proxy defaults to http://127.0.0.1:8010 for local dev, `next start`,
 * and other non-Vercel hosts so the Python agent on the same machine is reachable.
 */
function getChatAgentBaseUrl(): string {
  const fromEnv = process.env.CHAT_AGENT_URL?.trim()
  if (fromEnv) return fromEnv.replace(/\/$/, "")
  if (process.env.VERCEL) return ""
  return "http://127.0.0.1:8010"
}

function isAllowedPath(pathSegments: string[] | undefined): boolean {
  const p = pathSegments?.filter(Boolean).join("/") ?? ""
  if (!p) return false
  if (p === "health") return true
  return p.startsWith("v1/")
}

export async function GET(req: NextRequest, ctx: { params: Promise<{ path?: string[] }> }) {
  const backend = getChatAgentBaseUrl()
  if (!backend) {
    return NextResponse.json(
      { error: "CHAT_AGENT_URL is not configured for this deployment." },
      { status: 503 }
    )
  }
  const { path } = await ctx.params
  if (!isAllowedPath(path)) {
    return NextResponse.json({ error: "Not found" }, { status: 404 })
  }
  const sub = path!.join("/")
  const target = `${backend}/${sub}${req.nextUrl.search}`
  try {
    const res = await fetch(target, { method: "GET", cache: "no-store" })
    const buf = await res.arrayBuffer()
    return new NextResponse(buf, {
      status: res.status,
      headers: {
        "content-type": res.headers.get("content-type") ?? "application/json",
      },
    })
  } catch {
    return NextResponse.json({ error: "Could not reach chat agent." }, { status: 502 })
  }
}

export async function POST(req: NextRequest, ctx: { params: Promise<{ path?: string[] }> }) {
  const backend = getChatAgentBaseUrl()
  if (!backend) {
    return NextResponse.json(
      { error: "CHAT_AGENT_URL is not configured for this deployment." },
      { status: 503 }
    )
  }
  const { path } = await ctx.params
  if (!isAllowedPath(path)) {
    return NextResponse.json({ error: "Not found" }, { status: 404 })
  }
  const sub = path!.join("/")
  const target = `${backend}/${sub}${req.nextUrl.search}`
  const body = await req.arrayBuffer()
  try {
    const res = await fetch(target, {
      method: "POST",
      headers: {
        "content-type": req.headers.get("content-type") ?? "application/json",
      },
      body: body.byteLength ? body : undefined,
      cache: "no-store",
    })
    const buf = await res.arrayBuffer()
    return new NextResponse(buf, {
      status: res.status,
      headers: {
        "content-type": res.headers.get("content-type") ?? "application/json",
      },
    })
  } catch {
    return NextResponse.json({ error: "Could not reach chat agent." }, { status: 502 })
  }
}

import { NextResponse, type NextRequest } from "next/server"
import { z } from "zod"

export const runtime = "nodejs"

const bodySchema = z.object({
  full_name: z.string().trim().min(2).max(160),
  email: z.string().trim().email().max(254),
  company: z.string().trim().max(200).optional().or(z.literal("")),
  phone: z.string().trim().max(40).optional().or(z.literal("")),
  message: z.string().trim().min(10).max(8000),
})

type ContactWebhookPayload = z.infer<typeof bodySchema> & {
  source: "website_contact_widget"
  page_url: string | null
  user_agent: string | null
  submitted_at: string
}

export async function POST(req: NextRequest) {
  const url = process.env.CONTACT_INQUIRY_WEBHOOK_URL?.trim()
  if (!url) {
    return NextResponse.json(
      {
        error:
          "Contact form is not enabled on this deployment yet. Set CONTACT_INQUIRY_WEBHOOK_URL on the server.",
      },
      { status: 503 }
    )
  }

  let raw: unknown
  try {
    raw = await req.json()
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 })
  }

  const parsed = bodySchema.safeParse(raw)
  if (!parsed.success) {
    return NextResponse.json(
      {
        error: "Please check your name, email, and message (10+ characters).",
      },
      { status: 400 }
    )
  }

  const payload: ContactWebhookPayload = {
    ...parsed.data,
    company: parsed.data.company?.trim() || "",
    phone: parsed.data.phone?.trim() || "",
    source: "website_contact_widget",
    page_url: req.headers.get("referer"),
    user_agent: req.headers.get("user-agent"),
    submitted_at: new Date().toISOString(),
  }

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      cache: "no-store",
    })
    if (!res.ok) {
      console.error(
        `[contact] webhook responded ${res.status} ${res.statusText}`
      )
      return NextResponse.json(
        { error: "Could not send your message. Please try again in a moment." },
        { status: 502 }
      )
    }
  } catch (err) {
    console.error("[contact] webhook request failed", err)
    return NextResponse.json(
      { error: "Could not reach the inbox right now. Please try again." },
      { status: 502 }
    )
  }

  return NextResponse.json({ ok: true })
}

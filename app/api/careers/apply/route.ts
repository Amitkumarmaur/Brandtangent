import { NextResponse, type NextRequest } from "next/server"
import { z } from "zod"
import { createSupabaseAdmin } from "@/lib/supabase-admin"

export const runtime = "nodejs"

const MAX_FILE_BYTES = 5 * 1024 * 1024
const ALLOWED_MIME = new Set([
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
])

const bodySchema = z.object({
  career_id: z.string().uuid(),
  full_name: z.string().trim().min(2).max(160),
  email: z.string().trim().email().max(254),
  phone: z.string().trim().max(40).optional().or(z.literal("")),
  cover_letter: z.string().trim().max(12000).optional().or(z.literal("")),
})

function sanitizeFileName(name: string): string {
  const base = name.replace(/\\/g, "/").split("/").pop() || "resume"
  return base.replace(/[^\w.\-()+ ]/g, "_").slice(0, 120) || "resume.pdf"
}

export async function POST(req: NextRequest) {
  const admin = createSupabaseAdmin()
  if (!admin) {
    return NextResponse.json(
      {
        error:
          "Applications are not enabled on this deployment yet. Add SUPABASE_SERVICE_ROLE_KEY to the server environment and ensure the `careers`, `applications`, and `resumes` storage bucket exist.",
      },
      { status: 503 }
    )
  }

  let form: FormData
  try {
    form = await req.formData()
  } catch {
    return NextResponse.json({ error: "Invalid form data." }, { status: 400 })
  }

  const resume = form.get("resume")
  if (!(resume instanceof File) || resume.size === 0) {
    return NextResponse.json({ error: "Please attach a resume (PDF or Word)." }, { status: 400 })
  }
  if (resume.size > MAX_FILE_BYTES) {
    return NextResponse.json({ error: "Resume must be 5 MB or smaller." }, { status: 400 })
  }
  if (!ALLOWED_MIME.has(resume.type)) {
    return NextResponse.json(
      { error: "Resume must be a PDF, .doc, or .docx file." },
      { status: 400 }
    )
  }

  const parsed = bodySchema.safeParse({
    career_id: String(form.get("career_id") ?? ""),
    full_name: String(form.get("full_name") ?? ""),
    email: String(form.get("email") ?? ""),
    phone: form.get("phone") != null ? String(form.get("phone")) : "",
    cover_letter: form.get("cover_letter") != null ? String(form.get("cover_letter")) : "",
  })

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Please check your name, email, and the role you selected." },
      { status: 400 }
    )
  }

  const { career_id, full_name, email, phone, cover_letter } = parsed.data

  const { data: job, error: jobErr } = await admin
    .from("careers")
    .select("id, status, job_title, location, type, team")
    .eq("id", career_id)
    .maybeSingle()

  if (jobErr || !job || job.status !== "open") {
    return NextResponse.json({ error: "That role is not accepting applications." }, { status: 400 })
  }

  const safeName = sanitizeFileName(resume.name)
  const objectPath = `${crypto.randomUUID()}-${safeName}`
  const bytes = new Uint8Array(await resume.arrayBuffer())

  const { error: upErr } = await admin.storage.from("resumes").upload(objectPath, bytes, {
    contentType: resume.type,
    upsert: false,
  })

  if (upErr) {
    return NextResponse.json(
      {
        error:
          upErr.message.includes("Bucket not found") || upErr.message.includes("not found")
            ? 'Storage bucket "resumes" is missing. Create it in Supabase (Storage) or run scripts/careers-applications-setup.sql.'
            : `Could not upload resume: ${upErr.message}`,
      },
      { status: 500 }
    )
  }

  // Resumes bucket is private — store only the storage path and use a signed
  // URL when we need to share access (e.g. via the n8n webhook below).
  const resumeStoragePath = objectPath

  const SIGNED_URL_TTL_SECONDS = 60 * 60 * 24 * 90
  const { data: signed, error: signedErr } = await admin.storage
    .from("resumes")
    .createSignedUrl(objectPath, SIGNED_URL_TTL_SECONDS)

  if (signedErr || !signed?.signedUrl) {
    await admin.storage.from("resumes").remove([objectPath]).catch(() => {})
    return NextResponse.json(
      { error: `Could not generate resume access URL: ${signedErr?.message ?? "unknown error"}` },
      { status: 500 }
    )
  }

  const resumeSignedUrl = signed.signedUrl

  const { error: insErr } = await admin.from("applications").insert({
    career_id,
    full_name,
    email,
    phone: phone?.trim() || null,
    resume_url: resumeStoragePath,
    cover_letter: cover_letter?.trim() || null,
  })

  if (insErr) {
    await admin.storage.from("resumes").remove([objectPath]).catch(() => {})
    return NextResponse.json(
      { error: `Could not save application: ${insErr.message}` },
      { status: 500 }
    )
  }

  await notifyApplicationWebhook({
    career_id,
    job_title: job.job_title,
    location: job.location ?? null,
    type: job.type ?? null,
    team: job.team ?? null,
    full_name,
    email,
    phone: phone?.trim() || null,
    cover_letter: cover_letter?.trim() || null,
    resume_url: resumeSignedUrl,
    resume_storage_path: resumeStoragePath,
    resume_signed_url_expires_at: new Date(
      Date.now() + SIGNED_URL_TTL_SECONDS * 1000
    ).toISOString(),
    resume_file_name: safeName,
    resume_mime_type: resume.type,
    resume_size_bytes: resume.size,
    submitted_at: new Date().toISOString(),
  })

  return NextResponse.json({ ok: true })
}

type ApplicationWebhookPayload = {
  career_id: string
  job_title: string
  location: string | null
  type: string | null
  team: string | null
  full_name: string
  email: string
  phone: string | null
  cover_letter: string | null
  /** Time-limited signed URL for downloading the resume from the private bucket. */
  resume_url: string
  /** Permanent storage path (bucket: `resumes`). Use to regenerate a signed URL after `resume_signed_url_expires_at`. */
  resume_storage_path: string
  resume_signed_url_expires_at: string
  resume_file_name: string
  resume_mime_type: string
  resume_size_bytes: number
  submitted_at: string
}

/** Fire-and-forget notification to the automations webhook; failures are logged but do not fail the submission. */
async function notifyApplicationWebhook(payload: ApplicationWebhookPayload): Promise<void> {
  const url = process.env.CAREERS_APPLICATION_WEBHOOK_URL?.trim()
  if (!url) return

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    })
    if (!res.ok) {
      console.error(
        `[careers/apply] webhook responded ${res.status} ${res.statusText}`
      )
    }
  } catch (err) {
    console.error("[careers/apply] webhook request failed", err)
  }
}

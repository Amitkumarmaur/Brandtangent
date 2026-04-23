"use client"

import { useMemo, useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { filterOpenCareers, type CareerRow } from "@/lib/careers"
import Link from "next/link"

type Props = {
  careers: CareerRow[]
  listError: string | null
  /** When no `careers` rows exist, optional server env UUID for a “general” open role. */
  fallbackCareerId: string | null
  /** When set and present in `careers`, pre-select this role (e.g. job detail page). */
  preferredCareerId?: string | null
  /** Tighter spacing and no duplicate “Apply” heading when the page already introduces the form. */
  compact?: boolean
}

function pickDefaultCareerId(careers: CareerRow[]): string | null {
  if (!careers.length) return null
  const general = careers.find((c) => /general/i.test(c.job_title))
  return general?.id ?? careers[0]?.id ?? null
}

export default function CareersApplicationForm({
  careers,
  listError,
  fallbackCareerId,
  preferredCareerId,
  compact = false,
}: Props) {
  const openCareers = useMemo(() => filterOpenCareers(careers), [careers])

  const initialCareerId = useMemo(() => {
    if (preferredCareerId && openCareers.some((c) => c.id === preferredCareerId)) return preferredCareerId
    if (openCareers.length) return pickDefaultCareerId(openCareers)
    return fallbackCareerId
  }, [openCareers, fallbackCareerId, preferredCareerId])

  const [careerId, setCareerId] = useState<string>(initialCareerId ?? "")
  const [fullName, setFullName] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [coverLetter, setCoverLetter] = useState("")
  const [file, setFile] = useState<File | null>(null)
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle")
  const [message, setMessage] = useState<string | null>(null)
  const [fileInputKey, setFileInputKey] = useState(0)

  const canSubmit = Boolean(careerId && file && fullName.trim() && email.trim())

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!canSubmit || !file) return

    setStatus("submitting")
    setMessage(null)

    const fd = new FormData()
    fd.set("career_id", careerId)
    fd.set("full_name", fullName.trim())
    fd.set("email", email.trim())
    fd.set("phone", phone.trim())
    fd.set("cover_letter", coverLetter.trim())
    fd.set("resume", file)

    try {
      const res = await fetch("/api/careers/apply", { method: "POST", body: fd })
      const data = (await res.json()) as { ok?: boolean; error?: string }

      if (!res.ok) {
        setStatus("error")
        setMessage(data.error ?? "Something went wrong. Please try again.")
        return
      }

      setStatus("success")
      setMessage("Thank you — your application and resume were received. We will be in touch if there is a fit.")
      setFullName("")
      setEmail("")
      setPhone("")
      setCoverLetter("")
      setFile(null)
      setFileInputKey((k) => k + 1)
      if (initialCareerId) setCareerId(initialCareerId)
    } catch {
      setStatus("error")
      setMessage("Network error. Check your connection and try again.")
    }
  }

  if (!careerId) {
    return (
      <div className="rounded-2xl border border-grey-200 bg-white p-8 md:p-10 shadow-sm">
        <h2 className="font-heading text-2xl font-semibold text-foreground mb-3">We are not accepting files yet</h2>
        <p className="text-body text-grey-400 mb-6">
          {listError
            ? `We could not load open roles (${listError}).`
            : "There are no open roles in the database yet, and no fallback role id is configured."}{" "}
          Ask your admin to add at least one row to the <code className="text-sm font-mono">careers</code> table with{" "}
          <code className="text-sm font-mono">status = &apos;open&apos;</code>, or set{" "}
          <code className="text-sm font-mono">CAREERS_FALLBACK_CAREER_ID</code> on the server. See{" "}
          <code className="text-sm font-mono">scripts/careers-applications-setup.sql</code>.
        </p>
        <a
          href="mailto:careers@digiimark.com?subject=Resume%20submission"
          className="inline-flex items-center justify-center rounded-full bg-foreground px-6 py-3 text-sm font-semibold text-white hover:bg-grey-800 transition-colors"
        >
          Email careers@digiimark.com
        </a>
      </div>
    )
  }

  const formShell = compact
    ? "rounded-2xl border border-grey-200 bg-white p-6 md:p-8 shadow-sm space-y-4"
    : "rounded-2xl border border-grey-200 bg-white p-8 md:p-10 shadow-sm space-y-6"

  return (
    <form onSubmit={onSubmit} className={formShell}>
      {!compact ? (
        <div>
          <h2 className="font-heading text-2xl font-semibold text-foreground mb-2">Apply</h2>
          <p className="text-sm text-grey-400">
            PDF or Word, up to 5 MB. By submitting, you agree we store your details to evaluate hiring — see our{" "}
            <Link href="/privacy-policy" className="text-ignite-orange font-medium hover:underline">
              Privacy Policy
            </Link>
            .
          </p>
        </div>
      ) : null}

      {openCareers.length > 0 ? (
        <div className="space-y-2">
          <label htmlFor="career_id" className="text-sm font-medium text-foreground">
            Role
          </label>
          <select
            id="career_id"
            name="career_id"
            value={careerId}
            onChange={(e) => setCareerId(e.target.value)}
            required
            className="w-full rounded-xl border border-grey-200 bg-white px-4 py-3 text-foreground text-sm font-medium outline-none focus-visible:ring-2 focus-visible:ring-ignite-orange focus-visible:ring-offset-2"
          >
            {openCareers.map((c) => (
              <option key={c.id} value={c.id}>
                {c.job_title}
                {c.location ? ` — ${c.location}` : ""}
                {c.type ? ` (${c.type})` : ""}
              </option>
            ))}
          </select>
        </div>
      ) : (
        <div className="rounded-xl bg-grey-100 border border-grey-200 px-4 py-3 text-sm text-grey-600">
          Applying to the <strong className="text-foreground">general talent pool</strong> (configured fallback role).
        </div>
      )}

      <div className={`grid grid-cols-1 md:grid-cols-2 ${compact ? "gap-4" : "gap-5"}`}>
        <div className="space-y-2">
          <label htmlFor="full_name" className="text-sm font-medium text-foreground">
            Full name
          </label>
          <Input
            id="full_name"
            name="full_name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            required
            autoComplete="name"
            placeholder="Jane Doe"
            className="h-11 rounded-xl border-grey-200"
          />
        </div>
        <div className="space-y-2">
          <label htmlFor="email" className="text-sm font-medium text-foreground">
            Email
          </label>
          <Input
            id="email"
            name="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
            placeholder="you@example.com"
            className="h-11 rounded-xl border-grey-200"
          />
        </div>
      </div>

      <div className="space-y-2">
        <label htmlFor="phone" className="text-sm font-medium text-foreground">
          Phone <span className="text-grey-400 font-normal">(optional)</span>
        </label>
        <Input
          id="phone"
          name="phone"
          type="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          autoComplete="tel"
          placeholder="+971 …"
          className="h-11 rounded-xl border-grey-200 max-w-md"
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="cover_letter" className="text-sm font-medium text-foreground">
          Cover note <span className="text-grey-400 font-normal">(optional)</span>
        </label>
        <textarea
          id="cover_letter"
          name="cover_letter"
          value={coverLetter}
          onChange={(e) => setCoverLetter(e.target.value)}
          rows={compact ? 3 : 5}
          placeholder="What you want to work on, links to portfolio or GitHub, availability…"
          className="w-full rounded-xl border border-grey-200 bg-white px-4 py-3 text-sm text-foreground placeholder:text-grey-400 outline-none focus-visible:ring-2 focus-visible:ring-ignite-orange focus-visible:ring-offset-2"
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="resume" className="text-sm font-medium text-foreground">
          Resume
        </label>
        <Input
          key={fileInputKey}
          id="resume"
          name="resume"
          type="file"
          accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
          onChange={(e) => setFile(e.target.files?.[0] ?? null)}
          required
          className="h-auto py-3 rounded-xl border-grey-200 file:mr-4"
        />
        {file ? <p className="text-xs text-grey-400">{file.name}</p> : null}
      </div>

      {message ? (
        <p
          role={status === "error" ? "alert" : "status"}
          className={`text-sm font-medium ${status === "success" ? "text-success" : "text-red-600"}`}
        >
          {message}
        </p>
      ) : null}

      {compact ? (
        <p className="text-xs text-grey-400 leading-relaxed">
          PDF or Word, up to 5 MB. By submitting you agree we store your details for hiring — see our{" "}
          <Link href="/privacy-policy" className="text-ignite-orange font-medium hover:underline">
            Privacy Policy
          </Link>
          .
        </p>
      ) : null}

      <Button
        type="submit"
        disabled={!canSubmit || status === "submitting"}
        className={
          compact
            ? "w-full md:w-auto rounded-full bg-ignite-orange hover:bg-ignite-orange/90 text-white px-8 py-5 text-sm font-semibold shadow-[0_4px_14px_rgba(255,87,34,0.25)]"
            : "w-full md:w-auto rounded-full bg-ignite-orange hover:bg-ignite-orange/90 text-white px-10 py-6 text-base font-semibold shadow-[0_4px_14px_rgba(255,87,34,0.25)]"
        }
      >
        {status === "submitting" ? "Sending…" : "Submit application"}
      </Button>
    </form>
  )
}

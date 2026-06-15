"use client"

import { useMemo, useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { filterOpenCareers, type CareerRow } from "@/lib/careers"
import Link from "next/link"

type Props = {
  careers: CareerRow[]
  listError: string | null
  fallbackCareerId: string | null
  preferredCareerId?: string | null
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

  const lockedRole = useMemo(() => {
    if (!preferredCareerId) return null
    return openCareers.find((c) => c.id === preferredCareerId) ?? null
  }, [openCareers, preferredCareerId])

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
      <div className="rounded-md border border-border bg-white p-8 md:p-10">
        <h2 className="text-2xl font-semibold text-foreground mb-3">We are not accepting files yet</h2>
        <p className="text-sm text-muted-foreground mb-6">
          {listError
            ? `We could not load open roles (${listError}).`
            : "There are no open roles in the database yet, and no fallback role id is configured."}{" "}
          Ask your admin to add at least one row to the <code className="text-sm font-mono">careers</code> table with{" "}
          <code className="text-sm font-mono">status = &apos;open&apos;</code>, or set{" "}
          <code className="text-sm font-mono">CAREERS_FALLBACK_CAREER_ID</code> on the server. See{" "}
          <code className="text-sm font-mono">scripts/careers-applications-setup.sql</code>.
        </p>
        <a
          href="mailto:careers@brandtangent.com?subject=Resume%20submission"
          className="inline-flex items-center justify-center rounded-sm bg-primary px-6 h-11 text-sm font-semibold text-primary-foreground shadow-[rgba(255,255,255,0.2)_0px_0.5px_0px_0px_inset,rgba(0,0,0,0.2)_0px_0px_0px_0.5px_inset,rgba(0,0,0,0.05)_0px_1px_2px_0px] hover:opacity-90 transition-opacity"
        >
          Email careers@brandtangent.com
        </a>
      </div>
    )
  }

  const formShell = compact
    ? "rounded-md border border-border bg-white p-6 md:p-8 space-y-4"
    : "rounded-md border border-border bg-white p-8 md:p-10 space-y-6"

  return (
    <form onSubmit={onSubmit} className={formShell}>
      {!compact ? (
        <div>
          <h2 className="text-2xl font-semibold text-foreground mb-2">Apply</h2>
          <p className="text-sm text-muted-foreground">
            PDF or Word, up to 5 MB. By submitting, you agree we store your details to evaluate hiring — see our{" "}
            <Link href="/privacy-policy" className="text-foreground font-medium underline decoration-[rgba(28,28,28,0.3)] hover:decoration-primary">
              Privacy Policy
            </Link>
            .
          </p>
        </div>
      ) : null}

      {openCareers.length > 0 ? (
        lockedRole ? (
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Applying for</label>
            <div className="rounded-sm border border-border bg-[rgba(28,28,28,0.03)] px-4 py-3">
              <p className="text-sm font-semibold text-foreground">{lockedRole.job_title}</p>
              {lockedRole.location || lockedRole.type ? (
                <p className="mt-0.5 text-xs text-muted-foreground">
                  {[lockedRole.location, lockedRole.type].filter(Boolean).join(" · ")}
                </p>
              ) : null}
            </div>
            <input type="hidden" name="career_id" value={careerId} />
          </div>
        ) : (
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
              className="w-full rounded-sm border border-border bg-white px-4 py-3 text-foreground text-sm font-medium outline-none focus-visible:border-[rgba(28,28,28,0.4)] focus-visible:shadow-[rgba(0,0,0,0.1)_0px_4px_12px]"
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
        )
      ) : (
        <div className="rounded-sm bg-[rgba(28,28,28,0.04)] border border-border px-4 py-3 text-sm text-muted-foreground">
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
            className="h-11 rounded-sm border-border bg-white text-foreground placeholder:text-muted-foreground"
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
            className="h-11 rounded-sm border-border bg-white text-foreground placeholder:text-muted-foreground"
          />
        </div>
      </div>

      <div className="space-y-2">
        <label htmlFor="phone" className="text-sm font-medium text-foreground">
          Phone <span className="text-muted-foreground font-normal">(optional)</span>
        </label>
        <Input
          id="phone"
          name="phone"
          type="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          autoComplete="tel"
          placeholder="+971 …"
          className="h-11 rounded-sm border-border bg-white text-foreground placeholder:text-muted-foreground max-w-md"
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="cover_letter" className="text-sm font-medium text-foreground">
          Cover note <span className="text-muted-foreground font-normal">(optional)</span>
        </label>
        <textarea
          id="cover_letter"
          name="cover_letter"
          value={coverLetter}
          onChange={(e) => setCoverLetter(e.target.value)}
          rows={compact ? 3 : 5}
          placeholder="What you want to work on, links to portfolio, availability…"
          className="w-full rounded-sm border border-border bg-white px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground outline-none focus-visible:border-[rgba(28,28,28,0.4)] focus-visible:shadow-[rgba(0,0,0,0.1)_0px_4px_12px]"
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
          className="h-auto py-3 rounded-sm border-border bg-white file:mr-4"
        />
        {file ? <p className="text-xs text-muted-foreground">{file.name}</p> : null}
      </div>

      {message ? (
        <p
          role={status === "error" ? "alert" : "status"}
          className={`text-sm font-medium ${status === "success" ? "text-green-700" : "text-red-600"}`}
        >
          {message}
        </p>
      ) : null}

      {compact ? (
        <p className="text-xs text-muted-foreground leading-relaxed">
          PDF or Word, up to 5 MB. By submitting you agree we store your details for hiring — see our{" "}
          <Link href="/privacy-policy" className="text-foreground font-medium underline decoration-[rgba(28,28,28,0.3)] hover:decoration-primary">
            Privacy Policy
          </Link>
          .
        </p>
      ) : null}

      <Button
        type="submit"
        disabled={!canSubmit || status === "submitting"}
      >
        {status === "submitting" ? "Sending…" : "Submit application"}
      </Button>
    </form>
  )
}

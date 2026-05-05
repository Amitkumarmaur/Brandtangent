"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { CheckCircle2, Loader2, Send } from "lucide-react"

const formSchema = z.object({
  full_name: z.string().trim().min(2, "Please enter your name").max(160),
  email: z.string().trim().email("Please enter a valid email").max(254),
  company: z.string().trim().max(200).optional().or(z.literal("")),
  phone: z.string().trim().max(40).optional().or(z.literal("")),
  message: z
    .string()
    .trim()
    .min(10, "A few more words please (10+ characters)")
    .max(8000),
})

type FormValues = z.infer<typeof formSchema>

export function ContactForm() {
  const [submitState, setSubmitState] = useState<
    | { kind: "idle" }
    | { kind: "submitting" }
    | { kind: "success" }
    | { kind: "error"; message: string }
  >({ kind: "idle" })

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      full_name: "",
      email: "",
      company: "",
      phone: "",
      message: "",
    },
  })

  const onSubmit = async (values: FormValues) => {
    setSubmitState({ kind: "submitting" })
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      })
      const data = (await res.json().catch(() => ({}))) as {
        ok?: boolean
        error?: string
      }
      if (!res.ok || !data.ok) {
        throw new Error(data.error || `Request failed (${res.status})`)
      }
      setSubmitState({ kind: "success" })
      reset()
    } catch (e) {
      setSubmitState({
        kind: "error",
        message: e instanceof Error ? e.message : "Something went wrong.",
      })
    }
  }

  if (submitState.kind === "success") {
    return (
      <div className="flex flex-col items-center justify-center text-center gap-3 px-4 py-10">
        <div className="w-12 h-12 rounded-full bg-success/10 text-success flex items-center justify-center">
          <CheckCircle2 className="w-6 h-6" />
        </div>
        <p className="font-heading text-base font-semibold text-foreground">
          Message received
        </p>
        <p className="text-sm text-grey-400 leading-relaxed max-w-xs">
          Thanks — we&apos;ll get back to you within one business day.
        </p>
        <button
          type="button"
          onClick={() => setSubmitState({ kind: "idle" })}
          className="mt-2 text-sm font-medium text-ignite-orange hover:underline underline-offset-4"
        >
          Send another message
        </button>
      </div>
    )
  }

  const submitting = submitState.kind === "submitting"

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col gap-3 px-4 py-3"
      noValidate
    >
      <Field label="Full name" error={errors.full_name?.message}>
        <input
          type="text"
          autoComplete="name"
          disabled={submitting}
          className={inputClasses}
          {...register("full_name")}
        />
      </Field>

      <Field label="Email" error={errors.email?.message}>
        <input
          type="email"
          autoComplete="email"
          disabled={submitting}
          className={inputClasses}
          {...register("email")}
        />
      </Field>

      <div className="grid grid-cols-2 gap-3">
        <Field label="Company" optional error={errors.company?.message}>
          <input
            type="text"
            autoComplete="organization"
            disabled={submitting}
            className={inputClasses}
            {...register("company")}
          />
        </Field>
        <Field label="Phone" optional error={errors.phone?.message}>
          <input
            type="tel"
            autoComplete="tel"
            disabled={submitting}
            className={inputClasses}
            {...register("phone")}
          />
        </Field>
      </div>

      <Field label="How can we help?" error={errors.message?.message}>
        <textarea
          rows={4}
          disabled={submitting}
          className={`${inputClasses} resize-none min-h-[6rem]`}
          placeholder="A sentence or two about what you're working on."
          {...register("message")}
        />
      </Field>

      {submitState.kind === "error" && (
        <p
          role="alert"
          className="text-xs text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2"
        >
          {submitState.message}
        </p>
      )}

      <button
        type="submit"
        disabled={submitting}
        className="mt-1 inline-flex items-center justify-center gap-2 h-10 rounded-xl bg-ignite-orange text-white text-sm font-semibold disabled:opacity-50 disabled:pointer-events-none hover:bg-ignite-orange/90 transition-colors shadow-[0_4px_14px_rgba(255,87,34,0.25)]"
      >
        {submitting ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            Sending…
          </>
        ) : (
          <>
            <Send className="w-4 h-4" />
            Send message
          </>
        )}
      </button>
    </form>
  )
}

const inputClasses =
  "w-full rounded-xl border border-grey-200 bg-white px-3 py-2 text-sm text-foreground placeholder:text-grey-400 outline-none focus-visible:ring-2 focus-visible:ring-ignite-orange focus-visible:ring-offset-1 disabled:bg-grey-100 disabled:text-grey-400"

function Field({
  label,
  optional,
  error,
  children,
}: {
  label: string
  optional?: boolean
  error?: string
  children: React.ReactNode
}) {
  return (
    <label className="flex flex-col gap-1">
      <span className="text-xs font-medium text-grey-600">
        {label}
        {optional && (
          <span className="ml-1 font-normal text-grey-400">(optional)</span>
        )}
      </span>
      {children}
      {error && <span className="text-xs text-red-600">{error}</span>}
    </label>
  )
}

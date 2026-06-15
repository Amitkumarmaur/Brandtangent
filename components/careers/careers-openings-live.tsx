"use client"

import { useCallback, useEffect, useState } from "react"
import Link from "next/link"
import { motion } from "motion/react"
import { ArrowRight, CheckCircle2, Send } from "lucide-react"

import { Button } from "@/components/ui/button"
import CareersOpenRoles from "@/components/careers/careers-open-roles"
import CareersApplicationForm from "@/components/careers/careers-application-form"
import { fetchOpenCareers, type CareerRow } from "@/lib/careers"

const POLL_MS = 6000

type Props = {
  initialCareers: CareerRow[]
  initialListError: string | null
  fallbackCareerId: string | null
}

const hiringProcess = [
  {
    step: "01",
    title: "Submit",
    description: "Send your resume and a note about why you're interested.",
  },
  {
    step: "02",
    title: "Async review",
    description: "Portfolio review and async questions to assess creative thinking.",
  },
  {
    step: "03",
    title: "Interview",
    description: "Conversation with our team about your experience and approach.",
  },
  {
    step: "04",
    title: "Offer",
    description: "If it's a fit, we move fast with a competitive offer.",
  },
]

const principles = [
  {
    title: "Small teams, high ownership",
    description:
      "You will shape creative strategy and brand work that reaches real audiences. Your impact is direct and visible.",
  },
  {
    title: "Async-first interviews",
    description:
      "We respect your time and share clear expectations for each step. No surprise questions or gotchas.",
  },
  {
    title: "Inclusive by design",
    description:
      "We welcome applicants across regions aligned with how we work remotely. Diversity of thinking matters.",
  },
]

export default function CareersOpeningsLive({
  initialCareers,
  initialListError,
  fallbackCareerId,
}: Props) {
  const [careers, setCareers] = useState<CareerRow[]>(initialCareers)
  const [listError, setListError] = useState<string | null>(initialListError)

  const sync = useCallback(async () => {
    const { careers: next, error } = await fetchOpenCareers()
    setCareers(next)
    setListError(error)
  }, [])

  useEffect(() => {
    const interval = setInterval(() => {
      void sync()
    }, POLL_MS)

    const onVisible = () => {
      if (document.visibilityState === "visible") void sync()
    }
    document.addEventListener("visibilitychange", onVisible)

    return () => {
      clearInterval(interval)
      document.removeEventListener("visibilitychange", onVisible)
    }
  }, [sync])

  const formKey = careers
    .map((c) => `${c.id}:${c.status}`)
    .sort()
    .join("|")

  return (
    <>
      <CareersOpenRoles careers={careers} />

      {/* How we hire — animated timeline */}
      <section className="relative overflow-hidden border-t border-border bg-secondary/40 py-16 md:py-20">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="mb-12 lg:mb-16"
          >
            <div className="mb-4 flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-primary" />
              <span className="micro-cap text-muted-foreground">Process</span>
            </div>
            <h2 className="display-lg text-foreground">How we hire</h2>
            <p className="text-subtitle mt-2 max-w-lg">
              Transparent steps from application to offer — no black boxes.
            </p>
          </motion.div>

          <div className="relative">
            <div
              className="absolute left-6 top-8 hidden h-[calc(100%-4rem)] w-px bg-gradient-to-b from-primary/40 via-primary/20 to-transparent lg:left-[12.5%] lg:block"
              aria-hidden
            />

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-4 lg:gap-8">
              {hiringProcess.map((item, i) => (
                <motion.div
                  key={item.step}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-40px" }}
                  transition={{
                    duration: 0.5,
                    delay: i * 0.1,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  whileHover={{ y: -4 }}
                  className="relative"
                >
                  <div className="glass h-full rounded-md border border-border/60 p-6 shadow-[var(--shadow-1)] transition-shadow hover:shadow-[var(--shadow-accent-orange-soft)] md:p-8">
                    <motion.div
                      className="mb-5 flex h-12 w-12 items-center justify-center rounded-full bg-primary text-lg font-semibold text-white shadow-[var(--shadow-accent-orange)]"
                      initial={{ scale: 0 }}
                      whileInView={{ scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.2 + i * 0.1, type: "spring" }}
                    >
                      {item.step}
                    </motion.div>
                    <h3 className="mb-2 text-xl font-semibold text-foreground">{item.title}</h3>
                    <p className="text-sm leading-relaxed text-muted-foreground md:text-base">
                      {item.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Hiring principles — dark band */}
      <section className="relative overflow-hidden border-t border-white/10 bg-primary py-16 md:py-20">
        <motion.div
          className="pointer-events-none absolute -left-20 top-0 h-64 w-64 rounded-full bg-white/5 blur-3xl"
          animate={{ scale: [1, 1.15, 1], opacity: [0.4, 0.7, 0.4] }}
          transition={{ duration: 6, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
          aria-hidden
        />
        <motion.div
          className="pointer-events-none absolute -right-16 bottom-0 h-72 w-72 rounded-full bg-accent-orange/20 blur-3xl"
          animate={{ scale: [1.1, 1, 1.1], opacity: [0.3, 0.55, 0.3] }}
          transition={{ duration: 7, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
          aria-hidden
        />

        <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="mb-12 lg:mb-16"
          >
            <div className="mb-4 flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-accent-orange" />
              <span className="micro-cap text-white/60">Our hiring principles</span>
            </div>
            <h2 className="display-lg text-white">How we approach hiring</h2>
          </motion.div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-3 md:gap-8">
            {principles.map((item, i) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                whileHover={{ y: -4 }}
                className="rounded-md border border-white/10 bg-white/5 p-8 transition-colors hover:border-white/20 hover:bg-white/8"
              >
                <div className="mb-4 flex items-start gap-3">
                  <div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-accent-orange">
                    <CheckCircle2 className="h-4 w-4 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-white">{item.title}</h3>
                </div>
                <p className="text-base leading-relaxed text-white/75">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Application form */}
      <section
        id="apply"
        className="relative overflow-hidden border-t border-border bg-background py-16 md:py-20"
      >
        <div
          className="pointer-events-none absolute inset-0 opacity-30"
          aria-hidden
          style={{
            background:
              "radial-gradient(ellipse 70% 60% at 100% 0%, rgba(249,107,238,0.08), transparent 60%)",
          }}
        />

        <div className="relative mx-auto grid max-w-7xl grid-cols-1 items-start gap-12 px-6 lg:grid-cols-5 lg:gap-16 lg:px-8">
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="lg:col-span-2"
          >
            <div className="mb-4 flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-primary" />
              <span className="micro-cap text-muted-foreground">Apply</span>
            </div>
            <h2 className="display-lg mb-4 text-foreground">Start the conversation</h2>
            <p className="mb-8 text-lg leading-relaxed text-muted-foreground">
              Have a role in mind? Submit below. Or send a general application and
              we&apos;ll consider you for future opportunities.
            </p>

            <ul className="mb-10 space-y-4">
              {[
                "Resume + portfolio link",
                "Link to your best work",
                "A few words about why Brandtangent",
              ].map((item, i) => (
                <motion.li
                  key={item}
                  initial={{ opacity: 0, x: -12 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.1 + i * 0.08 }}
                  className="flex items-start gap-3"
                >
                  <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-primary" />
                  <span className="text-sm text-muted-foreground md:text-base">{item}</span>
                </motion.li>
              ))}
            </ul>

            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
              <Button variant="outline" size="lg" asChild>
                <a href="mailto:careers@brandtangent.com?subject=Resume%20submission">
                  Email careers@brandtangent.com
                  <Send className="h-4 w-4" />
                </a>
              </Button>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.6, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="lg:col-span-3"
          >
            <div className="overflow-hidden rounded-md border border-border/60 bg-card/80 shadow-[var(--shadow-glass)] backdrop-blur-sm">
              <CareersApplicationForm
                key={formKey}
                careers={careers}
                listError={listError}
                fallbackCareerId={fallbackCareerId}
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="border-t border-border bg-secondary/30 py-12 md:py-16">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mx-auto flex max-w-7xl flex-col items-center gap-4 px-6 text-center lg:px-8"
        >
          <p className="text-subtitle max-w-md">
            Not seeing the right role? We&apos;re always interested in exceptional talent.
          </p>
          <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
            <Button size="lg" asChild>
              <Link href="/#contact">
                Get in touch
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </motion.div>
        </motion.div>
      </section>
    </>
  )
}

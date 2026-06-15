"use client"

import { motion } from "motion/react"

interface CaseStudyTestimonialProps {
  quote: string
  clientName?: string | null
  clientRole?: string | null
}

export default function CaseStudyTestimonial({ quote, clientName, clientRole }: CaseStudyTestimonialProps) {
  return (
    <section className="relative w-full py-24 lg:py-36 bg-white border-t border-border overflow-hidden">
      {/* Decorative quote mark */}
      <div className="absolute left-6 lg:left-16 top-12 text-[16rem] lg:text-[22rem] font-semibold text-[rgba(28,28,28,0.06)] leading-none select-none pointer-events-none">
        &ldquo;
      </div>

      <div className="max-w-5xl mx-auto px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7 }}
        >
          <div className="flex items-center gap-2 mb-10">
            <div className="w-2 h-2 rounded-full bg-[rgba(28,28,28,0.4)]" />
            <span className="text-muted-foreground font-semibold tracking-wider text-sm uppercase">
              Client Voice
            </span>
          </div>

          <blockquote className="display-md text-foreground mb-8">
            {quote}
          </blockquote>

          {clientName && (
            <div className="flex items-center gap-4">
              <div className="w-12 h-0.5 bg-muted flex-shrink-0" />
              <div>
                <p className="text-sm font-semibold text-foreground tracking-tight">
                  {clientName}
                </p>
                <p className="text-xs text-muted-foreground uppercase tracking-widest mt-0.5">
                  {clientRole || "Client"}
                </p>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </section>
  )
}

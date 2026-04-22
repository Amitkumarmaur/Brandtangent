"use client"

import { motion } from "framer-motion"

interface CaseStudyTestimonialProps {
  quote: string
  clientName?: string | null
  clientRole?: string | null
}

export default function CaseStudyTestimonial({ quote, clientName, clientRole }: CaseStudyTestimonialProps) {
  return (
    <section className="relative w-full py-24 lg:py-36 bg-background border-t border-grey-200 overflow-hidden">
      {/* Large decorative quote mark */}
      <div className="absolute left-6 lg:left-16 top-12 font-heading text-[16rem] lg:text-[22rem] font-black text-grey-100 leading-none select-none pointer-events-none">
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
            <div className="w-2 h-2 rounded-full bg-ignite-orange" />
            <span className="font-heading text-ignite-orange font-medium tracking-wider text-sm uppercase">
              Client Voice
            </span>
          </div>

          <blockquote className="font-heading text-2xl md:text-3xl lg:text-4xl font-semibold text-foreground leading-[1.35] tracking-tight mb-12">
            {quote}
          </blockquote>

          {clientName && (
            <div className="flex items-center gap-4">
              {/* Orange accent line */}
              <div className="w-12 h-0.5 bg-ignite-orange flex-shrink-0" />
              <div>
                <p className="font-heading text-sm font-bold uppercase tracking-widest text-ignite-orange">
                  {clientName}
                </p>
                <p className="text-xs text-grey-400 uppercase tracking-widest mt-0.5">
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

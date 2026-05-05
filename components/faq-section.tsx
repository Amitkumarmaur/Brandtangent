"use client"

import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Plus, X } from "lucide-react"
import { supabase } from "@/lib/supabase"

/** Shape we render in the accordion — mirrors `public.faq`. */
type FAQ = {
  id: string
  question: string
  answer: string
}

type RawFaqRow = {
  id: string
  question: string
  answer: string
  sort_order: number | null
  is_active: boolean | null
}

function AccordionItem({
  question,
  answer,
  isOpen,
  onClick,
}: {
  question: string
  answer: string
  isOpen: boolean
  onClick: () => void
}) {
  return (
    <div className={`border rounded-[1.5rem] mb-4 overflow-hidden transition-all duration-300 ${isOpen ? 'border-ignite-orange bg-background shadow-lg' : 'border-grey-200 bg-transparent hover:border-ignite-orange/40'}`}>
      <button
        onClick={onClick}
        className="w-full flex justify-between items-center p-6 md:p-8 text-left"
      >
        <span className={`font-heading font-medium text-lg md:text-xl pr-8 transition-colors ${isOpen ? 'text-foreground' : 'text-grey-600'}`}>
          {question}
        </span>
        <span className="text-ignite-orange flex-shrink-0">
          {isOpen ? <X className="w-5 h-5 md:w-6 md:h-6" /> : <Plus className="w-5 h-5 md:w-6 md:h-6" />}
        </span>
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            <div className="px-6 md:px-8 pb-6 md:pb-8 text-grey-400 leading-relaxed font-light text-base md:text-lg">
              {answer}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default function FAQSection() {
  const [faqs, setFaqs] = useState<FAQ[]>([])
  const [openId, setOpenId] = useState<string | null>(null)
  const [loadError, setLoadError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false

    async function load() {
      const { data, error } = await supabase
        .from("faq")
        .select("id, question, answer, sort_order, is_active")
        .eq("is_active", true)
        .order("sort_order", { ascending: true, nullsFirst: false })

      if (cancelled) return
      if (error) {
        setLoadError(error.message)
        return
      }

      const rows = (data as RawFaqRow[] | null) ?? []
      const mapped = rows.map((r) => ({
        id: r.id,
        question: r.question,
        answer: r.answer,
      }))
      setFaqs(mapped)
      // Open the second FAQ by default, matching the previous UX.
      if (mapped.length > 1) {
        setOpenId(mapped[1].id)
      } else if (mapped.length === 1) {
        setOpenId(mapped[0].id)
      }
    }

    void load()
    return () => {
      cancelled = true
    }
  }, [])

  if (loadError || faqs.length === 0) {
    return null
  }

  return (
    <section className="bg-background relative py-16 md:py-20 overflow-hidden border-t border-grey-200">

      {/* Background Subtle Grid Pattern */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundSize: '40px 40px',
          backgroundImage: `linear-gradient(to right, var(--color-foreground) 1px, transparent 1px), linear-gradient(to bottom, var(--color-foreground) 1px, transparent 1px)`
        }}
      />

      <div className="w-full max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-24">

          {/* Left Column: Sticky Header */}
          <div className="lg:w-5/12 lg:sticky lg:top-24 h-max">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-2 h-2 rounded-full bg-ignite-orange" />
              <span className="font-heading text-ignite-orange font-medium tracking-wider uppercase text-sm">FAQs</span>
            </div>
            <h2 className="font-heading text-3xl md:text-4xl lg:text-5xl font-semibold text-foreground tracking-tight leading-tight">
              Transformation with <br className="hidden lg:block"/>
              Smart UX & Scalable Tech
            </h2>
            <p className="text-grey-400 text-base md:text-lg font-light leading-relaxed max-w-lg mb-6">
              You have the vision—we engineer for the future. At DigiiMark, we embrace modern technology with creativity to provide AI-powered multilingual support, predictive UX, and intelligent UI/UX design. No matter if you are looking for AI-powered hosting or AI-driven A/B testing, our teams have the expertise to build scalable digital products that think, adapt, and grow with your audience.
            </p>
          </div>

          {/* Right Column: Accordion */}
          <div className="lg:w-7/12 mt-4 lg:mt-0">
            {faqs.map((faq) => (
              <AccordionItem
                key={faq.id}
                question={faq.question}
                answer={faq.answer}
                isOpen={openId === faq.id}
                onClick={() => setOpenId(openId === faq.id ? null : faq.id)}
              />
            ))}
          </div>

        </div>
      </div>
    </section>
  )
}

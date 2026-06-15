"use client"

import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "motion/react"
import { Plus, Minus } from "lucide-react"
import { supabase } from "@/lib/supabase"
import { SectionHeader } from "@/components/motion/section-reveal"

type FAQ = { id: string; question: string; answer: string }

type RawFaqRow = {
  id: string; question: string; answer: string
  sort_order: number | null; is_active: boolean | null
}

function AccordionItem({
  question, answer, isOpen, onClick,
}: {
  question: string; answer: string; isOpen: boolean; onClick: () => void
}) {
  return (
    <div
      className={`border rounded-md mb-2 overflow-hidden transition-all duration-200 ${
        isOpen
          ? "border-accent-orange/30 bg-accent-orange/3 shadow-[rgba(83,58,253,0.06)_0_1px_3px]"
          : "border-border bg-white hover:border-accent-orange/30 hover:shadow-[var(--shadow-layered)]"
      }`}
    >
      <button
        onClick={onClick}
        className="w-full flex justify-between items-center p-5 md:p-6 text-left gap-4"
        aria-expanded={isOpen}
      >
        <span className={`text-[15px] font-normal transition-colors leading-relaxed ${isOpen ? "text-accent-orange" : "text-foreground"}`}>
          {question}
        </span>
        <span className={`flex-shrink-0 transition-colors ${isOpen ? "text-accent-orange" : "text-muted-foreground"}`}>
          {isOpen
            ? <Minus className="w-4 h-4" />
            : <Plus className="w-4 h-4" />
          }
        </span>
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.22, ease: "easeInOut" }}
          >
            <div className="px-5 md:px-6 pb-5 md:pb-6 text-muted-foreground font-normal leading-relaxed text-[15px]">
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
      if (error) { setLoadError(error.message); return }
      const rows = (data as RawFaqRow[] | null) ?? []
      const mapped = rows.map((r) => ({ id: r.id, question: r.question, answer: r.answer }))
      setFaqs(mapped)
      if (mapped.length > 1) setOpenId(mapped[1].id)
      else if (mapped.length === 1) setOpenId(mapped[0].id)
    }
    void load()
    return () => { cancelled = true }
  }, [])

  if (loadError || faqs.length === 0) return null

  return (
    <section className="bg-secondary py-16 md:py-20 border-t border-border">
      <div className="w-full max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-24">
          <div className="lg:w-5/12 lg:sticky lg:top-24 h-max">
            <SectionHeader
              eyebrow="FAQs"
              title={
                <>
                  Questions we
                  <br className="hidden lg:block" /> get a lot
                </>
              }
              subtitle="You have the vision — we build the system. Scalable, intelligent, and built to compound your brand equity over time."
            />
          </div>

          {/* Right â€” accordion */}
          <div className="lg:w-7/12 mt-2 lg:mt-0">
            {faqs.map((faq, index) => (
              <motion.div
                key={faq.id}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.5, delay: index * 0.06 }}
              >
                <AccordionItem
                  question={faq.question}
                  answer={faq.answer}
                  isOpen={openId === faq.id}
                  onClick={() => setOpenId(openId === faq.id ? null : faq.id)}
                />
              </motion.div>
            ))}
          </div>

        </div>
      </div>
    </section>
  )
}

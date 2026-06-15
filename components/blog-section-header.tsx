"use client"

import Link from "next/link"
import { motion } from "motion/react"
import { ArrowRight } from "lucide-react"
import { SectionHeader } from "@/components/motion/section-reveal"

export default function BlogSectionHeader() {
  return (
    <div className="w-full max-w-7xl mx-auto px-6 lg:px-8 mb-12">
      <div className="flex flex-col xl:flex-row xl:items-end justify-between gap-6">
        <SectionHeader
          eyebrow="Our blog"
          title={
            <>
              What&apos;s happening in
              <br className="hidden md:block" /> the industry
            </>
          }
        />
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.15 }}
        >
          <Link
            href="/blog"
            className="inline-flex items-center gap-1.5 text-sm text-primary hover:text-primary/80 transition-colors font-light shrink-0"
          >
            View all posts
            <ArrowRight className="w-4 h-4" aria-hidden />
          </Link>
        </motion.div>
      </div>
    </div>
  )
}

"use client"

import Image from "next/image"
import { motion } from "motion/react"

interface BlogPostHeroProps {
  title: string
  category: string
  date: string
  image?: string
  authorName?: string
  authorImage?: string
  readTime?: string
}

export default function BlogPostHero({
  title,
  category,
  date,
  image,
  authorName,
  authorImage,
  readTime,
}: BlogPostHeroProps) {
  return (
    <section className="relative w-full pt-32 pb-16 md:pt-40 md:pb-24 bg-white overflow-hidden border-b border-border">
      <div className="w-full max-w-4xl mx-auto px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex flex-col items-center text-center"
        >
          <p className="micro-cap text-muted-foreground mb-6">{category}</p>

          <h1 className="display-xl text-foreground mb-8 text-balance">
            {title}
          </h1>

          <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-muted-foreground mb-12">
            <div className="flex items-center gap-3">
              {authorImage && (
                <div className="relative w-8 h-8 rounded-full overflow-hidden border border-border">
                  <Image src={authorImage} alt={authorName || "Author"} fill className="object-cover" />
                </div>
              )}
              <span className="font-medium text-foreground">{authorName || "Brandtangent Team"}</span>
            </div>
            <div className="w-1 h-1 rounded-full bg-muted" />
            <span>
              {(() => {
                const d = new Date(date)
                return Number.isNaN(d.getTime())
                  ? "â€”"
                  : d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
              })()}
            </span>
            {readTime && (
              <>
                <div className="w-1 h-1 rounded-full bg-muted" />
                <span>{readTime}</span>
              </>
            )}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="relative w-full aspect-[16/9] rounded-md overflow-hidden border border-border bg-muted"
        >
          {image ? (
            <Image src={image} alt={title} fill priority className="object-cover" />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center text-muted-foreground text-sm font-medium" aria-hidden>
              No cover image
            </div>
          )}
        </motion.div>
      </div>
    </section>
  )
}

"use client"

import Image from "next/image"
import { motion } from "framer-motion"

interface BlogPostHeroProps {
  title: string
  category: string
  date: string
  /** Hero URL from `blogs.hero_image`; optional when not set in CMS */
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
    <section className="relative w-full pt-32 pb-16 md:pt-40 md:pb-24 bg-white overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(255,87,34,0.05),transparent_50%)] pointer-events-none" />
      
      <div className="w-full max-w-4xl mx-auto px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex flex-col items-center text-center"
        >
          {/* Eyebrow / Category */}
          <div className="flex items-center gap-2 mb-6">
            <div className="w-2 h-2 rounded-full bg-ignite-orange" />
            <span className="text-eyebrow text-ignite-orange">{category}</span>
          </div>

          <h1 className="heading-h1 text-foreground mb-8 text-balance">
            {title}
          </h1>

          {/* Metadata Row */}
          <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-grey-400 mb-12">
            <div className="flex items-center gap-3">
              {authorImage && (
                <div className="relative w-8 h-8 rounded-full overflow-hidden border border-grey-200">
                  <Image src={authorImage} alt={authorName || "Author"} fill className="object-cover" />
                </div>
              )}
              <span className="font-medium text-foreground">{authorName || "DigiiMark Team"}</span>
            </div>
            <div className="w-1 h-1 rounded-full bg-grey-300" />
            <span>
              {(() => {
                const d = new Date(date)
                return Number.isNaN(d.getTime())
                  ? "—"
                  : d.toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })
              })()}
            </span>
            {readTime && (
              <>
                <div className="w-1 h-1 rounded-full bg-grey-300" />
                <span>{readTime}</span>
              </>
            )}
          </div>
        </motion.div>

        {/* Featured image from `blogs.hero_image` */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="relative w-full aspect-[16/9] rounded-[2rem] overflow-hidden border border-grey-200 shadow-xl bg-grey-100"
        >
          {image ? (
            <Image
              src={image}
              alt={title}
              fill
              priority
              className="object-cover"
            />
          ) : (
            <div
              className="absolute inset-0 flex items-center justify-center text-grey-400 text-sm font-medium"
              aria-hidden
            >
              No cover image
            </div>
          )}
        </motion.div>
      </div>
    </section>
  )
}

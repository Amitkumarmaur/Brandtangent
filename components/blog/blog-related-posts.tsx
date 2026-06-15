"use client"

import Image from "next/image"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { motion } from "motion/react"
import type { RelatedBlogPostCard } from "@/lib/blog-related-by-category"

interface BlogRelatedPostsProps {
  items: RelatedBlogPostCard[]
}

export default function BlogRelatedPosts({ items }: BlogRelatedPostsProps) {
  if (!items.length) return null

  return (
    <section className="relative w-full py-16 md:py-20 bg-white border-t border-border overflow-hidden">
      <div className="w-full max-w-7xl mx-auto px-6 lg:px-8">
        <p className="micro-cap text-muted-foreground mb-4">Same topic</p>
        <h2 className="display-xl text-foreground mb-10 md:mb-12">Related articles</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {items.map((post, i) => (
            <motion.article
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.06 }}
              className="h-full"
            >
              <Link
                href={`/blog/${post.slug}`}
                className="group flex flex-col bg-white rounded-md overflow-hidden border border-border hover:border-[rgba(28,28,28,0.3)] transition-all duration-300 h-full"
              >
                <div className="relative w-full h-56 flex-shrink-0 overflow-hidden bg-muted">
                  {post.image_url ? (
                    <Image
                      src={post.image_url}
                      alt={post.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                  ) : (
                    <div className="absolute inset-0 bg-muted" aria-hidden />
                  )}
                  <div className="absolute top-4 left-4 z-10">
                    <span className="bg-[rgba(28,28,28,0.6)] backdrop-blur-sm text-primary-foreground text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wider border border-[rgba(255,255,255,0.15)]">
                      {post.categoryLabel}
                    </span>
                  </div>
                </div>
                <div className="px-6 pb-6 pt-4 flex flex-col flex-grow">
                  <h3 className="text-lg font-semibold text-foreground mb-3 line-clamp-2 leading-snug">
                    {post.title}
                  </h3>
                  {post.excerpt ? (
                    <p className="text-muted-foreground text-sm leading-relaxed line-clamp-3 mb-4 flex-grow">
                      {post.excerpt}
                    </p>
                  ) : null}
                  <span className="text-foreground font-medium text-sm flex items-center gap-2 group-hover:gap-3 transition-all mt-auto">
                    Read article
                    <ArrowRight className="w-4 h-4" />
                  </span>
                </div>
              </Link>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  )
}

"use client"

import Image from "next/image"
import Link from "next/link"
import { motion } from "framer-motion"
import type { RelatedBlogPostCard } from "@/lib/blog-related-by-category"

interface BlogRelatedPostsProps {
  items: RelatedBlogPostCard[]
}

export default function BlogRelatedPosts({ items }: BlogRelatedPostsProps) {
  if (!items.length) return null

  return (
    <section className="relative w-full py-16 md:py-20 bg-grey-100 border-t border-grey-200 overflow-hidden">
      <div className="w-full max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-2 h-2 rounded-full bg-ignite-orange shrink-0" />
          <span className="text-sm uppercase tracking-wider text-grey-600 font-medium">
            Same topic
          </span>
        </div>
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-semibold font-heading text-foreground mb-10 md:mb-12">
          Related articles
        </h2>

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
                className="group flex flex-col bg-white rounded-[2rem] overflow-hidden border border-grey-200 shadow-sm hover:shadow-md transition-shadow h-full"
              >
                <div className="relative w-full h-56 m-2 rounded-[1.5rem] overflow-hidden bg-grey-200 shrink-0">
                  {post.image_url ? (
                    <Image
                      src={post.image_url}
                      alt={post.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                  ) : (
                    <div className="absolute inset-0 bg-grey-200" aria-hidden />
                  )}
                  <div className="absolute top-4 left-4 z-10">
                    <span className="bg-foreground/50 backdrop-blur-md text-white border border-white/20 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                      {post.categoryLabel}
                    </span>
                  </div>
                </div>
                <div className="px-6 pb-6 pt-2 flex flex-col flex-grow">
                  <h3 className="heading-h3 text-foreground mb-3 group-hover:text-ignite-orange transition-colors line-clamp-2">
                    {post.title}
                  </h3>
                  {post.excerpt ? (
                    <p className="text-body text-grey-400 line-clamp-3 mb-4 flex-grow">
                      {post.excerpt}
                    </p>
                  ) : null}
                  <span className="text-foreground font-medium text-sm flex items-center gap-2 group-hover:gap-3 transition-all mt-auto">
                    Read article
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="text-ignite-orange"
                    >
                      <path d="M5 12h14" />
                      <path d="m12 5 7 7-7 7" />
                    </svg>
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

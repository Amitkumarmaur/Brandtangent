"use client"

import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import { motion } from "framer-motion"

interface BlogPostContentProps {
  content: string
}

export default function BlogPostContent({ content }: BlogPostContentProps) {
  const trimmed = content?.trim() ?? ""

  return (
    <section className="relative w-full py-16 md:py-20 bg-background overflow-hidden border-t border-grey-200">
      <div className="w-full max-w-3xl mx-auto px-6 lg:px-0 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="prose prose-lg prose-neutral max-w-none
           prose-headings:font-heading prose-headings:font-semibold prose-headings:text-foreground
           prose-h2:mt-12 prose-h2:mb-4 prose-h3:mt-8 prose-h3:mb-3
           prose-p:text-body prose-p:leading-relaxed prose-p:mb-6 prose-p:text-grey-600
           prose-strong:text-foreground prose-strong:font-bold
           prose-a:text-ignite-orange prose-a:no-underline hover:prose-a:underline
           prose-ul:text-grey-600 prose-ol:text-grey-600 prose-li:mb-2
           prose-blockquote:border-l-ignite-orange prose-blockquote:text-grey-600
           prose-th:bg-grey-100 prose-th:text-foreground prose-td:border-grey-200
           prose-img:rounded-2xl prose-img:border prose-img:border-grey-200
           "
        >
          {trimmed ? (
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{trimmed}</ReactMarkdown>
          ) : (
            <p className="text-body text-grey-500 not-prose">
              Body content is not available for this post yet.
            </p>
          )}
        </motion.div>
      </div>
    </section>
  )
}

"use client"

import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import { motion } from "motion/react"

interface BlogPostContentProps {
  content: string
}

export default function BlogPostContent({ content }: BlogPostContentProps) {
  const trimmed = content?.trim() ?? ""

  return (
    <section className="relative w-full py-16 md:py-20 bg-white overflow-hidden border-t border-border">
      <div className="w-full max-w-3xl mx-auto px-6 lg:px-0">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="prose prose-lg max-w-none
           prose-headings:font-sans prose-headings:font-semibold prose-headings:text-foreground prose-headings:tracking-tight
           prose-h2:mt-12 prose-h2:mb-4 prose-h3:mt-8 prose-h3:mb-3
           prose-p:leading-relaxed prose-p:mb-6 prose-p:text-muted-foreground
           prose-strong:text-foreground prose-strong:font-semibold
           prose-a:text-foreground prose-a:underline prose-a:decoration-[rgba(28,28,28,0.3)] hover:prose-a:decoration-primary
           prose-ul:text-muted-foreground prose-ol:text-muted-foreground prose-li:mb-2
           prose-blockquote:border-l-border prose-blockquote:text-muted-foreground prose-blockquote:not-italic
           prose-th:bg-muted prose-th:text-foreground prose-td:border-border
           prose-img:rounded-md prose-img:border prose-img:border-border
           "
        >
          {trimmed ? (
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{trimmed}</ReactMarkdown>
          ) : (
            <p className="text-muted-foreground not-prose">
              Body content is not available for this post yet.
            </p>
          )}
        </motion.div>
      </div>
    </section>
  )
}

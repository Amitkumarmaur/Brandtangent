"use client"

import * as React from "react"
import Image from "next/image"
import Link from "next/link"
import { cva, type VariantProps } from "class-variance-authority"
import { motion } from "motion/react"
import { ArrowRight } from "lucide-react"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import type { BlogPost } from "@/lib/supabase"

const cardVariants = cva(
  "group relative flex flex-col overflow-hidden rounded-md border border-border bg-card text-card-foreground shadow-[var(--shadow-1)] transition-all duration-300 ease-out hover:border-accent-orange/30 hover:shadow-[var(--shadow-accent-orange-soft)]",
  {
    variants: {
      variant: {
        default: "h-full",
        featured: "lg:flex-row lg:min-h-[420px]",
        compact: "h-full",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface BlogPostCardProps
  extends Omit<React.ComponentProps<typeof motion.article>, "children">,
    VariantProps<typeof cardVariants> {
  post: BlogPost
  categoryLabel: string
  index?: number
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  })
}

export function BlogPostCard({
  post,
  categoryLabel,
  variant = "default",
  className,
  index = 0,
  ...props
}: BlogPostCardProps) {
  const isFeatured = variant === "featured"
  const isCompact = variant === "compact"

  return (
    <motion.article
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{
        duration: 0.5,
        delay: index * 0.06,
        ease: [0.22, 1, 0.36, 1],
      }}
      whileHover={{ y: -6 }}
      className={cn(cardVariants({ variant }), className)}
      {...props}
    >
      <Link
        href={`/blog/${post.slug}`}
        className="absolute inset-0 z-20 rounded-md outline-none focus-visible:ring-2 focus-visible:ring-primary"
        aria-label={`Read ${post.title}`}
      />

      <div
        className={cn(
          "relative z-0 flex h-full w-full flex-col",
          isFeatured && "lg:flex-row"
        )}
      >
        <div
          className={cn(
            "relative overflow-hidden bg-secondary",
            isFeatured
              ? "aspect-[16/10] w-full lg:aspect-auto lg:w-[44%] lg:min-h-[420px]"
              : isCompact
                ? "aspect-[16/10] w-full"
                : "aspect-[16/10] w-full"
          )}
        >
          <Image
            src={post.image_url}
            alt={post.title}
            fill
            sizes={
              isFeatured
                ? "(max-width: 1024px) 100vw, 520px"
                : "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            }
            className="object-cover transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-navy/50 via-transparent to-transparent opacity-80" />
          <span className="absolute left-4 top-4 z-10 inline-flex items-center rounded-full bg-accent-orange px-3 py-1 text-[10px] font-semibold uppercase tracking-widest text-white shadow-lg">
            {categoryLabel}
          </span>
        </div>

        <div
          className={cn(
            "flex flex-1 flex-col justify-between",
            isFeatured ? "p-8 md:p-10 lg:p-12" : "p-6 md:p-7"
          )}
        >
          <div>
            <div className="mb-4 flex flex-wrap items-center gap-3 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
              <span>{formatDate(post.published_at)}</span>
              {post.read_time ? (
                <>
                  <span className="h-1 w-1 rounded-full bg-border" aria-hidden />
                  <span>{post.read_time}</span>
                </>
              ) : null}
            </div>

            {isFeatured ? (
              <h2 className="display-lg mb-4 text-foreground">
                <span className="bg-gradient-to-r from-primary to-primary bg-[length:0%_2px] bg-left-bottom bg-no-repeat transition-[background-size] duration-500 group-hover:bg-[length:100%_2px]">
                  {post.title}
                </span>
              </h2>
            ) : (
              <h3 className="mb-3 text-lg font-semibold leading-snug text-foreground md:text-xl">
                <span className="bg-gradient-to-r from-primary to-primary bg-[length:0%_2px] bg-left-bottom bg-no-repeat transition-[background-size] duration-500 group-hover:bg-[length:100%_2px]">
                  {post.title}
                </span>
              </h3>
            )}

            <p
              className={cn(
                "text-muted-foreground leading-relaxed",
                isFeatured ? "mb-8 line-clamp-3 text-base" : "mb-6 line-clamp-2 text-sm"
              )}
            >
              {post.excerpt}
            </p>
          </div>

          <div className={cn("mt-auto", isFeatured ? "pt-2" : "border-t border-border pt-4")}>
            {isFeatured ? (
              <Button size="lg" className="pointer-events-none relative z-0 w-fit">
                Read the full article
                <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
              </Button>
            ) : (
              <span className="inline-flex items-center gap-2 text-sm font-semibold text-primary transition-all group-hover:gap-3">
                Read article
                <ArrowRight className="h-4 w-4" />
              </span>
            )}
          </div>
        </div>
      </div>
    </motion.article>
  )
}

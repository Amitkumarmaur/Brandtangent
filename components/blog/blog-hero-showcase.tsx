"use client"

import Link from "next/link"
import Image from "next/image"
import { motion } from "motion/react"
import { ArrowUpRight, BookOpen } from "lucide-react"

import { Card } from "@/components/ui/card"
import { TiltCard } from "@/components/motion/tilt-card"
import type { BlogPost } from "@/lib/supabase"

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=800"

function BentoCard({
  post,
  category,
  className,
  floatDelay = 0,
  large = false,
}: {
  post: BlogPost
  category: string
  className?: string
  floatDelay?: number
  large?: boolean
}) {
  return (
    <motion.div
      animate={{ y: [0, large ? -10 : -6, 0] }}
      transition={{
        duration: 4 + floatDelay,
        repeat: Number.POSITIVE_INFINITY,
        ease: "easeInOut",
        delay: floatDelay,
      }}
      className={className}
    >
      <Link
        href={`/blog/${post.slug}`}
        className="group block h-full overflow-hidden rounded-md outline-none focus-visible:ring-2 focus-visible:ring-primary"
      >
        <div className="relative h-full min-h-[140px] overflow-hidden rounded-md border border-border/50 shadow-[var(--shadow-2)]">
          <Image
            src={post.image_url || FALLBACK_IMAGE}
            alt={post.title}
            fill
            sizes={large ? "(max-width: 768px) 100vw, 400px" : "200px"}
            className="object-cover transition-transform duration-700 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-navy/90 via-navy/35 to-transparent" />
          <div className="absolute inset-0 flex flex-col justify-end p-4">
            <span className="pill-tag mb-2 w-fit border-0 bg-primary/90 text-[10px] text-white">
              {category}
            </span>
            <p
              className={`font-light leading-tight text-white ${large ? "text-lg" : "text-sm line-clamp-2"}`}
            >
              {post.title}
            </p>
            <span className="mt-2 flex items-center gap-1 text-xs text-white/70 opacity-0 transition-opacity group-hover:opacity-100">
              Read article
              <ArrowUpRight className="h-3 w-3" />
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
  )
}

export default function BlogHeroShowcase({ posts }: { posts: BlogPost[] }) {
  if (posts.length === 0) {
    return (
      <TiltCard intensity={6} className="w-full">
        <Card className="glass relative flex h-[320px] items-center justify-center overflow-hidden border-border/50 p-8 shadow-[var(--shadow-glass)] sm:h-[380px]">
          <div className="text-center">
            <BookOpen className="mx-auto mb-3 h-8 w-8 text-primary" strokeWidth={1.5} />
            <p className="text-subtitle">Fresh articles landing soon.</p>
          </div>
        </Card>
      </TiltCard>
    )
  }

  const items = posts.slice(0, 3)
  const [featured, second, third] = items
  const categoryFor = (post: BlogPost) => post.category || "Insight"

  return (
    <TiltCard intensity={8} className="w-full">
      <Card className="glass relative overflow-hidden border-border/50 p-4 shadow-[var(--shadow-glass)]">
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-primary/8 via-transparent to-[rgba(249,107,238,0.06)]" />

        <motion.div
          className="pointer-events-none absolute inset-0 rounded-md"
          style={{
            background:
              "linear-gradient(90deg, transparent, var(--primary), transparent)",
            opacity: 0.18,
          }}
          animate={{ rotate: 360 }}
          transition={{
            duration: 14,
            repeat: Number.POSITIVE_INFINITY,
            ease: "linear",
          }}
          aria-hidden
        />

        <div className="relative z-10">
          <div className="mb-4 flex items-center justify-between px-1">
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 animate-pulse rounded-full bg-primary" />
              <span className="text-caption text-muted-foreground">Latest reads</span>
            </div>
            <span className="text-caption flex items-center gap-1 text-primary">
              <BookOpen className="h-3 w-3" />
              Editor&apos;s picks
            </span>
          </div>

          {items.length === 1 ? (
            <BentoCard
              post={featured}
              category={categoryFor(featured)}
              large
              className="h-[320px] sm:h-[380px]"
            />
          ) : items.length === 2 ? (
            <div className="grid h-[320px] grid-cols-2 gap-3 sm:h-[380px]">
              <BentoCard post={featured} category={categoryFor(featured)} large className="h-full" />
              <BentoCard post={second} category={categoryFor(second)} floatDelay={0.5} className="h-full" />
            </div>
          ) : (
            <div className="grid h-[320px] grid-cols-2 grid-rows-2 gap-3 sm:h-[380px]">
              <BentoCard
                post={featured}
                category={categoryFor(featured)}
                large
                floatDelay={0}
                className="col-span-1 row-span-2"
              />
              <BentoCard
                post={second!}
                category={categoryFor(second!)}
                floatDelay={0.5}
                className="col-span-1 row-span-1"
              />
              <BentoCard
                post={third!}
                category={categoryFor(third!)}
                floatDelay={1}
                className="col-span-1 row-span-1"
              />
            </div>
          )}

          <motion.div
            className="glass-dark absolute -bottom-3 -right-2 rounded-lg border border-white/10 px-3 py-2 shadow-lg"
            animate={{ y: [0, -6, 0] }}
            transition={{
              duration: 3.5,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
            }}
          >
            <p className="text-[10px] uppercase tracking-wider text-white/50">New weekly</p>
            <p className="tnum text-lg font-light text-white">Insights</p>
          </motion.div>
        </div>
      </Card>
    </TiltCard>
  )
}

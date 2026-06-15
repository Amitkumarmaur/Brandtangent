"use client"

import Link from "next/link"
import Image from "next/image"
import { motion } from "motion/react"
import { ArrowUpRight, TrendingUp } from "lucide-react"

import { Card } from "@/components/ui/card"
import { TiltCard } from "@/components/motion/tilt-card"
import type { CaseStudyListItem } from "@/lib/content-categories"

const PLACEHOLDER_STUDIES: CaseStudyListItem[] = [
  {
    id: "p1",
    slug: "techflow",
    title: "AI-Powered SaaS Dashboard",
    excerpt: "Full-stack product from zero to launch",
    image_url:
      "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=800",
    industry: "SaaS",
    industry_slug: "saas",
    service_name: "Web Development",
    service_slug: "web-development",
  },
  {
    id: "p2",
    slug: "retailpro",
    title: "E-Commerce Revenue Jump",
    excerpt: "218% growth after platform rebuild",
    image_url:
      "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&q=80&w=600",
    industry: "Retail",
    industry_slug: "retail",
    service_name: "Growth",
    service_slug: "growth",
  },
  {
    id: "p3",
    slug: "fintech",
    title: "FinTech Brand System",
    excerpt: "Identity that scales across markets",
    image_url:
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=600",
    industry: "FinTech",
    industry_slug: "fintech",
    service_name: "Brand Strategy",
    service_slug: "brand",
  },
]

function BentoCard({
  study,
  className,
  floatDelay = 0,
  large = false,
}: {
  study: CaseStudyListItem
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
        href={`/case-studies/${study.slug}`}
        className="group block h-full rounded-md overflow-hidden outline-none focus-visible:ring-2 focus-visible:ring-primary"
      >
        <div className="relative h-full min-h-[140px] overflow-hidden border border-border/50 rounded-md shadow-[var(--shadow-2)]">
          <Image
            src={study.image_url}
            alt={study.title}
            fill
            sizes={large ? "(max-width: 768px) 100vw, 400px" : "200px"}
            className="object-cover transition-transform duration-700 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-navy/90 via-navy/30 to-transparent" />
          <div className="absolute inset-0 p-4 flex flex-col justify-end">
            <span className="pill-tag bg-primary/90 text-white border-0 text-[10px] mb-2 w-fit">
              {study.industry}
            </span>
            <p
              className={`font-light text-white leading-tight ${large ? "text-lg" : "text-sm"}`}
            >
              {study.title}
            </p>
            <span className="mt-2 flex items-center gap-1 text-xs text-white/70 opacity-0 group-hover:opacity-100 transition-opacity">
              View study
              <ArrowUpRight className="w-3 h-3" />
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
  )
}

export default function CaseStudiesHeroShowcase({
  studies,
}: {
  studies: CaseStudyListItem[]
}) {
  const items = studies.length >= 3 ? studies.slice(0, 3) : PLACEHOLDER_STUDIES
  const [featured, second, third] = items

  return (
    <TiltCard intensity={8} className="w-full">
      <Card className="relative overflow-hidden glass border-border/50 p-4 shadow-[var(--shadow-glass)]">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/8 via-transparent to-[rgba(249,107,238,0.06)] pointer-events-none" />

        <motion.div
          className="absolute inset-0 rounded-md pointer-events-none"
          style={{
            background:
              "linear-gradient(90deg, transparent, var(--primary), transparent)",
            opacity: 0.2,
          }}
          animate={{ rotate: 360 }}
          transition={{
            duration: 12,
            repeat: Number.POSITIVE_INFINITY,
            ease: "linear",
          }}
          aria-hidden
        />

        <div className="relative z-10">
          <div className="flex items-center justify-between mb-4 px-1">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              <span className="text-caption text-muted-foreground">
                Live portfolio
              </span>
            </div>
            <span className="text-caption text-primary flex items-center gap-1">
              <TrendingUp className="w-3 h-3" />
              Featured work
            </span>
          </div>

          <div className="grid grid-cols-2 grid-rows-2 gap-3 h-[320px] sm:h-[380px]">
            <BentoCard
              study={featured}
              large
              floatDelay={0}
              className="col-span-1 row-span-2"
            />
            <BentoCard study={second} floatDelay={0.5} className="col-span-1 row-span-1" />
            <BentoCard study={third} floatDelay={1} className="col-span-1 row-span-1" />
          </div>

          <motion.div
            className="absolute -bottom-3 -right-2 glass-dark rounded-lg border border-white/10 px-3 py-2 shadow-lg"
            animate={{ y: [0, -6, 0] }}
            transition={{
              duration: 3.5,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
            }}
          >
            <p className="text-[10px] text-white/50 uppercase tracking-wider">
              Avg. ROI
            </p>
            <p className="text-lg text-white font-light tnum">+218%</p>
          </motion.div>
        </div>
      </Card>
    </TiltCard>
  )
}

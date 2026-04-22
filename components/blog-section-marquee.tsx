"use client"

import { motion } from "framer-motion"
import Image from "next/image"
import Link from "next/link"

export interface BlogMarqueeItem {
  id: string
  slug: string
  title: string
  category: string
  image: string
  date: string
}

function BlogCard({ item }: { item: BlogMarqueeItem }) {
  return (
    <Link
      href={`/blog/${item.slug}`}
      className="w-[85vw] sm:w-[320px] md:w-[400px] h-[300px] md:h-[360px] flex-shrink-0 rounded-[2rem] overflow-hidden group cursor-pointer relative shadow-xl border border-grey-200 block"
    >
      <Image
        src={item.image}
        alt={item.title}
        fill
        sizes="(max-width: 768px) 85vw, 400px"
        className="object-cover group-hover:scale-105 transition-transform duration-700 pointer-events-none"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent flex flex-col justify-end p-6 opacity-90 group-hover:opacity-100 transition-opacity duration-300">
        <div className="flex items-center gap-3 mb-4">
          <span className="bg-ignite-orange text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
            {item.category}
          </span>
          <span className="text-grey-200 text-sm font-medium">{item.date}</span>
        </div>
        <h3 className="font-heading text-white text-xl md:text-2xl font-semibold tracking-tight leading-snug group-hover:-translate-y-1 transition-transform duration-300">
          {item.title}
        </h3>
      </div>
    </Link>
  )
}

interface BlogSectionMarqueeProps {
  items: BlogMarqueeItem[]
}

export default function BlogSectionMarquee({ items }: BlogSectionMarqueeProps) {
  if (!items.length) return null

  // Duplicate list so translateX(-50%) loops seamlessly.
  return (
    <div className="relative w-full flex overflow-hidden pt-4 pb-8">
      <div className="absolute top-0 bottom-0 left-0 w-12 md:w-32 bg-gradient-to-r from-grey-100 to-transparent z-10 pointer-events-none" />
      <div className="absolute top-0 bottom-0 right-0 w-12 md:w-32 bg-gradient-to-l from-grey-100 to-transparent z-10 pointer-events-none" />

      <motion.div
        className="flex w-max"
        animate={{ x: ["0%", "-50%"] }}
        transition={{ repeat: Infinity, ease: "linear", duration: 45 }}
      >
        <div className="flex gap-6 md:gap-8 px-3 md:px-4">
          {items.map((item) => (
            <BlogCard key={`a-${item.id}`} item={item} />
          ))}
        </div>
        <div className="flex gap-6 md:gap-8 px-3 md:px-4" aria-hidden>
          {items.map((item) => (
            <BlogCard key={`b-${item.id}`} item={item} />
          ))}
        </div>
      </motion.div>
    </div>
  )
}

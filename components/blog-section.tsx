"use client"

import { motion } from "framer-motion"
import Image from "next/image"

const blogPosts = [
  { id: 1, title: "The Future of Cloud Infrastructure", category: "Technology", image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=800&h=800", date: "Oct 12, 2026" },
  { id: 2, title: "Mastering Real Estate Tech", category: "Industry", image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=800&h=800", date: "Oct 10, 2026" },
  { id: 3, title: "Scaling Startups with React", category: "Development", image: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&q=80&w=800&h=800", date: "Oct 8, 2026" },
  { id: 4, title: "AI Integration in 2026", category: "AI", image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80&w=800&h=800", date: "Oct 5, 2026" },
  { id: 5, title: "Designing for the Metaverse", category: "Design", image: "https://images.unsplash.com/photo-1614729939124-032f0b5609ce?auto=format&fit=crop&q=80&w=800&h=800", date: "Oct 1, 2026" },
]

function BlogCard({ title, image, date, category }: { title: string, image: string, date: string, category: string }) {
  return (
    <div className="w-[85vw] sm:w-[320px] md:w-[400px] h-[300px] md:h-[360px] flex-shrink-0 rounded-[2rem] overflow-hidden group cursor-pointer relative shadow-xl border border-grey-200">
      <Image src={image} alt={title} fill sizes="(max-width: 768px) 85vw, 400px" className="object-cover group-hover:scale-105 transition-transform duration-700 pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent flex flex-col justify-end p-6 opacity-90 group-hover:opacity-100 transition-opacity duration-300">
        <div className="flex items-center gap-3 mb-4">
          <span className="bg-ignite-orange text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">{category}</span>
          <span className="text-grey-200 text-sm font-medium">{date}</span>
        </div>
        <h3 className="font-heading text-white text-xl md:text-2xl font-semibold tracking-tight leading-snug group-hover:-translate-y-1 transition-transform duration-300">{title}</h3>
      </div>
    </div>
  )
}

export default function BlogSection() {
  return (
    <section className="bg-grey-100 relative py-16 md:py-20 overflow-hidden border-t border-grey-200">
      
      {/* Header Section */}
      <div className="w-full max-w-7xl mx-auto px-6 lg:px-8 relative z-10 mb-8 md:mb-12">
        <div className="flex flex-col xl:flex-row xl:items-end justify-between gap-6 md:gap-8">
          
          <div className="flex-1 xl:flex-shrink-0 pr-4">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-2 h-2 rounded-full bg-ignite-orange" />
              <span className="font-heading text-ignite-orange font-medium tracking-wider uppercase text-sm">Our Blog</span>
            </div>
            <h2 className="font-heading text-3xl md:text-4xl lg:text-5xl font-semibold text-foreground tracking-tight leading-tight max-w-3xl">
              What's Happening in <br className="hidden md:block"/>
              The Industry?
            </h2>
          </div>

          <div className="flex justify-start xl:justify-end w-full xl:w-auto mt-2 md:mt-0 xl:mb-2">
            <button className="bg-foreground hover:bg-grey-800 transition-colors text-white font-medium tracking-wide text-sm md:text-base py-3 px-8 rounded-full shadow-lg">
              View All Blogs
            </button>
          </div>

        </div>
      </div>

      {/* Blog Cards Horizontal Infinite Scroll */}
      <div className="relative w-full flex overflow-hidden pt-4 pb-8">
        {/* Gradients for smooth fade at edges */}
        <div className="absolute top-0 bottom-0 left-0 w-12 md:w-32 bg-gradient-to-r from-grey-100 to-transparent z-10 pointer-events-none" />
        <div className="absolute top-0 bottom-0 right-0 w-12 md:w-32 bg-gradient-to-l from-grey-100 to-transparent z-10 pointer-events-none" />
        
        {/* Right-to-Left Marquee */}
        <motion.div
          className="flex w-max"
          animate={{ x: ["0%", "-50%"] }}
          transition={{ repeat: Infinity, ease: "linear", duration: 45 }}
        >
          <div className="flex gap-6 md:gap-8 px-3 md:px-4">
            {blogPosts.map((post, idx) => <BlogCard key={`blog1-${idx}`} {...post} />)}
          </div>
          <div className="flex gap-6 md:gap-8 px-3 md:px-4">
            {blogPosts.map((post, idx) => <BlogCard key={`blog2-${idx}`} {...post} />)}
          </div>
        </motion.div>
      </div>

    </section>
  )
}

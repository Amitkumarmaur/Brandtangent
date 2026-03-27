"use client"

import { useRef } from "react"
import { motion, useInView } from "framer-motion"
import Image from "next/image"
import { ArrowUpRight } from "lucide-react"

interface PortfolioItem {
  title: string
  category: string
  result: string
  image: string
}

interface ServicePortfolioProps {
  badge: string
  title: string
  subtitle: string
  items: PortfolioItem[]
}

export default function ServicePortfolio({ badge, title, subtitle, items }: ServicePortfolioProps) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  return (
    <section ref={ref} className="relative w-full py-16 md:py-24 bg-foreground overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="w-2 h-2 rounded-full bg-ignite-orange" />
            <span className="text-ignite-orange font-semibold tracking-widest uppercase text-xs">{badge}</span>
          </div>
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">{title}</h2>
          <p className="text-lg text-white/50 max-w-2xl mx-auto">{subtitle}</p>
        </motion.div>

        {/* Portfolio Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {items.map((item, index) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 40 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group relative rounded-2xl overflow-hidden cursor-pointer bg-grey-800 border border-white/5 hover:border-ignite-orange/20 transition-all duration-300"
            >
              {/* Image */}
              <div className="relative w-full h-[240px] md:h-[280px] overflow-hidden">
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-grey-800 via-grey-800/40 to-transparent" />
              </div>

              {/* Content */}
              <div className="relative p-6 md:p-8 -mt-8">
                <span className="inline-block text-xs font-semibold text-ignite-orange uppercase tracking-wider mb-2">
                  {item.category}
                </span>
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="text-xl md:text-2xl font-bold text-white mb-2 group-hover:text-ignite-orange transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-white/50 text-sm">{item.result}</p>
                  </div>
                  <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center flex-shrink-0 group-hover:bg-ignite-orange transition-colors">
                    <ArrowUpRight className="w-5 h-5 text-white/60 group-hover:text-white transition-colors" />
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

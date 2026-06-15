"use client"

import { useRef } from "react"
import { motion, useInView } from "motion/react"
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
    <section ref={ref} className="relative w-full py-16 md:py-20 bg-white overflow-hidden border-t border-border">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <p className="micro-cap text-muted-foreground mb-4">{badge}</p>
          <h2 className="display-xl text-foreground mb-4">{title}</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">{subtitle}</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {items.map((item, index) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 40 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group relative rounded-md overflow-hidden cursor-pointer bg-white border border-border hover:border-[rgba(28,28,28,0.3)] transition-all duration-300"
            >
              <div className="relative w-full h-[240px] md:h-[280px] overflow-hidden">
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[rgba(28,28,28,0.6)] via-[rgba(28,28,28,0.1)] to-transparent" />
              </div>

              <div className="relative p-6 md:p-8 -mt-8">
                <span className="inline-block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                  {item.category}
                </span>
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="text-xl md:text-2xl font-semibold text-foreground mb-2">
                      {item.title}
                    </h3>
                    <p className="text-muted-foreground text-sm">{item.result}</p>
                  </div>
                  <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center flex-shrink-0 group-hover:bg-primary transition-colors">
                    <ArrowUpRight className="w-5 h-5 text-muted-foreground group-hover:text-primary-foreground transition-colors" />
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

"use client"

import { motion } from "motion/react"
import { Factory, Briefcase, Building2, Globe2 } from "lucide-react"

interface CaseStudyOverviewProps {
  industry?: string | null
  serviceName?: string | null
  clientName?: string | null
  clientWebsite?: string | null
}

export default function CaseStudyOverview({
  industry,
  serviceName,
  clientName,
  clientWebsite,
}: CaseStudyOverviewProps) {
  const items = [
    { label: "Industry", value: industry, icon: Factory },
    { label: "Service", value: serviceName, icon: Briefcase },
    { label: "Client", value: clientName, icon: Building2 },
    ...(clientWebsite
      ? [{ label: "Website", value: clientWebsite.replace(/^https?:\/\//, ""), icon: Globe2 }]
      : []),
  ].filter((item) => item.value)

  if (items.length === 0) return null

  const desktopColsClass =
    items.length === 1
      ? "md:grid-cols-1"
      : items.length === 2
        ? "md:grid-cols-2"
        : items.length === 3
          ? "md:grid-cols-3"
          : "md:grid-cols-4"

  const mobileColsClass = items.length === 1 ? "grid-cols-1" : "grid-cols-2"

  return (
    <section className="w-full bg-white border-t border-border relative z-10">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className={`grid ${mobileColsClass} ${desktopColsClass} divide-x divide-border`}
        >
          {items.map((item, i) => {
            const Icon = item.icon
            return (
              <div key={i} className="flex flex-col gap-2 py-8 px-6 first:pl-0 last:pr-0">
                <div className="flex items-center gap-2">
                  <Icon className="w-3.5 h-3.5 text-muted-foreground" />
                  <span className="text-[rgba(28,28,28,0.4)] text-[10px] font-semibold uppercase tracking-widest">
                    {item.label}
                  </span>
                </div>
                <span className="text-base md:text-lg font-semibold text-foreground">
                  {item.value}
                </span>
              </div>
            )
          })}
        </motion.div>
      </div>
    </section>
  )
}

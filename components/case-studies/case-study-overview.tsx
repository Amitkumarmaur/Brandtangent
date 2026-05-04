"use client"

import { motion } from "framer-motion"
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

  // Tailwind needs literal class names; pick the right one based on item count
  // so we don't render empty grid columns when only 1–3 fields exist in Supabase.
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
    <section className="w-full bg-foreground border-t border-white/10 relative z-10">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className={`grid ${mobileColsClass} ${desktopColsClass} divide-x divide-white/10`}
        >
          {items.map((item, i) => {
            const Icon = item.icon
            return (
              <div key={i} className="flex flex-col gap-2 py-8 px-6 first:pl-0 last:pr-0">
                <div className="flex items-center gap-2">
                  <Icon className="w-3.5 h-3.5 text-ignite-orange" />
                  <span className="text-white/30 text-[10px] font-bold uppercase tracking-widest">
                    {item.label}
                  </span>
                </div>
                <span className="text-base md:text-lg font-heading font-semibold text-white">
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

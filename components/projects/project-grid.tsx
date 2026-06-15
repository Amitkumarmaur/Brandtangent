"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "motion/react"
import ProjectCard from "./project-card"

const industries = ["All", "Ecommerce", "Fintech", "Real Estate", "Healthcare", "Education"]
const services = ["All", "Web Design", "Development", "UI/UX", "Mobile App"]

const sampleProjects = [
  {
    title: "Mighty Buildings â€” Sustainable 3D Printed Houses",
    industry: "Real Estate",
    year: "2024",
    image: "/images/project-mighty.png",
    tags: ["Manufacturing", "Real Estate", "Sustainability"],
    service: "Web Design"
  },
  {
    title: "NexPay â€” Next-Gen Decentralized Payments",
    industry: "Fintech",
    year: "2023",
    image: "/images/project-nexpay.png",
    tags: ["Fintech", "Crypto", "App Design"],
    service: "Development"
  },
  {
    title: "E-Store Pro â€” Modern Shopping Experience",
    industry: "Ecommerce",
    year: "2024",
    image: "/images/project-estore.png",
    tags: ["Ecommerce", "Next.js", "Retail"],
    service: "Development"
  }
]

export default function ProjectGrid() {
  const [activeIndustry, setActiveIndustry] = useState("All")
  const [activeService, setActiveService] = useState("All")

  const filteredProjects = sampleProjects.filter(project => {
    const industryMatch = activeIndustry === "All" || project.industry === activeIndustry
    const serviceMatch = activeService === "All" || project.service === activeService
    return industryMatch && serviceMatch
  })

  return (
    <div className="max-w-[1200px] mx-auto px-6 lg:px-8 py-16 bg-white">
      <div className="flex flex-col lg:flex-row gap-12 lg:gap-16">

        {/* Sidebar filters */}
        <aside className="lg:w-56 shrink-0">
          <div className="lg:sticky lg:top-32 space-y-10">

            <div>
              <p className="micro-cap text-muted-foreground mb-5">Industries</p>
              <ul className="space-y-2">
                {industries.map(industry => (
                  <li key={industry}>
                    <button
                      onClick={() => setActiveIndustry(industry)}
                      className={`text-[14px] font-normal transition-colors duration-200 hover:text-accent-orange ${
                        activeIndustry === industry ? "text-accent-orange" : "text-muted-foreground"
                      }`}
                    >
                      {industry}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <p className="micro-cap text-muted-foreground mb-5">Services</p>
              <ul className="space-y-2">
                {services.map(service => (
                  <li key={service}>
                    <button
                      onClick={() => setActiveService(service)}
                      className={`text-[14px] font-normal transition-colors duration-200 hover:text-accent-orange ${
                        activeService === service ? "text-accent-orange" : "text-muted-foreground"
                      }`}
                    >
                      {service}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            <div className="pt-6 border-t border-border">
              <span className="text-muted-foreground text-xs font-normal font-mono">
                {filteredProjects.length} / {sampleProjects.length} projects
              </span>
            </div>
          </div>
        </aside>

        {/* Project list */}
        <div className="flex-1">
          <AnimatePresence mode="popLayout">
            {filteredProjects.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-10">
                {filteredProjects.map((project, index) => (
                  <ProjectCard
                    key={project.title}
                    project={project}
                    index={index}
                  />
                ))}
              </div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="h-[40vh] flex items-center justify-center text-muted-foreground font-normal tracking-widest uppercase text-sm border border-dashed border-border rounded-md"
              >
                No projects found for this selection
              </motion.div>
            )}
          </AnimatePresence>
        </div>

      </div>
    </div>
  )
}

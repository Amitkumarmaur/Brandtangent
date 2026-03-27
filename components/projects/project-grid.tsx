"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import ProjectCard from "./project-card"

const industries = ["All Status", "Ecommerce", "Fintech", "Real Estate", "Healthcare", "Education"]
const services = ["All Services", "Web Design", "Development", "UI/UX", "Mobile App"]

const sampleProjects = [
  {
    title: "Mighty Buildings — Sustainable 3D Printed Houses",
    industry: "Real Estate",
    year: "2024",
    image: "/images/project-mighty.png",
    tags: ["Manufacturing", "Real Estate", "Sustainability"],
    service: "Web Design"
  },
  {
    title: "NexPay — Next-Gen Decentralized Payments",
    industry: "Fintech",
    year: "2023",
    image: "/images/project-nexpay.png",
    tags: ["Fintech", "Crypto", "App Design"],
    service: "Development"
  },
  {
    title: "E-Store Pro — Modern Shopping Experience",
    industry: "Ecommerce",
    year: "2024",
    image: "/images/project-estore.png",
    tags: ["Ecommerce", "Next.js", "Retail"],
    service: "Development"
  }
]

export default function ProjectGrid() {
  const [activeIndustry, setActiveIndustry] = useState("All Status")
  const [activeService, setActiveService] = useState("All Services")

  const filteredProjects = sampleProjects.filter(project => {
    const industryMatch = activeIndustry === "All Status" || project.industry === activeIndustry
    const serviceMatch = activeService === "All Services" || project.service === activeService
    return industryMatch && serviceMatch
  })

  return (
    <div className="max-w-[1440px] mx-auto px-4 md:px-8 py-20 bg-black">
      <div className="flex flex-col lg:flex-row gap-16">
        
        {/* Sticky Sidebar (Filters) */}
        <aside className="lg:w-1/4">
          <div className="lg:sticky lg:top-32 space-y-12">
            
            {/* Industries Filter */}
            <div>
              <h4 className="text-white/20 text-xs font-bold tracking-[0.3em] uppercase mb-8">Industries</h4>
              <ul className="space-y-4">
                {industries.map(industry => (
                  <li key={industry}>
                    <button
                      onClick={() => setActiveIndustry(industry)}
                      className={`text-sm md:text-base font-semibold transition-all duration-300 hover:translate-x-2 ${activeIndustry === industry ? 'text-ignite-orange' : 'text-white/40 hover:text-white'}`}
                    >
                      {industry}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Services Filter */}
            <div>
              <h4 className="text-white/20 text-xs font-bold tracking-[0.3em] uppercase mb-8">Services</h4>
              <ul className="space-y-4">
                {services.map(service => (
                  <li key={service}>
                    <button
                      onClick={() => setActiveService(service)}
                      className={`text-sm md:text-base font-semibold transition-all duration-300 hover:translate-x-2 ${activeService === service ? 'text-ignite-orange' : 'text-white/40 hover:text-white'}`}
                    >
                      {service}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Total Count */}
            <div className="pt-8 border-t border-white/5">
                <span className="text-white/10 text-xs font-mono">SHOWING {filteredProjects.length} OF {sampleProjects.length} PROJECT</span>
            </div>
          </div>
        </aside>

        {/* Project List */}
        <div className="lg:w-3/4">
          <AnimatePresence mode="popLayout">
            {filteredProjects.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-12">
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
                    className="h-[60vh] flex items-center justify-center text-white/30 font-mono tracking-widest uppercase text-sm border border-dashed border-white/10 rounded-3xl"
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

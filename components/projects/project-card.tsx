"use client"

import { motion } from "motion/react"
import Image from "next/image"

interface Project {
  title: string
  industry: string
  year: string
  image: string
  tags: string[]
}

interface ProjectCardProps {
  project: Project
  index: number
}

export default function ProjectCard({ project, index }: ProjectCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.08, ease: [0.22, 1, 0.36, 1] }}
      className="group relative w-full"
    >
      <div className="relative aspect-[16/10] w-full overflow-hidden rounded-md border border-border-blue bg-light-gray-blue shadow-sm group-hover:shadow-lg transition-shadow duration-300">
        <Image
          src={project.image}
          alt={project.title}
          fill
          className="object-cover object-center transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[rgba(13,37,61,0.88)] via-[rgba(13,37,61,0.20)] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex flex-col justify-end p-6">
          <span className="text-accent-orange/60 text-[11px] font-normal tracking-wide uppercase mb-1.5">View case study</span>
          <h3 className="text-white text-[17px] font-normal">{project.title}</h3>
        </div>
      </div>

      <div className="mt-4 flex flex-col gap-1.5">
        <div className="flex flex-wrap gap-2">
          {project.tags.map(tag => (
            <span key={tag} className="text-[10px] font-normal tracking-[0.15em] text-slate-gray uppercase">
              {tag}
            </span>
          ))}
        </div>
        <div className="flex items-center justify-between">
          <h3 className="text-[15px] font-normal text-foreground group-hover:text-sky-blue transition-colors">
            {project.title}
          </h3>
          <span className="text-slate-gray/40 text-sm font-normal font-mono shrink-0 ml-3">{project.year}</span>
        </div>
      </div>
    </motion.div>
  )
}

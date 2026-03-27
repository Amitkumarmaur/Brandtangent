"use client"

import { motion } from "framer-motion"
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
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      className="group relative w-full mb-12"
    >
      {/* Folder Notch Image Container */}
      <div 
        className="relative aspect-[16/10] w-full overflow-hidden transition-transform duration-500 group-hover:scale-[1.02]"
        style={{
          clipPath: 'polygon(0% 60px, 60px 60px, 60px 0%, 100% 0%, 100% 100%, 0% 100%)',
          background: '#1A1A1A'
        }}
      >
        <Image
          src={project.image}
          alt={project.title}
          fill
          className="object-cover object-center transition-transform duration-700 group-hover:scale-110 opacity-80 group-hover:opacity-100"
        />
        
        {/* Hover Overlay */}
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
            <div className="w-16 h-16 rounded-full bg-white text-black flex items-center justify-center font-bold text-xs tracking-widest uppercase scale-0 group-hover:scale-100 transition-transform duration-500 delay-100 cursor-pointer">
              View
            </div>
        </div>
      </div>

      {/* Metadata */}
      <div className="mt-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="space-y-2">
          <div className="flex flex-wrap gap-2">
            {project.tags.map(tag => (
              <span key={tag} className="text-[10px] font-bold tracking-[0.2em] text-white/40 uppercase">
                {tag}
              </span>
            ))}
          </div>
          <h3 className="text-2xl md:text-3xl font-bold text-white group-hover:text-ignite-orange transition-colors duration-300">
            {project.title}
          </h3>
        </div>
        
        <div className="text-right">
          <span className="text-white/20 text-sm font-mono">{project.year}</span>
        </div>
      </div>

      {/* Underline decoration */}
      <div className="absolute -bottom-4 left-0 w-full h-[1px] bg-white/5 overflow-hidden">
        <motion.div 
          className="h-full bg-ignite-orange w-0"
          whileInView={{ width: '100%' }}
          transition={{ duration: 1, delay: 0.5 }}
        />
      </div>
    </motion.div>
  )
}

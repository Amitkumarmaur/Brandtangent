"use client"

import { motion } from "framer-motion"
import { VolumeX } from "lucide-react"
import Image from "next/image"

const testimonials = [
  {
    id: 1,
    name: "SEPHORA",
    logoText: "SEPHORA",
    image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=600&h=800",
  },
  {
    id: 2,
    name: "Egoro Hill",
    logoText: "Egoro Hill",
    image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=600&h=800",
  },
  {
    id: 3,
    name: "HAKALab",
    logoText: "HAKALab",
    image: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=600&h=800",
  },
  {
    id: 4,
    name: "scout kids",
    logoText: "scout kids",
    image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=600&h=800",
  },
  {
    id: 5,
    name: "Digital Gravity",
    logoText: "Digital Gravity",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=600&h=800",
  },
]

export default function TestimonialSection() {
  // We duplicate the array to create a seamless infinite loop
  const duplicatedTestimonials = [...testimonials, ...testimonials, ...testimonials]

  return (
    <section className="py-16 lg:py-20 bg-background overflow-hidden relative">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 mb-8 relative z-10">
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-2 h-2 rounded-full bg-ignite-orange" />
            <span className="font-heading text-ignite-orange font-medium tracking-wider text-sm uppercase">Client Testimonials & Reviews</span>
          </div>
          
          <div className="relative inline-block mt-2">
            <h2 className="font-heading text-3xl md:text-4xl lg:text-5xl font-semibold text-foreground tracking-tight leading-tight max-w-2xl relative z-10">
              What Our Happy Clients <br />Say About Us
            </h2>
            {/* The watermark effect from the image */}
            <div className="absolute -top-6 lg:-top-10 -left-4 lg:-left-6 text-[#F4F4F4]/80 text-6xl lg:text-8xl font-black uppercase tracking-tighter z-[-1] pointer-events-none select-none">
              digii<br />mark
            </div>
          </div>
        </div>
      </div>

      <div className="relative flex overflow-hidden group">
        <motion.div
          animate={{ x: ["0%", "-33.33333333%"] }}
          transition={{
            repeat: Infinity,
            ease: "linear",
            duration: 30, // Adjust speed here
          }}
          className="flex gap-6 px-3 cursor-grab active:cursor-grabbing w-max hover:pause"
          style={{ width: "max-content" }}
        >
          {duplicatedTestimonials.map((testimonial, idx) => (
            <div key={`${testimonial.id}-${idx}`} className="flex flex-col gap-3 w-[240px] lg:w-[280px] flex-shrink-0">
              <div className="relative w-full h-[320px] lg:h-[380px] rounded-[1.5rem] overflow-hidden bg-gray-100 border border-gray-100">
                <Image
                  src={testimonial.image}
                  alt={testimonial.name}
                  fill
                  sizes="(max-width: 1024px) 240px, 280px"
                  className="object-cover object-center"
                />
                
                {/* Mute Button */}
                <button className="absolute bottom-5 left-5 w-12 h-12 bg-ignite-orange hover:bg-ignite-orange hover:opacity-90 transition-all rounded-full flex items-center justify-center text-white shadow-lg z-10 group">
                  <VolumeX className="w-5 h-5 group-hover:scale-110 transition-transform" />
                </button>
              </div>
              
              <div className="px-2 mt-2">
                <h3 className="font-heading text-xl font-semibold tracking-tight text-foreground">{testimonial.logoText}</h3>
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}

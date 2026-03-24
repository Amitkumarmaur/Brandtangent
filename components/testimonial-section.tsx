"use client"

import { motion } from "framer-motion"
import { VolumeX } from "lucide-react"

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
    <section className="py-12 lg:py-16 bg-white overflow-hidden relative">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 mb-8 relative z-10">
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-[#FF5722]" />
            <span className="text-[#FF5722] font-medium tracking-wide text-sm uppercase">Client Testimonials & Reviews</span>
          </div>
          
          <div className="relative inline-block mt-2">
            <h2 className="text-3xl md:text-5xl font-light text-[#0A0A0A] tracking-tight leading-tight max-w-2xl relative z-10">
              What Our Happy Clients <br /><span className="font-normal">Say About Us</span>
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
                <img
                  src={testimonial.image}
                  alt={testimonial.name}
                  className="w-full h-full object-cover object-center"
                  loading="lazy"
                />
                
                {/* Mute Button */}
                <button className="absolute bottom-5 left-5 w-12 h-12 bg-[#FF5722] hover:bg-[#E64A19] transition-colors rounded-full flex items-center justify-center text-white shadow-lg z-10 group">
                  <VolumeX className="w-5 h-5 group-hover:scale-110 transition-transform" />
                </button>
              </div>
              
              <div className="px-2 mt-2">
                <h3 className="text-xl font-bold tracking-tight text-[#0A0A0A]">{testimonial.logoText}</h3>
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}

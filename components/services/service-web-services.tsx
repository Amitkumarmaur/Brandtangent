"use client"

import { useState, useRef } from "react"
import { motion, AnimatePresence, useInView } from "framer-motion"
import { Minus, X } from "lucide-react"

interface WebService {
  title: string
  shortDescription: string
  fullDescription: string[]
}

const defaultServices: WebService[] = [
  {
    title: "Website Design and Development",
    shortDescription:
      "Get your business an expertly crafted website that does not only look interactive but also ranks on SERPs.",
    fullDescription: [
      "At DigiiMark, we don't just build websites; we craft digital experiences that leave a lasting impression. As a leading website design and development agency, we have successfully designed and developed over 300 websites, catering to diverse industries both locally and globally.",
      "From front-end developers to back-end engineers, our talent is the heartbeat of our success. We thrive on executing complex web projects while embracing out-of-the-box business models.",
    ],
  },
  {
    title: "Annual Maintenance Service",
    shortDescription:
      "We offer cost-efficient annual maintenance for your website to keep it updated with the latest norms.",
    fullDescription: [
      "Our Annual Maintenance Service ensures your website remains up-to-date, secure, and performing at its best throughout the year. We handle all updates, security patches, and performance optimizations so you can focus on growing your business.",
      "From content updates to plugin management and server monitoring, our dedicated team provides proactive maintenance that prevents issues before they arise.",
    ],
  },
  {
    title: "Website Maintenance",
    shortDescription:
      "At our website maintenance service, we take care of your website from every technical aspect.",
    fullDescription: [
      "Our comprehensive Website Maintenance services cover everything from regular backups and security monitoring to content updates and performance tuning. We ensure your site runs smoothly 24/7.",
      "Whether it's fixing bugs, updating content, optimizing page speed, or ensuring compatibility with the latest browsers — our team handles it all with precision and care.",
    ],
  },
  {
    title: "Hosting and Administration",
    shortDescription:
      "Our Hosting and Administration services will keep your site healthy, functional, and performing optimally.",
    fullDescription: [
      "We provide enterprise-grade hosting solutions with 99.9% uptime guarantee, daily backups, and SSL certificates. Our infrastructure is built on cloud-native architecture for maximum reliability and speed.",
      "Our administration team monitors your servers around the clock, handles scaling during traffic spikes, and ensures your applications are always running on the most secure and optimized environment.",
    ],
  },
]

interface ServiceWebServicesProps {
  title?: string
  services?: WebService[]
}

export default function ServiceWebServices({
  title = "Our Web Services",
  services = defaultServices,
}: ServiceWebServicesProps) {
  const [selectedService, setSelectedService] = useState<WebService | null>(null)
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  return (
    <>
      <section ref={ref} className="relative w-full py-16 md:py-20 overflow-hidden" style={{ background: "#fff" }}>
        {/* Subtle dot grid */}
        <div
          className="absolute inset-0 opacity-[0.06] pointer-events-none"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, #FF5722 1px, transparent 0)`,
            backgroundSize: '40px 40px',
          }}
        />
        {/* Warm peach ambient glow */}
        <div
          className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[900px] h-[300px] rounded-full blur-[160px] pointer-events-none"
          style={{ background: "rgba(255,210,184,0.3)" }}
        />
        {/* Warm peach ambient glow */}
        <div
          className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[900px] h-[300px] rounded-full blur-[160px] pointer-events-none"
          style={{ background: "rgba(255,210,184,0.5)" }}
        />

        <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
          {/* Section Header */}
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7 }}
            className="text-3xl md:text-5xl lg:text-6xl font-light text-foreground mb-12 md:mb-16 tracking-tight"
          >
            {title}
          </motion.h2>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 md:gap-6">
            {services.map((service, index) => (
              <motion.div
                key={service.title}
                initial={{ opacity: 0, y: 40 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                onClick={() => setSelectedService(service)}
              className="group relative backdrop-blur-sm rounded-2xl p-6 md:p-7 border transition-all duration-300 cursor-pointer flex flex-col justify-between min-h-[240px] md:min-h-[280px] hover:scale-[1.04] hover:-translate-y-1"
                style={{
                  background: "#FFF5F0",
                  border: "1.5px solid rgba(255,87,34,0.12)",
                  boxShadow: "0 2px 12px rgba(255,210,184,0.3)",
                }}
                whileHover={{
                  boxShadow: "0 12px 40px rgba(255,87,34,0.15)",
                } as any}
              >
                {/* Top glow line on hover */}
                <div className="absolute top-0 left-4 right-4 h-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-full" style={{ background: "linear-gradient(to right, transparent, #FF5722, transparent)" }} />
                {/* Peach corner accent */}
                <div className="absolute top-0 right-0 w-16 h-16 rounded-bl-3xl rounded-tr-2xl opacity-60" style={{ background: "#FFD2B8" }} />
                <div className="relative z-10">
                  <h3 className="text-lg md:text-xl font-semibold text-foreground mb-3 leading-snug group-hover:text-ignite-orange transition-colors pr-10">
                    {service.title}
                  </h3>
                  <p className="text-foreground/60 text-sm leading-relaxed">
                    {service.shortDescription}
                  </p>
                </div>

                {/* Bottom circle button */}
                <div className="flex justify-end mt-6 relative z-10">
                  <div className="w-9 h-9 rounded-full flex items-center justify-center transition-all group-hover:scale-110" style={{ background: "#FFD2B8" }}>
                    <Minus className="w-4 h-4 transition-colors" style={{ color: "#FF5722" }} />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Modal Overlay */}
      <AnimatePresence>
        {selectedService && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[100] flex items-center justify-center px-4"
            onClick={() => setSelectedService(null)}
          >
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />

            {/* Modal Card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 30 }}
              transition={{ duration: 0.35, ease: "easeOut" }}
              onClick={(e) => e.stopPropagation()}
              className="relative max-w-2xl w-full backdrop-blur-xl rounded-3xl p-8 md:p-12 border shadow-2xl"
              style={{ background: "#FFF5F0", borderColor: "rgba(255,87,34,0.15)" }}
            >
              {/* Close button */}
              <button
                onClick={() => setSelectedService(null)}
                className="absolute top-5 right-5 w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors"
              >
                <X className="w-4 h-4 text-white/60" />
              </button>

              <h3 className="text-2xl md:text-4xl font-light text-foreground mb-6 md:mb-8 leading-tight pr-8">
                {selectedService.title}
              </h3>

              <div className="space-y-4">
                {selectedService.fullDescription.map((paragraph, i) => (
                  <p key={i} className="text-foreground/60 text-sm md:text-base leading-relaxed">
                    {paragraph}
                  </p>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

"use client"

import { useState, useRef, useEffect } from "react"
import Link from "next/link"
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from "framer-motion"
import { Linkedin, Twitter, Youtube, Instagram, X } from "lucide-react"

const socialLinks = [
  { icon: Twitter, href: "#", label: "Twitter" },
  { icon: Instagram, href: "#", label: "Instagram" },
  { icon: Youtube, href: "#", label: "YouTube" },
  { icon: Linkedin, href: "#", label: "LinkedIn" },
]

const footerColumns = [
  {
    title: "Overview",
    links: ["About Us", "Services", "Our Work", "Blog", "Contact us", "Career"]
  },
  {
    title: "Smart Technology Solutions",
    links: [
      "AI Integration",
      "Marketing Automation",
      "Lead Scoring Engines",
      "Agentic Workflows",
      "Custom CRM Development",
      "Data Analytics Platforms",
      "Chatbot Development"
    ]
  },
  {
    title: "Digital Growth & Marketing",
    links: [
      "B2B Lead Generation",
      "Search Engine Optimization (SEO)",
      "Generative Engine Optimization (GEO)",
      "Pay-Per-Click Advertising (PPC)",
      "Conversion Rate Optimization",
      "Content Marketing"
    ]
  },
  {
    title: "Industry",
    links: [
      "SaaS",
      "FinTech",
      "InsureTech",
      "Enterprise Tech",
      "Healthcare",
      "Education"
    ]
  }
]

// The massive 5-column Digital Gravity menu
const DigitalGravityMenu = () => (
  <div className="bg-[#0A0A0A] text-white pt-20 md:pt-24 pb-16 w-full mx-auto pointer-events-auto rounded-[2rem] md:rounded-[3rem] shadow-2xl relative">
    <div className="max-w-[1240px] mx-auto px-6 md:px-12 flex flex-col items-center">
      
      {/* Top centered logo */}
      <div className="mb-8">
        <Link href="/" className="flex flex-col items-center gap-2">
          <div className="w-14 h-14 bg-white rounded-xl flex items-center justify-center mb-1">
            <span className="text-[#0A0A0A] font-black text-3xl">D</span>
          </div>
          <span className="text-4xl font-light tracking-tight">digii<strong className="font-bold">mark</strong></span>
        </Link>
      </div>

      {/* Social Links */}
      <div className="flex gap-6 mb-12">
        {socialLinks.map((social) => (
          <a key={social.label} href={social.href} className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-[#FF5722] hover:text-white transition-colors">
            <social.icon className="w-5 h-5" />
          </a>
        ))}
      </div>

      {/* Separator */}
      <div className="w-full h-px bg-white/10 mb-16"></div>

      {/* 5-Column Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 lg:gap-8 w-full">
        
        {/* Column 1: Contact Us */}
        <div className="flex flex-col">
          <h3 className="text-xl font-semibold mb-6 flex items-center gap-2">
            <span className="w-0.5 h-6 bg-[#FF5722]"></span>
            Contact Us
          </h3>
          <div className="text-sm text-gray-400 space-y-6">
            <p className="leading-relaxed text-white/80">
              100 Innovation Drive,<br />
              Tech Park, Suite 400,<br />
              San Francisco, CA
            </p>
            <p>
              <a href="mailto:discover@digiimark.com" className="hover:text-white transition-colors">discover@digiimark.com</a>
            </p>
            <p className="space-y-1">
              <a href="tel:+18005550199" className="block hover:text-white transition-colors">+1 800 555 0199</a>
              <a href="tel:+18005550299" className="block hover:text-white transition-colors">+1 800 555 0299</a>
            </p>
          </div>
        </div>

        {/* Columns 2-5 from array */}
        {footerColumns.map((col, idx) => (
          <div key={idx} className="flex flex-col">
            <h3 className="text-xl font-semibold mb-6 flex items-center gap-2">
              <span className="w-0.5 h-6 bg-white/30"></span>
              {col.title}
            </h3>
            <ul className="flex flex-col gap-4 text-sm text-gray-400">
              {col.links.map((link, linkIdx) => (
                <li key={linkIdx}>
                  <Link href="#" className="hover:text-white transition-colors block">
                    {link}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}

      </div>

    </div>
  </div>
)

export default function Footer() {
  const [isOpen, setIsOpen] = useState(false)
  const [isVisible, setIsVisible] = useState(true)
  const { scrollY } = useScroll()
  const lastScrollY = useRef(0)
  const bottomTriggerRef = useRef<HTMLDivElement>(null)
  const scrollUpStart = useRef<number | null>(null)
  
  // A lock to prevent the intersection observer from auto-opening the 
  // menu immediately after the user manually closes it while still at the bottom.
  const justClosed = useRef(false)
  
  // Track scroll direction to hide/show pill and close the menu
  useMotionValueEvent(scrollY, "change", (latest) => {
    const isScrollingDown = latest > lastScrollY.current
    lastScrollY.current = latest
    
    if (!isOpen) {
      if (isScrollingDown && latest > 50) {
        setIsVisible(false) // Hide pill when scrolling down
      } else {
        setIsVisible(true) // Show pill when scrolling back up
      }
    } else {
      // If the massive menu is open and the user scrolls up by over 50px continuously
      if (!isScrollingDown) {
        if (scrollUpStart.current === null) {
          scrollUpStart.current = latest
        } else if (scrollUpStart.current - latest > 50) {
          setIsOpen(false)
          setIsVisible(true)
          justClosed.current = true // Keep it locked until intersection observer clears
          scrollUpStart.current = null
        }
      } else {
        // Reset the tracker if scrolling down
        scrollUpStart.current = null
      }
    }
  })

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          // If we reached the bottom, and the user hasn't explicitly closed it recently
          if (!isOpen && !justClosed.current) {
            setIsVisible(false)
            setIsOpen(true)
          }
        } else {
          // As soon as the user scrolls away from the bottom (trigger leaves the viewport),
          // reset the lock so it can auto-open the NEXT time they scroll to the bottom.
          justClosed.current = false
        }
      },
      // Trigger slightly before the very bottom to mask any visual stutter
      { rootMargin: "0px 0px 50px 0px", threshold: 0 } 
    )
    
    if (bottomTriggerRef.current) {
      observer.observe(bottomTriggerRef.current)
    }
    
    return () => observer.disconnect()
  }, [isOpen])

  return (
    <>
      <AnimatePresence>
        {!isOpen && (
          <motion.div
            initial={{ y: 200, opacity: 0 }}
            animate={{ y: isVisible ? 0 : 200, opacity: isVisible ? 1 : 0 }}
            exit={{ y: 200, opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="fixed bottom-6 md:bottom-10 left-1/2 -translate-x-1/2 z-50 w-[280px] md:w-[320px]"
          >
            {/* The Glassmorphic Minimal Pill Component */}
            <button 
              onClick={() => {
                setIsVisible(false)
                setIsOpen(true)
                // Optionally scroll to bottom when they click the pill manually
                window.scrollTo({ top: document.documentElement.scrollHeight, behavior: 'smooth' })
              }}
              className="bg-white/60 backdrop-blur-xl rounded-full pl-2.5 pr-5 py-2.5 flex items-center justify-between w-full shadow-[0_8px_32px_rgba(0,0,0,0.08)] border border-white/40 hover:bg-white/70 transition-all duration-300 cursor-pointer"
            >
              <div className="w-9 h-9 bg-[#0A0A0A] text-white rounded-full flex items-center justify-center shadow-inner">
                <span className="font-bold text-sm">D</span>
              </div>
              
              <div className="flex flex-col gap-[5px]">
                <div className="w-5 h-[1.5px] bg-[#0A0A0A] rounded-full opacity-90"></div>
                <div className="w-5 h-[1.5px] bg-[#0A0A0A] rounded-full opacity-90"></div>
              </div>
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 
        This is an invisible anchor element at the very bottom of the natural DOM flow.
        As the user scrolls down, when they hit this div, it triggers the mega-menu to open.
      */}
      <div className="w-full h-1" ref={bottomTriggerRef}></div>

      {/* Expandable Digital Gravity Mega-Menu anchored at the bottom */}
      <div className="relative z-40 w-full mb-0 md:px-4 lg:px-8 bg-white pb-4 md:pb-8">
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0, y: 50 }}
              animate={{ opacity: 1, height: "auto", y: 0 }}
              exit={{ opacity: 0, height: 0, y: 50 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="overflow-hidden w-full origin-bottom"
            >
              <div className="relative">
                 {/* Close button for the mega-menu to shrink it back down to a pill */}
                 <button 
                  onClick={() => {
                    justClosed.current = true
                    setIsOpen(false)
                    setIsVisible(true)
                  }} 
                  className="absolute top-6 right-6 md:top-10 md:right-10 z-50 p-3 bg-white/10 hover:bg-white/20 rounded-full transition-colors flex items-center justify-center group"
                 >
                   <X className="w-6 h-6 text-white group-hover:rotate-90 transition-transform duration-300" />
                 </button>
                 <DigitalGravityMenu />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  )
}

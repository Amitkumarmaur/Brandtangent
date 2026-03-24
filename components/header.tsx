"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import { Menu, X, Phone } from "lucide-react"
import { Button } from "@/components/ui/button"

const navItems = [
  { name: "Services", href: "#services" },
  { name: "Industries", href: "#industries" },
  { name: "Solutions", href: "#solutions" },
  { name: "About", href: "#about" },
]

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className={`fixed z-50 mx-auto transition-all duration-500 ease-in-out ${
        isScrolled && !isMobileMenuOpen
          ? "top-4 left-4 right-4 md:top-6 md:left-8 md:right-8 max-w-7xl bg-[#0A0A0A]/90 backdrop-blur-md rounded-full shadow-[0_8px_32px_rgba(0,0,0,0.2)] border border-white/10"
          : isMobileMenuOpen
          ? "top-0 left-0 right-0 max-w-full bg-white shadow-md"
          : "top-0 left-0 right-0 max-w-full bg-transparent border-b border-black/10"
      }`}
    >
      <div className="mx-auto px-4 md:px-6 lg:px-8">
        <div className={`flex items-center justify-between transition-all duration-500 ease-in-out ${
          isScrolled && !isMobileMenuOpen ? "h-16" : "h-20 md:h-24"
        }`}>
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center transition-colors duration-500 ${isScrolled && !isMobileMenuOpen ? "bg-white" : "bg-[#0A0A0A]"}`}>
              <span className={`font-bold text-xl transition-colors duration-500 ${isScrolled && !isMobileMenuOpen ? "text-[#0A0A0A]" : "text-white"}`}>D</span>
            </div>
            <span className={`text-xl font-bold transition-colors duration-500 ${isScrolled && !isMobileMenuOpen ? "text-white" : "text-[#0A0A0A]"}`}>DigiiMark</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`transition-colors text-sm font-medium ${isScrolled && !isMobileMenuOpen ? "text-white/80 hover:text-white" : "text-[#4A4A4A] hover:text-[#0A0A0A]"}`}
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* CTA Buttons */}
          <div className="hidden lg:flex items-center gap-3">
            <a href="tel:+1234567890" className={`group flex items-center gap-2 px-4 py-2 rounded-full font-medium transition-colors border ${isScrolled && !isMobileMenuOpen ? "bg-white/10 hover:bg-white/20 text-white border-white/20 hover:border-white/40" : "bg-transparent hover:bg-black/5 text-[#0A0A0A] border-black/20 hover:border-black/40"}`}>
              <Phone className={`w-4 h-4 transition-colors ${isScrolled && !isMobileMenuOpen ? "text-white/70 group-hover:text-[#FF5722]" : "text-[#0A0A0A]/60 group-hover:text-[#FF5722]"}`} />
              <span className="text-sm font-semibold">Call Us</span>
            </a>
            <Button className="bg-[#FF5722] hover:bg-[#FF5722]/90 text-white px-6 py-2 rounded-full font-medium transition-all hover:scale-105 shadow-[0_4px_14px_rgba(255,87,34,0.25)]">
              Start Automating
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button className="md:hidden p-2" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
            {isMobileMenuOpen ? <X className="w-6 h-6 text-[#0A0A0A]" /> : <Menu className={`w-6 h-6 transition-colors duration-500 ${isScrolled && !isMobileMenuOpen ? "text-white" : "text-[#0A0A0A]"}`} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="md:hidden bg-white border-t border-[#E5E5E5] py-6"
          >
            <nav className="flex flex-col gap-4">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="text-[#4A4A4A] hover:text-[#0A0A0A] transition-colors text-base font-medium px-4"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
              <div className="px-4 pt-4 flex flex-col gap-3">
                <a href="tel:+1234567890" className="flex items-center justify-center gap-2 w-full bg-[#F5F5F5] text-[#0A0A0A] py-2.5 rounded-full font-medium border border-[#E5E5E5]">
                  <Phone className="w-4 h-4 text-[#FF5722]" />
                  <span>Call Us</span>
                </a>
                <Button className="w-full bg-[#FF5722] hover:bg-[#FF5722]/90 text-white rounded-full py-6">
                  Start Automating
                </Button>
              </div>
            </nav>
          </motion.div>
        )}
      </div>
    </motion.header>
  )
}

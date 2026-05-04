"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import { Menu, X, Phone } from "lucide-react"
import { Button } from "@/components/ui/button"
import { supabase } from "@/lib/supabase"
import { NavServicesDesktop, NavServicesMobile, type NavServiceCategoryRow } from "@/components/nav-services"
import { DigiimarkLogo } from "@/components/digiimark-logo"

const navItems = [
  { name: "Our Work", href: "/case-studies" },
  { name: "Blog", href: "/blog" },
  { name: "Careers", href: "/careers" },
  { name: "About", href: "/about" },
]

const navLinkClass =
  "font-heading text-base md:text-[1.05rem] font-medium tracking-[0.01em] text-foreground transition-colors hover:text-ignite-orange"

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [serviceCategories, setServiceCategories] = useState<NavServiceCategoryRow[]>([])

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50)
    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      const [catsRes, svcRes] = await Promise.all([
        supabase
          .from("service_categories")
          .select("id, name, slug, display_order")
          .order("display_order", { ascending: true }),
        supabase.from("services").select("category_id"),
      ])
      if (cancelled) return
      const cats = (catsRes.data ?? []) as NavServiceCategoryRow[]
      const withSvc = new Set(
        (svcRes.data ?? [])
          .map((r: { category_id: string | null }) => r.category_id)
          .filter((id): id is string => Boolean(id))
      )
      setServiceCategories(
        cats.filter((c) => withSvc.has(c.id) && Boolean((c.slug ?? "").trim())),
      )
    })()
    return () => {
      cancelled = true
    }
  }, [])

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className={`fixed z-50 mx-auto transition-all duration-500 ease-in-out ${isScrolled && !isMobileMenuOpen
          ? "top-4 left-4 right-4 md:top-6 md:left-8 md:right-8 max-w-7xl bg-white/92 backdrop-blur-md rounded-full border border-black/25 shadow-[0_14px_36px_rgba(0,0,0,0.18),0_0_0_1px_rgba(0,0,0,0.12),0_0_28px_rgba(0,0,0,0.12)]"
          : isMobileMenuOpen
            ? "top-0 left-0 right-0 max-w-full bg-white shadow-md"
            : "top-0 left-0 right-0 max-w-full border-b bg-white/95 border-black/10 backdrop-blur-sm shadow-sm"
        }`}
    >
      <div className="mx-auto px-4 md:px-6 lg:px-8">
        <div className={`flex items-center justify-between transition-all duration-500 ease-in-out ${isScrolled && !isMobileMenuOpen ? "h-16" : "h-20 md:h-24"
          }`}>

          {/* Logo */}
          <Link href="/" aria-label="DigiiMark — home" className="flex items-center">
            <DigiimarkLogo
              variant="dark"
              className={`w-auto transition-all duration-500 ${
                isScrolled && !isMobileMenuOpen ? "h-7 md:h-8" : "h-8 md:h-10"
              }`}
            />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <NavServicesDesktop categories={serviceCategories} />
            {navItems.map((item) => (
              <Link key={item.name} href={item.href} className={navLinkClass}>
                {item.name}
              </Link>
            ))}
          </nav>

          {/* CTA Buttons */}
          <div className="hidden lg:flex items-center gap-4">
            <a
              href="tel:+1234567890"
              className="group flex items-center gap-2.5 px-5 py-2.5 rounded-full text-base font-semibold transition-all border border-black/20 text-[#0A0A0A] hover:bg-black/5 hover:border-black/40"
            >
              <Phone className="w-4.5 h-4.5 text-[#0A0A0A]/60 transition-colors group-hover:text-[#FF5722]" />
              <span className="text-base font-semibold">Call Us</span>
            </a>
            <Button className="bg-[#FF5722] hover:bg-[#FF5722]/90 text-white text-sm md:text-base px-7 py-2.5 rounded-full font-semibold transition-all hover:scale-105 shadow-[0_4px_14px_rgba(255,87,34,0.25)]">
              Start Automating
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button className="md:hidden p-2" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
            {isMobileMenuOpen
              ? <X className="w-6 h-6 text-[#0A0A0A]" />
              : <Menu className="w-6 h-6 text-[#0A0A0A] transition-colors duration-500" />
            }
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
              <NavServicesMobile categories={serviceCategories} onNavigate={() => setIsMobileMenuOpen(false)} />
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="font-heading text-foreground hover:text-ignite-orange transition-colors text-lg font-semibold px-4"
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

"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "motion/react"
import Link from "next/link"
import { Menu, X, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { supabase } from "@/lib/supabase"
import { NavServicesDesktop, NavServicesMobile, type NavServiceCategoryRow } from "@/components/nav-services"
import { BrandtangentLogo } from "@/components/brandtangent-logo"

const navItems = [
  { name: "Our Work", href: "/case-studies" },
  { name: "Blog", href: "/blog" },
  { name: "Careers", href: "/careers" },
  { name: "About", href: "/about" },
]

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [serviceCategories, setServiceCategories] = useState<NavServiceCategoryRow[]>([])

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 30)
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
        cats.filter((c) => withSvc.has(c.id) && Boolean((c.slug ?? "").trim()))
      )
    })()
    return () => { cancelled = true }
  }, [])

  return (
    <motion.header
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-white/95 backdrop-blur-sm shadow-sm"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-[1200px] mx-auto px-6 lg:px-8">
        <div className={`flex items-center justify-between transition-all duration-300 ${
          isScrolled ? "h-14" : "h-20"
        }`}>

          {/* Logo */}
          <Link href="/" aria-label="Brandtangent - home" className="flex items-center">
            <BrandtangentLogo
              variant="dark"
              animated
              className={`transition-all duration-300 ${isScrolled ? "h-10" : "h-12"}`}
            />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <NavServicesDesktop categories={serviceCategories} />
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-[15px] text-foreground hover:text-sky-blue transition-colors font-normal"
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* CTA */}
          <div className="hidden md:flex items-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
            >
              <Button size="sm" asChild className="relative overflow-hidden shadow-[0_4px_14px_rgba(83,58,253,0.35)]">
                <Link href="/#contact">
                  <motion.span
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                    initial={{ x: "-100%" }}
                    whileHover={{ x: "100%" }}
                    transition={{ duration: 0.55, ease: "easeInOut" }}
                    aria-hidden
                  />
                  <span className="relative z-10 flex items-center gap-1.5">
                    Start a project
                    <ArrowRight className="w-3.5 h-3.5" aria-hidden />
                  </span>
                </Link>
              </Button>
            </motion.div>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 rounded-full text-foreground hover:bg-blue-tint transition-colors"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
            className="md:hidden overflow-hidden"
          >
            <div className="bg-white/95 backdrop-blur-sm border-t border-border-blue px-6 py-6">
              <nav className="flex flex-col gap-3">
                <NavServicesMobile
                  categories={serviceCategories}
                  onNavigate={() => setIsMobileMenuOpen(false)}
                />
                {navItems.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className="text-foreground text-base font-normal py-2 hover:text-sky-blue transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {item.name}
                  </Link>
                ))}
                <div className="pt-4 border-t border-border">
                  <motion.div whileTap={{ scale: 0.98 }}>
                    <Button size="lg" asChild className="w-full">
                      <Link
                        href="/#contact"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        Start a project
                        <ArrowRight className="w-4 h-4" aria-hidden />
                      </Link>
                    </Button>
                  </motion.div>
                </div>
              </nav>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  )
}

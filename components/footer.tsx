"use client"

import type React from "react"

import { useState } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ArrowRight, Linkedin, Twitter, Youtube, Instagram } from "lucide-react"

const footerLinks = {
  Services: ["AI Integration", "Marketing Automation", "Lead Scoring", "Analytics"],
  Industries: ["InsureTech", "FinTech", "Ecommerce", "SaaS"],
  Company: ["About", "Careers", "Blog", "Contact"],
  Resources: ["Case Studies", "Documentation", "API", "Status"],
}

const socialLinks = [
  { icon: Linkedin, href: "#", label: "LinkedIn" },
  { icon: Twitter, href: "#", label: "Twitter" },
  { icon: Youtube, href: "#", label: "YouTube" },
  { icon: Instagram, href: "#", label: "Instagram" },
]

export default function Footer() {
  const [email, setEmail] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle newsletter signup
    setEmail("")
  }

  return (
    <footer className="bg-[#0A0A0A] text-white pt-20 pb-8">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-12 mb-16">
          {/* Brand & Newsletter */}
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-6">
              <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
                <span className="text-[#0A0A0A] font-bold text-xl">D</span>
              </div>
              <span className="text-xl font-bold">DigiiMark</span>
            </Link>
            <p className="text-[#7D7D7D] mb-6">AI-first automation that transforms how B2B companies grow.</p>

            {/* Newsletter */}
            <form onSubmit={handleSubmit} className="flex gap-2">
              <Input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-[#1A1A1A] border-[#4A4A4A] text-white placeholder:text-[#7D7D7D] rounded-full"
              />
              <Button
                type="submit"
                size="icon"
                className="bg-[#FF5722] hover:bg-[#FF5722]/90 rounded-full flex-shrink-0"
              >
                <ArrowRight className="w-4 h-4" />
              </Button>
            </form>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h4 className="font-bold text-white mb-4">{category}</h4>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link}>
                    <Link href="#" className="text-[#7D7D7D] hover:text-white transition-colors text-sm">
                      {link}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom */}
        <div className="border-t border-[#1A1A1A] pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-[#7D7D7D] text-sm">© 2025 DigiiMark. All rights reserved.</p>

          {/* Social Links */}
          <div className="flex items-center gap-4">
            {socialLinks.map((social) => (
              <motion.a
                key={social.label}
                href={social.href}
                whileHover={{ scale: 1.1 }}
                className="w-10 h-10 bg-[#1A1A1A] rounded-full flex items-center justify-center hover:bg-[#FF5722] transition-colors"
                aria-label={social.label}
              >
                <social.icon className="w-5 h-5" />
              </motion.a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}

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

/**
 * Inner functional component rendering the dark visual capsule.
 * Pointers are explicitly enabled so it can be interacted with while fixed beneath an invisible spacer.
 */
const FooterContent = ({
  email,
  setEmail,
  handleSubmit,
}: {
  email: string
  setEmail: (e: string) => void
  handleSubmit: (e: React.FormEvent) => void
}) => (
  <div className="bg-[#0A0A0A] text-white pt-16 pb-8 px-8 lg:px-12 rounded-[2rem] md:rounded-[3rem] w-[calc(100%-1rem)] md:w-[calc(100%-2rem)] mx-auto shadow-[0_-15px_40px_rgba(0,0,0,0.1)] pointer-events-auto">
    <div className="max-w-7xl mx-auto">
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
  </div>
)

export default function Footer() {
  const [email, setEmail] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle newsletter signup
    setEmail("")
  }

  return (
    <div 
      className="relative w-full bg-transparent overflow-hidden" // ensures no extra scrollbars
      style={{ clipPath: "polygon(0 0, 100% 0, 100% 100%, 0 100%)" }}
    >
      {/* 
        This is the fixed footer that reveals exactly beneath the clip-path. 
        It naturally stays pinned at the bottom of the viewport.
      */}
      <div className="fixed bottom-0 left-0 w-full flex justify-center pb-2 md:pb-4 pointer-events-none">
         <FooterContent email={email} setEmail={setEmail} handleSubmit={handleSubmit} />
      </div>
      
      {/* 
        Invisible spacer perfectly duplicates the footer height. 
        This guarantees the user can scroll far enough to reveal the fixed footer behind it.
      */}
      <div className="invisible pb-2 md:pb-4 pt-[50vh] flex justify-center pointer-events-none">
        <FooterContent email={email} setEmail={setEmail} handleSubmit={handleSubmit} />
      </div>
    </div>
  )
}

import Link from "next/link"
import { Linkedin, Twitter, Youtube, Instagram } from "lucide-react"

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
  <div className="bg-foreground text-white pt-12 md:pt-16 pb-12 w-full mx-auto pointer-events-auto rounded-[2rem] md:rounded-[3rem] shadow-2xl relative">
    <div className="max-w-[1240px] mx-auto px-6 md:px-12 flex flex-col items-center">
      
      {/* Top centered logo */}
      <div className="mb-6">
        <Link href="/" className="flex flex-col items-center gap-2">
          <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center mb-1">
            <span className="text-foreground font-black text-2xl">D</span>
          </div>
          <span className="font-heading text-3xl font-light tracking-tight">digii<strong className="font-bold">mark</strong></span>
        </Link>
      </div>

      {/* Social Links */}
      <div className="flex gap-4 mb-8">
        {socialLinks.map((social) => (
          <a key={social.label} href={social.href} className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-ignite-orange hover:text-white transition-colors">
            <social.icon className="w-5 h-5" />
          </a>
        ))}
      </div>

      {/* Separator */}
      <div className="w-full h-px bg-white/10 mb-10"></div>

      {/* 5-Column Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-6 w-full">
        
        {/* Column 1: Contact Us */}
        <div className="flex flex-col">
          <h3 className="font-heading text-xl font-semibold mb-6 flex items-center gap-2">
            <span className="w-0.5 h-6 bg-ignite-orange"></span>
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
            <h3 className="font-heading text-xl font-semibold mb-6 flex items-center gap-2">
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
  return (
    <footer className="relative z-40 w-full mb-0 md:px-4 lg:px-8 bg-white pb-4 md:pb-8">
      <DigitalGravityMenu />
    </footer>
  )
}

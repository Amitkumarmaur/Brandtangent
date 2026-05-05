import type { ReactNode } from "react"
import Link from "next/link"
import { Linkedin, Twitter, Youtube, Instagram } from "lucide-react"
import { DigiimarkLogo } from "@/components/digiimark-logo"
import { getFooterNavColumns, type FooterColumnData } from "@/lib/footer-nav"

const socialLinks = [
  { icon: Twitter, href: "#", label: "Twitter" },
  { icon: Instagram, href: "#", label: "Instagram" },
  { icon: Youtube, href: "#", label: "YouTube" },
  { icon: Linkedin, href: "#", label: "LinkedIn" },
]

function FooterNavItem({ href, children }: { href: string; children: ReactNode }) {
  const isMailOrTel = href.startsWith("mailto:") || href.startsWith("tel:")
  const className = "hover:text-white transition-colors block"
  if (isMailOrTel) {
    return (
      <a href={href} className={className}>
        {children}
      </a>
    )
  }
  return (
    <Link href={href} className={className}>
      {children}
    </Link>
  )
}

function DigitalGravityMenu({ columns }: { columns: FooterColumnData[] }) {
  return (
    <div className="bg-foreground text-white pt-12 md:pt-16 pb-12 w-full mx-auto pointer-events-auto rounded-[2rem] md:rounded-[3rem] shadow-2xl relative">
      <div className="max-w-[1240px] mx-auto px-6 md:px-12 flex flex-col items-center">
        <div className="mb-6">
          <Link href="/" aria-label="DigiiMark — home" className="inline-flex items-center">
            <DigiimarkLogo variant="light" className="h-12 md:h-14 w-auto" />
          </Link>
        </div>

        <div className="flex gap-4 mb-8">
          {socialLinks.map((social) => (
            <a
              key={social.label}
              href={social.href}
              className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-ignite-orange hover:text-white transition-colors"
            >
              <social.icon className="w-5 h-5" />
            </a>
          ))}
        </div>

        <div className="w-full h-px bg-white/10 mb-10" />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-6 w-full">
          <div className="flex flex-col">
            <h3 className="font-heading text-xl font-semibold mb-6 flex items-center gap-2">
              <span className="w-0.5 h-6 bg-ignite-orange" />
              Contact Us
            </h3>
            <div className="text-sm text-gray-400 space-y-6">
              <p className="leading-relaxed text-white/80">
                100 Innovation Drive,
                <br />
                Tech Park, Suite 400,
                <br />
                San Francisco, CA
              </p>
              <p>
                <a href="mailto:discover@digiimark.com" className="hover:text-white transition-colors">
                  discover@digiimark.com
                </a>
              </p>
              <p className="space-y-1">
                <a href="tel:+18005550199" className="block hover:text-white transition-colors">
                  +1 800 555 0199
                </a>
                <a href="tel:+18005550299" className="block hover:text-white transition-colors">
                  +1 800 555 0299
                </a>
              </p>
            </div>
          </div>

          {columns.map((col) => (
            <div key={col.title} className="flex flex-col">
              <h3 className="font-heading text-xl font-semibold mb-6 flex items-center gap-2">
                <span className="w-0.5 h-6 bg-white/30" />
                {col.title}
              </h3>
              <ul className="flex flex-col gap-4 text-sm text-gray-400">
                {col.links.map((item) => (
                  <li key={item.label}>
                    <FooterNavItem href={item.href}>{item.label}</FooterNavItem>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default async function Footer() {
  const columns = await getFooterNavColumns()
  return (
    <footer className="relative z-40 w-full mt-16 md:mt-20 mb-0 md:px-4 lg:px-8 bg-white pb-4 md:pb-8">
      <DigitalGravityMenu columns={columns} />
    </footer>
  )
}

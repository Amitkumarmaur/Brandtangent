import type { ReactNode } from "react"
import Link from "next/link"
import { Linkedin, Twitter, Youtube, Instagram } from "lucide-react"
import { BrandtangentLogo } from "@/components/brandtangent-logo"
import { getFooterNavColumns, type FooterColumnData } from "@/lib/footer-nav"

const socialLinks = [
  { icon: Twitter, href: "#", label: "Twitter" },
  { icon: Instagram, href: "#", label: "Instagram" },
  { icon: Youtube, href: "#", label: "YouTube" },
  { icon: Linkedin, href: "#", label: "LinkedIn" },
]

function FooterNavItem({ href, children }: { href: string; children: ReactNode }) {
  const isMailOrTel = href.startsWith("mailto:") || href.startsWith("tel:")
  const cls = "text-white/70 hover:text-white transition-colors text-[14px] font-normal block"
  if (isMailOrTel) return <a href={href} className={cls}>{children}</a>
  return <Link href={href} className={cls}>{children}</Link>
}

function FooterInner({ columns }: { columns: FooterColumnData[] }) {
  return (
    <div className="bg-primary border-t border-white/10 pt-16 pb-10 w-full">
      <div className="max-w-[1200px] mx-auto px-6 lg:px-8">

        {/* Single row — logo col + 4 nav columns */}
        <div className="grid grid-cols-2 md:grid-cols-[200px_repeat(4,1fr)] gap-8 lg:gap-10 mb-12">

          {/* Logo, tagline, contact, social */}
          <div className="col-span-2 md:col-span-1 flex flex-col gap-4">
            <Link href="/" aria-label="Brandtangent — home">
              <BrandtangentLogo variant="light" className="h-10" animated={false} />
            </Link>
            <p className="text-[13px] text-white/70 font-normal leading-relaxed">
              Strategy-led brand and creative for businesses that mean it.
            </p>
            <div className="flex flex-col gap-1.5 text-[13px] text-white/70 font-normal">
              <p>San Francisco, CA</p>
              <a href="mailto:hello@brandtangent.com" className="hover:text-white transition-colors">
                hello@brandtangent.com
              </a>
              <a href="tel:+18005550199" className="hover:text-white transition-colors">
                +1 800 555 0199
              </a>
            </div>
            <div className="flex gap-2 mt-1">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  aria-label={social.label}
                  className="w-8 h-8 rounded-full border border-white/20 flex items-center justify-center text-white/70 hover:text-white hover:border-white transition-colors"
                >
                  <social.icon className="w-3.5 h-3.5" />
                </a>
              ))}
            </div>
          </div>

          {/* 4 nav columns — each in its own grid column */}
          {columns.map((col) => (
            <div key={col.title}>
              <h3 className="micro-cap text-white mb-4">
                {col.title}
              </h3>
              <ul className="flex flex-col gap-2.5">
                {col.links.map((item) => (
                  <li key={item.label}>
                    <FooterNavItem href={item.href}>{item.label}</FooterNavItem>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/10 pt-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <p className="text-[13px] text-white/70 font-normal">
            © {new Date().getFullYear()} Brandtangent. All rights reserved.
          </p>
          <div className="flex gap-4">
            {[
              { label: "Privacy Policy", href: "/privacy-policy" },
              { label: "Terms", href: "/privacy-policy" },
            ].map(({ label, href }) => (
              <Link key={label} href={href} className="text-[13px] text-white/70 hover:text-white transition-colors font-normal">
                {label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

// Provide default footer data if async fetch fails
const DEFAULT_COLUMNS: FooterColumnData[] = [
  {
    title: "Overview",
    links: [
      { label: "About Us", href: "/about" },
      { label: "Services", href: "/services" },
      { label: "Our Work", href: "/case-studies" },
      { label: "Blog", href: "/blog" },
    ],
  },
]

export default async function Footer() {
  let columns = DEFAULT_COLUMNS
  try {
    columns = await getFooterNavColumns()
  } catch (e) {
    console.warn("Failed to fetch footer columns, using defaults", e)
  }

  return (
    <footer className="relative z-40 w-full">
      <FooterInner columns={columns} />
    </footer>
  )
}

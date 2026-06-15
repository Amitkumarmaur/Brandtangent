"use client"

import { useRef } from "react"
import { motion, useInView } from "motion/react"
import Image from "next/image"
import Link from "next/link"
import { ArrowUpRight } from "lucide-react"

interface IndustryCard {
  industry: string
  headline: string
  services: string
  yearsExp: number
  clients: number
  clientLabel: string
  image: string
  caseStudies: { name: string; bg: string }[]
}

const defaultIndustries: IndustryCard[] = [
  {
    industry: "Government",
    headline: "We Have Helped Leading Government Sectors In The UAE",
    services:
      "Web Design & Development, Mobile App Development, Digital Marketing, SEO, Social Media Marketing, ERP Software Solutions.",
    yearsExp: 10,
    clients: 55,
    clientLabel: "Clients across various government sectors.",
    image: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=900&q=80",
    caseStudies: [
      { name: "Gov Portal", bg: "#1a1a2e" },
      { name: "Smart City", bg: "#16213e" },
      { name: "UAE Digital", bg: "#111827" },
    ],
  },
  {
    industry: "Real Estate",
    headline: "We Are Your Go-To Company Among Famed Real Estate Companies In The UAE",
    services:
      "Web Design & Development, Mobile App Development, Digital Marketing, SEO, Social Media Marketing, ERP Software Solutions.",
    yearsExp: 10,
    clients: 53,
    clientLabel: "Clients across various real estate sectors.",
    image: "https://images.unsplash.com/photo-1486325212027-8081e485255e?auto=format&fit=crop&w=900&q=80",
    caseStudies: [
      { name: "AVELON", bg: "#111" },
      { name: "Emaar", bg: "#1a1206" },
      { name: "Damac", bg: "#0d1b2a" },
    ],
  },
  {
    industry: "Education",
    headline: "Our Clients' Substantial Growth Through These Channels Reflects The Impact",
    services:
      "Web Design & Development, Mobile App Development, Digital Marketing, SEO, Social Media Marketing, ERP Software Solutions.",
    yearsExp: 10,
    clients: 59,
    clientLabel: "Clients across various education sectors.",
    image: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=900&q=80",
    caseStudies: [
      { name: "Manipal", bg: "#1a0a0a" },
      { name: "Amity", bg: "#0a0a1a" },
      { name: "Skillbridge", bg: "#0a1a0a" },
    ],
  },
  {
    industry: "Home & Living",
    headline: "We Have Worked With Leading Home & Living Industries Across The Region",
    services:
      "Web Design & Development, Mobile App Development, Digital Marketing, SEO, Social Media Marketing, ERP Software Solutions.",
    yearsExp: 10,
    clients: 51,
    clientLabel: "Clients across various home & living sectors.",
    image: "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=900&q=80",
    caseStudies: [
      { name: "Enzo", bg: "#111" },
      { name: "The Fretman", bg: "#0d1017" },
      { name: "Dilara", bg: "#120d17" },
    ],
  },
  {
    industry: "Fashion",
    headline: "We Have Helped Several Fashion Industries In Dubai Grow Their Digital Presence",
    services:
      "Web Design & Development, Mobile App Development, Digital Marketing, SEO, Social Media Marketing, ERP Software Solutions.",
    yearsExp: 10,
    clients: 58,
    clientLabel: "Clients across various fashion sectors.",
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=900&q=80",
    caseStudies: [
      { name: "Surjuman", bg: "#111" },
      { name: "Sephora", bg: "#0a0a1a" },
      { name: "Rivoli", bg: "#1a0a00" },
    ],
  },
]

/** Sticky stack offsets — scaled for compact cards. */
const STICKY_TOP_BASE_REM = 5
const STICKY_TOP_STEP_REM = 2.25
/** Scroll runway between cards so each transition has time to stick. */
const CARD_SCROLL_HEIGHT = 80
const CARD_MIN_HEIGHT = "26rem"

const CARD_SURFACES = [
  "rgb(52, 52, 56)",
  "rgb(65, 65, 69)",
  "rgb(77, 77, 83)",
  "rgb(89, 89, 96)",
  "rgb(101, 101, 109)",
  "rgb(114, 114, 122)",
  "rgb(126, 126, 135)",
]

interface ServiceIndustriesProps {
  title?: string
  industries?: IndustryCard[]
}

export default function ServiceIndustries({
  title = "Proven Results for a Diverse Clientele",
  industries = defaultIndustries,
}: ServiceIndustriesProps) {
  const titleRef = useRef(null)
  const titleInView = useInView(titleRef, { once: true, margin: "-100px" })

  return (
    <section className="relative w-full bg-black pt-14 md:pt-16 pb-20 md:pb-28 lg:pb-32">
      <motion.h2
        ref={titleRef}
        initial={{ opacity: 0, y: 30 }}
        animate={titleInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className="mx-auto mb-12 max-w-3xl px-6 text-center text-3xl font-light leading-tight tracking-tight text-white md:mb-16 md:text-4xl lg:text-5xl"
      >
        {title}
      </motion.h2>

      <div
        className="mx-auto w-full max-w-[1200px] px-4 md:px-[clamp(16px,4vw,60px)]"
      >
        {industries.map((card, index) => (
          <div
            key={card.industry}
            className="relative mb-8 lg:sticky lg:mb-0"
            style={{
              top: `${STICKY_TOP_BASE_REM + index * STICKY_TOP_STEP_REM}rem`,
              zIndex: 10 + index,
            }}
          >
            <article
              className="overflow-hidden rounded-2xl border border-white/5 md:rounded-3xl"
              style={{
                backgroundColor: CARD_SURFACES[index] ?? CARD_SURFACES[CARD_SURFACES.length - 1],
                boxShadow: "0 -8px 24px rgba(0,0,0,0.22)",
                minHeight: CARD_MIN_HEIGHT,
              }}
            >
              <div
                className="grid grid-cols-1 lg:grid-cols-[35%_35%_30%]"
                style={{ minHeight: CARD_MIN_HEIGHT }}
              >
                {/* Left — title, headline, CTA, services */}
                <div className="flex flex-col justify-between p-8 md:p-10 lg:p-12">
                  <div>
                    <h3 className="mb-3 text-2xl font-semibold leading-tight text-white md:text-3xl">
                      {card.industry}
                    </h3>
                    <p className="text-sm font-medium capitalize leading-snug text-white/90 md:text-base">
                      {card.headline}
                    </p>
                    <Link
                      href="/projects"
                      className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-accent-orange px-5 py-2 text-xs font-semibold text-white transition-opacity hover:opacity-90 md:text-sm"
                    >
                      Explore More
                      <ArrowUpRight className="h-3.5 w-3.5" />
                    </Link>
                  </div>

                  <div className="mt-6">
                    <div className="mb-2 flex items-center gap-2">
                      <span className="h-1.5 w-1.5 shrink-0 rounded-sm bg-accent-orange" />
                      <span className="text-xs text-white/60 md:text-sm">Our Services Include</span>
                    </div>
                    <p className="text-xs leading-relaxed text-white/55 md:text-sm">{card.services}</p>
                  </div>
                </div>

                {/* Center — image */}
                <div className="flex items-center justify-center p-6 md:p-8">
                  <div className="relative h-52 w-full overflow-hidden rounded-xl sm:h-56 lg:h-full lg:min-h-[240px] lg:max-h-[300px]">
                    <Image
                      src={card.image}
                      alt={card.industry}
                      fill
                      sizes="(max-width: 1200px) 35vw, 360px"
                      className="object-cover object-center"
                    />
                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
                  </div>
                </div>

                {/* Right — stats + case studies */}
                <div className="flex flex-col justify-between border-t border-white/10 p-8 md:p-10 lg:border-l lg:border-t-0 lg:p-12">
                  <div className="space-y-5">
                    <div>
                      <p className="tnum text-4xl font-light leading-none text-white md:text-5xl">
                        {card.yearsExp}
                        <span className="text-white/50"> +</span>
                      </p>
                      <p className="mt-2 text-xs leading-relaxed text-white/55 md:text-sm">
                        Years of experience in the {card.industry.toLowerCase()} sectors.
                      </p>
                    </div>
                    <div>
                      <p className="tnum text-4xl font-light leading-none text-white md:text-5xl">
                        {card.clients}
                        <span className="text-white/50"> +</span>
                      </p>
                      <p className="mt-2 text-xs leading-relaxed text-white/55 md:text-sm">{card.clientLabel}</p>
                    </div>
                  </div>

                  <div className="mt-6">
                    <div className="mb-3 flex items-center gap-2">
                      <span className="h-1.5 w-1.5 shrink-0 rounded-sm bg-accent-orange" />
                      <span className="text-xs text-white/60 md:text-sm">See Case Studies</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {card.caseStudies.map((cs) => (
                        <div
                          key={cs.name}
                          className="flex h-11 min-w-[72px] flex-1 cursor-pointer items-center justify-center rounded-xl px-3 text-[11px] font-semibold uppercase tracking-wide text-white/75 transition-colors hover:text-white md:h-12 md:text-xs"
                          style={{ backgroundColor: cs.bg }}
                        >
                          {cs.name}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </article>

            {index < industries.length - 1 ? (
              <div aria-hidden className="hidden lg:block" style={{ height: `${CARD_SCROLL_HEIGHT}px` }} />
            ) : null}
          </div>
        ))}
      </div>
    </section>
  )
}

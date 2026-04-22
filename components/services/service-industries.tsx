"use client"

import { useRef } from "react"
import { motion, useInView } from "framer-motion"
import Image from "next/image"

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
    services: "Web Design & Development, Mobile App Development, Digital Marketing, SEO ,Social Media Marketing, ERP Software Solutions.",
    yearsExp: 10, clients: 55, clientLabel: "Clients across various government sectors.",
    image: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=900&q=80",
    caseStudies: [{ name: "Gov Portal", bg: "#1a1a2e" }, { name: "Smart City", bg: "#16213e" }, { name: "UAE Digital", bg: "#111827" }],
  },
  {
    industry: "Real Estate",
    headline: "We Are Your Go-To Company Among Famed Real Estate Companies In The UAE",
    services: "Web Design & Development, Mobile App Development, Digital Marketing, SEO ,Social Media Marketing, ERP Software Solutions.",
    yearsExp: 10, clients: 53, clientLabel: "Clients across various real estate sectors.",
    image: "https://images.unsplash.com/photo-1486325212027-8081e485255e?auto=format&fit=crop&w=900&q=80",
    caseStudies: [{ name: "AVELON", bg: "#111" }, { name: "Emaar", bg: "#1a1206" }, { name: "Damac", bg: "#0d1b2a" }],
  },
  {
    industry: "Education",
    headline: "Our Clients' Substantial Growth Through These Channels Reflects The Impact",
    services: "Web Design & Development, Mobile App Development, Digital Marketing, SEO ,Social Media Marketing, ERP Software Solutions.",
    yearsExp: 10, clients: 59, clientLabel: "Clients across various education sectors.",
    image: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=900&q=80",
    caseStudies: [{ name: "Manipal", bg: "#1a0a0a" }, { name: "Amity", bg: "#0a0a1a" }, { name: "Skillbridge", bg: "#0a1a0a" }],
  },
  {
    industry: "Home & Living",
    headline: "We Have Worked With Leading Home & Living Industries Across The Region",
    services: "Web Design & Development, Mobile App Development, Digital Marketing, SEO ,Social Media Marketing, ERP Software Solutions.",
    yearsExp: 10, clients: 51, clientLabel: "Clients across various home & living sectors.",
    image: "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=900&q=80",
    caseStudies: [{ name: "Enzo", bg: "#111" }, { name: "The Fretman", bg: "#0d1017" }, { name: "Dilara", bg: "#120d17" }],
  },
  {
    industry: "Fashion",
    headline: "We Have Helped Several Fashion Industries In Dubai Grow Their Digital Presence",
    services: "Web Design & Development, Mobile App Development, Digital Marketing, SEO ,Social Media Marketing, ERP Software Solutions.",
    yearsExp: 10, clients: 58, clientLabel: "Clients across various fashion sectors.",
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=900&q=80",
    caseStudies: [{ name: "Surjuman", bg: "#111" }, { name: "Sephora", bg: "#0a0a1a" }, { name: "Rivoli", bg: "#1a0a00" }],
  },
]

// Peek height between stacked cards (px each card tabs above next)
const PEEK = 14
// Nav/header height
const NAV = 80
// Extra scroll space for each card so the transition feels smooth
const CARD_SCROLL_HEIGHT = 120

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
    <section className="relative w-full bg-foreground py-16 md:py-20">

      {/* Section Title */}
      <motion.h2
        ref={titleRef}
        initial={{ opacity: 0, y: 30 }}
        animate={titleInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.7 }}
        className="text-3xl md:text-5xl font-light text-white text-center mb-20 md:mb-24 px-6 tracking-tight leading-tight"
      >
        {title}
      </motion.h2>

      {/*
        Stacking cards:
        - All cards are `position: sticky`
        - Each card's `top` increases by PEEK px (e.g. 80, 94, 108…)
        - So each previous card shows a PEEK-height tab above the current card
        - paddingBottom gives the section enough scroll room
      */}
      <div>
        {industries.map((card, index) => (
          <div
            key={card.industry}
            style={{
              position: "sticky",
              top: `${NAV + index * PEEK}px`,
              zIndex: 10 + index,
            }}
          >
            {/* Centered container — max 1200px like reference */}
            <div
              className="mx-auto"
              style={{ maxWidth: "1200px", paddingLeft: "clamp(16px, 4vw, 60px)", paddingRight: "clamp(16px, 4vw, 60px)" }}
            >
              <div
                className="rounded-2xl md:rounded-3xl overflow-hidden relative bg-grey-50 border border-grey-200"
                style={{
                  boxShadow: "0 4px 24px rgba(0,0,0,0.06), 0 1px 0 rgba(0,0,0,0.04)",
                }}
              >
                {/* Card index badge */}
                <div className="absolute top-5 right-5 w-8 h-8 rounded-full bg-grey-200 flex items-center justify-center text-grey-400 text-xs font-mono z-10">
                  {String(index + 1).padStart(2, '0')}
                </div>
                {/* 3-column grid: 35% | 35% | 30% */}
                <div
                  className="grid grid-cols-1 lg:grid-cols-[35%_35%_30%]"
                  style={{ minHeight: "420px" }}
                >

                  {/* LEFT — Title + Headline + Services */}
                  <div className="flex flex-col justify-between p-10 md:p-14">
                    <div>
                      <h3 className="text-2xl md:text-3xl font-bold text-foreground mb-5 leading-tight">
                        {card.industry}
                      </h3>
                      <p className="text-foreground text-base md:text-lg font-bold leading-snug">
                        {card.headline}
                      </p>
                    </div>
                    <div className="mt-8">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-2 h-2 rounded-full bg-ignite-orange" />
                        <span className="text-grey-400 text-sm">Our Services Include</span>
                      </div>
                      <p className="text-grey-400 text-sm leading-relaxed">{card.services}</p>
                    </div>
                  </div>

                  {/* CENTER — Inset image with rounded corners + gradient overlay */}
                  <div className="flex items-center justify-center p-8 md:p-10">
                    <div
                      className="relative w-full rounded-2xl overflow-hidden"
                      style={{ minHeight: "280px", height: "100%" }}
                    >
                      <Image
                        src={card.image}
                        alt={card.industry}
                        fill
                        sizes="(max-width: 1200px) 35vw, 420px"
                        className="object-cover object-center hover:scale-105 transition-transform duration-700"
                      />
                      {/* Subtle bottom gradient on image */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent pointer-events-none rounded-2xl" />
                    </div>
                  </div>

                  {/* RIGHT — Stats + Case Studies */}
                  <div className="flex flex-col justify-between p-10 md:p-12">
                    <div className="space-y-7">
                      <div>
                        <p className="text-5xl md:text-6xl font-bold text-foreground tracking-tight leading-none">
                          {card.yearsExp} <span className="text-ignite-orange">+</span>
                        </p>
                        <p className="text-grey-400 text-sm mt-2 leading-relaxed">
                          Years of experience in the {card.industry.toLowerCase()} sectors.
                        </p>
                      </div>
                      <div>
                        <p className="text-5xl md:text-6xl font-bold text-foreground tracking-tight leading-none">
                          {card.clients} <span className="text-ignite-orange">+</span>
                        </p>
                        <p className="text-grey-400 text-sm mt-2 leading-relaxed">
                          {card.clientLabel}
                        </p>
                      </div>
                    </div>

                    <div className="mt-8">
                      <div className="flex items-center gap-2 mb-3">
                        <div className="w-2 h-2 rounded-full bg-ignite-orange" />
                        <span className="text-grey-400 text-sm">See Case Studies</span>
                      </div>
                      <div className="flex gap-3 flex-wrap">
                        {card.caseStudies.map((cs) => (
                          <div
                            key={cs.name}
                            className="h-12 px-4 min-w-[76px] rounded-xl flex items-center justify-center text-foreground/60 text-xs font-semibold border border-grey-200 bg-background hover:border-ignite-orange/60 hover:text-ignite-orange hover:-translate-y-0.5 transition-all duration-200 cursor-pointer"

                          >
                            {cs.name}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                </div>
              </div>
            </div>

            {/* Scroll gap between cards — gives natural scroll pacing */}
            {index < industries.length - 1 && (
              <div style={{ height: `${CARD_SCROLL_HEIGHT}px` }} />
            )}
          </div>
        ))}
      </div>

    </section>
  )
}

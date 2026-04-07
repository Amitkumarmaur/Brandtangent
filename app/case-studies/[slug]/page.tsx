"use client"

import React from "react"
import { motion } from "framer-motion"
import Header from "@/components/header"
import Footer from "@/components/footer"
import { CheckCircle2, Quote, ArrowUpRight, Code2, Factory, Globe2, Clock, Palette, Type } from "lucide-react"

// ── MOCK DATA SCHEMA ──────────────────────────────────────────────────────────
const CASE_STUDY = {
  hero: {
    clientName: "Dubai International Finance Centre",
    title: "Transforming the Global Financial Ecosystem",
    subtitle: "A complete structural overhaul of DIFC's digital presence, optimizing speed, design, and global accessibility.",
    image: "/images/project-estore.png",
  },
  overview: [
    { label: "Industry", value: "Real Estate", icon: Factory },
    { label: "Country", value: "UAE", icon: Globe2 },
    { label: "Timeline", value: "6 Months", icon: Clock },
    { label: "Services", value: "Development", icon: Code2 },
  ],
  client: {
    heading: "The Vision",
    description: "Dubai International Finance Centre (DIFC) required a highly responsive, visually appealing digital platform to target international investors. They needed to accommodate a massive library of complex information while maintaining lightning-fast load times and absolute data security.",
  },
  designSystem: {
    heading: "Brand Identity Layout",
    typography: {
      fontFamily: "Inter / Plus Jakarta Sans",
      weights: ["Regular 400", "Medium 500", "Bold 700", "Black 900"],
    },
    colors: [
      { name: "Executive Black", hex: "#080808" },
      { name: "Slate Grey", hex: "#1A1A1A" },
      { name: "Ignite Orange", hex: "#FF5722" },
      { name: "Neutral White", hex: "#F8F8F8" },
    ]
  },
  gallery: [
    "/images/project-nexpay.png",
    "/images/project-mighty.png",
  ],
  challenges: [
    {
      title: "Attractive UI/UX",
      description: "We architected a bespoke, premium layout that perfectly encapsulated their market leadership without sacrificing usability.",
    },
    {
      title: "Content Architecture",
      description: "Integrated a headless CMS to ensure dynamic routing of content that reflected DIFC's core values seamlessly.",
    },
    {
      title: "Responsive Scaling",
      description: "Our engineers enforced pixel-perfect multi-viewport scaling so assets retain highest quality on any mobile screen.",
    },
    {
      title: "Advanced Security",
      description: "Deployed enterprise-grade serverless edge-caching to safeguard visitor data and prevent aggressive DDoS attacks.",
    },
  ],
  results: [
    { heading: "Increase in User Retention", value: "85%" },
    { heading: "Page Speed Improvement", value: "3x" },
    { heading: "Decrease in Bounce Rate", value: "12%" },
    { heading: "Security Uptime", value: "99%" }
  ],
  testimonial: {
    quote: "The team balanced high-end aesthetics with complex financial functionality perfectly. The new digital ecosystem is exactly what we needed to maintain global leadership.",
    author: "Ali Al-Maktoum",
    role: "Head of Digital, DIFC",
  },
}

export default function CaseStudyPage() {
  const data = CASE_STUDY

  return (
    <main className="bg-white min-h-screen text-foreground overflow-hidden font-sans selection:bg-ignite-orange selection:text-white">
      <Header />

      <div className="w-full bg-white relative">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(255,87,34,0.05),transparent_50%)] pointer-events-none" />
        
        {/* 1. HERO SECTION */}
        <section className="relative w-full pt-32 pb-16 lg:pt-48 lg:pb-24 px-4 sm:px-6 lg:px-8 border-b border-foreground/5 z-10">
          <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#FFD2B8] text-ignite-orange text-xs font-bold tracking-widest uppercase mb-6 shadow-sm">
                Case Study <ArrowUpRight className="w-3.5 h-3.5" />
              </div>
              
              <h1 className="font-heading text-4xl md:text-5xl lg:text-7xl font-bold uppercase tracking-tight leading-[1] mb-6 text-foreground">
                {data.hero.title}
              </h1>
              
              <p className="text-lg md:text-xl text-foreground/70 leading-relaxed max-w-xl font-medium">
                {data.hero.subtitle}
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="w-full relative aspect-[4/3] rounded-[2rem] overflow-hidden border border-foreground/5 shadow-[0_20px_50px_rgba(0,0,0,0.08)] bg-grey-100 flex items-center justify-center p-4 lg:p-6"
            >
              <div className="relative w-full h-full rounded-xl overflow-hidden shadow-sm">
                <img
                  src={data.hero.image}
                  alt={data.hero.title}
                  className="w-full h-full object-cover"
                />
              </div>
            </motion.div>
          </div>
        </section>

        {/* 2. OVERVIEW ROW */}
        <section className="w-full bg-grey-50 border-b border-foreground/5 relative z-10">
          <div className="max-w-7xl mx-auto px-6 lg:px-8 py-10">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {data.overview.map((item, i) => {
                const Icon = item.icon
                return (
                  <div key={i} className="flex flex-col gap-2">
                    <div className="flex items-center gap-2 text-foreground/50">
                      <Icon className="w-4 h-4 text-ignite-orange" />
                      <span className="text-xs font-bold uppercase tracking-widest">{item.label}</span>
                    </div>
                    <span className="text-lg font-bold text-foreground">{item.value}</span>
                  </div>
                )
              })}
            </div>
          </div>
        </section>

        {/* 3. ABOUT CLIENT */}
        <section className="relative w-full py-20 lg:py-32 px-6 lg:px-8 bg-white z-10">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="font-heading text-xl md:text-2xl font-bold text-ignite-orange uppercase tracking-widest mb-8">
              {data.client.heading}
            </h2>
            <p className="font-heading text-2xl md:text-4xl lg:text-5xl text-foreground leading-[1.3] font-bold tracking-tight text-balance">
              "{data.client.description}"
            </p>
          </div>
        </section>

        {/* 4. DESIGN SYSTEM */}
        <section className="relative w-full py-20 lg:py-32 px-6 lg:px-8 bg-grey-50 border-y border-foreground/5 z-10">
          <div className="max-w-7xl mx-auto">
            <div className="mb-16">
              <h2 className="font-heading text-4xl md:text-6xl font-black text-foreground uppercase tracking-tight">
                {data.designSystem.heading}
              </h2>
              <p className="text-foreground/60 text-lg mt-4 max-w-2xl font-medium">Crafting a distinctive visual language that perfectly anchors the client's position as a global leader.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16">
              {/* Typography Box */}
              <div className="bg-white rounded-[2rem] border border-foreground/10 p-10 flex flex-col justify-between overflow-hidden relative shadow-sm">
                <div className="absolute -right-10 -bottom-10 text-[200px] font-black text-foreground/[0.03] font-heading leading-none">Aa</div>
                <div className="relative z-10">
                  <div className="flex items-center gap-3 mb-8 text-ignite-orange">
                    <Type className="w-6 h-6" />
                    <h3 className="font-heading text-xl font-bold tracking-widest uppercase text-foreground">Typography Scale</h3>
                  </div>
                  <h4 className="font-heading text-4xl md:text-5xl text-foreground font-bold mb-8 border-b border-foreground/10 pb-8">{data.designSystem.typography.fontFamily}</h4>
                  
                  <div className="space-y-4 font-sans text-lg text-foreground/70 font-medium">
                    {data.designSystem.typography.weights.map((weight, i) => (
                       <div key={i} className="flex justify-between items-center">
                          <span>{weight}</span>
                          <span className="text-foreground font-bold">Aa Bb Cc</span>
                       </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Color Palette */}
              <div className="bg-white rounded-[2rem] border border-foreground/10 p-10 shadow-sm">
                <div className="flex items-center gap-3 mb-8 text-ignite-orange">
                  <Palette className="w-6 h-6" />
                  <h3 className="font-heading text-xl font-bold tracking-widest uppercase text-foreground">Color Palette</h3>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {data.designSystem.colors.map((color, i) => (
                    <div key={i} className="flex items-center gap-4 p-3 rounded-2xl bg-grey-50 border border-foreground/10 hover:border-foreground/30 transition-colors">
                      <div className="w-16 h-16 rounded-xl border border-foreground/10 shadow-sm" style={{ backgroundColor: color.hex }} />
                      <div>
                        <p className="font-bold text-foreground text-sm uppercase tracking-wider mb-1">{color.name}</p>
                        <p className="font-mono text-xs font-semibold text-foreground/50">{color.hex}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 5. CHALLENGES GRID */}
        <section className="relative w-full py-20 lg:py-32 px-6 lg:px-8 bg-white z-10">
          <div className="max-w-7xl mx-auto">
            <div className="mb-16">
              <h2 className="font-heading text-4xl md:text-6xl font-black text-foreground uppercase tracking-tight">
                Execution Hurdles
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
              {data.challenges.map((challenge, i) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  className="bg-grey-50 border border-foreground/5 p-10 rounded-[1.5rem] hover:border-ignite-orange/50 transition-colors group shadow-sm hover:shadow-md"
                >
                  <div className="w-12 h-12 rounded-full bg-[#FFD2B8] flex items-center justify-center mb-8 group-hover:bg-ignite-orange transition-colors">
                    <CheckCircle2 className="w-6 h-6 text-ignite-orange group-hover:text-white transition-colors" />
                  </div>
                  <h3 className="font-heading text-2xl font-bold text-foreground uppercase tracking-tight mb-4">
                    {challenge.title}
                  </h3>
                  <p className="text-foreground/70 font-medium text-lg leading-relaxed">
                    {challenge.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* 6. IMMERSIVE GALLERY SHOWCASE */}
        <section className="relative w-full py-24 pb-32 px-6 lg:px-8 bg-grey-100 border-y border-foreground/5 overflow-hidden z-10">
          <div className="max-w-[100rem] mx-auto text-center mb-16">
            <h2 className="font-heading text-2xl font-bold text-ignite-orange uppercase tracking-widest mb-4">
              Project Gallery
            </h2>
            <p className="font-heading text-4xl lg:text-5xl font-black text-foreground uppercase tracking-tight">
              High-Fidelity UI Screens.
            </p>
          </div>
          
          <div className="max-w-[100rem] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16">
             {data.gallery.map((imgSrc, i) => (
               <motion.div
                 key={i}
                 initial={{ opacity: 0, y: 30 }}
                 whileInView={{ opacity: 1, y: 0 }}
                 viewport={{ once: true }}
                 transition={{ duration: 0.7, delay: i * 0.2 }}
                 className="relative w-full aspect-[4/3] rounded-[2rem] overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.1)] group"
               >
                  <img
                    src={imgSrc}
                    alt={"Project Gallery Mockup"}
                    className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                  />
               </motion.div>
             ))}
          </div>
        </section>

        {/* 7. RESULTS AND NUMBERS */}
        <section className="relative w-full py-20 lg:py-32 px-6 lg:px-8 bg-white z-10">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16 lg:mb-20">
               <h2 className="font-heading text-4xl md:text-6xl font-black text-foreground uppercase tracking-tight">
                The Results
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-10">
              {data.results.map((res, i) => (
                <div 
                  key={i}
                  className="bg-white border border-foreground/10 shadow-sm rounded-[2rem] p-8 flex flex-col items-center text-center justify-center min-h-[250px] transition-all hover:border-ignite-orange hover:-translate-y-2 relative overflow-hidden group"
                >
                  <div className="absolute inset-x-0 bottom-0 h-2 bg-ignite-orange translate-y-full group-hover:translate-y-0 transition-transform" />
                  <p className="font-heading text-5xl md:text-6xl lg:text-7xl font-black text-ignite-orange tracking-[-0.05em] mb-4 relative z-10">
                    {res.value}
                  </p>
                  <h4 className="font-sans font-bold text-sm text-foreground/60 uppercase tracking-widest relative z-10">
                    {res.heading}
                  </h4>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 8. TESTIMONIAL */}
        <section className="relative w-full py-24 lg:py-32 px-6 lg:px-8 bg-grey-50 border-t border-foreground/5 z-10">
          <div className="max-w-4xl mx-auto text-center relative z-10">
            <Quote className="mx-auto w-16 h-16 text-ignite-orange mb-10 opacity-30 fill-ignite-orange" />
            
            <h2 className="font-heading text-3xl md:text-5xl text-foreground font-black leading-[1.3] tracking-tight mb-12">
              "{data.testimonial.quote}"
            </h2>
            
            <div className="flex flex-col items-center justify-center">
              <p className="font-heading text-xl font-bold uppercase tracking-widest text-ignite-orange mb-1">
                {data.testimonial.author}
              </p>
              <p className="font-sans text-sm font-bold tracking-widest text-foreground/50 uppercase">
                {data.testimonial.role}
              </p>
            </div>
          </div>
        </section>

        {/* 9. CTA BLOCK */}
        <section className="relative w-full py-24 pb-32 px-6 lg:px-8 bg-ignite-orange overflow-hidden z-10">
          <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-white opacity-20 rounded-full blur-[100px] pointer-events-none" />
          
          <div className="max-w-5xl mx-auto text-center relative z-10">
            <h2 className="font-heading text-4xl md:text-6xl lg:text-[5rem] font-bold uppercase tracking-tight leading-[1] mb-8 text-[#1A1A1A]">
              Have a similar vision?
            </h2>
            <p className="font-sans text-xl md:text-2xl font-bold tracking-wide text-[#1A1A1A]/80 mb-12 max-w-2xl mx-auto">
              Our experts are ready to architect and deploy your next digital transformation. Let's make it phenomenal.
            </p>
            
            <button className="bg-[#1A1A1A] text-white px-10 py-5 rounded-full font-heading text-xl font-black uppercase tracking-widest hover:bg-black transition-colors shadow-xl hover:scale-105 transform">
              Start Your Project
            </button>
          </div>
        </section>

      </div>
      <Footer />
    </main>
  )
}

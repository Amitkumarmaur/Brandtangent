import TechGlobe from "./tech-globe"

export default function TrustIndicators() {
  const Logo = ({ name, isBold = false, iconClass = "" }: { name: string, isBold?: boolean, iconClass?: string }) => (
    <div className={`flex items-center justify-center grayscale opacity-60 hover:opacity-100 hover:grayscale-0 transition-all duration-300 cursor-pointer ${iconClass} mx-8`}>
      <span className={`text-2xl md:text-3xl tracking-tight text-[#0A0A0A] ${isBold ? 'font-black' : 'font-bold'}`}>
        {name}
      </span>
    </div>
  )

  const LogosSet = () => (
    <>
      <Logo name="n8n" isBold iconClass="text-[#FF405B]" />
      <Logo name="make" isBold iconClass="tracking-tighter" />
      <Logo name="zapier" />
      <div className="flex items-center gap-1 grayscale opacity-60 hover:opacity-100 transition-all cursor-pointer mx-8">
        <span className="w-8 h-8 bg-[#0A0A0A] rounded-sm text-white flex items-center justify-center font-bold text-sm">W</span>
        <span className="font-bold text-2xl md:text-3xl text-[#0A0A0A] tracking-tight">webflow</span>
      </div>
      <Logo name="Google Cloud" iconClass="font-medium" />
      <Logo name="SEMRush" />
      <Logo name="ahrefs" iconClass="text-[#FF8730]" />
      <Logo name="Claude" />
      <div className="flex items-center gap-2 grayscale opacity-60 hover:opacity-100 transition-all cursor-pointer mx-8">
        <span className="w-8 h-8 border-[3px] border-[#0A0A0A] rounded-full flex items-center justify-center text-lg">❖</span>
        <span className="font-bold text-2xl md:text-3xl text-[#0A0A0A] tracking-tight">OpenAI</span>
      </div>
    </>
  )

  return (
    <section className="relative w-full py-10 lg:py-12 bg-grey-100 overflow-hidden flex flex-col items-center border-t border-b border-grey-200/50">
      
      {/* Global CSS for the Marquee Slider */}
      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0%); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          animation: marquee 35s linear infinite;
        }
        .animate-marquee:hover {
          animation-play-state: paused;
        }
      `}</style>
      
      {/* Small top label */}
      <div className="flex items-center gap-2 mb-4 relative z-20">
        <div className="w-2 h-2 rounded-full bg-ignite-orange" />
        <span className="font-heading text-ignite-orange font-medium tracking-wider text-sm uppercase">Our Tech Stack</span>
      </div>

      {/* Main Headline */}
      <h2 className="font-heading text-3xl md:text-4xl lg:text-5xl font-semibold text-foreground text-center max-w-4xl tracking-tight z-20 leading-tight px-4">
        Fueled Up 500+ Brands to Roar with Next-Gen AI & Tech
      </h2>

      {/* 3D Earth Globe Container */}
      <div className="relative w-full h-[160px] sm:h-[190px] md:h-[210px] lg:h-[240px] mt-2 mb-2 flex justify-center items-end">
         <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-[45%] w-[320px] h-[320px] sm:w-[420px] sm:h-[420px] md:w-[470px] md:h-[470px] lg:w-[530px] lg:h-[530px] z-0 pointer-events-none rounded-full overflow-hidden" 
              style={{ maskImage: "linear-gradient(to bottom, black 40%, transparent 80%)", WebkitMaskImage: "linear-gradient(to bottom, black 40%, transparent 80%)" }}>
             <TechGlobe />
         </div>

         {/* Full-width Logo Slider cutting horizontally across the globe */}
         <div className="w-full relative overflow-hidden flex whitespace-nowrap py-4 z-10 w-screen ml-[calc(-50vw+50%)]">
            <div className="animate-marquee flex items-center w-max">
               <LogosSet />
               <LogosSet />
            </div>
         </div>
      </div>
      
      {/* Bottom Global Presence Pill */}
      <div className="relative z-30 bg-background border border-grey-200 rounded-[2rem] px-5 sm:px-8 py-3.5 sm:py-4 flex items-center gap-5 sm:gap-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_40px_rgb(0,0,0,0.08)] transition-shadow overflow-x-auto max-w-[95vw]">
        <span className="text-foreground font-medium whitespace-nowrap hidden sm:block text-[0.85rem] sm:text-sm">Our Global Presence</span>
        <div className="h-5 w-px bg-grey-200 hidden sm:block shrink-0" />
        <div className="flex gap-4 sm:gap-6 text-xs sm:text-sm text-grey-400 font-medium whitespace-nowrap">
          <span className="flex items-center gap-2 transition-colors hover:text-foreground cursor-default"><div className="w-1.5 h-1.5 rounded-full bg-ignite-orange"/> USA</span>
          <span className="flex items-center gap-2 transition-colors hover:text-foreground cursor-default"><div className="w-1.5 h-1.5 rounded-full bg-ignite-orange"/> Canada</span>
          <span className="flex items-center gap-2 transition-colors hover:text-foreground cursor-default"><div className="w-1.5 h-1.5 rounded-full bg-ignite-orange"/> Saudi Arabia</span>
          <span className="flex items-center gap-2 transition-colors hover:text-foreground cursor-default"><div className="w-1.5 h-1.5 rounded-full bg-ignite-orange"/> Europe</span>
        </div>
      </div>
      
    </section>
  )
}

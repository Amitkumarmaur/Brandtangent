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
    <section className="relative w-full py-24 sm:py-32 bg-[#F5F7F9] overflow-hidden flex flex-col items-center border-t border-b border-[#E5E5E5]/50">
      
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
      <div className="flex items-center gap-3 mb-8 sm:mb-12 relative z-20">
        <div className="w-2.5 h-2.5 rounded-full bg-[#FF5722] animate-pulse" />
        <span className="text-sm font-semibold tracking-wider text-[#0A0A0A] uppercase letter-spacing-[0.2em]">Our Tech Stack</span>
      </div>

      {/* Main Headline */}
      <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-[#0A0A0A] text-center max-w-5xl tracking-[-0.02em] z-20 leading-[1.1] px-4">
        Fueled Up 500+ Brands to Roar with Next-Gen AI & Tech
      </h2>

      {/* 3D Earth Globe Container */}
      <div className="relative w-full h-[350px] sm:h-[450px] md:h-[550px] mt-12 mb-12 flex justify-center items-end">
         <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-[45%] w-[600px] h-[600px] sm:w-[800px] sm:h-[800px] md:w-[1000px] md:h-[1000px] z-0 pointer-events-none rounded-full overflow-hidden" 
              style={{ maskImage: "linear-gradient(to bottom, black 40%, transparent 80%)", WebkitMaskImage: "linear-gradient(to bottom, black 40%, transparent 80%)" }}>
             <TechGlobe />
         </div>

         {/* Full-width Logo Slider cutting horizontally across the globe */}
         <div className="w-full relative overflow-hidden flex whitespace-nowrap py-12 z-10 w-screen ml-[calc(-50vw+50%)]">
            <div className="animate-marquee flex items-center w-max">
               {/* Print the set of logos twice for seamless infinite loop */}
               <LogosSet />
               <LogosSet />
            </div>
         </div>
      </div>
      
      {/* Bottom Global Presence Pill */}
      <div className="relative z-30 bg-white border border-[#E5E5E5] rounded-[2rem] px-6 sm:px-10 py-5 flex items-center gap-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_40px_rgb(0,0,0,0.08)] transition-shadow overflow-x-auto max-w-[95vw]">
        <span className="text-[#0A0A0A] font-semibold whitespace-nowrap hidden sm:block text-sm sm:text-base">Our Global Presence</span>
        <div className="h-6 w-px bg-[#E5E5E5] hidden sm:block shrink-0" />
        <div className="flex gap-6 sm:gap-8 text-sm sm:text-base text-[#7D7D7D] font-medium whitespace-nowrap">
          <span className="flex items-center gap-2.5 transition-colors hover:text-[#0A0A0A] cursor-default"><div className="w-2 h-2 rounded-full bg-[#FF5722]"/> USA</span>
          <span className="flex items-center gap-2.5 transition-colors hover:text-[#0A0A0A] cursor-default"><div className="w-2 h-2 rounded-full bg-[#FF5722]"/> Canada</span>
          <span className="flex items-center gap-2.5 transition-colors hover:text-[#0A0A0A] cursor-default"><div className="w-2 h-2 rounded-full bg-[#FF5722]"/> Saudi Arabia</span>
          <span className="flex items-center gap-2.5 transition-colors hover:text-[#0A0A0A] cursor-default"><div className="w-2 h-2 rounded-full bg-[#FF5722]"/> Europe</span>
        </div>
      </div>
      
    </section>
  )
}

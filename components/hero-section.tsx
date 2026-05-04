"use client"

import { Play, Zap, Rocket } from "lucide-react"

export default function HeroSection() {
  return (
    <section className="relative bg-white flex items-center justify-center p-4 sm:p-5 lg:p-6 overflow-hidden font-sans pt-28 sm:pt-32 lg:pt-[140px] pb-10 md:pb-14 lg:pb-16">
      
      <div className="max-w-[1300px] w-full mx-auto">
        
        {/* CSS grid ensures both columns are strictly identical in overall height */}
        <div className="grid grid-cols-1 xl:grid-cols-[1.3fr_1fr] gap-4 lg:gap-6 items-stretch w-full min-h-[300px]">
          
          {/* Left Panel (Folder) */}
          <div className="flex flex-col relative w-full h-full">
            
            {/* Top Tab for the folder effect (positioned at top-left) */}
            <div className="w-[50%] md:w-[40%] h-8 sm:h-10 bg-[#FFD2B8] rounded-t-[1.5rem] relative self-start z-10 flex hidden sm:flex">
               {/* The inner curve smoothing for the tab (on the right side of the tab) */}
               <div className="absolute -right-6 bottom-0 w-6 h-6 overflow-hidden pointer-events-none">
                  <div className="w-full h-full rounded-bl-[1.5rem] shadow-[-20px_20px_0_20px_#FFD2B8]"></div>
               </div>
            </div>

            {/* Main Folder Box */}
            <div className="flex-1 bg-[#FFD2B8] rounded-b-[2rem] rounded-tr-[2rem] sm:rounded-tl-none rounded-tl-[2rem] p-5 sm:p-8 lg:p-8 flex flex-col justify-between relative z-20 w-full shadow-md text-left transition-all">
              <div className="w-full mt-1 lg:mt-2">
                <h1 className="font-heading text-3xl sm:text-4xl lg:text-[3.2rem] xl:text-[3.5rem] leading-[1.0] font-bold tracking-[-0.03em] uppercase text-foreground">
                  <span className="block mb-1 sm:mb-[6px]">AI-FIRST</span>
                  <span className="block mb-1 sm:mb-[6px]">MARKETING</span>
                  <span className="block mb-1 sm:mb-[6px]">AGENCY HELPING</span>
                  <span className="block mb-1 sm:mb-[6px]">BRANDS BECOME</span>
                  <span className="inline-block text-white bg-ignite-orange px-4 sm:px-6 py-1 sm:py-2 rounded-[2rem] mt-1 lg:mt-2 align-middle border-none">TOP 1%</span>
                </h1>
              </div>

              <div className="mt-6 lg:mt-8 w-full flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-t border-foreground/10 pt-4 sm:pt-5">
                
                <div className="flex items-center gap-2 max-w-[280px]">
                  <Rocket className="w-5 h-5 text-ignite-orange fill-ignite-orange shrink-0" />
                  <p className="text-foreground/80 text-xs sm:text-[0.85rem] font-medium leading-[1.2] text-balance">
                    12 years of design-driven development for B2B products
                  </p>
                </div>

                <button className="flex items-center gap-2.5 bg-foreground text-white hover:bg-white hover:text-foreground transition-colors py-2 sm:py-3 px-5 sm:px-6 rounded-full font-bold uppercase tracking-wider text-xs sm:text-sm whitespace-nowrap shadow-md group">
                  <div className="bg-white rounded-full p-1 text-foreground flex items-center justify-center w-6 h-6 sm:w-7 sm:h-7 transition-colors group-hover:bg-ignite-orange group-hover:text-white group-hover:shadow-[0_0_15px_rgba(255,87,34,0.5)]">
                    <Zap className="w-3.5 h-3.5 fill-current text-current" />
                  </div>
                  Book A Call
                </button>
              </div>
            </div>
          </div>

          {/* Right Panel (Video Player Placeholder) */}
          {/* h-full forces it to stretch perfectly to match the exact height of the Left Panel (including its tab) */}
          <div className="w-full h-full bg-grey-100 rounded-[2rem] relative overflow-hidden min-h-[250px] flex items-center justify-center group cursor-pointer border border-black/5">
            
            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-[0_8px_20px_rgb(0,0,0,0.1)] z-20 group-hover:scale-110 group-hover:shadow-[0_8px_30px_rgb(0,0,0,0.15)] transition-all duration-300 pointer-events-none">
              <Play className="w-6 h-6 fill-foreground text-foreground ml-1.5" />
            </div>

            {/* Subtle animated background gradient effect for the "video" */}
            <div className="absolute inset-0 bg-gradient-to-tr from-grey-200 to-grey-100">
               {/* Simulating some very faint video imagery / depth */}
               <div className="absolute inset-0 bg-black opacity-[0.02] mix-blend-overlay"></div>
               <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[150%] h-[150%] bg-[radial-gradient(circle,rgba(255,255,255,0.6)_0%,transparent_60%)]"></div>
            </div>
          </div>

        </div>

      </div>
    </section>
  )
}

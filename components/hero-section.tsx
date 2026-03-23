"use client"

import { Play, Zap } from "lucide-react"

export default function HeroSection() {
  return (
    <section className="relative bg-white flex items-center justify-center p-4 sm:p-6 lg:p-8 overflow-hidden font-sans pt-28 lg:pt-36 pb-12">
      
      <div className="max-w-[1300px] w-full mx-auto">
        
        {/* CSS grid ensures both columns are strictly identical in overall height */}
        <div className="grid grid-cols-1 xl:grid-cols-[1.3fr_1fr] gap-6 lg:gap-8 items-stretch w-full min-h-[500px]">
          
          {/* Left Panel (Folder) */}
          <div className="flex flex-col relative w-full h-full">
            
            {/* Top Tab for the folder effect (positioned at top-left) */}
            <div className="w-[50%] md:w-[40%] h-12 bg-[#FFD2B8] rounded-t-[1.5rem] relative self-start z-10 flex hidden sm:flex">
               {/* The inner curve smoothing for the tab (on the right side of the tab) */}
               <div className="absolute -right-8 bottom-0 w-8 h-8 overflow-hidden pointer-events-none">
                  <div className="w-full h-full rounded-bl-[1.5rem] shadow-[-20px_20px_0_20px_#FFD2B8]"></div>
               </div>
            </div>

            {/* Main Folder Box */}
            <div className="flex-1 bg-[#FFD2B8] rounded-b-[2rem] rounded-tr-[2rem] sm:rounded-tl-none rounded-tl-[2rem] p-8 sm:p-10 lg:p-12 flex flex-col justify-between relative z-20 w-full shadow-md text-left transition-all">
              <div className="w-full mt-2 lg:mt-4">
                <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-[4.5rem] leading-[1.0] font-bold tracking-[-0.03em] uppercase text-[#0A0A0A]">
                  <span className="block mb-2 sm:mb-3">AI-FIRST</span>
                  <span className="block mb-2 sm:mb-3">MARKETING</span>
                  <span className="block mb-2 sm:mb-3">AGENCY HELPING</span>
                  <span className="block mb-2 sm:mb-3">BRANDS BECOME</span>
                  <span className="inline-block text-white bg-[#FF5722] px-6 sm:px-8 py-2 sm:py-3 rounded-[2rem] mt-2 lg:mt-4 align-middle">TOP 1%</span>
                </h1>
              </div>

              <div className="mt-12 lg:mt-16 w-full flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 border-t border-[#0A0A0A]/10 pt-6 sm:pt-8">
                
                <div className="flex items-center gap-3 max-w-[280px]">
                  <div className="text-3xl sm:text-4xl">🔥</div>
                  <p className="text-[#0A0A0A]/80 text-sm sm:text-base font-medium leading-tight text-balance">
                    12 years of design-driven development for B2B products
                  </p>
                </div>

                <button className="flex items-center gap-3 bg-[#0A0A0A] text-white hover:bg-white hover:text-[#0A0A0A] transition-colors py-3 sm:py-4 px-6 sm:px-8 rounded-full font-bold uppercase tracking-wider text-sm sm:text-base whitespace-nowrap shadow-md group">
                  <div className="bg-white rounded-full p-1 text-[#0A0A0A] flex items-center justify-center w-8 h-8 transition-colors group-hover:bg-[#FF5722] group-hover:text-white group-hover:shadow-[0_0_15px_rgba(255,87,34,0.5)]">
                    <Zap className="w-4 h-4 fill-current" />
                  </div>
                  Book A Call
                </button>
              </div>
            </div>
          </div>

          {/* Right Panel (Video Player Placeholder) */}
          {/* h-full forces it to stretch perfectly to match the exact height of the Left Panel (including its tab) */}
          <div className="w-full h-full bg-[#f0f0f0] rounded-[2rem] relative overflow-hidden min-h-[350px] flex items-center justify-center group cursor-pointer border border-black/5">
            
            <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-[0_8px_20px_rgb(0,0,0,0.1)] z-20 group-hover:scale-110 group-hover:shadow-[0_8px_30px_rgb(0,0,0,0.15)] transition-all duration-300 pointer-events-none">
              <Play className="w-8 h-8 fill-[#0A0A0A] text-[#0A0A0A] ml-1.5" />
            </div>

            {/* Subtle animated background gradient effect for the "video" */}
            <div className="absolute inset-0 bg-gradient-to-tr from-[#e5e5e5] to-[#f8f8f8]">
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

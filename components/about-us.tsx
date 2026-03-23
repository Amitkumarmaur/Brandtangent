import Image from "next/image"
import { Award, Medal, Star, CheckCircle, ShieldCheck } from "lucide-react"

export default function AboutUs() {
  return (
    <section className="bg-[#FF5722] text-white py-24 sm:py-32 px-6 lg:px-12 w-full overflow-hidden">
      <div className="max-w-[1500px] mx-auto w-full">
        
        {/* Top Header Section */}
        <div className="flex flex-col lg:flex-row justify-between items-start gap-16 lg:gap-32 mb-24 md:mb-32">
          
          {/* Left: Founders Info */}
          <div className="flex flex-col shrink-0 pt-2">
            <div className="flex -space-x-4 mb-6">
              <div className="w-[4.5rem] h-[4.5rem] rounded-full border-4 border-[#FF5722] overflow-hidden bg-white shadow-xl isolate">
                 {/* Fallback to placeholder since professional headshots exist in public folder */}
                <Image src="/professional-headshot-man-ceo.jpg" alt="Founder 1" width={72} height={72} className="object-cover w-full h-full" />
              </div>
              <div className="w-[4.5rem] h-[4.5rem] rounded-full border-4 border-[#FF5722] overflow-hidden bg-white shadow-xl z-10 isolate">
                <Image src="/professional-headshot-woman-marketing-executive.jpg" alt="Founder 2" width={72} height={72} className="object-cover w-full h-full" />
              </div>
              <div className="w-[4.5rem] h-[4.5rem] rounded-full border-4 border-[#FF5722] overflow-hidden bg-white shadow-xl z-20 isolate">
                <Image src="/professional-headshot-man-software-engineer.jpg" alt="Founder 3" width={72} height={72} className="object-cover w-full h-full" />
              </div>
            </div>
            <div className="flex flex-col gap-1.5 mt-2">
              <span className="text-white font-semibold text-sm tracking-[0.2em] uppercase">Founders</span>
              <span className="text-white/80 text-xs tracking-[0.2em] uppercase">Of DigiiMark</span>
            </div>
          </div>

          {/* Right: The About Paragraph */}
          <div className="lg:w-3/4 xl:w-2/3 max-w-4xl">
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-[3rem] font-medium leading-[1.35] tracking-tight text-white/95 text-balance">
              Over the past 12 years, we've perfected our <span className="font-bold text-white">Design & Automation</span> game and are eager to help passionate Founders perfect theirs. Success is a team play, right? Let's aim for the top together!
            </h2>
          </div>
        </div>

        {/* Bottom Achievements Circles */}
        <div className="w-full flex flex-col md:flex-row flex-wrap items-center justify-center xl:justify-between gap-8 xl:gap-0 mt-12">
          
          {/* Circle 1 */}
          <div className="w-[300px] h-[300px] shrink-0 rounded-full border-4 border-white/40 flex flex-col items-center justify-center text-center p-8 hover:bg-white/5 transition-colors duration-500 cursor-default">
            <div className="flex items-center gap-3 mb-5">
              <Award className="w-14 h-14 text-white stroke-[1.5]" />
            </div>
            <p className="text-lg md:text-[1.1rem] font-medium leading-tight text-white/95 tracking-tight px-2">Top Team in the world on Dribbble</p>
          </div>

          {/* Circle 2 */}
          <div className="w-[300px] h-[300px] shrink-0 rounded-full border-4 border-white/40 flex flex-col items-center justify-center text-center p-8 hover:bg-white/5 transition-colors duration-500 cursor-default">
            <div className="flex items-center gap-3 mb-5">
               <span className="text-[2.5rem] font-bold text-white tracking-widest px-4 border-l-2 border-r-2 border-white/40">C</span>
            </div>
            <p className="text-lg md:text-[1.1rem] font-medium leading-tight text-white/95 tracking-tight px-2">Top 100 Global Service Providers by Clutch</p>
          </div>

          {/* Circle 3 */}
          <div className="w-[300px] h-[300px] shrink-0 rounded-full border-4 border-white/40 flex flex-col items-center justify-center text-center p-8 hover:bg-white/5 transition-colors duration-500 cursor-default">
            <div className="flex items-center gap-3 mb-5">
               <span className="text-[3rem] font-black px-4 py-1.5 border border-white/40 rounded-xl bg-white/10 tracking-tighter">GF</span>
            </div>
            <p className="text-lg md:text-[1.1rem] font-medium leading-tight text-white/95 tracking-tight px-2">5 Stars Rating on<br/>GoodFirms</p>
          </div>

          {/* Circle 4 */}
          <div className="w-[300px] h-[300px] shrink-0 rounded-full border-4 border-white/40 flex flex-col items-center justify-center text-center p-8 hover:bg-white/5 transition-colors duration-500 cursor-default">
            <div className="flex items-center gap-3 mb-5">
               <span className="text-[3.2rem] font-black text-white tracking-tighter">Up</span>
            </div>
            <p className="text-lg md:text-[1.1rem] font-medium leading-tight text-white/95 tracking-tight px-2">100% Job Success on<br/>Upwork</p>
          </div>

        </div>

      </div>
    </section>
  )
}

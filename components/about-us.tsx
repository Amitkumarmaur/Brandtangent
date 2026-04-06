import Image from "next/image"
import { Award, Medal, Star, CheckCircle, ShieldCheck } from "lucide-react"

export default function AboutUs() {
  return (
    <section className="bg-[#0F0F0F] text-white py-16 lg:py-20 px-6 lg:px-12 w-full overflow-hidden">
      <div className="max-w-7xl mx-auto w-full">
        
        {/* Top Header Section */}
        <div className="flex flex-col lg:flex-row justify-between items-start gap-12 lg:gap-24 mb-16 lg:mb-20">
          
          {/* Left: Founders Info */}
          <div className="flex flex-col shrink-0 pt-2">
            <div className="flex -space-x-4 mb-5">
              <div className="w-16 h-16 rounded-full border-[3px] border-white overflow-hidden bg-white shadow-lg isolate">
                 {/* Fallback to placeholder since professional headshots exist in public folder */}
                <Image src="/professional-headshot-man-ceo.jpg" alt="Founder 1" width={64} height={64} className="object-cover w-full h-full" />
              </div>
              <div className="w-16 h-16 rounded-full border-[3px] border-white overflow-hidden bg-white shadow-lg z-10 isolate">
                <Image src="/professional-headshot-woman-marketing-executive.jpg" alt="Founder 2" width={64} height={64} className="object-cover w-full h-full" />
              </div>
              <div className="w-16 h-16 rounded-full border-[3px] border-white overflow-hidden bg-white shadow-lg z-20 isolate">
                <Image src="/professional-headshot-man-software-engineer.jpg" alt="Founder 3" width={64} height={64} className="object-cover w-full h-full" />
              </div>
            </div>
            <div className="flex flex-col gap-1.5 mt-2">
              <span className="text-white font-semibold text-sm tracking-[0.2em] uppercase">Founders</span>
              <span className="text-white/80 text-xs tracking-[0.2em] uppercase">Of DigiiMark</span>
            </div>
          </div>

          {/* Right: The About Paragraph */}
          <div className="lg:w-3/4 xl:w-2/3 max-w-4xl">
            <h2 className="font-heading text-2xl sm:text-3xl lg:text-4xl font-medium leading-[1.3] tracking-tight text-white/95 text-balance">
              Over the past 12 years, we've perfected our <span className="font-bold text-white">Design & Automation</span> game and are eager to help passionate Founders perfect theirs. Success is a team play, right? Let's aim for the top together!
            </h2>
          </div>
        </div>

        {/* Bottom Achievements Circles */}
        <div className="w-full flex flex-col md:flex-row flex-wrap items-center justify-center xl:justify-between gap-6 xl:gap-0 mt-8">
          
          {/* Circle 1 */}
          <div className="w-[180px] h-[180px] md:w-[200px] md:h-[200px] lg:w-[220px] lg:h-[220px] shrink-0 rounded-full border-[3px] border-white/40 flex flex-col items-center justify-center text-center p-6 hover:bg-white/5 transition-colors duration-500 cursor-default">
            <div className="flex items-center gap-3 mb-3">
              <Award className="w-10 h-10 lg:w-12 lg:h-12 text-white stroke-[1.5]" />
            </div>
            <p className="text-sm md:text-base font-medium leading-tight text-white/95 tracking-tight px-2">Top Team in the world on Dribbble</p>
          </div>

          {/* Circle 2 */}
          <div className="w-[180px] h-[180px] md:w-[200px] md:h-[200px] lg:w-[220px] lg:h-[220px] shrink-0 rounded-full border-[3px] border-white/40 flex flex-col items-center justify-center text-center p-6 hover:bg-white/5 transition-colors duration-500 cursor-default">
            <div className="flex items-center gap-3 mb-3">
               <span className="text-3xl lg:text-4xl font-bold text-white tracking-widest px-4 border-l-2 border-r-2 border-white/40">C</span>
            </div>
            <p className="text-sm md:text-base font-medium leading-tight text-white/95 tracking-tight px-2">Top 100 Global Service Providers by Clutch</p>
          </div>

          {/* Circle 3 */}
          <div className="w-[180px] h-[180px] md:w-[200px] md:h-[200px] lg:w-[220px] lg:h-[220px] shrink-0 rounded-full border-[3px] border-white/40 flex flex-col items-center justify-center text-center p-6 hover:bg-white/5 transition-colors duration-500 cursor-default">
            <div className="flex items-center gap-3 mb-3">
               <span className="text-4xl lg:text-[2.5rem] font-black px-3 py-1 border border-white/40 rounded-xl bg-white/10 tracking-tighter">GF</span>
            </div>
            <p className="text-sm md:text-base font-medium leading-tight text-white/95 tracking-tight px-2">5 Stars Rating on<br/>GoodFirms</p>
          </div>

          {/* Circle 4 */}
          <div className="w-[180px] h-[180px] md:w-[200px] md:h-[200px] lg:w-[220px] lg:h-[220px] shrink-0 rounded-full border-[3px] border-white/40 flex flex-col items-center justify-center text-center p-6 hover:bg-white/5 transition-colors duration-500 cursor-default">
            <div className="flex items-center gap-3 mb-3">
               <span className="text-4xl lg:text-[2.5rem] font-black text-white tracking-tighter">Up</span>
            </div>
            <p className="text-sm md:text-base font-medium leading-tight text-white/95 tracking-tight px-2">100% Job Success on<br/>Upwork</p>
          </div>

        </div>

      </div>
    </section>
  )
}

"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Plus, X } from "lucide-react"

const faqs = [
  {
    id: 1,
    question: "Can you create a content management system for my website?",
    answer: "Yes, we specialize in building highly scalable and customized Content Management Systems (CMS) tailored to your specific operational needs, allowing your team to seamlessly update and oversee content without needing technical skills."
  },
  {
    id: 2,
    question: "May I know the name of some of the biggest brands you have worked with?",
    answer: "In the last few years, our client base has grown substantially. We work confidentially with leading global enterprises and innovative startups spanning tech, real estate, healthcare, and e-commerce. Due to NDAs, we selectively share enterprise case studies on request."
  },
  {
    id: 3,
    question: "I'm looking for a content marketing agency. Do you have writers in your agency?",
    answer: "Absolutely! DigiiMark houses a dedicated team of expert copywriters and content strategists who specialize in SEO-driven web copy, engaging blog content, and high-converting marketing materials."
  },
  {
    id: 4,
    question: "Why should I choose you as my web design agency?",
    answer: "Our approach bridges aesthetic design with engineering precision. We don't just build beautiful sites; we build high-performance, conversion-focused digital experiences engineered using cutting-edge frameworks like React and Next.js."
  },
  {
    id: 5,
    question: "Can you create a theme-based WordPress website?",
    answer: "While our expertise lies heavily in modern, custom-coded web applications (like Next.js), we absolutely provide highly optimized, secure, and beautiful theme-based CMS solutions when it fits your business requirements best."
  },
  {
    id:  6,
    question: "Do I need to hire a web designer to develop my business site?",
    answer: "When working with DigiiMark, you get an entire end-to-end team. We provide the UX researchers, UI designers, and frontend/backend developers needed to successfully launch your platform without any external hiring."
  }
]

function AccordionItem({ 
  question, 
  answer, 
  isOpen, 
  onClick 
}: { 
  question: string, 
  answer: string, 
  isOpen: boolean, 
  onClick: () => void 
}) {
  return (
    <div className={`border rounded-[1.5rem] mb-4 overflow-hidden transition-all duration-300 ${isOpen ? 'border-[#FF5722] bg-white shadow-lg' : 'border-[#E5E5E5] bg-transparent hover:border-[#FF5722]/40'}`}>
      <button 
        onClick={onClick}
        className="w-full flex justify-between items-center p-6 md:p-8 text-left"
      >
        <span className={`font-medium text-lg md:text-xl pr-8 transition-colors ${isOpen ? 'text-[#0A0A0A]' : 'text-[#4A4A4A]'}`}>
          {question}
        </span>
        <span className="text-[#FF5722] flex-shrink-0">
          {isOpen ? <X className="w-5 h-5 md:w-6 md:h-6" /> : <Plus className="w-5 h-5 md:w-6 md:h-6" />}
        </span>
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            <div className="px-6 md:px-8 pb-6 md:pb-8 text-[#7D7D7D] leading-relaxed font-light text-base md:text-lg">
              {answer}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default function FAQSection() {
  const [openId, setOpenId] = useState<number | null>(2)

  return (
    <section className="bg-white relative py-16 md:py-20 overflow-hidden border-t border-[#E5E5E5]">
      
      {/* Background Subtle Grid Pattern */}
      <div 
        className="absolute inset-0 opacity-[0.03] pointer-events-none" 
        style={{
          backgroundSize: '40px 40px',
          backgroundImage: `linear-gradient(to right, #0A0A0A 1px, transparent 1px), linear-gradient(to bottom, #0A0A0A 1px, transparent 1px)`
        }}
      />
      
      <div className="w-full max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-24">
          
          {/* Left Column: Sticky Header */}
          <div className="lg:w-5/12 lg:sticky lg:top-24 h-max">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-2 h-2 rounded-full bg-[#FF5722]" />
              <span className="text-[#FF5722] font-medium tracking-wide uppercase text-sm">FAQs</span>
            </div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-light text-[#0A0A0A] tracking-tight leading-tight mb-6">
              Transformation with <br className="hidden lg:block"/>
              <span className="font-medium tracking-tight">Smart UX & Scalable Tech</span>
            </h2>
            <p className="text-[#7D7D7D] text-base md:text-lg font-light leading-relaxed max-w-lg mb-6">
              You have the vision—we engineer for the future. At DigiiMark, we embrace modern technology with creativity to provide AI-powered multilingual support, predictive UX, and intelligent UI/UX design. No matter if you are looking for AI-powered hosting or AI-driven A/B testing, our teams have the expertise to build scalable digital products that think, adapt, and grow with your audience.
            </p>
          </div>

          {/* Right Column: Accordion */}
          <div className="lg:w-7/12 mt-4 lg:mt-0">
            {faqs.map((faq) => (
              <AccordionItem 
                key={faq.id}
                question={faq.question}
                answer={faq.answer}
                isOpen={openId === faq.id}
                onClick={() => setOpenId(openId === faq.id ? null : faq.id)}
              />
            ))}
          </div>

        </div>
      </div>
    </section>
  )
}

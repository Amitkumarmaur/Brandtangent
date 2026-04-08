'use client'

import type { Platform } from '@/lib/supabase'

interface Props {
  platforms: Platform[]
}

function PlatformItem({ platform }: { platform: Platform }) {
  const ds = platform.display_style ?? {}
  const weightClass = ds.weight === 'black' ? 'font-black' : 'font-bold'
  const trackingClass = ds.tracking === 'tighter' ? 'tracking-tighter' : 'tracking-tight'

  const handleClick = () => {
    if (platform.url) {
      window.open(platform.url, '_blank', 'noopener,noreferrer')
    }
  }

  // Special case: box prefix (e.g. Webflow "W")
  if (ds.prefix_icon && ds.prefix_style === 'box') {
    return (
      <div
        role="link"
        tabIndex={0}
        onClick={handleClick}
        onKeyDown={(e) => e.key === 'Enter' && handleClick()}
        title={`Visit ${platform.platform_name}`}
        className="flex items-center gap-1 grayscale opacity-60 hover:opacity-100 hover:grayscale-0 transition-all duration-300 cursor-pointer mx-8 focus:outline-none focus:opacity-100 focus:grayscale-0"
      >
        <span className="w-8 h-8 bg-[#0A0A0A] rounded-sm text-white flex items-center justify-center font-bold text-sm select-none">
          {ds.prefix_icon}
        </span>
        <span className={`${weightClass} text-2xl md:text-3xl text-[#0A0A0A] tracking-tight`}>
          {platform.platform_name.split(' ')[0].toLowerCase()}
        </span>
      </div>
    )
  }

  // Special case: circle prefix (e.g. OpenAI "❖")
  if (ds.prefix_icon && ds.prefix_style === 'circle') {
    return (
      <div
        role="link"
        tabIndex={0}
        onClick={handleClick}
        onKeyDown={(e) => e.key === 'Enter' && handleClick()}
        title={`Visit ${platform.platform_name}`}
        className="flex items-center gap-2 grayscale opacity-60 hover:opacity-100 hover:grayscale-0 transition-all duration-300 cursor-pointer mx-8 focus:outline-none focus:opacity-100 focus:grayscale-0"
      >
        <span className="w-8 h-8 border-[3px] border-[#0A0A0A] rounded-full flex items-center justify-center text-lg select-none">
          {ds.prefix_icon}
        </span>
        <span className={`${weightClass} text-2xl md:text-3xl text-[#0A0A0A] tracking-tight`}>
          {platform.platform_name}
        </span>
      </div>
    )
  }

  // Standard item (optional brand color)
  const colorStyle = ds.color ? { color: ds.color } : undefined
  // Display name: use first word for "Make (Integromat)", show full for others
  const displayName = platform.platform_name.includes('(')
    ? platform.platform_name.split('(')[0].trim()
    : platform.platform_name

  return (
    <div
      role="link"
      tabIndex={0}
      onClick={handleClick}
      onKeyDown={(e) => e.key === 'Enter' && handleClick()}
      title={`Visit ${platform.platform_name}`}
      style={colorStyle}
      className={`flex items-center justify-center grayscale opacity-60 hover:opacity-100 hover:grayscale-0 transition-all duration-300 cursor-pointer mx-8 focus:outline-none focus:opacity-100 focus:grayscale-0`}
    >
      <span className={`text-2xl md:text-3xl ${trackingClass} text-[#0A0A0A] ${weightClass}`}>
        {displayName}
      </span>
    </div>
  )
}

function LogosSet({ platforms }: { platforms: Platform[] }) {
  return (
    <>
      {platforms.map((p) => (
        <PlatformItem key={p.id} platform={p} />
      ))}
    </>
  )
}

export default function TechMarquee({ platforms }: Props) {
  if (platforms.length === 0) return null

  return (
    <>
      <style>{`
        @keyframes marquee {
          0%   { transform: translateX(0%); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          animation: marquee 40s linear infinite;
        }
        .animate-marquee:hover {
          animation-play-state: paused;
        }
      `}</style>

      <div className="w-full relative overflow-hidden flex whitespace-nowrap py-4 z-10 w-screen ml-[calc(-50vw+50%)]">
        <div className="animate-marquee flex items-center w-max">
          <LogosSet platforms={platforms} />
          {/* Duplicate set for seamless loop */}
          <LogosSet platforms={platforms} />
        </div>
      </div>
    </>
  )
}

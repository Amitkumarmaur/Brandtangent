'use client'

import type { Platform } from '@/lib/supabase'

interface Props {
  platforms: Platform[]
}

function PlatformItem({ platform }: { platform: Platform }) {
  const ds = platform.display_style ?? {}
  const weightClass = ds.weight === 'black' ? 'font-black' : 'font-semibold'
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
        <span className="w-8 h-8 bg-primary rounded-sm text-white flex items-center justify-center font-semibold text-sm select-none">
          {ds.prefix_icon}
        </span>
        <span className={`${weightClass} text-2xl md:text-3xl text-foreground tracking-tight`}>
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
        <span className="w-8 h-8 border-[3px] border-foreground rounded-full flex items-center justify-center text-lg select-none">
          {ds.prefix_icon}
        </span>
        <span className={`${weightClass} text-2xl md:text-3xl text-foreground tracking-tight`}>
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
      <span className={`text-2xl md:text-3xl ${trackingClass} text-foreground ${weightClass}`}>
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

const FALLBACK_PLATFORMS: Platform[] = [
  { id: '1', platform_name: 'n8n', url: 'https://n8n.io', logo: null, display_style: { color: '#EA4B71', weight: 'black' }, display_order: 1 },
  { id: '2', platform_name: 'Make', url: 'https://make.com', logo: null, display_style: { color: '#6D00CC', weight: 'black' }, display_order: 2 },
  { id: '3', platform_name: 'HubSpot', url: 'https://hubspot.com', logo: null, display_style: { color: '#FF7A59', weight: 'black' }, display_order: 3 },
  { id: '4', platform_name: 'Webflow', url: 'https://webflow.com', logo: null, display_style: { prefix_icon: 'W', prefix_style: 'box' }, display_order: 4 },
  { id: '5', platform_name: 'Next.js', url: 'https://nextjs.org', logo: null, display_style: { weight: 'black' }, display_order: 5 },
  { id: '6', platform_name: 'Supabase', url: 'https://supabase.com', logo: null, display_style: { color: '#3ECF8E', weight: 'black' }, display_order: 6 },
  { id: '7', platform_name: 'Semrush', url: 'https://semrush.com', logo: null, display_style: { color: '#FF642D', weight: 'black' }, display_order: 7 },
  { id: '8', platform_name: 'ahrefs', url: 'https://ahrefs.com', logo: null, display_style: { color: '#0E6CF9', weight: 'bold' }, display_order: 8 },
  { id: '9', platform_name: 'Claude', url: 'https://anthropic.com', logo: null, display_style: { weight: 'bold' }, display_order: 9 },
  { id: '10', platform_name: 'OpenAI', url: 'https://openai.com', logo: null, display_style: { prefix_icon: '❖', prefix_style: 'circle', weight: 'black' }, display_order: 10 },
  { id: '11', platform_name: 'Google Ads', url: 'https://ads.google.com', logo: null, display_style: { weight: 'bold' }, display_order: 11 },
  { id: '12', platform_name: 'Meta Ads', url: 'https://www.facebook.com/business/ads', logo: null, display_style: { color: '#0082FB', weight: 'black' }, display_order: 12 },
  { id: '13', platform_name: 'LinkedIn Ads', url: 'https://business.linkedin.com', logo: null, display_style: { color: '#0077B5', weight: 'black' }, display_order: 13 },
  { id: '14', platform_name: 'Vercel', url: 'https://vercel.com', logo: null, display_style: { weight: 'black' }, display_order: 14 },
  { id: '15', platform_name: 'Zapier', url: 'https://zapier.com', logo: null, display_style: { color: '#FF4A00', weight: 'bold' }, display_order: 15 },
]

export default function TechMarquee({ platforms }: Props) {
  const items = platforms.length > 0 ? platforms : FALLBACK_PLATFORMS

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
          <LogosSet platforms={items} />
          {/* Duplicate set for seamless loop */}
          <LogosSet platforms={items} />
        </div>
      </div>
    </>
  )
}

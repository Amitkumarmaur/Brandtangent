import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = 'https://gvcmgrvjkbczikgzlmhe.supabase.co'
const ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd2Y21ncnZqa2JjemlrZ3psbWhlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzU1MzM0MzcsImV4cCI6MjA5MTEwOTQzN30.9QwY1Led9AuIz7OCwcmRsGeWH1jcIeYobyRKXl_NbAI'

const supabase = createClient(SUPABASE_URL, ANON_KEY)

// ─── SVG Logo Definitions ────────────────────────────────────────────────────
const logos = {
  'n8n.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 48" width="120" height="48">
  <text x="60" y="34" text-anchor="middle"
    font-family="Arial Black, Arial, sans-serif" font-weight="900"
    font-size="36" fill="#EA4B71">n8n</text>
</svg>`,

  'make.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 140 48" width="140" height="48">
  <rect x="0" y="0" width="140" height="48" rx="8" fill="#6D00CC"/>
  <text x="70" y="33" text-anchor="middle"
    font-family="Arial Black, Arial, sans-serif" font-weight="900"
    font-size="26" fill="#ffffff" letter-spacing="1">make</text>
</svg>`,

  'zapier.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 48" width="160" height="48">
  <text x="80" y="34" text-anchor="middle"
    font-family="Arial, sans-serif" font-weight="700"
    font-size="30" fill="#FF4A00">Zapier</text>
</svg>`,

  'webflow.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 210 48" width="210" height="48">
  <rect x="2" y="6" width="36" height="36" rx="5" fill="#0A0A0A"/>
  <text x="20" y="32" text-anchor="middle"
    font-family="Arial Black, sans-serif" font-weight="900"
    font-size="20" fill="#ffffff">W</text>
  <text x="130" y="34" text-anchor="middle"
    font-family="Arial, sans-serif" font-weight="700"
    font-size="28" fill="#0A0A0A">webflow</text>
</svg>`,

  'google-ads.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 230 48" width="230" height="48">
  <circle cx="16" cy="20" r="10" fill="#4285F4"/>
  <circle cx="39" cy="20" r="10" fill="#FBBC05"/>
  <circle cx="27" cy="36" r="10" fill="#34A853"/>
  <text x="140" y="30" text-anchor="middle"
    font-family="Arial, sans-serif" font-weight="700"
    font-size="22" fill="#0A0A0A">Google Ads</text>
</svg>`,

  'semrush.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 190 48" width="190" height="48">
  <text x="95" y="34" text-anchor="middle"
    font-family="Arial Black, Arial, sans-serif" font-weight="900"
    font-size="28" fill="#FF642D">Semrush</text>
</svg>`,

  'ahrefs.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 48" width="160" height="48">
  <text x="80" y="34" text-anchor="middle"
    font-family="Arial, sans-serif" font-weight="700"
    font-size="30" fill="#0E6CF9">ahrefs</text>
</svg>`,

  'anthropic.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 180 56" width="180" height="56">
  <text x="90" y="32" text-anchor="middle"
    font-family="Georgia, Times New Roman, serif" font-weight="700"
    font-size="26" fill="#1A1A1A">Claude</text>
  <text x="90" y="50" text-anchor="middle"
    font-family="Arial, sans-serif" font-weight="400"
    font-size="10" fill="#888" letter-spacing="2">by Anthropic</text>
</svg>`,

  'openai.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 190 48" width="190" height="48">
  <circle cx="22" cy="24" r="16" fill="none" stroke="#0A0A0A" stroke-width="3"/>
  <text x="22" y="31" text-anchor="middle"
    font-family="Arial, sans-serif" font-size="18" fill="#0A0A0A">❖</text>
  <text x="120" y="34" text-anchor="middle"
    font-family="Arial Black, sans-serif" font-weight="900"
    font-size="26" fill="#0A0A0A">OpenAI</text>
</svg>`,

  'hubspot.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 48" width="200" height="48">
  <circle cx="22" cy="24" r="8" fill="#FF7A59"/>
  <circle cx="22" cy="10" r="5" fill="#FF7A59"/>
  <circle cx="36" cy="24" r="5" fill="#FF7A59"/>
  <circle cx="22" cy="38" r="5" fill="#FF7A59"/>
  <circle cx="8"  cy="24" r="5" fill="#FF7A59"/>
  <text x="122" y="34" text-anchor="middle"
    font-family="Arial Black, sans-serif" font-weight="900"
    font-size="24" fill="#2D3E50">HubSpot</text>
</svg>`,

  'nextjs.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 190 48" width="190" height="48">
  <circle cx="24" cy="24" r="20" fill="#0A0A0A"/>
  <polygon points="16,14 32,14 16,34" fill="#ffffff"/>
  <text x="120" y="34" text-anchor="middle"
    font-family="Arial Black, sans-serif" font-weight="900"
    font-size="24" fill="#0A0A0A">Next.js</text>
</svg>`,

  'supabase.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 210 48" width="210" height="48">
  <polygon points="20,6 8,28 18,28 14,42 34,20 22,20 28,6" fill="#3ECF8E"/>
  <text x="125" y="34" text-anchor="middle"
    font-family="Arial Black, sans-serif" font-weight="900"
    font-size="24" fill="#0A0A0A">Supabase</text>
</svg>`,

  'meta.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 210 48" width="210" height="48">
  <path d="M6,26 C6,16 12,9 19,9 C25,9 29,13 33,20 C37,13 41,9 47,9 C54,9 60,16 60,26 C60,36 54,41 47,39 C41,37 37,30 33,26 C29,30 25,37 19,39 C13,41 6,36 6,26Z" fill="#0082FB"/>
  <text x="135" y="34" text-anchor="middle"
    font-family="Arial Black, sans-serif" font-weight="900"
    font-size="22" fill="#0082FB">Meta Ads</text>
</svg>`,

  'linkedin.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 48" width="240" height="48">
  <rect x="2" y="4" width="40" height="40" rx="6" fill="#0077B5"/>
  <text x="22" y="32" text-anchor="middle"
    font-family="Arial Black, sans-serif" font-weight="900"
    font-size="22" fill="#ffffff">in</text>
  <text x="148" y="32" text-anchor="middle"
    font-family="Arial Black, sans-serif" font-weight="900"
    font-size="21" fill="#0A0A0A">LinkedIn Ads</text>
</svg>`,

  'vercel.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 180 48" width="180" height="48">
  <polygon points="24,4 44,42 4,42" fill="#0A0A0A"/>
  <text x="115" y="34" text-anchor="middle"
    font-family="Arial Black, sans-serif" font-weight="900"
    font-size="26" fill="#0A0A0A">Vercel</text>
</svg>`,
}

// Platform ID map
const platformMap = {
  'n8n.svg':        '40000000-0000-0000-0000-000000000001',
  'make.svg':       '40000000-0000-0000-0000-000000000002',
  'zapier.svg':     '40000000-0000-0000-0000-000000000015',
  'webflow.svg':    '40000000-0000-0000-0000-000000000004',
  'google-ads.svg': '40000000-0000-0000-0000-000000000011',
  'semrush.svg':    '40000000-0000-0000-0000-000000000007',
  'ahrefs.svg':     '40000000-0000-0000-0000-000000000008',
  'anthropic.svg':  '40000000-0000-0000-0000-000000000009',
  'openai.svg':     '40000000-0000-0000-0000-000000000010',
  'hubspot.svg':    '40000000-0000-0000-0000-000000000003',
  'nextjs.svg':     '40000000-0000-0000-0000-000000000005',
  'supabase.svg':   '40000000-0000-0000-0000-000000000006',
  'meta.svg':       '40000000-0000-0000-0000-000000000012',
  'linkedin.svg':   '40000000-0000-0000-0000-000000000013',
  'vercel.svg':     '40000000-0000-0000-0000-000000000014',
}

async function main() {
  console.log('🚀 Uploading platform logos to Supabase storage (logos/platforms/)...\n')

  let uploaded = 0
  let failed = 0

  for (const [filename, svgContent] of Object.entries(logos)) {
    process.stdout.write(`  Uploading ${filename.padEnd(20)}`)

    const bytes = Buffer.from(svgContent, 'utf-8')

    const { error: uploadError } = await supabase.storage
      .from('logos')
      .upload(`platforms/${filename}`, bytes, {
        contentType: 'image/svg+xml',
        upsert: true,
      })

    if (uploadError) {
      console.log(`✗  ${uploadError.message}`)
      failed++
      continue
    }

    const { data: urlData } = supabase.storage
      .from('logos')
      .getPublicUrl(`platforms/${filename}`)

    const publicUrl = urlData.publicUrl

    // Update the platforms table
    const { error: dbError } = await supabase
      .from('platforms')
      .update({ logo: publicUrl })
      .eq('id', platformMap[filename])

    if (dbError) {
      console.log(`✓ uploaded, ✗ db: ${dbError.message}`)
      failed++
    } else {
      console.log(`✓  ${publicUrl}`)
      uploaded++
    }
  }

  console.log(`\n${'─'.repeat(60)}`)
  console.log(`✅  ${uploaded} logos uploaded & linked   ✗  ${failed} failed`)
  console.log(`\nStorage base: ${SUPABASE_URL}/storage/v1/object/public/logos/platforms/`)
}

main().catch(console.error)

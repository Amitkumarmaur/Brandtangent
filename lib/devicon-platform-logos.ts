/**
 * Official-style technology logos (Devicon SVGs via jsDelivr).
 * Used to override inconsistent or broken `platforms.logo` URLs from Supabase
 * for known web-stack tools.
 */
const DEVICON_BASE =
  "https://cdn.jsdelivr.net/gh/devicons/devicon/icons" as const

const logosByNormalizedName: Record<string, string> = {
  javascript: `${DEVICON_BASE}/javascript/javascript-original.svg`,
  typescript: `${DEVICON_BASE}/typescript/typescript-original.svg`,
  react: `${DEVICON_BASE}/react/react-original.svg`,
  "next.js": `${DEVICON_BASE}/nextjs/nextjs-original.svg`,
  nextjs: `${DEVICON_BASE}/nextjs/nextjs-original.svg`,
  "node.js": `${DEVICON_BASE}/nodejs/nodejs-original.svg`,
  nodejs: `${DEVICON_BASE}/nodejs/nodejs-original.svg`,
  python: `${DEVICON_BASE}/python/python-original.svg`,
  postgresql: `${DEVICON_BASE}/postgresql/postgresql-original.svg`,
  postgres: `${DEVICON_BASE}/postgresql/postgresql-original.svg`,
  "tailwind css": `${DEVICON_BASE}/tailwindcss/tailwindcss-original.svg`,
  tailwindcss: `${DEVICON_BASE}/tailwindcss/tailwindcss-original.svg`,
  docker: `${DEVICON_BASE}/docker/docker-original.svg`,
}

/**
 * Returns a stable Devicon CDN URL when `platformName` is a known stack tool.
 */
export function deviconLogoForPlatformName(platformName: string): string | null {
  const key = platformName.trim().toLowerCase()
  return logosByNormalizedName[key] ?? null
}

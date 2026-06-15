import path from 'node:path'
import { fileURLToPath } from 'node:url'

/** Directory containing this config file (real project root). */
const projectRoot = path.dirname(fileURLToPath(import.meta.url))

/** @type {import('next').NextConfig} */
const nextConfig = {
  // When a lockfile exists in a parent folder (e.g. C:\Users\…\package-lock.json),
  // Next may infer the wrong Turbopack root and break `next dev` (missing modules / blank app).
  turbopack: {
    root: projectRoot,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    // Enable Next.js Image Optimization for better mobile performance
    unoptimized: false,
    // Cache optimized images for 1 year (content-addressed)
    minimumCacheTTL: 31536000,
    // Responsive image sizes for mobile/tablet/desktop
    deviceSizes: [320, 640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
}

export default nextConfig
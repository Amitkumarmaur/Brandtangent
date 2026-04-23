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
    unoptimized: true,
  },
}

export default nextConfig
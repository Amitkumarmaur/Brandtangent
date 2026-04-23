"use client"

import { useEffect } from "react"
import { usePathname, useSearchParams } from "next/navigation"

/**
 * Forces the window to scroll to the top on every client-side route change.
 *
 * Next.js App Router normally handles this automatically, but the global
 * `scroll-behavior: smooth` on `<html>` can cause the animated scroll to stall
 * mid-way or get cancelled as the next page mounts — leaving users stranded at
 * whatever scroll position they had on the previous page. We use
 * `behavior: "instant"` to bypass the CSS smooth scroll when routing, while
 * still allowing smooth scroll for in-page anchor jumps.
 *
 * If the URL includes a `#hash`, we let the browser handle anchor scrolling.
 */
export default function ScrollToTop() {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  useEffect(() => {
    if (typeof window === "undefined") return
    if (window.location.hash) return

    window.scrollTo({ top: 0, left: 0, behavior: "instant" as ScrollBehavior })
  }, [pathname, searchParams])

  return null
}

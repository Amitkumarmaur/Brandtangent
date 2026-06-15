"use client"

import { useState } from "react"
import Link from "next/link"
import { ChevronDown, ChevronRight } from "lucide-react"
import { categoryUrl } from "@/lib/services-urls"

export type NavServiceCategoryRow = {
  id: string
  name: string
  slug: string
  display_order: number | null
}

function categoryHref(cat: NavServiceCategoryRow): string {
  return categoryUrl((cat.slug ?? "").trim() || null)
}

export function NavServicesDesktop({ categories }: { categories: NavServiceCategoryRow[] }) {
  return (
    <div className="relative group">
      <Link
        href="/services"
        className="text-base text-foreground transition-colors hover:underline inline-flex items-center gap-1 py-2"
      >
        Services
        <ChevronDown
          className="w-4 h-4 opacity-40 transition-transform duration-200 group-hover:rotate-180"
          aria-hidden
        />
      </Link>

      <div
        className="absolute left-1/2 z-[100] flex w-[min(100vw-2rem,22rem)] -translate-x-1/2 flex-col items-stretch opacity-0 invisible translate-y-1 transition-all duration-200 ease-out pointer-events-none group-hover:opacity-100 group-hover:visible group-hover:translate-y-0 group-hover:pointer-events-auto group-focus-within:opacity-100 group-focus-within:visible group-focus-within:translate-y-0 group-focus-within:pointer-events-auto"
        role="region"
        aria-label="Service categories"
      >
        <div className="h-2 w-full shrink-0" aria-hidden />
        <div className="rounded-md border border-border bg-white py-2 shadow-[rgba(0,55,112,0.08)_0px_4px_16px] max-h-[min(70vh,24rem)] overflow-y-auto">
          <Link
            href="/services"
            className="flex items-center justify-between px-4 py-2.5 text-sm font-normal text-foreground hover:bg-secondary transition-colors"
          >
            All services
            <ChevronRight className="w-4 h-4 text-muted-foreground" aria-hidden />
          </Link>
          <div className="mx-3 h-px bg-border my-1" />
          {categories.length === 0 ? (
            <p className="px-4 py-3 text-sm text-muted-foreground">Loading…</p>
          ) : (
            <ul className="py-1">
              {categories.map((c) => (
                <li key={c.id}>
                  <Link
                    href={categoryHref(c)}
                    className="block px-4 py-2.5 text-sm text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors"
                  >
                    {(c.name ?? "").trim() || "Category"}
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  )
}

export function NavServicesMobile({
  categories,
  onNavigate,
}: {
  categories: NavServiceCategoryRow[]
  onNavigate: () => void
}) {
  const [open, setOpen] = useState(false)

  return (
    <div className="px-4">
      <div className="flex w-full items-center justify-between gap-2 py-1">
        <Link
          href="/services"
          className="text-lg font-normal text-foreground hover:text-accent-orange transition-colors"
          onClick={onNavigate}
        >
          Services
        </Link>
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          className="flex items-center gap-1 rounded-sm px-2 py-1 text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors"
          aria-expanded={open}
          aria-label={open ? "Hide categories" : "Show categories"}
        >
          {categories.length > 0 ? (
            <span className="text-xs font-medium tabular-nums">{categories.length}</span>
          ) : null}
          <ChevronDown className={`w-5 h-5 transition-transform ${open ? "rotate-180" : ""}`} aria-hidden />
        </button>
      </div>
      {open && categories.length > 0 && (
        <ul className="mt-2 ml-1 space-y-1 border-l border-border pl-3 mb-2">
          <li>
            <Link
              href="/services"
              className="block py-1.5 text-sm font-normal text-foreground"
              onClick={onNavigate}
            >
              View all services
            </Link>
          </li>
          {categories.map((c) => (
            <li key={c.id}>
              <Link
                href={categoryHref(c)}
                className="block py-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
                onClick={onNavigate}
              >
                {(c.name ?? "").trim() || "Category"}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

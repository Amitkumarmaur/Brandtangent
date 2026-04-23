"use client"

import { useState } from "react"
import { ChevronDown, Search, SlidersHorizontal, X } from "lucide-react"

export type FilterOption = { slug: string; name: string }

interface CaseStudiesFilterSidebarProps {
  /** Current search query applied against industry/service/title text. */
  query: string
  onQueryChange: (next: string) => void

  industries: FilterOption[]
  activeIndustrySlug: string | null
  onIndustryChange: (slug: string | null) => void

  services: FilterOption[]
  activeServiceSlug: string | null
  onServiceChange: (slug: string | null) => void

  /** Number of active filters (search + industry + service) — shown as a pill. */
  activeCount: number

  /** Clears every filter facet in one call. */
  onClearAll: () => void

  /**
   * True while the initial case-studies fetch is still running. When true we
   * suppress the "No industries match your search" fallback so the sidebar
   * doesn't flash misleading copy before the real data arrives.
   */
  loading?: boolean
}

/** A single list item in the industry / service lists. */
function FilterRadioButton({
  name,
  isActive,
  onClick,
}: {
  name: string
  isActive: boolean
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={isActive}
      className={`group flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-sm transition-colors duration-200 ${
        isActive
          ? "bg-ignite-orange/[0.08] text-foreground"
          : "text-grey-500 hover:bg-grey-100 hover:text-foreground"
      }`}
    >
      <span
        aria-hidden
        className={`h-2 w-2 shrink-0 rounded-full transition-colors ${
          isActive ? "bg-ignite-orange" : "bg-grey-200 group-hover:bg-grey-300"
        }`}
      />
      <span className={`truncate ${isActive ? "font-semibold" : "font-normal"}`}>{name}</span>
    </button>
  )
}

/** Eyebrow label + list of radio-style options. */
function FilterSection({
  label,
  allLabel,
  options,
  activeSlug,
  onSelect,
  emptyLabel,
  showEmptyLabel,
  loading,
}: {
  label: string
  allLabel: string
  options: FilterOption[]
  activeSlug: string | null
  onSelect: (slug: string | null) => void
  emptyLabel: string
  /** Only show the "no match" fallback when true (i.e. the user is searching). */
  showEmptyLabel: boolean
  /** When true, render a couple of skeleton rows instead of the option list. */
  loading: boolean
}) {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <div className="h-2 w-2 rounded-full bg-ignite-orange" />
        <span className="text-xs font-semibold uppercase tracking-wider text-grey-500">
          {label}
        </span>
      </div>

      <div className="flex flex-col gap-0.5">
        <FilterRadioButton
          name={allLabel}
          isActive={activeSlug === null}
          onClick={() => onSelect(null)}
        />
        {loading ? (
          <div className="px-3 py-2 space-y-2">
            <div className="h-3 w-24 animate-pulse rounded bg-grey-100" />
            <div className="h-3 w-32 animate-pulse rounded bg-grey-100" />
            <div className="h-3 w-20 animate-pulse rounded bg-grey-100" />
          </div>
        ) : options.length === 0 ? (
          showEmptyLabel ? (
            <p className="px-3 py-2 text-sm text-grey-400 italic">{emptyLabel}</p>
          ) : null
        ) : (
          options.map((o) => (
            <FilterRadioButton
              key={o.slug}
              name={o.name}
              isActive={activeSlug === o.slug}
              onClick={() => onSelect(o.slug)}
            />
          ))
        )}
      </div>
    </div>
  )
}

export default function CaseStudiesFilterSidebar({
  query,
  onQueryChange,
  industries,
  activeIndustrySlug,
  onIndustryChange,
  services,
  activeServiceSlug,
  onServiceChange,
  activeCount,
  onClearAll,
  loading = false,
}: CaseStudiesFilterSidebarProps) {
  const showEmptyLabels = query.trim().length > 0
  // Mobile-only: filter lists are collapsible; search and header stay visible.
  const [isOpenOnMobile, setIsOpenOnMobile] = useState(false)

  return (
    <div className="rounded-2xl border border-grey-200 bg-white p-5 lg:p-6 shadow-sm">
      <div className="mb-4 flex items-center justify-between gap-3 lg:mb-5">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="h-4 w-4 text-ignite-orange" aria-hidden />
          <h2 className="font-heading text-base font-semibold text-foreground tracking-tight">
            Filters
          </h2>
          {activeCount > 0 && (
            <span className="ml-1 inline-flex h-5 min-w-[1.25rem] items-center justify-center rounded-full bg-ignite-orange/10 px-1.5 text-[11px] font-semibold text-ignite-orange">
              {activeCount}
            </span>
          )}
        </div>
        {activeCount > 0 && (
          <button
            type="button"
            onClick={onClearAll}
            className="text-xs font-semibold uppercase tracking-wider text-grey-500 transition-colors hover:text-ignite-orange"
          >
            Clear all
          </button>
        )}
      </div>

      <label className="relative mb-4 block lg:mb-6">
        <span className="sr-only">Search industries or services</span>
        <Search
          className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-grey-400"
          aria-hidden
        />
        <input
          type="search"
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
          placeholder="Search industries or services…"
          className="w-full rounded-lg border border-grey-200 bg-grey-50 px-10 py-2.5 text-sm text-foreground placeholder:text-grey-400 transition-colors focus:border-ignite-orange focus:bg-white focus:outline-none focus-visible:ring-2 focus-visible:ring-ignite-orange/20"
        />
        {query && (
          <button
            type="button"
            onClick={() => onQueryChange("")}
            aria-label="Clear search"
            className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full p-1 text-grey-400 transition-colors hover:bg-grey-100 hover:text-foreground"
          >
            <X className="h-3.5 w-3.5" aria-hidden />
          </button>
        )}
      </label>

      {/* Mobile-only toggle for the filter lists. Hidden on lg+. */}
      <button
        type="button"
        onClick={() => setIsOpenOnMobile((open) => !open)}
        aria-expanded={isOpenOnMobile}
        className="flex w-full items-center justify-between rounded-lg border border-grey-200 bg-white px-3 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-grey-50 lg:hidden"
      >
        <span>{isOpenOnMobile ? "Hide filters" : "Show filters"}</span>
        <ChevronDown
          className={`h-4 w-4 transition-transform duration-200 ${
            isOpenOnMobile ? "rotate-180" : ""
          }`}
          aria-hidden
        />
      </button>

      {/* Filter lists: hidden on mobile when collapsed, always visible on lg+. */}
      <div
        className={`${isOpenOnMobile ? "mt-4 block" : "hidden"} space-y-6 lg:!mt-0 lg:!block`}
      >
        <FilterSection
          label="Industry"
          allLabel="All industries"
          options={industries}
          activeSlug={activeIndustrySlug}
          onSelect={onIndustryChange}
          emptyLabel="No industries match your search."
          showEmptyLabel={showEmptyLabels}
          loading={loading}
        />

        <div className="h-px bg-grey-100" aria-hidden />

        <FilterSection
          label="Service"
          allLabel="All services"
          options={services}
          activeSlug={activeServiceSlug}
          onSelect={onServiceChange}
          emptyLabel="No services match your search."
          showEmptyLabel={showEmptyLabels}
          loading={loading}
        />
      </div>
    </div>
  )
}

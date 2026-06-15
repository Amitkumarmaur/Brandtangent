"use client"

import { useState } from "react"
import { ChevronDown, Search, SlidersHorizontal, X } from "lucide-react"

export type FilterOption = { slug: string; name: string }

interface CaseStudiesFilterSidebarProps {
  query: string
  onQueryChange: (next: string) => void
  industries: FilterOption[]
  activeIndustrySlug: string | null
  onIndustryChange: (slug: string | null) => void
  services: FilterOption[]
  activeServiceSlug: string | null
  onServiceChange: (slug: string | null) => void
  activeCount: number
  onClearAll: () => void
  loading?: boolean
}

function FilterRadioButton({ name, isActive, onClick }: { name: string; isActive: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={isActive}
      className={`group flex w-full items-center gap-3 rounded-sm px-3 py-2 text-left text-sm transition-colors duration-200 ${
        isActive
          ? "bg-[rgba(28,28,28,0.06)] text-foreground"
          : "text-muted-foreground hover:bg-[rgba(28,28,28,0.04)] hover:text-foreground"
      }`}
    >
      <span
        aria-hidden
        className={`h-2 w-2 shrink-0 rounded-full transition-colors ${
          isActive ? "bg-primary" : "bg-muted group-hover:bg-[rgba(28,28,28,0.3)]"
        }`}
      />
      <span className={`truncate ${isActive ? "font-semibold" : "font-normal"}`}>{name}</span>
    </button>
  )
}

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
  showEmptyLabel: boolean
  loading: boolean
}) {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <div className="h-1.5 w-1.5 rounded-full bg-[rgba(28,28,28,0.4)]" />
        <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{label}</span>
      </div>

      <div className="flex flex-col gap-0.5">
        <FilterRadioButton name={allLabel} isActive={activeSlug === null} onClick={() => onSelect(null)} />
        {loading ? (
          <div className="px-3 py-2 space-y-2">
            <div className="h-3 w-24 animate-pulse rounded bg-muted" />
            <div className="h-3 w-32 animate-pulse rounded bg-muted" />
            <div className="h-3 w-20 animate-pulse rounded bg-muted" />
          </div>
        ) : options.length === 0 ? (
          showEmptyLabel ? <p className="px-3 py-2 text-sm text-muted-foreground italic">{emptyLabel}</p> : null
        ) : (
          options.map((o) => (
            <FilterRadioButton key={o.slug} name={o.name} isActive={activeSlug === o.slug} onClick={() => onSelect(o.slug)} />
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
  const [isOpenOnMobile, setIsOpenOnMobile] = useState(false)

  return (
    <div className="rounded-md border border-border bg-white p-5 lg:p-6">
      <div className="mb-4 flex items-center justify-between gap-3 lg:mb-5">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="h-4 w-4 text-muted-foreground" aria-hidden />
          <h2 className="text-base font-semibold text-foreground tracking-tight">Filters</h2>
          {activeCount > 0 && (
            <span className="ml-1 inline-flex h-5 min-w-[1.25rem] items-center justify-center rounded-full bg-[rgba(28,28,28,0.08)] px-1.5 text-[11px] font-semibold text-foreground">
              {activeCount}
            </span>
          )}
        </div>
        {activeCount > 0 && (
          <button
            type="button"
            onClick={onClearAll}
            className="text-xs font-semibold uppercase tracking-wider text-muted-foreground transition-colors hover:text-foreground"
          >
            Clear all
          </button>
        )}
      </div>

      <label className="relative mb-4 block lg:mb-6">
        <span className="sr-only">Search industries or services</span>
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" aria-hidden />
        <input
          type="search"
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
          placeholder="Search industries or services…"
          className="w-full rounded-sm border border-border bg-white px-10 py-2.5 text-sm text-foreground placeholder:text-muted-foreground transition-colors focus:border-[rgba(28,28,28,0.4)] focus:outline-none"
        />
        {query && (
          <button
            type="button"
            onClick={() => onQueryChange("")}
            aria-label="Clear search"
            className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full p-1 text-muted-foreground transition-colors hover:bg-[rgba(28,28,28,0.06)] hover:text-foreground"
          >
            <X className="h-3.5 w-3.5" aria-hidden />
          </button>
        )}
      </label>

      <button
        type="button"
        onClick={() => setIsOpenOnMobile((open) => !open)}
        aria-expanded={isOpenOnMobile}
        className="flex w-full items-center justify-between rounded-sm border border-border bg-white px-3 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-[rgba(28,28,28,0.04)] lg:hidden"
      >
        <span>{isOpenOnMobile ? "Hide filters" : "Show filters"}</span>
        <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${isOpenOnMobile ? "rotate-180" : ""}`} aria-hidden />
      </button>

      <div className={`${isOpenOnMobile ? "mt-4 block" : "hidden"} space-y-6 lg:!mt-0 lg:!block`}>
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

        <div className="h-px bg-muted" aria-hidden />

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

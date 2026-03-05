"use client"

import { useMemo, useState } from "react"
import { SlidersHorizontal } from "lucide-react"
import type { Tool } from "@/data/mockTools"
import { mockTools } from "@/data/mockTools"
import { ToolsGrid } from "@/components/catalog/ToolsGrid"
import {
  FiltersPanel,
  type FiltersState,
} from "@/components/catalog/FiltersPanel"
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"

const defaultFilters: FiltersState = {
  q: "",
  categories: [],
  min: "",
  max: "",
  minRating: 0,
  sort: "relevance",
}

function applyFilters(tools: Tool[], filters: FiltersState): Tool[] {
  let result = [...tools]

  const q = filters.q.trim().toLowerCase()
  if (q) {
    result = result.filter((tool) =>
      tool.name.toLowerCase().includes(q)
    )
  }

  if (filters.categories.length > 0) {
    const selected = new Set(filters.categories)
    result = result.filter((tool) =>
      tool.categories.some((c) => selected.has(c))
    )
  }

  const minRating = filters.minRating ?? 0
  if (minRating > 0) {
    result = result.filter((tool) => tool.rating >= minRating)
  }

  const minPrice = filters.min.trim() ? Number(filters.min) : NaN
  if (!Number.isNaN(minPrice)) {
    result = result.filter((tool) => (tool.pricingMin ?? 0) >= minPrice)
  }

  const maxPrice = filters.max.trim() ? Number(filters.max) : NaN
  if (!Number.isNaN(maxPrice)) {
    result = result.filter((tool) => (tool.pricingMin ?? Infinity) <= maxPrice)
  }

  switch (filters.sort) {
    case "rating":
      result.sort((a, b) => b.rating - a.rating)
      break
    case "reviews":
      result.sort((a, b) => b.reviews - a.reviews)
      break
    case "priceLow":
      result.sort(
        (a, b) => (a.pricingMin ?? Infinity) - (b.pricingMin ?? Infinity)
      )
      break
    case "priceHigh":
      result.sort(
        (a, b) => (b.pricingMin ?? 0) - (a.pricingMin ?? 0)
      )
      break
    case "az":
      result.sort((a, b) => a.name.localeCompare(b.name))
      break
    case "relevance":
    default:
      // keep original ordering
      break
  }

  return result
}

export default function ToolsPageClient() {
  const [filters, setFilters] = useState<FiltersState>(defaultFilters)
  const [isSheetOpen, setIsSheetOpen] = useState(false)

  const allCategories = useMemo(() => {
    const set = new Set<string>()
    mockTools.forEach((tool) =>
      tool.categories.forEach((cat) => set.add(cat))
    )
    return Array.from(set).sort((a, b) => a.localeCompare(b))
  }, [])

  const filteredTools = useMemo(
    () => applyFilters(mockTools, filters),
    [filters]
  )

  const hasActiveFilters =
    filters.q.trim() !== "" ||
    filters.categories.length > 0 ||
    filters.min.trim() !== "" ||
    filters.max.trim() !== "" ||
    (filters.minRating ?? 0) > 0 ||
    filters.sort !== "relevance"

  const handleReset = () => {
    setFilters(defaultFilters)
    setIsSheetOpen(false)
  }

  const filtersContent = (
    <FiltersPanel
      allCategories={allCategories}
      value={filters}
      onChange={setFilters}
      onReset={handleReset}
    />
  )

  return (
    <main className="min-h-screen w-full bg-gradient-to-br from-[#f7fafc] via-[#eff4fa] to-[#e3eaf5] py-10 flex items-center justify-center">
      <div className="w-full max-w-7xl px-4">
        <div className="rounded-[2.5rem] border border-[#e2e8f0] bg-white/90 shadow-xl p-1">
          <div className="rounded-[2rem] border border-[#e0e7ef]/80 bg-gradient-to-br from-white via-white/95 to-[#f3f6fa] p-8 md:p-12">
            {/* Page header */}
            <header className="mb-6 space-y-4 md:space-y-6">
              <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
                <div>
                  <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-muted-foreground/80">
                    Finance SaaS directory
                  </p>
                  <h1 className="mt-2 text-3xl md:text-4xl font-semibold tracking-tight text-foreground">
                    Discover corporate finance tools
                  </h1>
                  <p className="mt-2 max-w-2xl text-sm md:text-base text-muted-foreground">
                    Filter and compare software for FP&amp;A, treasury, and planning
                    teams in one focused directory.
                  </p>
                </div>

                <div className="text-sm text-muted-foreground/90">
                  <span className="text-foreground font-semibold">
                    {filteredTools.length}
                  </span>{" "}
                  results
                  {hasActiveFilters && (
                    <span className="text-muted-foreground/80">
                      {" "}
                      · filtered from {mockTools.length}
                    </span>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-between gap-3 md:justify-end">
                {/* Mobile filters trigger */}
                <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
                  <SheetTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      className="inline-flex items-center gap-2 lg:hidden"
                    >
                      <SlidersHorizontal className="h-4 w-4" />
                      Filters
                      {hasActiveFilters && (
                        <span className="ml-1 h-2 w-2 rounded-full bg-primary" />
                      )}
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="left" className="w-[min(100vw-3rem,320px)] overflow-y-auto">
                    <SheetHeader>
                      <SheetTitle>Filters</SheetTitle>
                    </SheetHeader>
                    <div className="mt-4 pb-6">{filtersContent}</div>
                  </SheetContent>
                </Sheet>

                {/* Desktop-only subtle help text */}
                <p className="hidden text-xs text-muted-foreground/80 lg:block">
                  Narrow down by category, rating, and pricing.
                </p>
              </div>

              <div className="h-px bg-gradient-to-r from-transparent via-border/80 to-transparent" />
            </header>

            <div className="mt-6 flex flex-col gap-8 lg:flex-row">
              {/* Desktop sidebar filters */}
              <aside className="lg:w-72 lg:shrink-0">
                <div className="sticky top-6 hidden rounded-xl border border-[#e3eaf5] bg-white/80 p-4 lg:block">
                  <h2 className="mb-3 text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground/80">
                    Filters
                  </h2>
                  {filtersContent}
                </div>
              </aside>

              <section
                aria-label="Finance tools"
                className="min-w-0 flex-1"
              >
                <ToolsGrid tools={filteredTools} />
              </section>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
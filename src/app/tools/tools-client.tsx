"use client"

import { useMemo, useState } from "react"
import { useRouter } from "next/navigation"
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
  const router = useRouter()
  const [filters, setFilters] = useState<FiltersState>(defaultFilters)
  const [isSheetOpen, setIsSheetOpen] = useState(false)
  const [compareSelection, setCompareSelection] = useState<string[]>([])

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

  const compareTools: Tool[] = useMemo(
    () =>
      compareSelection
        .map((slug) => mockTools.find((t) => t.slug === slug))
        .filter((t): t is Tool => Boolean(t)),
    [compareSelection]
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

  const toggleCompare = (slug: string) => {
    setCompareSelection((prev) => {
      const exists = prev.includes(slug)
      if (exists) {
        return prev.filter((s) => s !== slug)
      }
      if (prev.length >= 3) {
        return prev
      }
      return [...prev, slug]
    })
  }

  const handleCompareNavigate = () => {
    if (compareTools.length < 2) return
    const slugs = compareTools.map((t) => t.slug)
    const params = new URLSearchParams()
    params.set("tools", slugs.join(","))
    router.push(`/compare?${params.toString()}`)
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
    <main className="min-h-screen w-full bg-[#f8fafc] py-12 md:py-16">
      <div className="mx-auto w-full max-w-[90rem] px-4 sm:px-6 lg:px-10">
        {/* Page header */}
        <header className="mb-10 space-y-6">
          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-muted-foreground/70">
                Finance SaaS directory
              </p>
              <h1 className="mt-3 text-3xl font-semibold tracking-tight text-foreground md:text-4xl">
                Discover corporate finance tools
              </h1>
              <p className="mt-3 max-w-2xl text-base leading-relaxed text-muted-foreground">
                Filter and compare software for FP&amp;A, treasury, and planning
                teams in one focused directory.
              </p>
            </div>

            <div className="text-sm text-muted-foreground/90">
              <span className="font-semibold text-foreground">
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

            <p className="hidden text-xs text-muted-foreground/70 lg:block">
              Narrow down by category, rating, and pricing.
            </p>
          </div>

          <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent" />
        </header>

        <div className="flex flex-col gap-12 lg:flex-row">
          {/* Desktop sidebar filters - narrower, cleaner */}
          <aside className="lg:w-56 lg:shrink-0">
            <div className="sticky top-8 hidden rounded-lg border border-border/60 bg-background/60 px-4 py-4 backdrop-blur-sm lg:block">
              <h2 className="mb-4 text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground/80">
                Filters
              </h2>
              {filtersContent}
            </div>
          </aside>

          <section
            aria-label="Finance tools"
            className="min-w-0 flex-1"
          >
            <ToolsGrid
              tools={filteredTools}
              compareSelection={compareSelection}
              onToggleCompare={toggleCompare}
            />
          </section>
        </div>
      </div>

      {compareTools.length >= 2 && (
        <div className="pointer-events-none fixed inset-x-0 bottom-6 z-40 flex justify-center px-4 sm:px-6">
          <div className="pointer-events-auto w-full max-w-4xl rounded-xl border border-border bg-background/95 shadow-lg backdrop-blur">
            <div className="flex flex-wrap items-center justify-between gap-4 px-4 py-3">
              <div className="flex flex-1 flex-wrap items-center gap-2">
                <span className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground/80">
                  Compare
                </span>
                {compareTools.map((tool) => (
                  <button
                    key={tool.slug}
                    type="button"
                    onClick={() => toggleCompare(tool.slug)}
                    className="inline-flex items-center gap-2 rounded-full border border-border bg-muted/60 px-3 py-1 text-xs font-medium text-foreground hover:bg-muted"
                  >
                    <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-background text-[10px] font-semibold">
                      {tool.name[0]?.toUpperCase()}
                    </span>
                    <span className="max-w-[8rem] truncate">{tool.name}</span>
                    <span className="text-muted-foreground/80">×</span>
                  </button>
                ))}
              </div>
              <div className="flex items-center gap-3">
                <p className="hidden text-xs text-muted-foreground sm:block">
                  {compareTools.length} tools selected
                </p>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setCompareSelection([])}
                >
                  Clear
                </Button>
                <Button
                  type="button"
                  size="sm"
                  onClick={handleCompareNavigate}
                >
                  Compare
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  )
}
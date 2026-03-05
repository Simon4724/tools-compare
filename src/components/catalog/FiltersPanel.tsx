"use client"

import { useMemo } from "react"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"

export type FiltersState = {
  q: string
  categories: string[]
  min: string // on garde en string pour inputs
  max: string
  sort: "relevance" | "rating" | "reviews" | "priceLow" | "priceHigh" | "az"
}

export function FiltersPanel({
  allCategories,
  value,
  onChange,
  onReset,
}: {
  allCategories: string[]
  value: FiltersState
  onChange: (next: FiltersState) => void
  onReset: () => void
}) {
  const selectedSet = useMemo(() => new Set(value.categories), [value.categories])

  const toggleCategory = (cat: string) => {
    const next = selectedSet.has(cat)
      ? value.categories.filter((c) => c !== cat)
      : [...value.categories, cat]
    onChange({ ...value, categories: next })
  }

  return (
    <div className="space-y-5">
      <div>
        <div className="text-sm font-medium mb-2">Search</div>
        <Input
          value={value.q}
          onChange={(e) => onChange({ ...value, q: e.target.value })}
          placeholder="Search by name, keyword…"
        />
      </div>

      <Separator />

      <div>
        <div className="text-sm font-medium mb-2">Pricing (monthly)</div>
        <div className="grid grid-cols-2 gap-2">
          <Input
            inputMode="numeric"
            placeholder="Min"
            value={value.min}
            onChange={(e) => onChange({ ...value, min: e.target.value })}
          />
          <Input
            inputMode="numeric"
            placeholder="Max"
            value={value.max}
            onChange={(e) => onChange({ ...value, max: e.target.value })}
          />
        </div>
      </div>

      <Separator />

      <div>
        <div className="text-sm font-medium mb-2">Categories</div>
        <div className="flex flex-wrap gap-2">
          {allCategories.map((cat) => {
            const active = selectedSet.has(cat)
            return (
              <button
                key={cat}
                type="button"
                onClick={() => toggleCategory(cat)}
                className="focus:outline-none"
              >
                <Badge variant={active ? "default" : "secondary"}>{cat}</Badge>
              </button>
            )
          })}
        </div>
      </div>

      <Separator />

      <div>
        <div className="text-sm font-medium mb-2">Sort</div>
        <div className="flex flex-wrap gap-2">
          {[
            ["relevance", "Relevance"],
            ["rating", "Rating"],
            ["reviews", "Most reviews"],
            ["priceLow", "Price ↑"],
            ["priceHigh", "Price ↓"],
            ["az", "A → Z"],
          ].map(([k, label]) => (
            <Button
              key={k}
              type="button"
              variant={value.sort === k ? "default" : "outline"}
              size="sm"
              onClick={() => onChange({ ...value, sort: k as FiltersState["sort"] })}
            >
              {label}
            </Button>
          ))}
        </div>
      </div>

      <div className="pt-2">
        <Button type="button" variant="ghost" onClick={onReset}>
          Reset filters
        </Button>
      </div>
    </div>
  )
}
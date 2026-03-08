"use client"

import { useState } from "react"
import Link from "next/link"
import { Check } from "lucide-react"
import type { Tool } from "@/data/mockTools"
import { ToolLogo } from "@/components/catalog/ToolLogo"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"

export function ToolCard({
  tool,
  compareSelected = false,
  onToggleCompare,
}: {
  tool: Tool
  compareSelected?: boolean
  onToggleCompare?: (slug: string) => void
}) {
  const [open, setOpen] = useState(false)
  // For hover state on desktop for showing Quick view
  const [hovered, setHovered] = useState(false)

  // Badge pills for up to 3 categories, and the "+N" overflow indicator
  const maxTags = 3
  const shownTags = tool.categories.slice(0, maxTags)
  const extraCount = tool.categories.length - maxTags

  return (
    <>
      <Card
        tabIndex={0}
        onClick={() => setOpen(true)}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        className={
          [
            "relative cursor-pointer group",
            // Transitions for border, shadow, transform, and ring
            "transition-all duration-200",
            "border border-border bg-background",
            "hover:-translate-y-0.5 hover:shadow-lg hover:border-primary/50",
            "hover:ring-1 hover:ring-muted-foreground/10",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30",
            "will-change-transform will-change-shadow will-change-border",
          ].join(" ")
        }
        style={{
          boxShadow: hovered
            ? "0 2px 12px rgba(0,0,0,0.06)"
            : undefined,
          borderLeftWidth: hovered ? 3 : 1,
          borderLeftColor: hovered ? "var(--primary)" : undefined,
        }}
      >
        <CardContent className="flex flex-col gap-3 p-5 md:p-6">
          {/* Main row: logo, title, rating, pricing - horizontal layout */}
          <div className="flex w-full items-center gap-4">
            <ToolLogo tool={tool} className="h-10 w-10" />
            <div className="min-w-0 flex-1">
              <h3 className="text-base font-semibold leading-snug tracking-tight text-foreground sm:text-lg">
                {tool.name}
              </h3>
              <div className="mt-1 flex items-center gap-2 text-xs font-medium text-emerald-700">
                <span>★ {tool.rating.toFixed(1)}</span>
                <span className="text-muted-foreground font-normal">({tool.reviews})</span>
              </div>
            </div>
            {tool.pricingMin != null && (
              <div className="shrink-0 text-right">
                <span className="text-base font-semibold tabular-nums text-foreground">
                  ${tool.pricingMin}
                </span>
                <span className="text-xs text-muted-foreground">/mo</span>
              </div>
            )}
          </div>

          {/* Tagline - single line, subtle */}
          <p className="line-clamp-1 text-[13px] leading-snug text-muted-foreground">
            {tool.tagline}
          </p>

          {/* Footer: pills + compare - single compact row */}
          <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
            <div className="flex flex-wrap gap-1.5">
              {shownTags.map((cat) => (
                <Badge
                  key={cat}
                  variant="secondary"
                  className="rounded-md px-2 py-0.5 text-[11px] font-medium"
                >
                  {cat}
                </Badge>
              ))}
              {extraCount > 0 && (
                <Badge
                  variant="secondary"
                  className="rounded-md px-2 py-0.5 text-[11px] font-medium text-muted-foreground"
                >
                  +{extraCount}
                </Badge>
              )}
            </div>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation()
                onToggleCompare?.(tool.slug)
              }}
              className={[
                "inline-flex items-center gap-2 rounded-md px-2 py-1.5 text-xs transition-colors",
                compareSelected
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/50",
              ].join(" ")}
              aria-pressed={compareSelected}
            >
              <span
                className={[
                  "flex h-3.5 w-3.5 shrink-0 items-center justify-center rounded border transition-colors",
                  compareSelected
                    ? "border-primary bg-primary"
                    : "border-muted-foreground/40 bg-background",
                ].join(" ")}
              >
                {compareSelected && (
                  <Check className="h-2 w-2 text-primary-foreground" strokeWidth={2.5} />
                )}
              </span>
              <span>Compare</span>
            </button>
          </div>

          {/* Quick View Button (hover only, desktop only) */}
          <div
            className={[
              "absolute right-5 top-4 z-10",
              "hidden sm:block",
              hovered
                ? "opacity-100 pointer-events-auto translate-y-0"
                : "opacity-0 pointer-events-none translate-y-[-4px]",
              "transition-all duration-200"
            ].join(" ")}
          >
            <Button
              variant="secondary"
              size="sm"
              className="rounded-full px-3 py-0.5 text-xs shadow"
              tabIndex={-1}
              onClick={e => {
                e.stopPropagation()
                setOpen(true)
              }}
            >
              Quick view
            </Button>
          </div>
        </CardContent>
      </Card>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-xl flex flex-col items-center">
          {/* Visually hidden DialogTitle for accessibility */}
          <DialogTitle>
            <span className="sr-only">{tool.name} - Quick View</span>
          </DialogTitle>

          {/* Premium Header Row */}
          <div className="flex w-full items-center justify-between border-b pb-4">
            <div className="flex items-center gap-4">
              {/* Logo placeholder */}
              <ToolLogo tool={tool} className="h-12 w-12 rounded-xl" />
              <div>
                <div className="text-2xl font-bold tracking-tight">{tool.name}</div>
                <div className="mt-1 flex items-center gap-2 text-sm text-muted-foreground">
                  <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-700">
                    <span className="text-[11px]">★</span>
                    <span>{tool.rating.toFixed(1)}</span>
                  </span>
                  <span>({tool.reviews} reviews)</span>
                </div>
              </div>
            </div>
            {tool.pricingMin != null && (
              <div className="text-right">
                <span className="block uppercase text-xs text-muted-foreground mb-0.5">from</span>
                <span className="text-2xl font-bold text-foreground">
                  ${tool.pricingMin}
                </span>
                <span className="block text-muted-foreground text-sm font-medium">/mo</span>
              </div>
            )}
          </div>

          {/* Modal Content */}
          <div className="w-full mt-7 space-y-7">

            {/* Overview Section */}
            <section>
              <h3 className="text-lg font-medium mb-1">Overview</h3>
              <div className="text-base font-normal text-muted line-clamp-2 text-muted-foreground/80 mb-2">{tool.tagline}</div>
              <div className="text-sm text-muted-foreground">
                {/* Placeholder description; replace with real content as desired */}
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer posuere erat a ante. This is a placeholder description for the tool overview section to add more context and value.
              </div>
            </section>

            {/* Categories Section */}
            <section>
              <h3 className="text-lg font-medium mb-2">Categories</h3>
              <div className="flex flex-wrap gap-2">
                {tool.categories.map((cat) => (
                  <Badge
                    key={cat}
                    variant="outline"
                    className="rounded-full px-3 py-1 text-sm font-medium"
                  >
                    {cat}
                  </Badge>
                ))}
              </div>
            </section>
          </div>

          {/* Modal Footer */}
          <div className="mt-8 w-full flex flex-col gap-3 sm:flex-row sm:justify-end">
            <Button variant="outline" onClick={() => setOpen(false)}>
              Close
            </Button>
            <Button asChild>
              <Link href={`/tools/${tool.slug}`}>View full profile</Link>
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
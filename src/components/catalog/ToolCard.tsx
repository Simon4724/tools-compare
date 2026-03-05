"use client"

import { useState } from "react"
import Link from "next/link"
import type { Tool } from "@/data/mockTools"
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

// Generate initials for the logo placeholder from tool name
function getInitials(name: string) {
  const words = name.split(" ").filter(Boolean)
  return (
    words[0]?.[0]?.toUpperCase() +
    (words.length > 1 ? words[1]?.[0]?.toUpperCase() : "")
  )
}

export function ToolCard({ tool }: { tool: Tool }) {
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
            "hover:-translate-y-[5px] hover:shadow-xl hover:border-primary/70",
            "hover:ring-1 hover:ring-muted-foreground/10",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30",
            "will-change-transform will-change-shadow will-change-border",
          ].join(" ")
        }
        style={{
          boxShadow: hovered
            ? "0 4px 24px 0 rgba(19,22,26,0.08), 0 1px 1.5px 0 rgba(19,22,26,0.04)"
            : undefined,
          borderLeftWidth: hovered ? 4 : 1,
          borderLeftColor: hovered ? "var(--primary)" : undefined,
        }}
      >
        <CardContent className="flex flex-col gap-5 p-7 pb-6">
          <div className="flex w-full items-center">
            {/* Logo Placeholder */}
            <div className="mr-5 flex-shrink-0">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-border bg-muted text-2xl font-bold uppercase text-primary">
                {getInitials(tool.name)}
              </div>
            </div>
            <div className="flex-1 min-w-0">
              {/* Title and tagline */}
              <div className="flex items-start gap-3">
                <h3 className="truncate text-xl font-semibold tracking-tight text-foreground">
                  {tool.name}
                </h3>
                {/* Rating chip (desktop) */}
                <div className="hidden sm:inline-flex items-center gap-1 rounded-full border border-emerald-100 bg-emerald-50 px-2.5 py-0.5 text-xs font-medium text-emerald-700">
                  <span className="text-[11px]">★</span>
                  <span>{tool.rating.toFixed(1)}</span>
                  <span className="text-[11px] text-emerald-800/70">
                    ({tool.reviews})
                  </span>
                </div>
              </div>
              <p className="mt-1 line-clamp-2 text-sm text-muted-foreground/90">
                {tool.tagline}
              </p>
            </div>
            {/* Pricing premium format */}
            {tool.pricingMin != null && (
              <div className="ml-6 flex-shrink-0 flex flex-col items-end whitespace-nowrap">
                <span className="uppercase text-xs text-muted-foreground mb-0.5">
                  from
                </span>
                <span>
                  <span className="text-xl font-bold text-foreground leading-snug">
                    ${tool.pricingMin}
                  </span>
                  <span className="text-muted-foreground text-sm font-medium">/mo</span>
                </span>
              </div>
            )}
          </div>

          {/* Rating (mobile) */}
          <div className="mt-1 flex items-center gap-2 text-sm sm:hidden">
            <span className="font-medium text-primary">
              ★ {tool.rating.toFixed(1)}
            </span>
            <span className="text-muted-foreground">
              ({tool.reviews} reviews)
            </span>
          </div>

          {/* Categories as pill-shaped badges */}
          <div className="flex flex-wrap gap-2">
            {shownTags.map((cat) => (
              <Badge
                key={cat}
                variant="secondary"
                className="rounded-full px-3 py-1 text-xs font-medium"
              >
                {cat}
              </Badge>
            ))}
            {extraCount > 0 && (
              <Badge
                variant="secondary"
                className="rounded-full px-3 py-1 text-xs font-medium text-muted-foreground"
              >
                +{extraCount}
              </Badge>
            )}
          </div>

          {/* Quick View Button (hover only, desktop only) */}
          <div
            className={[
              "absolute right-7 top-5 z-10",
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
              className="rounded-full px-4 py-1 shadow"
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
              <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-border bg-muted text-2xl font-bold uppercase text-primary">
                {getInitials(tool.name)}
              </div>
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
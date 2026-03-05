"use client"

import { mockTools } from "@/data/mockTools"
import { ToolsGrid } from "@/components/catalog/ToolsGrid"
import { Input } from "@/components/ui/input"

export default function ToolsPageClient() {
  return (
    <main className="min-h-screen w-full bg-gradient-to-br from-[#f7fafc] via-[#eff4fa] to-[#e3eaf5] py-10 flex items-center justify-center">
      <div className="w-full max-w-7xl px-4">
        <div className="rounded-[2.5rem] border border-[#e2e8f0] bg-white/90 shadow-xl p-1">
          <div className="rounded-[2rem] border border-[#e0e7ef]/80 bg-gradient-to-br from-white via-white/95 to-[#f3f6fa] p-8 md:p-12">
            {/* Page header */}
            <header className="mb-8 space-y-6">
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
                    {mockTools.length}
                  </span>{" "}
                  tools
                  <span className="mx-1 text-muted-foreground/60">•</span>
                  curated for corporate finance
                </div>
              </div>

              <div className="h-px bg-gradient-to-r from-transparent via-border/80 to-transparent" />
            </header>

            {/* Premium Search Bar Row (visual only for now) */}
            <div className="mb-8">
              <div className="flex w-full max-w-lg items-center gap-3 rounded-xl border border-[#e3eaf5] bg-white px-4 py-2.5 shadow-sm">
                <span className="select-none text-lg text-muted-foreground">🔍</span>
                <Input
                  type="text"
                  placeholder="Search tools (coming soon)…"
                  className="border-0 bg-transparent px-0 text-sm md:text-base shadow-none focus-visible:ring-0 focus-visible:ring-transparent"
                  disabled
                  aria-label="Search tools"
                />
              </div>
            </div>

            <section aria-label="Finance tools" className="mt-2">
              <ToolsGrid tools={mockTools} />
            </section>
          </div>
        </div>
      </div>
    </main>
  )
}
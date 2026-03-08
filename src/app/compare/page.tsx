import Link from "next/link"
import type { Tool } from "@/data/mockTools"
import { mockTools } from "@/data/mockTools"
import { ToolLogo } from "@/components/catalog/ToolLogo"

type ComparePageProps = {
  searchParams?: Promise<{ tools?: string }>
}

function getToolsFromQuery(resolved?: { tools?: string } | null): Tool[] {
  const slugs =
    resolved?.tools
      ?.split(",")
      .map((s) => s.trim())
      .filter(Boolean) ?? []

  if (slugs.length === 0) return []

  const slugSet = new Set(slugs)
  const ordered = slugs
    .map((slug) => mockTools.find((t) => t.slug === slug))
    .filter((t): t is Tool => Boolean(t))

  // Fallback to any remaining tools if less than requested
  if (ordered.length < slugSet.size) {
    const remaining = mockTools.filter((t) => !slugSet.has(t.slug))
    ordered.push(...remaining.slice(0, slugSet.size - ordered.length))
  }

  return ordered.slice(0, 3)
}

export default async function ComparePage({ searchParams }: ComparePageProps) {
  const resolved = await searchParams
  const tools = getToolsFromQuery(resolved ?? undefined)

  return (
    <main className="min-h-screen w-full bg-[#f8fafc] py-12 md:py-16">
      <div className="mx-auto w-full max-w-[90rem] px-4 sm:px-6 lg:px-10">
        <header className="mb-10 space-y-6">
          <Link
            href="/tools"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground"
          >
            ← Back to tools
          </Link>
          <div>
            <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-muted-foreground/70">
              Finance SaaS directory
            </p>
            <h1 className="mt-3 text-2xl font-semibold tracking-tight text-foreground md:text-3xl">
              Compare tools side by side
            </h1>
            <p className="mt-3 max-w-2xl text-base leading-relaxed text-muted-foreground">
              Review pricing, categories, and ratings at a glance to choose the
              right finance stack for your team.
            </p>
          </div>
          <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent" />
        </header>

        {tools.length < 2 ? (
          <div className="rounded-lg border border-dashed border-border bg-background/60 px-6 py-8 text-sm text-muted-foreground">
            Select at least two tools from the directory to start a comparison.
          </div>
        ) : (
          <div className="overflow-x-auto rounded-lg border border-border bg-background">
            <table className="min-w-full border-collapse">
              <thead>
                <tr className="border-b border-border bg-muted/30">
                  <th className="w-36 px-4 py-4 text-left text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                    Metric
                  </th>
                  {tools.map((tool) => (
                    <th
                      key={tool.slug}
                      className="px-4 py-4 text-left align-bottom"
                    >
                      <div className="flex flex-col items-start gap-2">
                        <ToolLogo
                          tool={tool}
                          className="h-10 w-10 rounded-lg"
                        />
                        <div className="text-sm font-semibold text-foreground">
                          {tool.name}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {tool.categories.join(" • ")}
                        </div>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
                  <tbody className="text-sm">
                    <tr className="border-b border-border">
                      <td className="bg-muted/20 px-4 py-3 text-xs font-medium text-muted-foreground">
                        Pricing
                      </td>
                      {tools.map((tool) => (
                        <td key={tool.slug} className="px-4 py-3 align-top">
                          {tool.pricingMin != null ? (
                            <span className="font-semibold text-foreground">
                              ${tool.pricingMin}
                              <span className="ml-1 text-xs font-medium text-muted-foreground">
                                /mo
                              </span>
                            </span>
                          ) : (
                            <span className="text-muted-foreground">
                              Contact vendor
                            </span>
                          )}
                        </td>
                      ))}
                    </tr>

                    <tr className="border-b border-border">
                      <td className="bg-muted/20 px-4 py-3 text-xs font-medium text-muted-foreground">
                        Categories
                      </td>
                      {tools.map((tool) => (
                        <td key={tool.slug} className="px-4 py-3 align-top">
                          <div className="flex flex-wrap gap-1.5">
                            {tool.categories.map((cat) => (
                              <span
                                key={cat}
                                className="inline-flex items-center rounded-full bg-[#f1f5ff] px-2 py-0.5 text-[11px] font-medium text-[#1f3263]"
                              >
                                {cat}
                              </span>
                            ))}
                          </div>
                        </td>
                      ))}
                    </tr>

                    <tr className="border-b border-border">
                      <td className="bg-muted/20 px-4 py-3 text-xs font-medium text-muted-foreground">
                        Rating
                      </td>
                      {tools.map((tool) => (
                        <td key={tool.slug} className="px-4 py-3 align-top">
                          <div className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-800">
                            <span>★ {tool.rating.toFixed(1)}</span>
                            <span className="text-[11px] text-emerald-900/70">
                              ({tool.reviews} reviews)
                            </span>
                          </div>
                        </td>
                      ))}
                    </tr>

                    <tr className="border-b border-border align-top">
                      <td className="bg-muted/20 px-4 py-3 text-xs font-medium text-muted-foreground">
                        Description
                      </td>
                      {tools.map((tool) => (
                        <td key={tool.slug} className="px-4 py-3 align-top">
                          <p className="text-sm text-muted-foreground">
                            {tool.tagline}
                          </p>
                        </td>
                      ))}
                    </tr>

                    <tr className="align-top">
                      <td className="bg-muted/20 px-4 py-3 text-xs font-medium text-muted-foreground">
                        Key features
                      </td>
                      {tools.map((tool) => (
                        <td key={tool.slug} className="px-4 py-3 align-top">
                          <p className="text-xs text-muted-foreground">
                            Not available in this preview.
                          </p>
                        </td>
                      ))}
                    </tr>
                  </tbody>
                </table>
              </div>
            )}
      </div>
    </main>
  )
}


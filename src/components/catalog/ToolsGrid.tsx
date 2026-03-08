import type { Tool } from "@/data/mockTools"
import { ToolCard } from "@/components/catalog/ToolCard"

export function ToolsGrid({
  tools,
  compareSelection = [],
  onToggleCompare,
}: {
  tools: Tool[]
  compareSelection?: string[]
  onToggleCompare?: (slug: string) => void
}) {
  return (
    <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 sm:gap-10 xl:grid-cols-3 xl:gap-12">
      {tools.map((tool) => (
        <ToolCard
          key={tool.slug}
          tool={tool}
          compareSelected={compareSelection.includes(tool.slug)}
          onToggleCompare={onToggleCompare}
        />
      ))}
    </div>
  )
}
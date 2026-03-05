import type { Tool } from "@/data/mockTools"
import { ToolCard } from "@/components/catalog/ToolCard"

export function ToolsGrid({ tools }: { tools: Tool[] }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7 sm:gap-8 lg:gap-10">
      {tools.map((tool) => (
        <ToolCard key={tool.slug} tool={tool} />
      ))}
    </div>
  )
}
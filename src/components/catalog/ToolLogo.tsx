"use client"

import { useState } from "react"
import type { Tool } from "@/data/mockTools"
import { cn } from "@/lib/utils"

function getInitials(name: string) {
  const words = name.split(" ").filter(Boolean)
  return (
    words[0]?.[0]?.toUpperCase() +
    (words.length > 1 ? words[1]?.[0]?.toUpperCase() : "")
  )
}

export function ToolLogo({
  tool,
  className,
  ...props
}: {
  tool: Tool
  className?: string
} & React.HTMLAttributes<HTMLDivElement>) {
  const [imgError, setImgError] = useState(false)
  const showImg = tool.logo && !imgError

  return (
    <div
      className={cn(
        "flex shrink-0 items-center justify-center overflow-hidden rounded-lg border border-border bg-muted",
        className
      )}
      {...props}
    >
      {showImg ? (
        <img
          src={tool.logo}
          alt=""
          className="h-full w-full object-cover object-center"
          onError={() => setImgError(true)}
        />
      ) : (
        <span className="text-sm font-semibold uppercase leading-none text-primary">
          {getInitials(tool.name)}
        </span>
      )}
    </div>
  )
}

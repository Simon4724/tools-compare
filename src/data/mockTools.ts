export type Tool = {
  slug: string
  name: string
  tagline: string
  rating: number
  reviews: number
  categories: string[]
  pricingMin?: number
  /** URL or path to tool logo image; falls back to initials if missing or invalid */
  logo?: string
}

export const mockTools: Tool[] = [
  {
    slug: "finflow",
    name: "Finflow",
    tagline: "Modern FP&A planning and forecasting.",
    rating: 4.6,
    reviews: 128,
    categories: ["FP&A", "Planning"],
    pricingMin: 49,
    logo: "/logos/finflow.svg",
  },
  {
    slug: "treasurybox",
    name: "TreasuryBox",
    tagline: "Cash visibility and treasury automation.",
    rating: 4.4,
    reviews: 87,
    categories: ["Treasury"],
    pricingMin: 199,
    // no logo: falls back to initials
  },
]
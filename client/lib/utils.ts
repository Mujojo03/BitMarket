import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import type { Category, CategoryCardData } from "./types"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatSats(sats: number): string {
  return new Intl.NumberFormat().format(sats)
}

export function truncate(str: string, length: number): string {
  if (str.length <= length) {
    return str
  }
  return str.slice(0, length) + "..."
}


export function toCategoryCardData(category: Category): CategoryCardData {
  const slug = category.name.toLowerCase().replace(/\s+/g, "-")
  const imageUrl = `/img/categories/${slug}.png`

  return {
    ...category,
    slug,
    imageUrl,
  }
}


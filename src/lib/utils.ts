import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Anchor links (`href="#id"`) only trigger the browser's native scroll on a
 * hash *change* — clicking the same link twice in a row does nothing the
 * second time since the hash never changes. This drives the scroll directly
 * instead, so it works every time regardless of the current hash.
 */
export function scrollToId(id: string) {
  return (e: { preventDefault: () => void }) => {
    e.preventDefault()
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" })
  }
}

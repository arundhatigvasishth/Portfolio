"use client"

import { useEffect, useState } from "react"

// Returns true when the user has requested reduced motion, or before mount
// (so we never start heavy animation until we know the preference).
export function usePrefersReducedMotion(): boolean {
  const [reduced, setReduced] = useState(true)

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)")
    const update = () => setReduced(mq.matches)
    update()
    mq.addEventListener("change", update)
    return () => mq.removeEventListener("change", update)
  }, [])

  return reduced
}

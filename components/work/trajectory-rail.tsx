"use client"

import { useEffect, useRef, type ReactNode } from "react"

// A rail that fills as you read down it. Each [data-stop] gets data-lit once
// the reading line (60% down the viewport) passes its dot. Written straight to
// the DOM so scrolling never re-renders the cards and their live previews.
export function TrajectoryRail({ children }: { children: ReactNode }) {
  const list = useRef<HTMLOListElement>(null)

  useEffect(() => {
    const el = list.current
    if (!el) return
    const stops = Array.from(el.querySelectorAll<HTMLElement>("[data-stop]"))
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      el.style.setProperty("--thread-progress", "1")
      stops.forEach((s) => (s.dataset.lit = "true"))
      return
    }
    let raf = 0
    const update = () => {
      raf = 0
      const line = window.innerHeight * 0.6
      const rect = el.getBoundingClientRect()
      const progress = Math.min(1, Math.max(0, (line - rect.top) / rect.height))
      el.style.setProperty("--thread-progress", progress.toFixed(4))
      stops.forEach((s) => {
        const dot = s.querySelector<HTMLElement>("[data-dot]")
        s.dataset.lit = String(!!dot && dot.getBoundingClientRect().top < line)
      })
    }
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update)
    }
    update()
    window.addEventListener("scroll", onScroll, { passive: true })
    window.addEventListener("resize", onScroll)
    // Rows open and close, which moves every dot below them.
    const ro = new ResizeObserver(onScroll)
    ro.observe(el)
    return () => {
      ro.disconnect()
      window.removeEventListener("scroll", onScroll)
      window.removeEventListener("resize", onScroll)
      cancelAnimationFrame(raf)
    }
  }, [])

  return (
    <ol ref={list} className="relative">
      <span aria-hidden="true" className="absolute bottom-3 left-[11px] top-3 w-[2px] rounded-full bg-border" />
      <span aria-hidden="true" className="thread-fill absolute bottom-3 left-[11px] top-3 w-[2px] rounded-full bg-primary" />
      {children}
    </ol>
  )
}

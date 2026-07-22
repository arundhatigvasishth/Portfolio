"use client"

import { useRef, type ReactNode } from "react"

// A gentle pointer-reactive tilt. Pure transforms, disabled for touch and
// reduced motion. Gives cards a subtle sense of stage depth.
export function TiltCard({ children, className = "" }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null)

  const onMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const el = ref.current
    if (!el) return
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return
    if (e.pointerType === "touch") return
    const r = el.getBoundingClientRect()
    const px = (e.clientX - r.left) / r.width - 0.5
    const py = (e.clientY - r.top) / r.height - 0.5
    el.style.transform = `perspective(900px) rotateX(${(-py * 5).toFixed(2)}deg) rotateY(${(px * 6).toFixed(2)}deg) translateY(-4px)`
  }

  const reset = () => {
    const el = ref.current
    if (el) el.style.transform = "perspective(900px) rotateX(0deg) rotateY(0deg) translateY(0)"
  }

  return (
    <div
      ref={ref}
      onPointerMove={onMove}
      onPointerLeave={reset}
      className={className}
      style={{ transition: "transform 0.4s cubic-bezier(0.22, 1, 0.36, 1)", transformStyle: "preserve-3d" }}
    >
      {children}
    </div>
  )
}

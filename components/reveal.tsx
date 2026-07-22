"use client"

import { useEffect, useRef, useState, type ReactNode } from "react"
import { rhythmEasing } from "@/lib/rhythm"

type RevealProps = {
  children: ReactNode
  className?: string
  delay?: number
  as?: "div" | "li" | "section"
}

// Reveals content on scroll using one shared rhythmic easing curve, so every
// entrance across the site moves on the same beat. Respects reduced motion.
export function Reveal({ children, className, delay = 0, as = "div" }: RevealProps) {
  const ref = useRef<HTMLElement | null>(null)
  const [visible, setVisible] = useState(false)
  const [reduced, setReduced] = useState(false)

  useEffect(() => {
    setReduced(window.matchMedia("(prefers-reduced-motion: reduce)").matches)
  }, [])

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            setVisible(true)
            io.unobserve(e.target)
          }
        })
      },
      { threshold: 0.15, rootMargin: "0px 0px -8% 0px" },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  const Tag = as as any
  const animate = !reduced

  return (
    <Tag
      ref={ref}
      className={className}
      style={{
        opacity: animate ? (visible ? 1 : 0) : 1,
        transform: animate ? (visible ? "none" : "translateY(22px)") : "none",
        transition: animate ? `opacity 0.7s ${rhythmEasing} ${delay}ms, transform 0.7s ${rhythmEasing} ${delay}ms` : undefined,
        willChange: animate ? "opacity, transform" : undefined,
      }}
    >
      {children}
    </Tag>
  )
}

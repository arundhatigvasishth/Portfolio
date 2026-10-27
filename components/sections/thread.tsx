"use client"

import Link from "next/link"
import { useEffect, useRef, useState } from "react"
import { ArrowRight } from "lucide-react"
import { thread } from "@/lib/content"
import { SectionHeading } from "@/components/section-heading"
import { TextPlate } from "@/components/text-plate"
import { cn } from "@/lib/utils"

const kindStyle = {
  Project: "bg-primary/10 text-primary",
  Research: "bg-[oklch(0.55_0.17_300/0.12)] text-[oklch(0.5_0.17_300)] dark:text-[oklch(0.78_0.13_300)]",
  Role: "bg-[oklch(0.68_0.15_150/0.14)] text-[oklch(0.45_0.13_150)] dark:text-[oklch(0.8_0.14_150)]",
}

// A rail that fills as you read down it. Each stop lights up once the
// reading line (60% down the viewport) passes its dot.
export function Thread() {
  const list = useRef<HTMLOListElement>(null)
  const [reached, setReached] = useState(-1)

  useEffect(() => {
    const el = list.current
    if (!el) return
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      el.style.setProperty("--thread-progress", "1")
      setReached(thread.stops.length - 1)
      return
    }
    let raf = 0
    const update = () => {
      raf = 0
      const line = window.innerHeight * 0.6
      const rect = el.getBoundingClientRect()
      const progress = Math.min(1, Math.max(0, (line - rect.top) / rect.height))
      el.style.setProperty("--thread-progress", progress.toFixed(4))
      const dots = el.querySelectorAll<HTMLElement>("[data-dot]")
      let last = -1
      dots.forEach((d, i) => {
        if (d.getBoundingClientRect().top < line) last = i
      })
      setReached(last)
    }
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update)
    }
    update()
    window.addEventListener("scroll", onScroll, { passive: true })
    window.addEventListener("resize", onScroll)
    return () => {
      window.removeEventListener("scroll", onScroll)
      window.removeEventListener("resize", onScroll)
      cancelAnimationFrame(raf)
    }
  }, [])

  return (
    <section id="thread" className="relative mx-auto max-w-6xl px-4 py-28 sm:px-8 sm:py-40">
      <SectionHeading index="02" title={thread.title} kicker={thread.kicker} />

      <p className="max-w-2xl text-pretty text-lg leading-relaxed text-foreground/85">
        <TextPlate>{thread.intro}</TextPlate>
      </p>

      <ol ref={list} className="relative mt-14 max-w-3xl">
        {/* the rail and its fill */}
        <span aria-hidden="true" className="absolute bottom-3 left-[11px] top-3 w-[2px] rounded-full bg-border" />
        <span aria-hidden="true" className="thread-fill absolute bottom-3 left-[11px] top-3 w-[2px] rounded-full bg-primary" />

        {thread.stops.map((stop, i) => {
          const lit = i <= reached
          return (
            <li key={`${stop.title}-${i}`} className="relative pb-12 pl-12 last:pb-0 sm:pl-14">
              <span
                data-dot
                aria-hidden="true"
                className={cn(
                  "absolute left-0 top-1 flex h-6 w-6 items-center justify-center rounded-full border-2 bg-background transition-all duration-500 ease-apple",
                  lit ? "scale-100 border-primary" : "scale-90 border-border",
                )}
              >
                <span className={cn("h-2 w-2 rounded-full transition-colors duration-500", lit ? "bg-primary" : "bg-border")} />
              </span>

              <div className={cn("transition-opacity duration-700 ease-apple", lit ? "opacity-100" : "opacity-45")}>
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                  <span className="text-xs font-medium tabular-nums text-muted-foreground">
                    <TextPlate>{stop.period}</TextPlate>
                  </span>
                  <span className={cn("rounded-full px-2.5 py-0.5 text-[11px] font-medium", kindStyle[stop.kind])}>{stop.kind}</span>
                </div>
                <h3 className="mt-2 text-2xl font-semibold text-foreground">
                  <Link href={stop.href} className="group inline-flex items-center gap-2 hover:text-primary">
                    <TextPlate>{stop.title}</TextPlate>
                    <ArrowRight className="h-5 w-5 -translate-x-1 opacity-0 transition-all duration-300 ease-apple group-hover:translate-x-0 group-hover:opacity-100" />
                  </Link>
                </h3>
                <p className="mt-3 text-pretty text-[17px] leading-relaxed text-foreground/85">
                  <TextPlate>{stop.why}</TextPlate>
                </p>
                <p className="mt-3 text-pretty text-[15px] leading-relaxed text-muted-foreground">
                  <TextPlate>
                    <span className="font-medium text-foreground/80">What I took from it: </span>
                    {stop.lesson}
                  </TextPlate>
                </p>
              </div>
            </li>
          )
        })}
      </ol>
    </section>
  )
}

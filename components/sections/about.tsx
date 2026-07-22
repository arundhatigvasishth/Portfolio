"use client"

import dynamic from "next/dynamic"
import { about } from "@/lib/content"
import { SectionHeading } from "@/components/section-heading"
import { Reveal } from "@/components/reveal"

const MudraField = dynamic(
  () => import("@/components/three/mudra-field").then((m) => m.MudraField),
  { ssr: false },
)

export function About() {
  return (
    <section id="about" className="relative mx-auto max-w-6xl px-5 py-24 sm:px-8 sm:py-32">
      <SectionHeading index="01" title="About" />

      <div className="grid gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16">
        <div className="flex flex-col gap-6">
          {about.map((para, i) => (
            <Reveal key={i} delay={i * 90}>
              <p className="text-pretty text-lg leading-relaxed text-foreground/85">{para}</p>
            </Reveal>
          ))}
        </div>

        <Reveal delay={120} className="flex flex-col">
          <div className="relative aspect-square w-full overflow-hidden rounded-2xl border border-border bg-card/40">
            <MudraField />
            <div className="pointer-events-none absolute inset-x-0 bottom-0 flex items-center justify-between p-4 font-mono text-[10px] tracking-[0.2em] text-muted-foreground">
              <span>MUDRA FIELD</span>
              <span>READS ON HOVER</span>
            </div>
          </div>
          <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
            Move across the lattice. Nodes lift and light where your hand passes, the same way a gesture recognizer reads the shape of a hand in real time.
          </p>
        </Reveal>
      </div>
    </section>
  )
}

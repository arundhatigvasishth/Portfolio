"use client"

import dynamic from "next/dynamic"

const Starfield = dynamic(
  () => import("@/components/three/starfield").then((m) => m.Starfield),
  { ssr: false },
)

const SolarSystem = dynamic(
  () => import("@/components/three/solar-system").then((m) => m.SolarSystem),
  { ssr: false },
)

export function HeroVisual() {
  return <SolarSystem />
}

export function SiteBackground() {
  return (
    <div className="pointer-events-none fixed inset-0 z-0">
      <Starfield />
    </div>
  )
}

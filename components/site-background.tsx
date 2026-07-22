"use client"

import dynamic from "next/dynamic"

const MudraField = dynamic(
  () => import("@/components/three/mudra-field").then((m) => m.MudraField),
  { ssr: false },
)

export function SiteBackground() {
  return (
    <div className="pointer-events-none fixed inset-0 z-0">
      <MudraField />
    </div>
  )
}

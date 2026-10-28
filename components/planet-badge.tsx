import { planets } from "@/lib/planets"
import { cn } from "@/lib/utils"

// A project's planet as a flat, lit sphere, matching its body in the hero system.
export function PlanetBadge({ slug, className }: { slug: string; className?: string }) {
  const planet = planets[slug]
  if (!planet) return null
  return (
    <span className={cn("relative flex h-11 w-11 shrink-0 items-center justify-center", className)} aria-hidden="true">
      <span
        className="h-7 w-7 rounded-full"
        style={{
          background: `radial-gradient(circle at 32% 30%, color-mix(in oklab, ${planet.color} 35%, white), ${planet.color} 45%, color-mix(in oklab, ${planet.color} 35%, black))`,
          boxShadow: `0 0 18px -2px color-mix(in oklab, ${planet.color} 55%, transparent)`,
        }}
      />
      {planet.ring ? (
        <span
          className="absolute h-3 w-11 -rotate-[18deg] rounded-[50%] border"
          style={{ borderColor: `color-mix(in oklab, ${planet.color} 60%, transparent)` }}
        />
      ) : null}
      {planet.moon ? <span className="absolute right-0.5 top-1 h-1.5 w-1.5 rounded-full bg-foreground/60" /> : null}
    </span>
  )
}

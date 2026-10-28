import { ChevronDown } from "lucide-react"
import { HeroVisual } from "@/components/site-background"

// The first screen is only the sky. I'm the star at the center (click it for
// the intro and links); every planet is a project.
export function Hero() {
  return (
    <section id="top" aria-label="Arundhati Vasishth: projects as a solar system" className="relative h-[100svh] min-h-[600px] w-full overflow-hidden">
      <h1 className="sr-only">Arundhati Vasishth, software engineer and CS student at UMass Amherst</h1>
      <div className="absolute inset-0">
        <HeroVisual />
      </div>
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-b from-transparent to-background" />

      <a
        href="#projects"
        className="absolute inset-x-0 bottom-6 mx-auto flex w-fit flex-col items-center gap-1 rounded-full px-4 py-1 text-xs text-white/55 transition-colors hover:text-white sm:bottom-8"
      >
        <span className="hidden sm:block">Every planet is a project · hover to read, click to open</span>
        <span className="sm:hidden">Every planet is a project · tap one</span>
        <ChevronDown className="h-4 w-4 animate-bounce motion-reduce:animate-none" aria-hidden="true" />
      </a>
    </section>
  )
}

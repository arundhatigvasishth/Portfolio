import { ArrowUpRight, FileText } from "lucide-react"
import { profile } from "@/lib/content"
import { IconGithub, IconLinkedin } from "@/components/icons"
import { TextPlate } from "@/components/text-plate"

export function Hero() {
  return (
    <section id="top" className="relative min-h-[100svh] w-full overflow-hidden">
      {/* readability wash */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-background via-background/80 to-transparent md:via-background/40" />

      <div className="relative mx-auto flex min-h-[100svh] max-w-6xl flex-col justify-center px-5 pt-24 sm:px-8">
        <div className="max-w-2xl">
          <p className="mb-5 inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 font-mono text-xs tracking-[0.2em] text-muted-foreground">
            <span className="h-1.5 w-1.5 rounded-full bg-accent" />
            {profile.location.toUpperCase()}
          </p>
          <h1 className="text-balance font-serif text-5xl font-semibold tracking-tight text-foreground sm:text-6xl md:text-7xl">
            <TextPlate className="block px-2 py-0.5 -mx-2 leading-tight">Arundhati</TextPlate>
            <TextPlate className="block px-2 py-0.5 -mx-2 leading-tight text-primary">Vasishth</TextPlate>
          </h1>
          <p className="mt-6 max-w-xl text-pretty text-lg leading-relaxed text-foreground/80 sm:text-xl">
            <TextPlate>{profile.tagline}</TextPlate>
          </p>

          <div className="mt-9 flex flex-wrap items-center gap-3">
            <a
              href="#projects"
              className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition-transform hover:-translate-y-0.5"
            >
              View work
              <ArrowUpRight className="h-4 w-4" />
            </a>
            <a
              href={profile.resume}
              className="inline-flex items-center gap-2 rounded-full border border-border bg-background px-5 py-2.5 text-sm font-medium text-foreground transition-colors hover:border-accent hover:text-accent"
            >
              <FileText className="h-4 w-4" />
              Resume
            </a>
            <div className="ml-1 flex items-center gap-1">
              <a
                href={profile.github}
                target="_blank"
                rel="noreferrer noopener"
                aria-label="GitHub profile"
                className="inline-flex h-10 w-10 items-center justify-center rounded-full text-foreground/70 transition-colors hover:text-accent"
              >
                <IconGithub className="h-5 w-5" />
              </a>
              <a
                href={profile.linkedin}
                target="_blank"
                rel="noreferrer noopener"
                aria-label="LinkedIn profile"
                className="inline-flex h-10 w-10 items-center justify-center rounded-full text-foreground/70 transition-colors hover:text-accent"
              >
                <IconLinkedin className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

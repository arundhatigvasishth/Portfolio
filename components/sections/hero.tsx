import { ChevronRight, FileText } from "lucide-react"
import { profile } from "@/lib/content"
import { IconGithub, IconLinkedin } from "@/components/icons"
import { TextPlate } from "@/components/text-plate"

export function Hero() {
  return (
    <section id="top" className="relative min-h-[100svh] w-full overflow-hidden">
      {/* readability wash: solid behind the type, fading out so the field shows on the right */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-background via-background/85 to-background/0 md:via-background/50" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-b from-transparent to-background" />

      <div className="relative mx-auto flex min-h-[100svh] max-w-6xl flex-col justify-center px-4 pt-24 pb-16 sm:px-8">
        <div className="max-w-3xl">
          <p className="mb-6 text-sm font-medium text-muted-foreground">
            <TextPlate>{profile.location}</TextPlate>
          </p>
          <h1 className="text-balance text-[clamp(3rem,9vw,6.5rem)] font-semibold leading-[1.02] text-foreground">
            <TextPlate className="block px-2 py-0.5 -mx-2">Arundhati</TextPlate>
            <TextPlate className="block px-2 py-0.5 -mx-2 text-muted-foreground">Vasishth</TextPlate>
          </h1>
          <p className="mt-7 max-w-xl text-pretty text-xl leading-snug text-foreground/80 sm:text-2xl">
            <TextPlate>{profile.tagline}</TextPlate>
          </p>

          <div className="mt-10 flex flex-wrap items-center gap-x-4 gap-y-3">
            <a
              href="#projects"
              className="inline-flex items-center gap-1 rounded-full bg-primary px-6 py-3 text-[15px] font-medium text-primary-foreground shadow-soft transition-[transform,opacity] duration-300 ease-apple hover:opacity-90 active:scale-[0.98]"
            >
              View work
            </a>
            <a
              href={profile.resume}
              className="group inline-flex items-center gap-1.5 rounded-full px-3 py-3 text-[15px] font-medium text-primary transition-colors"
            >
              <FileText className="h-4 w-4" />
              <TextPlate className="px-1 py-0.5 -mx-1 -my-0.5">Resume</TextPlate>
              <ChevronRight className="h-4 w-4 transition-transform duration-300 ease-apple group-hover:translate-x-0.5" />
            </a>
            <div className="flex items-center gap-1">
              <a
                href={profile.github}
                target="_blank"
                rel="noreferrer noopener"
                aria-label="GitHub profile"
                className="inline-flex h-11 w-11 items-center justify-center rounded-full text-foreground/60 transition-colors duration-200 ease-apple hover:bg-foreground/[0.06] hover:text-foreground"
              >
                <IconGithub className="h-5 w-5" />
              </a>
              <a
                href={profile.linkedin}
                target="_blank"
                rel="noreferrer noopener"
                aria-label="LinkedIn profile"
                className="inline-flex h-11 w-11 items-center justify-center rounded-full text-foreground/60 transition-colors duration-200 ease-apple hover:bg-foreground/[0.06] hover:text-foreground"
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

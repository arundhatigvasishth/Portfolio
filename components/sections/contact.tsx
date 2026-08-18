import { Mail } from "lucide-react"
import { contact, profile } from "@/lib/content"
import { IconGithub, IconLinkedin } from "@/components/icons"
import { BeatStrip } from "@/components/beat-strip"
import { Reveal } from "@/components/reveal"
import { TextPlate } from "@/components/text-plate"
import { CopyEmailButton } from "@/components/copy-email-button"

export function Contact() {
  const year = new Date().getFullYear()

  return (
    <section id="contact" className="relative border-t border-border">
      <div className="mx-auto max-w-6xl px-5 py-24 sm:px-8 sm:py-32">
        <Reveal className="flex flex-col items-center text-center">
          <BeatStrip className="mb-8" />
          <h2 className="text-balance font-serif text-4xl font-semibold tracking-tight text-foreground sm:text-6xl">
            <TextPlate className="px-1.5 py-0.5 -mx-1.5 -my-0.5">{contact.heading}</TextPlate>
          </h2>
          <p className="mt-4 max-w-md text-pretty text-lg text-muted-foreground">
            <TextPlate>{contact.subtext}</TextPlate>
          </p>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
            <a
              href={`mailto:${profile.email}`}
              className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-medium text-primary-foreground transition-transform hover:-translate-y-0.5"
            >
              <Mail className="h-4 w-4" />
              Email me
            </a>
            <a
              href={profile.linkedin}
              target="_blank"
              rel="noreferrer noopener"
              className="inline-flex items-center gap-2 rounded-full border border-border bg-background px-6 py-3 text-sm font-medium text-foreground transition-colors hover:border-accent hover:text-accent"
            >
              <IconLinkedin className="h-4 w-4" />
              LinkedIn
            </a>
            <a
              href={profile.github}
              target="_blank"
              rel="noreferrer noopener"
              className="inline-flex items-center gap-2 rounded-full border border-border bg-background px-6 py-3 text-sm font-medium text-foreground transition-colors hover:border-accent hover:text-accent"
            >
              <IconGithub className="h-4 w-4" />
              GitHub
            </a>
          </div>

          <CopyEmailButton email={profile.email} className="mt-6" />
        </Reveal>
      </div>

      <footer className="border-t border-border">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 px-5 py-8 text-sm text-muted-foreground sm:flex-row sm:px-8">
          <p>
            <TextPlate className="px-1 py-0.5 -mx-1 -my-0.5">
              © {year} {profile.name}
            </TextPlate>
          </p>
          <p className="font-mono text-xs tracking-[0.2em]">
            <TextPlate className="px-1 py-0.5 -mx-1 -my-0.5">BUILT ON RHYTHM · AMHERST, MA</TextPlate>
          </p>
        </div>
      </footer>
    </section>
  )
}

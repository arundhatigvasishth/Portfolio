import { ArrowUpRight } from "lucide-react"
import { projects } from "@/lib/content"
import { badgeIcons, type BadgeIconKey } from "@/components/icons"
import { SectionHeading } from "@/components/section-heading"
import { Reveal } from "@/components/reveal"
import { TiltCard } from "@/components/tilt-card"

export function Projects() {
  return (
    <section id="projects" className="relative mx-auto max-w-6xl px-5 py-24 sm:px-8 sm:py-32">
      <SectionHeading
        index="03"
        title="Projects"
        kicker="Applied AI, from gesture recognition to prediction markets."
      />

      <div className="grid gap-6 md:grid-cols-2">
        {projects.map((project, i) => {
          const Icon = badgeIcons[project.id as BadgeIconKey]
          return (
            <Reveal key={project.id} delay={(i % 2) * 90}>
              <TiltCard className="h-full">
                <article className="flex h-full flex-col rounded-2xl border border-border bg-card p-6 transition-colors hover:border-accent/60 sm:p-7">
                  <span className="flex h-12 w-12 items-center justify-center rounded-xl border border-border bg-background text-primary">
                    {Icon ? <Icon className="h-6 w-6" /> : null}
                  </span>

                  <h3 className="mt-5 font-serif text-2xl font-semibold text-foreground">{project.name}</h3>
                  <p className="mt-1.5 text-pretty text-sm font-medium text-foreground/80">{project.tagline}</p>
                  <p className="mt-1 font-mono text-xs tracking-wide text-muted-foreground">{project.meta}</p>

                  {project.teamNote ? (
                    <p className="mt-3 text-xs italic text-muted-foreground">{project.teamNote}</p>
                  ) : null}

                  {project.callout ? (
                    <p className="mt-4 rounded-lg border-l-2 border-accent bg-accent/10 px-4 py-3 text-sm leading-relaxed text-foreground/85">
                      {project.callout}
                    </p>
                  ) : null}

                  <ul className="mt-5 flex flex-col gap-2.5">
                    {project.points.map((point, p) => (
                      <li key={p} className="flex gap-3 text-sm leading-relaxed text-foreground/80">
                        <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                        <span className="text-pretty">{point}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="mt-auto pt-6">
                    <div className="flex flex-wrap gap-2">
                      {project.tech.map((t) => (
                        <span
                          key={t}
                          className="rounded-full bg-secondary px-3 py-1 text-xs text-secondary-foreground"
                        >
                          {t}
                        </span>
                      ))}
                    </div>

                    {project.link ? (
                      <a
                        href={project.link.href}
                        target="_blank"
                        rel="noreferrer noopener"
                        className="mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-primary transition-colors hover:text-accent"
                      >
                        {project.link.label}
                        <ArrowUpRight className="h-4 w-4" />
                      </a>
                    ) : null}
                  </div>
                </article>
              </TiltCard>
            </Reveal>
          )
        })}
      </div>
    </section>
  )
}

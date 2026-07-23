import { ArrowUpRight } from "lucide-react"
import { experience } from "@/lib/content"
import { badgeIcons, type BadgeIconKey } from "@/components/icons"
import { SectionHeading } from "@/components/section-heading"
import { Reveal } from "@/components/reveal"

export function Experience() {
  return (
    <section id="experience" className="relative border-t border-border bg-card/30">
      <div className="mx-auto max-w-6xl px-5 py-24 sm:px-8 sm:py-32">
        <SectionHeading index="02" title="Experience" kicker="Where the AI systems meet real stakes." />

        <div className="flex flex-col gap-6">
          {experience.map((job, i) => {
            const Icon = badgeIcons[job.id as BadgeIconKey]
            return (
              <Reveal key={job.id} delay={i * 100}>
                <article className="group rounded-2xl border border-border bg-background p-6 transition-colors hover:border-accent/60 sm:p-8">
                  <div className="flex flex-col gap-6 sm:flex-row sm:gap-8">
                    <div className="flex shrink-0 items-start">
                      <span className="flex h-14 w-14 items-center justify-center rounded-xl border border-border bg-card text-primary transition-colors group-hover:border-accent group-hover:text-accent">
                        {Icon ? <Icon className="h-7 w-7" /> : null}
                      </span>
                    </div>

                    <div className="flex-1">
                      <div className="flex flex-col gap-1 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
                        <div>
                          <h3 className="font-serif text-xl font-semibold text-foreground sm:text-2xl">
                            {job.role}
                          </h3>
                          <p className="mt-1 text-pretty text-sm text-foreground/80">
                            {job.org}
                          </p>
                          <p className="text-sm text-muted-foreground">{job.place}</p>
                        </div>
                        <span className="shrink-0 rounded-full border border-border px-3 py-1 font-mono text-xs tracking-wide text-muted-foreground">
                          {job.period}
                        </span>
                      </div>

                      {job.pointGroups ? (
                        <div className="mt-5 flex flex-col gap-4">
                          {job.pointGroups.map((group, g) => (
                            <div key={g} className="flex flex-col gap-3">
                              <span className="inline-flex w-fit shrink-0 rounded-full border border-border px-2.5 py-0.5 font-mono text-[11px] tracking-wide text-muted-foreground">
                                {group.period}
                              </span>
                              <ul className="flex flex-col gap-3">
                                {group.points.map((point, p) => (
                                  <li key={p} className="flex gap-3 text-sm leading-relaxed text-foreground/80">
                                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                                    <span className="text-pretty">{point}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <ul className="mt-5 flex flex-col gap-3">
                          {job.points.map((point, p) => (
                            <li key={p} className="flex gap-3 text-sm leading-relaxed text-foreground/80">
                              <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                              <span className="text-pretty">{point}</span>
                            </li>
                          ))}
                        </ul>
                      )}

                      {job.link ? (
                        <a
                          href={job.link.href}
                          target="_blank"
                          rel="noreferrer noopener"
                          className="mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-primary transition-colors hover:text-accent"
                        >
                          {job.link.label}
                          <ArrowUpRight className="h-4 w-4" />
                        </a>
                      ) : null}
                    </div>
                  </div>
                </article>
              </Reveal>
            )
          })}
        </div>
      </div>
    </section>
  )
}

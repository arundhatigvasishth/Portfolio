import Image from "next/image"
import { ArrowUpRight } from "lucide-react"
import { experience } from "@/lib/content"
import { badgeIcons, type BadgeIconKey } from "@/components/icons"
import { SectionHeading } from "@/components/section-heading"
import { Reveal } from "@/components/reveal"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

export function Experience() {
  return (
    <section id="experience" className="relative border-t border-border bg-card/30">
      <div className="mx-auto max-w-6xl px-5 py-24 sm:px-8 sm:py-32">
        <SectionHeading index="02" title="Experience" kicker="Where the AI systems meet real stakes." />

        <Accordion defaultValue={experience[0] ? [experience[0].id] : []} className="flex flex-col gap-5">
          {experience.map((job, i) => {
            const Icon = badgeIcons[job.id as BadgeIconKey]
            return (
              <Reveal key={job.id} delay={i * 100}>
                <AccordionItem
                  value={job.id}
                  className="group overflow-hidden rounded-2xl border border-border bg-background transition-colors hover:border-accent/60"
                >
                  <AccordionTrigger className="items-center gap-4 rounded-none px-6 py-5 hover:no-underline sm:px-8">
                    <div className="flex flex-1 items-center gap-4 text-left">
                      <span className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-border bg-card p-1.5 text-primary transition-colors group-hover:border-accent">
                        {job.logo ? (
                          <Image
                            src={job.logo.src}
                            alt={job.logo.alt}
                            width={48}
                            height={48}
                            className="h-full w-full object-contain"
                          />
                        ) : Icon ? (
                          <Icon className="h-7 w-7" />
                        ) : null}
                      </span>

                      <div>
                        <h3 className="font-serif text-lg font-semibold text-foreground sm:text-xl">{job.role}</h3>
                        <p className="mt-0.5 text-pretty text-sm text-foreground/80">{job.org}</p>
                        <p className="text-sm text-muted-foreground">{job.place}</p>
                      </div>
                    </div>

                    <span className="shrink-0 rounded-full border border-border px-3 py-1 font-mono text-xs tracking-wide text-muted-foreground">
                      {job.period}
                    </span>
                  </AccordionTrigger>

                  <AccordionContent className="px-6 sm:px-8">
                    <div className="flex flex-col gap-6 border-t border-border pt-6 sm:flex-row sm:gap-8">
                      <div className="flex-1">
                        {job.pointGroups ? (
                          <div className="flex flex-col gap-4">
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
                          <ul className="flex flex-col gap-3">
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

                      {job.feature ? (
                        <div className="shrink-0 sm:w-56 md:w-64">
                          <a
                            href={job.feature.href}
                            target="_blank"
                            rel="noreferrer noopener"
                            className="group/feature block"
                          >
                            <div
                              className={`relative w-full overflow-hidden rounded-xl border border-border ${
                                job.feature.aspect === "3/4" ? "aspect-[3/4]" : "aspect-[3/2]"
                              }`}
                            >
                              <Image
                                src={job.feature.image}
                                alt={job.feature.alt}
                                fill
                                sizes="(min-width: 768px) 16rem, (min-width: 640px) 14rem, 100vw"
                                className="object-cover transition-transform duration-300 group-hover/feature:scale-105"
                              />
                            </div>
                            <p className="mt-2 flex items-center gap-1.5 text-xs text-muted-foreground transition-colors group-hover/feature:text-accent">
                              {job.feature.caption}
                              <ArrowUpRight className="h-3.5 w-3.5" />
                            </p>
                          </a>
                        </div>
                      ) : null}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Reveal>
            )
          })}
        </Accordion>
      </div>
    </section>
  )
}

import Image from "next/image"
import { ArrowUpRight } from "lucide-react"
import { experience } from "@/lib/content"
import { badgeIcons, type BadgeIconKey } from "@/components/icons"
import { SectionHeading } from "@/components/section-heading"
import { Reveal } from "@/components/reveal"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

export function Experience() {
  return (
    <section id="experience" className="relative">
      <div className="mx-auto max-w-6xl px-4 py-20 sm:px-8 sm:py-28">
        <SectionHeading index="03" title="Experience" kicker="Where the work meets real stakes." />

        <Accordion multiple className="flex flex-col gap-3">
          {experience.map((job, i) => {
            const Icon = badgeIcons[job.id as BadgeIconKey]
            return (
              <Reveal key={job.id} delay={i * 100}>
                <AccordionItem
                  value={job.id}
                  className="group overflow-hidden rounded-3xl border border-border bg-card shadow-soft transition-shadow duration-300 ease-apple hover:shadow-lift"
                >
                  <AccordionTrigger className="items-center gap-4 rounded-none px-5 py-5 hover:no-underline sm:px-8 sm:py-6">
                    <div className="flex flex-1 items-center gap-4 text-left">
                      <span className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-border bg-white p-1.5 text-primary">
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
                        <h3 className="text-lg font-semibold text-foreground sm:text-xl">{job.role}</h3>
                        <p className="mt-0.5 text-pretty text-sm text-foreground/75">{job.org}</p>
                        <p className="text-sm text-muted-foreground">
                          {job.place}
                          <span className="sm:hidden"> · {job.period}</span>
                        </p>
                      </div>
                    </div>

                    <span className="hidden shrink-0 rounded-full bg-secondary px-3 py-1 text-xs sm:inline-flex font-medium tabular-nums text-muted-foreground">
                      {job.period}
                    </span>
                  </AccordionTrigger>

                  <AccordionContent className="px-5 sm:px-8">
                    <div className="flex flex-col gap-6 border-t border-border pt-6 sm:flex-row sm:gap-8">
                      <div className="flex-1">
                        {job.pointGroups ? (
                          <div className="flex flex-col gap-4">
                            {job.pointGroups.map((group, g) => (
                              <div key={g} className="flex flex-col gap-3">
                                <span className="inline-flex w-fit shrink-0 rounded-full bg-secondary px-2.5 py-0.5 text-[11px] font-medium tabular-nums text-muted-foreground">
                                  {group.period}
                                </span>
                                <ul className="flex flex-col gap-3">
                                  {group.points.map((point, p) => (
                                    <li key={p} className="flex gap-3 text-sm leading-relaxed text-foreground/80">
                                      <span className="mt-[0.6rem] h-1 w-1 shrink-0 rounded-full bg-muted-foreground/60" />
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
                                <span className="mt-[0.6rem] h-1 w-1 shrink-0 rounded-full bg-muted-foreground/60" />
                                <span className="text-pretty">{point}</span>
                              </li>
                            ))}
                          </ul>
                        )}

                        {job.link ? (
                          <a
                            href={job.link.href}
                            {...(job.link.href.startsWith("http") ? { target: "_blank", rel: "noreferrer noopener" } : {})}
                            className="mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-primary transition-opacity duration-200 hover:opacity-80"
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
                              className={`relative w-full overflow-hidden rounded-2xl border border-border shadow-soft ${
                                job.feature.aspect === "3/4" ? "aspect-[3/4]" : "aspect-[3/2]"
                              }`}
                            >
                              <Image
                                src={job.feature.image}
                                alt={job.feature.alt}
                                fill
                                sizes="(min-width: 768px) 16rem, (min-width: 640px) 14rem, 100vw"
                                className="object-cover transition-transform duration-700 ease-apple group-hover/feature:scale-[1.03]"
                              />
                            </div>
                            <p className="mt-2 flex items-center gap-1.5 text-xs text-muted-foreground transition-colors group-hover/feature:text-primary">
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

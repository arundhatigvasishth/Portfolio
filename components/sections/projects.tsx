import { Fragment } from "react"
import Link from "next/link"
import { ArrowUpRight, ChevronRight } from "lucide-react"
import { projects, proof, thread, type Project, type ThreadStop } from "@/lib/content"
import { badgeIcons, type BadgeIconKey } from "@/components/icons"
import { SectionHeading } from "@/components/section-heading"
import { Reveal } from "@/components/reveal"
import { ProjectVisual } from "@/components/work/project-visual"
import { TrajectoryRail } from "@/components/work/trajectory-rail"
import { TextPlate } from "@/components/text-plate"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

// Work, newest first: the strongest projects lead, and each one points back
// to the one below it. Only stops with a project card are on the rail;
// research has its own section. Each stop starts as a one-line row with a
// live peek of its preview, and opens into the full card.
export function Projects() {
  const stops = [...thread.stops].reverse().flatMap((stop) => {
    const project = projects.find((p) => `/work/${p.slug}` === stop.href)
    return project ? [{ stop, project }] : []
  })
  const firstEarlier = stops.findIndex(({ project }) => !project.featured)
  return (
    <section id="projects" className="relative mx-auto max-w-6xl px-4 py-20 sm:px-8 sm:py-28">
      <SectionHeading index="01" title={thread.title} kicker={thread.kicker} />

      <Reveal>
        <p className="max-w-3xl text-pretty text-lg leading-relaxed text-foreground/85">
          <TextPlate>{thread.intro}</TextPlate>
        </p>
      </Reveal>

      {/* Numbers that can be checked against a public source. */}
      <Reveal className="mb-12 mt-10">
        <h3 className="sr-only">Proof of work</h3>
        <ul className="grid grid-cols-2 gap-px overflow-hidden rounded-3xl border border-border bg-border lg:grid-cols-4">
          {proof.map((item) => {
            const external = item.href.startsWith("http")
            return (
              <li key={item.label} className="bg-card">
                <a
                  href={item.href}
                  {...(external ? { target: "_blank", rel: "noreferrer noopener" } : {})}
                  className="group flex h-full flex-col gap-1 p-5 transition-colors hover:bg-secondary/60 sm:p-6"
                >
                  <span className="text-2xl font-semibold tabular-nums tracking-tight text-foreground sm:text-3xl">{item.value}</span>
                  <span className="text-pretty text-sm leading-snug text-muted-foreground group-hover:text-foreground/80">
                    {item.label}
                  </span>
                </a>
              </li>
            )
          })}
        </ul>
      </Reveal>

      <Accordion multiple defaultValue={["tokenwise"]}>
        <TrajectoryRail>
          {stops.map(({ stop, project }, i) => (
            <Fragment key={stop.title}>
              {i === firstEarlier ? (
                <li className="pb-3 pl-10 pt-5 text-xs font-medium uppercase tracking-[0.14em] text-muted-foreground sm:pl-14">
                  <TextPlate>Where it started</TextPlate>
                </li>
              ) : null}
              <li data-stop className="group/stop relative pb-3 pl-10 last:pb-0 sm:pl-14">
                <span
                  data-dot
                  aria-hidden="true"
                  className="absolute left-0 top-9 flex h-6 w-6 scale-90 items-center justify-center rounded-full border-2 border-border bg-background transition-all duration-500 ease-apple group-data-[lit=true]/stop:scale-100 group-data-[lit=true]/stop:border-primary"
                >
                  <span className="h-2 w-2 rounded-full bg-border transition-colors duration-500 group-data-[lit=true]/stop:bg-primary" />
                </span>
                <Reveal delay={Math.min(i, 3) * 60}>
                  <ProjectRow project={project} stop={stop} />
                </Reveal>
              </li>
            </Fragment>
          ))}
        </TrajectoryRail>
      </Accordion>
    </section>
  )
}

function ProjectRow({ project, stop }: { project: Project; stop: ThreadStop }) {
  const Icon = badgeIcons[project.slug as BadgeIconKey]
  const extras = project.links.filter((l) => l.kind === "repo" || l.kind === "demo" || l.kind === "video").slice(0, 2)
  return (
    <AccordionItem
      value={project.slug}
      className="group/item relative overflow-hidden rounded-3xl border border-border bg-card shadow-soft transition-shadow duration-500 ease-apple hover:shadow-lift data-[open]:shadow-lift"
    >
      <AccordionTrigger className="items-center gap-4 rounded-none px-4 py-4 hover:no-underline sm:px-6 sm:py-5 md:pr-[17rem] md:[&>svg]:absolute md:[&>svg]:right-6 md:[&>svg]:top-1/2 md:[&>svg]:-translate-y-1/2">
        <div className="flex min-w-0 flex-1 items-center gap-4 text-left">
          <span className="hidden h-11 w-11 shrink-0 items-center justify-center rounded-xl sm:flex bg-secondary text-primary transition-colors duration-300 group-hover/item:bg-primary group-hover/item:text-primary-foreground">
            {Icon ? <Icon className="h-5 w-5" /> : null}
          </span>
          <div className="min-w-0">
            <p className="text-xs font-normal tabular-nums text-muted-foreground">
              {stop.period} · {project.context}
            </p>
            <h3 className="mt-0.5 text-xl font-semibold text-foreground sm:text-2xl">{project.name}</h3>
            <p className="mt-0.5 text-pretty text-[15px] font-normal leading-snug text-foreground/75">{project.tagline}</p>
          </div>
        </div>
      </AccordionTrigger>

      {/* A live, scaled-down peek of the preview. Clicks fall through to the
          row underneath; it fades out once the full preview is open. */}
      <div
        aria-hidden="true"
        inert
        className="peek-mask pointer-events-none absolute right-14 top-4 hidden h-[80px] w-[200px] overflow-hidden rounded-xl border border-border bg-background/60 transition-opacity duration-300 ease-apple group-data-[open]/item:opacity-0 md:block"
      >
        <div className="w-[480px] origin-top-left scale-[0.4167] p-4">
          <ProjectVisual visual={project.architecture.visual} compact />
        </div>
      </div>

      <AccordionContent className="px-4 pb-0 sm:px-6 [&_a]:no-underline">
        <div className="grid grid-cols-[minmax(0,1fr)] gap-6 border-t border-border py-6 lg:grid-cols-2 lg:gap-8">
          <div className="flex min-w-0 flex-col">
            <p className="border-l-2 border-primary/50 pl-4 text-pretty text-[15px] leading-relaxed text-foreground/75">
              <span className="font-medium text-foreground">Why I built it: </span>
              {stop.why}
            </p>
            <p className="mt-4 text-pretty text-[15px] leading-relaxed text-muted-foreground">{project.summary}</p>

            <div className="mt-auto flex flex-wrap items-center gap-x-5 gap-y-3 pt-6">
              <Link
                href={`/work/${project.slug}`}
                className="inline-flex items-center gap-1 rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition-opacity duration-300 ease-apple hover:opacity-90"
              >
                Case study
                <span className="sr-only"> for {project.name}</span>
                <ChevronRight className="h-4 w-4" />
              </Link>
              {extras.map((l) => (
                <a
                  key={l.href}
                  href={l.href}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
                >
                  {l.kind === "repo" ? "Code" : l.label}
                  <span className="sr-only"> for {project.name}</span>
                  <ArrowUpRight className="h-4 w-4" />
                </a>
              ))}
              {project.status ? <span className="text-xs text-muted-foreground">{project.status}</span> : null}
            </div>
          </div>

          <div className="flex min-w-0 items-center rounded-2xl border border-border bg-background/60 p-4 sm:p-6">
            <div className="w-full">
              <ProjectVisual visual={project.architecture.visual} compact />
            </div>
          </div>
        </div>
      </AccordionContent>
    </AccordionItem>
  )
}

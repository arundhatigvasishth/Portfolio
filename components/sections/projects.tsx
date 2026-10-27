import Link from "next/link"
import { ArrowRight, ArrowUpRight, ChevronRight } from "lucide-react"
import { projects, proof, thread, type Project, type ThreadStop } from "@/lib/content"
import { badgeIcons, type BadgeIconKey } from "@/components/icons"
import { SectionHeading } from "@/components/section-heading"
import { Reveal } from "@/components/reveal"
import { ProjectVisual } from "@/components/work/project-visual"
import { TrajectoryRail } from "@/components/work/trajectory-rail"
import { TextPlate } from "@/components/text-plate"
import { cn } from "@/lib/utils"

const kindStyle = {
  Project: "bg-primary/10 text-primary",
  Research: "bg-[oklch(0.55_0.17_300/0.12)] text-[oklch(0.5_0.17_300)] dark:text-[oklch(0.78_0.13_300)]",
  Role: "bg-[oklch(0.68_0.15_150/0.14)] text-[oklch(0.45_0.13_150)] dark:text-[oklch(0.8_0.14_150)]",
}

// Work, newest first: the strongest projects lead, and each one points back
// to the one below it. Featured projects get full cards; the earlier path is
// smaller cards and one-line notes, so the section stays short.
export function Projects() {
  const stops = [...thread.stops].reverse()
  const lastFeatured = stops.findLastIndex((s) => projects.some((p) => p.featured && `/work/${p.slug}` === s.href))
  let cardCount = 0
  return (
    <section id="projects" className="relative mx-auto max-w-6xl px-4 py-28 sm:px-8 sm:py-40">
      <SectionHeading index="01" title={thread.title} kicker={thread.kicker} />

      <Reveal>
        <p className="mb-16 max-w-3xl text-pretty text-xl leading-relaxed text-foreground/85 sm:text-[1.375rem]">
          <TextPlate>{thread.intro}</TextPlate>
        </p>
      </Reveal>

      <TrajectoryRail>
        {stops.map((stop, i) => {
          const project = projects.find((p) => `/work/${p.slug}` === stop.href)
          const small = !project?.featured
          return (
            <li
              key={stop.title}
              data-stop
              className={cn("group/stop relative pl-10 sm:pl-14", project && !small ? "pb-14 sm:pb-16" : "pb-9 sm:pb-11", "last:pb-0")}
            >
              {i === lastFeatured + 1 ? (
                <p className="mb-6 -ml-10 bg-background py-1 text-xs font-medium uppercase tracking-[0.14em] text-muted-foreground sm:-ml-14">
                  <TextPlate>Where it started</TextPlate>
                </p>
              ) : null}
              <span
                data-dot
                aria-hidden="true"
                className="absolute left-0 top-1 flex h-6 w-6 scale-90 items-center justify-center rounded-full border-2 border-border bg-background transition-all duration-500 ease-apple group-data-[lit=true]/stop:scale-100 group-data-[lit=true]/stop:border-primary"
              >
                <span className="h-2 w-2 rounded-full bg-border transition-colors duration-500 group-data-[lit=true]/stop:bg-primary" />
              </span>
              <StopMeta stop={stop} />
              {project ? <ProjectCard project={project} stop={stop} small={small} flip={cardCount++ % 2 === 1} /> : <Note stop={stop} />}
            </li>
          )
        })}
      </TrajectoryRail>

      {/* Numbers that can be checked against a public source. */}
      <Reveal className="mt-20 sm:mt-24">
        <h3 className="sr-only">Proof of work</h3>
        <ul className="grid grid-cols-2 gap-px overflow-hidden rounded-3xl border border-border bg-border lg:grid-cols-4">
          {proof.map((item) => {
            const external = item.href.startsWith("http")
            return (
              <li key={item.label} className="bg-card">
                <a
                  href={item.href}
                  {...(external ? { target: "_blank", rel: "noreferrer noopener" } : {})}
                  className="group flex h-full flex-col gap-1 p-6 transition-colors hover:bg-secondary/60 sm:p-8"
                >
                  <span className="text-3xl font-semibold tabular-nums tracking-tight text-foreground sm:text-4xl">
                    {item.value}
                  </span>
                  <span className="text-pretty text-sm leading-snug text-muted-foreground group-hover:text-foreground/80">
                    {item.label}
                  </span>
                </a>
              </li>
            )
          })}
        </ul>
      </Reveal>
    </section>
  )
}

function StopMeta({ stop }: { stop: ThreadStop }) {
  return (
    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 pt-1">
      <span className="text-xs font-medium tabular-nums text-muted-foreground">
        <TextPlate>{stop.period}</TextPlate>
      </span>
      <span className={cn("rounded-full px-2.5 py-0.5 text-[11px] font-medium", kindStyle[stop.kind])}>{stop.kind}</span>
    </div>
  )
}

// A research or role stop: the turn between two projects, kept short.
function Note({ stop }: { stop: ThreadStop }) {
  return (
    <div className="mt-1.5 max-w-2xl opacity-50 transition-opacity duration-700 ease-apple group-data-[lit=true]/stop:opacity-100">
      <h3 className="text-lg font-semibold text-foreground">
        <Link href={stop.href} className="group inline-flex items-center gap-2 hover:text-primary">
          <TextPlate>{stop.title}</TextPlate>
          <ArrowRight className="h-4 w-4 -translate-x-1 opacity-0 transition-all duration-300 ease-apple group-hover:translate-x-0 group-hover:opacity-100" />
        </Link>
      </h3>
      <p className="mt-1 text-pretty text-[15px] leading-relaxed text-muted-foreground">
        <TextPlate>{stop.why}</TextPlate>
      </p>
    </div>
  )
}

function ProjectCard({ project, stop, flip, small }: { project: Project; stop: ThreadStop; flip: boolean; small: boolean }) {
  const Icon = badgeIcons[project.slug as BadgeIconKey]
  const extras = project.links.filter((l) => l.kind === "repo" || l.kind === "demo" || l.kind === "video").slice(0, 2)
  return (
    <Reveal className={small ? "mt-3 max-w-4xl" : "mt-4"}>
      {/* Not a whole-card link: the preview inside is interactive. */}
      <article className="grid grid-cols-[minmax(0,1fr)] overflow-hidden rounded-3xl border border-border bg-card shadow-soft transition-shadow duration-500 ease-apple hover:shadow-lift lg:grid-cols-2">
        <div className={cn("flex min-w-0 flex-col", small ? "p-6 sm:p-7" : "p-6 sm:p-9", flip && "lg:order-2")}>
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-secondary text-primary">
              {Icon ? <Icon className="h-5 w-5" /> : null}
            </span>
            <p className="text-xs font-medium text-muted-foreground">{project.context}</p>
          </div>

          <h3 className={cn("mt-5 font-semibold text-foreground", small ? "text-2xl" : "text-3xl sm:text-4xl")}>{project.name}</h3>
          <p className={cn("mt-2 text-pretty leading-snug text-foreground/85", small ? "text-base" : "text-lg")}>{project.tagline}</p>

          <p className="mt-5 border-l-2 border-primary/50 pl-4 text-pretty text-[15px] leading-relaxed text-foreground/75">
            <span className="font-medium text-foreground">Why I built it: </span>
            {stop.why}
          </p>

          <div className={cn("mt-auto flex flex-wrap items-center gap-x-5 gap-y-3", small ? "pt-5" : "pt-7")}>
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

        <div
          className={cn(
            "flex min-w-0 items-center border-t border-border bg-background/60 lg:border-t-0",
            small ? "p-5 sm:p-7" : "p-5 sm:p-9",
            flip ? "lg:order-1 lg:border-r" : "lg:border-l",
          )}
        >
          <div className="w-full">
            <ProjectVisual visual={project.architecture.visual} compact />
          </div>
        </div>
      </article>
    </Reveal>
  )
}

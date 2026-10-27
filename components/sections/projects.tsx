import Link from "next/link"
import { ArrowUpRight, ChevronRight } from "lucide-react"
import { additionalProjects, featuredProjects, proof } from "@/lib/content"
import { badgeIcons, type BadgeIconKey } from "@/components/icons"
import { SectionHeading } from "@/components/section-heading"
import { Reveal } from "@/components/reveal"
import { ProjectVisual } from "@/components/work/project-visual"
import { TextPlate } from "@/components/text-plate"
import { cn } from "@/lib/utils"

export function Projects() {
  return (
    <section id="projects" className="relative mx-auto max-w-6xl px-4 py-28 sm:px-8 sm:py-40">
      <SectionHeading
        index="03"
        title="Work"
        kicker="Systems where the model is the easy part. Each one has a full case study."
      />

      <div className="flex flex-col gap-6 sm:gap-8">
        {featuredProjects.map((project, i) => {
          const Icon = badgeIcons[project.slug as BadgeIconKey]
          const repo = project.links.find((l) => l.kind === "repo")
          return (
            <Reveal key={project.slug}>
              <article className="grid overflow-hidden rounded-3xl border border-border bg-card shadow-soft transition-shadow duration-500 ease-apple hover:shadow-lift grid-cols-[minmax(0,1fr)] lg:grid-cols-2">
                <div className={cn("flex min-w-0 flex-col p-7 sm:p-10", i % 2 === 1 && "lg:order-2")}>
                  <div className="flex items-center gap-3">
                    <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-secondary text-primary">
                      {Icon ? <Icon className="h-5 w-5" /> : null}
                    </span>
                    <p className="text-xs font-medium text-muted-foreground">{project.context}</p>
                  </div>

                  <h3 className="mt-6 text-3xl font-semibold text-foreground sm:text-4xl">{project.name}</h3>
                  <p className="mt-3 text-pretty text-lg leading-snug text-foreground/85">{project.tagline}</p>
                  <p className="mt-4 text-pretty text-[15px] leading-relaxed text-muted-foreground">{project.summary}</p>

                  <div className="mt-6 flex flex-wrap gap-2">
                    {project.stack.slice(0, 5).map((t) => (
                      <span key={t} className="rounded-full bg-secondary px-3 py-1 text-xs text-secondary-foreground">
                        {t}
                      </span>
                    ))}
                  </div>

                  <div className="mt-auto flex flex-wrap items-center gap-x-5 gap-y-3 pt-8">
                    <Link
                      href={`/work/${project.slug}`}
                      className="inline-flex items-center gap-1 rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition-opacity duration-300 ease-apple hover:opacity-90"
                    >
                      Read the case study
                      <span className="sr-only"> for {project.name}</span>
                      <ChevronRight className="h-4 w-4" />
                    </Link>
                    {repo ? (
                      <a
                        href={repo.href}
                        target="_blank"
                        rel="noreferrer noopener"
                        className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
                      >
                        Code
                        <span className="sr-only"> for {project.name} (opens GitHub)</span>
                        <ArrowUpRight className="h-4 w-4" />
                      </a>
                    ) : null}
                    {project.status ? <span className="text-xs text-muted-foreground">{project.status}</span> : null}
                  </div>
                </div>

                <div
                  className={cn(
                    "flex min-w-0 items-center border-t border-border bg-background/60 p-5 sm:p-10 lg:border-t-0",
                    i % 2 === 1 ? "lg:order-1 lg:border-r" : "lg:border-l",
                  )}
                >
                  <div className="w-full">
                    <ProjectVisual visual={project.architecture.visual} compact />
                  </div>
                </div>
              </article>
            </Reveal>
          )
        })}
      </div>

      {/* Numbers that can be checked against a public source. */}
      <Reveal className="mt-16 sm:mt-20">
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

      <div className="mt-20 sm:mt-24">
        <Reveal>
          <h3 className="text-2xl font-semibold text-foreground sm:text-3xl">More projects</h3>
          <p className="mt-2 text-pretty text-muted-foreground">
            <TextPlate>Hackathon builds. Go ahead and poke them.</TextPlate>
          </p>
        </Reveal>
        <div className="mt-8 grid gap-5 md:grid-cols-2">
          {additionalProjects.map((project, i) => {
            const Icon = badgeIcons[project.slug as BadgeIconKey]
            return (
              <Reveal key={project.slug} delay={i * 90}>
                {/* Not a whole-card link: the preview inside is interactive. */}
                <article className="flex h-full flex-col rounded-3xl border border-border bg-card p-6 shadow-soft transition-shadow duration-500 ease-apple hover:shadow-lift sm:p-8">
                  <ProjectVisual visual={project.architecture.visual} compact />
                  <div className="mt-7 flex items-center gap-3">
                    <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-secondary text-primary">
                      {Icon ? <Icon className="h-5 w-5" /> : null}
                    </span>
                    <p className="text-xs font-medium text-muted-foreground">{project.context}</p>
                  </div>
                  <h4 className="mt-5 text-2xl font-semibold text-foreground">
                    <Link href={`/work/${project.slug}`} className="hover:text-primary">
                      {project.name}
                    </Link>
                  </h4>
                  <p className="mt-2 text-pretty text-[15px] leading-snug text-foreground/80">{project.tagline}</p>
                  <div className="mt-auto flex flex-wrap items-center gap-x-5 gap-y-2 pt-6">
                    <Link
                      href={`/work/${project.slug}`}
                      className="group inline-flex items-center gap-1 text-sm font-medium text-primary"
                    >
                      Read the case study
                      <span className="sr-only"> for {project.name}</span>
                      <ChevronRight className="h-4 w-4 transition-transform duration-300 ease-apple group-hover:translate-x-0.5" />
                    </Link>
                    {project.links
                      .filter((l) => l.kind === "demo" || l.kind === "video")
                      .map((l) => (
                        <a
                          key={l.href}
                          href={l.href}
                          target="_blank"
                          rel="noreferrer noopener"
                          className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
                        >
                          {l.label}
                          <ArrowUpRight className="h-4 w-4" />
                        </a>
                      ))}
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

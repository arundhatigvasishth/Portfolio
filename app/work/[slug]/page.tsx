import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowLeft, ArrowUpRight, ChevronRight } from "lucide-react"
import { projects, site, thread, type WorkLink } from "@/lib/content"
import { SiteNav } from "@/components/site-nav"
import { Contact } from "@/components/sections/contact"
import { Reveal } from "@/components/reveal"
import { TextPlate } from "@/components/text-plate"
import { ProjectVisual } from "@/components/work/project-visual"
import { VideoEmbed } from "@/components/work/video-embed"

type Props = { params: Promise<{ slug: string }> }

export const dynamicParams = false

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const project = projects.find((p) => p.slug === slug)
  if (!project) return {}
  const title = `${project.name}: case study`
  return {
    title,
    description: project.summary,
    alternates: { canonical: `/work/${project.slug}` },
    openGraph: { title: `${project.name} · ${site.title}`, description: project.tagline, url: `/work/${project.slug}`, type: "article" },
    twitter: { card: "summary_large_image", title: `${project.name} · ${site.title}`, description: project.tagline },
  }
}

const linkVerb: Record<WorkLink["kind"], string> = {
  repo: "Code",
  demo: "Live demo",
  video: "Video",
  post: "Post",
  evidence: "Evidence",
  writeup: "Write-up",
}

export default async function CaseStudyPage({ params }: Props) {
  const { slug } = await params
  const index = projects.findIndex((p) => p.slug === slug)
  if (index === -1) notFound()
  const project = projects[index]
  const next = projects[(index + 1) % projects.length]
  const stopIndex = thread.stops.findIndex((t) => t.href === `/work/${project.slug}`)
  const stop = thread.stops[stopIndex]
  const before = stopIndex > 0 ? thread.stops[stopIndex - 1] : null
  const playable = project.slug === "fingersolve" || project.slug === "medecho"

  return (
    <>
      <SiteNav />
      <main>
        <header className="relative mx-auto max-w-5xl px-4 pt-32 pb-16 sm:px-8 sm:pt-40 sm:pb-20">
          <Link
            href="/#projects"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            <TextPlate>All work</TextPlate>
          </Link>

          <p className="mt-10 text-sm font-medium text-muted-foreground">
            <TextPlate>{project.context}</TextPlate>
          </p>
          <h1 className="mt-3 text-balance text-[clamp(2.75rem,8vw,5.5rem)] font-semibold leading-[1.02] text-foreground">
            <TextPlate className="px-2 -mx-2">{project.name}</TextPlate>
          </h1>
          <p className="mt-6 max-w-3xl text-pretty text-xl leading-snug text-foreground/85 sm:text-2xl">
            <TextPlate>{project.tagline}</TextPlate>
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-2">
            <span className="rounded-full border border-border bg-background px-3 py-1 text-xs text-foreground/80">{project.period}</span>
            {project.status ? (
              <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">{project.status}</span>
            ) : null}
          </div>

          {project.links.length ? (
            <div className="mt-8 flex flex-wrap gap-3">
              {project.links.map((link, i) => (
                <a
                  key={link.href}
                  href={link.href}
                  target="_blank"
                  rel="noreferrer noopener"
                  className={
                    i === 0
                      ? "inline-flex items-center gap-1 rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground shadow-soft transition-opacity duration-300 ease-apple hover:opacity-90"
                      : "inline-flex items-center gap-1 rounded-full border border-border bg-background px-5 py-2.5 text-sm font-medium text-foreground transition-colors hover:border-primary hover:text-primary"
                  }
                  title={link.note}
                >
                  {link.label === "Repository" ? linkVerb[link.kind] : link.label}
                  <ArrowUpRight className="h-4 w-4" />
                </a>
              ))}
            </div>
          ) : null}
          {project.links.some((l) => l.note) ? (
            <p className="mt-3 text-xs text-muted-foreground">
              <TextPlate>{project.links.find((l) => l.note)?.note}</TextPlate>
            </p>
          ) : null}
        </header>

        {/* Solid from here down, so long-form reading sits on a calm surface. */}
        <div className="relative bg-background">
          <div className="mx-auto flex max-w-5xl flex-col gap-20 px-4 pb-28 sm:gap-28 sm:px-8 sm:pb-40">
            {/* Results */}
            <Reveal>
              <h2 className="sr-only">Results</h2>
              <dl className={`grid gap-px overflow-hidden rounded-3xl border border-border bg-border ${project.results.length === 3 ? "grid-cols-1 sm:grid-cols-3" : "grid-cols-2 lg:grid-cols-4"}`}>
                {project.results.map((m) => (
                  <div key={m.label} className="flex flex-col gap-1 bg-card p-6 sm:p-8">
                    <dt className="order-2 text-pretty text-sm leading-snug text-muted-foreground">{m.label}</dt>
                    <dd className="order-1 text-3xl font-semibold tabular-nums tracking-tight text-foreground sm:text-4xl">
                      {m.value}
                    </dd>
                    {m.note ? <dd className="order-3 text-xs text-muted-foreground/80">{m.note}</dd> : null}
                  </div>
                ))}
              </dl>
              {project.resultsNote ? <p className="mt-4 text-sm text-muted-foreground">{project.resultsNote}</p> : null}
            </Reveal>

            {stop ? (
              <Reveal>
                <div className="relative overflow-hidden rounded-3xl border border-primary/30 bg-primary/[0.04] p-7 sm:p-10">
                  <p className="text-xs font-medium uppercase tracking-[0.12em] text-primary">Why I built it</p>
                  <p className="mt-4 max-w-3xl text-pretty text-xl leading-snug text-foreground sm:text-2xl">{stop.why}</p>
                  <p className="mt-5 max-w-3xl text-pretty text-[15px] leading-relaxed text-muted-foreground">
                    <span className="font-medium text-foreground/80">What I took from it: </span>
                    {stop.lesson}
                  </p>
                  {before ? (
                    <Link
                      href={before.href}
                      className="mt-6 inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline"
                    >
                      <ArrowLeft className="h-4 w-4" />
                      Came after {before.title}
                    </Link>
                  ) : null}
                  <Link href="/#thread" className="ml-5 mt-6 inline-flex text-sm text-muted-foreground hover:text-foreground">
                    See the whole thread
                  </Link>
                </div>
              </Reveal>
            ) : null}

            {/* Problem and role */}
            <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
              <Reveal>
                <h2 className="text-3xl font-semibold text-foreground sm:text-4xl">The problem</h2>
                <div className="mt-6 flex flex-col gap-4">
                  {project.problem.map((p) => (
                    <p key={p} className="text-pretty text-[17px] leading-relaxed text-foreground/80">
                      {p}
                    </p>
                  ))}
                </div>
              </Reveal>
              <Reveal delay={90}>
                <h2 className="text-3xl font-semibold text-foreground sm:text-4xl">What I built</h2>
                <p className="mt-6 text-pretty text-[15px] leading-relaxed text-muted-foreground">{project.role.team}</p>
                <ul className="mt-5 flex flex-col gap-3.5">
                  {project.role.built.map((b) => (
                    <li key={b} className="flex gap-3 text-[17px] leading-relaxed text-foreground/85">
                      <span className="mt-[0.7rem] h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                      <span className="text-pretty">{b}</span>
                    </li>
                  ))}
                </ul>
                {project.role.note ? <p className="mt-5 text-sm leading-relaxed text-muted-foreground">{project.role.note}</p> : null}
              </Reveal>
            </div>

            {/* Architecture */}
            <Reveal>
              <h2 className="text-3xl font-semibold text-foreground sm:text-4xl">How it works</h2>
              <p className="mt-6 max-w-3xl text-pretty text-[17px] leading-relaxed text-foreground/80">{project.architecture.intro}</p>
              <figure className="mt-10 rounded-3xl border border-border bg-card p-5 shadow-soft sm:p-10">
                <ProjectVisual visual={project.architecture.visual} />
                <figcaption className="mt-6 text-sm text-muted-foreground">{project.architecture.caption}</figcaption>
              </figure>
              {project.architecture.image ? (
                <figure className="mt-6 overflow-x-auto rounded-3xl border border-border bg-white p-4 sm:p-6">
                  <Image
                    src={project.architecture.image.src}
                    alt={project.architecture.image.alt}
                    width={project.architecture.image.width}
                    height={project.architecture.image.height}
                    className="h-auto w-full min-w-[640px]"
                  />
                  <figcaption className="mt-3 text-xs text-neutral-500">{project.architecture.image.credit}</figcaption>
                </figure>
              ) : null}
            </Reveal>

            {playable ? (
              <Reveal>
                <h2 className="text-3xl font-semibold text-foreground sm:text-4xl">Play with it</h2>
                <div className="mt-8 max-w-xl rounded-3xl border border-border bg-card p-5 shadow-soft sm:p-8">
                  <ProjectVisual visual={project.architecture.visual} compact />
                </div>
              </Reveal>
            ) : null}

            {project.embed ? (
              <Reveal>
                <h2 className="mb-8 text-3xl font-semibold text-foreground sm:text-4xl">See it run</h2>
                <VideoEmbed {...project.embed} />
              </Reveal>
            ) : null}

            {project.challenges.length ? (
              <section>
                <Reveal>
                  <h2 className="text-3xl font-semibold text-foreground sm:text-4xl">The hard parts</h2>
                </Reveal>
                <div className="mt-8 grid gap-5 md:grid-cols-3">
                  {project.challenges.map((c, i) => (
                    <Reveal key={c.title} delay={i * 90}>
                      <article className="h-full rounded-3xl border border-border bg-card p-7 shadow-soft">
                        <p className="text-xs font-medium tabular-nums text-muted-foreground">0{i + 1}</p>
                        <h3 className="mt-3 text-lg font-semibold text-foreground">{c.title}</h3>
                        <p className="mt-3 text-pretty text-[15px] leading-relaxed text-muted-foreground">{c.body}</p>
                      </article>
                    </Reveal>
                  ))}
                </div>
              </section>
            ) : null}

            <Reveal>
              <h2 className="text-3xl font-semibold text-foreground sm:text-4xl">Built with</h2>
              <ul className="mt-6 flex flex-wrap gap-2.5">
                {project.stack.map((t) => (
                  <li key={t} className="rounded-full border border-border bg-card px-4 py-1.5 text-sm text-foreground/85">
                    {t}
                  </li>
                ))}
              </ul>
            </Reveal>

            <Reveal>
              <Link
                href={`/work/${next.slug}`}
                className="group flex items-center justify-between gap-6 rounded-3xl border border-border bg-card p-7 shadow-soft transition-shadow duration-500 ease-apple hover:shadow-lift sm:p-10"
              >
                <div>
                  <p className="text-sm text-muted-foreground">Next case study</p>
                  <p className="mt-1 text-2xl font-semibold text-foreground sm:text-3xl">{next.name}</p>
                  <p className="mt-1 text-pretty text-[15px] text-muted-foreground">{next.tagline}</p>
                </div>
                <ChevronRight className="h-6 w-6 shrink-0 text-primary transition-transform duration-300 ease-apple group-hover:translate-x-1" />
              </Link>
            </Reveal>
          </div>
        </div>

        <div className="relative bg-background">
          <Contact />
        </div>
      </main>
    </>
  )
}

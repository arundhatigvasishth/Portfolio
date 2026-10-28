import { ArrowUpRight, Check } from "lucide-react"
import { arbRelations, research, type Research as ResearchItem } from "@/lib/content"
import { badgeIcons, type BadgeIconKey } from "@/components/icons"
import { SectionHeading } from "@/components/section-heading"
import { Reveal } from "@/components/reveal"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { cn } from "@/lib/utils"

const stageStyle: Record<ResearchItem["stage"], string> = {
  "In progress": "bg-primary/10 text-primary",
  Built: "bg-[oklch(0.68_0.15_150/0.14)] text-[oklch(0.45_0.13_150)] dark:text-[oklch(0.8_0.14_150)]",
  Exploratory: "bg-secondary text-secondary-foreground",
}

export function Research() {
  return (
    <section id="research" className="relative mx-auto max-w-6xl px-4 py-20 sm:px-8 sm:py-28">
      <SectionHeading index="02" title="Quantitative research" kicker={research.org} />

      <Reveal>
        <p className="max-w-2xl text-pretty text-lg leading-relaxed text-foreground/85">
          {research.intro}
        </p>
      </Reveal>

      <Accordion multiple className="mt-10 flex flex-col gap-3">
        {research.items.map((item, i) => {
          const Icon = badgeIcons[item.id as BadgeIconKey]
          return (
            <Reveal key={item.id} delay={i * 80}>
              <AccordionItem
                value={item.id}
                className="group/item overflow-hidden rounded-3xl border border-border bg-card shadow-soft transition-shadow duration-300 ease-apple hover:shadow-lift"
              >
                <AccordionTrigger className="items-center gap-4 rounded-none px-5 py-5 hover:no-underline sm:px-7">
                  <div className="flex min-w-0 flex-1 items-center gap-4 text-left">
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-secondary text-primary transition-colors duration-300 group-hover/item:bg-primary group-hover/item:text-primary-foreground">
                      {Icon ? <Icon className="h-5 w-5" /> : null}
                    </span>
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                        <span className={cn("rounded-full px-2.5 py-0.5 text-[11px] font-medium", stageStyle[item.stage])}>
                          {item.stage}
                        </span>
                        <span className="text-xs font-normal text-muted-foreground">{item.period}</span>
                      </div>
                      <h3 className="mt-1 text-lg font-semibold text-foreground sm:text-xl">{item.title}</h3>
                    </div>
                  </div>
                  <MiniTrack steps={item.track} />
                </AccordionTrigger>

                <AccordionContent className="px-5 pb-0 sm:px-7 [&_a]:no-underline">
                  <div className="border-t border-border py-6">
                    <div className="grid gap-8 lg:grid-cols-[1.15fr_1fr] lg:gap-12">
                      <div>
                        <p className="text-pretty text-[17px] leading-relaxed text-foreground/85">{item.question}</p>
                        <ul className="mt-5 flex flex-col gap-3">
                          {item.approach.map((step) => (
                            <li key={step} className="flex gap-3 text-[15px] leading-relaxed text-muted-foreground">
                              <span className="mt-2.5 h-1 w-1 shrink-0 rounded-full bg-primary" />
                              <span className="text-pretty">{step}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="flex flex-col gap-6">
                        <Track steps={item.track} />
                        <p className="text-sm leading-relaxed text-foreground/80">
                          <span className="font-medium text-foreground">Status: </span>
                          {item.status}
                        </p>
                        {item.id === "arbitrage" ? <Relations /> : null}
                        {item.id === "edgar" ? <Spillover /> : null}
                      </div>
                    </div>

                    <div className="mt-8 flex flex-wrap items-center gap-x-5 gap-y-3 border-t border-border pt-6">
                      <div className="flex flex-wrap gap-2">
                        {item.stack.map((t) => (
                          <span key={t} className="rounded-full bg-secondary px-3 py-1 text-xs text-secondary-foreground">
                            {t}
                          </span>
                        ))}
                      </div>
                      {item.links?.map((link) => (
                        <a
                          key={link.href}
                          href={link.href}
                          target="_blank"
                          rel="noreferrer noopener"
                          className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
                        >
                          {link.label}
                          <ArrowUpRight className="h-4 w-4" />
                        </a>
                      ))}
                      {item.teamNote ? <p className="w-full text-xs text-muted-foreground">{item.teamNote}</p> : null}
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Reveal>
          )
        })}
      </Accordion>
    </section>
  )
}

const stateLabel = { done: "Done", active: "In progress", open: "Not started" }

// The progress track at a glance, shown on the closed row.
function MiniTrack({ steps }: { steps: ResearchItem["track"] }) {
  const done = steps.filter((s) => s.state === "done").length
  return (
    <span className="hidden shrink-0 items-center gap-3 sm:flex" aria-hidden="true">
      <span className="flex items-center gap-1">
        {steps.map((step) => (
          <span
            key={step.label}
            className={cn(
              "h-1.5 w-5 rounded-full",
              step.state === "done" && "bg-primary",
              step.state === "active" && "animate-pulse bg-primary/50 motion-reduce:animate-none",
              step.state === "open" && "bg-border",
            )}
          />
        ))}
      </span>
      <span className="text-xs font-normal tabular-nums text-muted-foreground">
        {done}/{steps.length}
      </span>
    </span>
  )
}

function Track({ steps }: { steps: ResearchItem["track"] }) {
  return (
    <ol className="flex flex-col gap-0" aria-label="Progress">
      {steps.map((step, i) => (
        <li key={step.label} className="relative flex items-center gap-3 pb-4 last:pb-0">
          {i < steps.length - 1 ? (
            <span
              aria-hidden="true"
              className={cn(
                "absolute left-[9px] top-5 h-[calc(100%-12px)] w-[2px] rounded-full",
                step.state === "done" ? "bg-primary/60" : "bg-border",
              )}
            />
          ) : null}
          <span
            aria-hidden="true"
            className={cn(
              "relative z-10 flex h-5 w-5 shrink-0 items-center justify-center rounded-full",
              step.state === "done" && "bg-primary text-primary-foreground",
              step.state === "active" && "border-2 border-primary bg-card",
              step.state === "open" && "border-2 border-dashed border-muted-foreground/40 bg-card",
            )}
          >
            {step.state === "done" ? <Check className="h-3 w-3" /> : null}
            {step.state === "active" ? <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-primary motion-reduce:animate-none" /> : null}
          </span>
          <span className={cn("text-sm", step.state === "open" ? "text-muted-foreground" : "text-foreground")}>
            {step.label}
            <span className="sr-only">: {stateLabel[step.state]}</span>
          </span>
          {step.state !== "done" ? (
            <span className="ml-auto text-xs text-muted-foreground" aria-hidden="true">
              {stateLabel[step.state]}
            </span>
          ) : null}
        </li>
      ))}
    </ol>
  )
}

function Relations() {
  return (
    <div>
      <p className="mb-3 text-xs font-medium uppercase tracking-[0.12em] text-muted-foreground">
        The five relationships it labels
      </p>
      <ul className="grid gap-2 sm:grid-cols-2">
        {arbRelations.map((r) => (
          <li key={r.name} className="rounded-2xl border border-border bg-background px-3.5 py-2.5">
            <p className="text-sm font-medium text-foreground">{r.name}</p>
            <p className="font-mono text-xs text-primary">{r.condition}</p>
            <p className="mt-0.5 text-xs text-muted-foreground">{r.rule}</p>
          </li>
        ))}
      </ul>
    </div>
  )
}

// A concept sketch of the hypothesis, not data: a surprise at one company
// reaching its neighbours a beat later.
const nodes = [
  { x: 60, y: 60, d: 0 },
  { x: 150, y: 30, d: 1 },
  { x: 140, y: 110, d: 1 },
  { x: 240, y: 70, d: 2 },
  { x: 230, y: 140, d: 2 },
  { x: 40, y: 140, d: 1 },
  { x: 300, y: 30, d: 3 },
]
const edges: [number, number][] = [
  [0, 1], [0, 2], [0, 5], [1, 3], [2, 3], [2, 4], [3, 6], [5, 2],
]

function Spillover() {
  return (
    <figure className="rounded-2xl border border-border bg-background p-4">
      <svg viewBox="0 0 340 170" className="h-auto w-full" role="img" aria-label="Concept sketch: a surprise at one company reaching connected companies in waves.">
        {edges.map(([a, b]) => (
          <line key={`${a}-${b}`} x1={nodes[a].x} y1={nodes[a].y} x2={nodes[b].x} y2={nodes[b].y} stroke="var(--border)" strokeWidth={2} />
        ))}
        {nodes.map((n, i) => (
          <g key={i}>
            <circle
              cx={n.x}
              cy={n.y}
              r={14}
              fill="var(--primary)"
              className="spill-ring"
              style={{ animationDelay: `${n.d * 0.6}s`, transformOrigin: `${n.x}px ${n.y}px` }}
            />
            <circle cx={n.x} cy={n.y} r={i === 0 ? 9 : 6} fill={i === 0 ? "var(--primary)" : "var(--card)"} stroke="var(--primary)" strokeWidth={2} />
          </g>
        ))}
      </svg>
      <figcaption className="mt-2 text-xs text-muted-foreground">Concept sketch of the hypothesis. Not results.</figcaption>
    </figure>
  )
}

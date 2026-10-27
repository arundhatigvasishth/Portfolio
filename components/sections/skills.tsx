import { GraduationCap } from "lucide-react"
import { skills, education } from "@/lib/content"
import { SectionHeading } from "@/components/section-heading"
import { Reveal } from "@/components/reveal"
import { TextPlate } from "@/components/text-plate"

// Fixed categorical order, one hue per group — matches lib/content.ts order.
const categoryColors = ["var(--chart-1)", "var(--chart-2)", "var(--chart-3)"]

export function Skills() {
  return (
    <section id="skills" className="relative">
      <div className="mx-auto max-w-6xl px-4 py-28 sm:px-8 sm:py-40">
        <SectionHeading index="07" title="Skills & Education" />

        <div className="grid gap-10 lg:grid-cols-[1.4fr_1fr] lg:gap-16">
          <div className="flex flex-col gap-9">
            {skills.map((group, i) => {
              const color = categoryColors[i % categoryColors.length]
              return (
                <Reveal key={group.label} delay={i * 90}>
                  <div>
                    <div className="mb-3 flex items-baseline justify-between gap-4">
                      <h3 className="text-xs font-semibold uppercase tracking-[0.12em]" style={{ color }}>
                        <TextPlate className="px-1 py-0.5 -mx-1 -my-0.5">{group.label}</TextPlate>
                      </h3>
                      <span className="text-xs font-medium tabular-nums text-muted-foreground">
                        {group.items.length}
                      </span>
                    </div>

                    {/* A rhythmic bar per skill — the count read as a beat, not a
                        separate chart competing with the list below it. */}
                    <div className="mb-4 flex h-4 items-end gap-[3px]" aria-hidden="true">
                      {group.items.map((_, b) => (
                        <span
                          key={b}
                          className="w-[3px] rounded-full"
                          style={{
                            backgroundColor: color,
                            height: `${45 + ((b * 37) % 55)}%`,
                            opacity: 0.4 + ((b * 17) % 60) / 100,
                          }}
                        />
                      ))}
                    </div>

                    <div className="flex flex-wrap gap-2.5">
                      {group.items.map((item) => (
                        <span
                          key={item}
                          className="rounded-full border border-border bg-card px-3.5 py-1.5 text-sm text-foreground/85 shadow-soft transition-colors duration-200 ease-apple hover:text-primary"
                        >
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>
                </Reveal>
              )
            })}
          </div>

          <Reveal delay={120}>
            <div className="rounded-3xl border border-border bg-card p-7 shadow-soft sm:p-9">
              <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-secondary text-primary">
                <GraduationCap className="h-6 w-6" />
              </span>
              <h3 className="mt-6 text-xl font-semibold text-foreground sm:text-2xl">{education.school}</h3>
              <p className="mt-1 text-sm text-foreground/80">{education.degree}</p>
              <p className="text-sm text-muted-foreground">{education.place}</p>

              <div className="mt-5 flex flex-wrap gap-2">
                {education.honors.map((h) => (
                  <span
                    key={h}
                    className="rounded-full bg-secondary px-3 py-1 text-xs font-medium text-foreground/85"
                  >
                    {h}
                  </span>
                ))}
              </div>
              <p className="mt-6 text-xs font-medium text-muted-foreground">
                {education.expected}
              </p>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}

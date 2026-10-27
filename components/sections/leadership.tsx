import Image from "next/image"
import { ArrowUpRight } from "lucide-react"
import { leadership } from "@/lib/content"
import { badgeIcons, type BadgeIconKey } from "@/components/icons"
import { SectionHeading } from "@/components/section-heading"
import { Reveal } from "@/components/reveal"

export function Leadership() {
  return (
    <section id="leadership" className="relative mx-auto max-w-6xl px-4 py-28 sm:px-8 sm:py-40">
      <SectionHeading index="04" title="Leadership" kicker="Teaching, organizing, and helping other people get started." />

      <div className="grid gap-5 md:grid-cols-2">
        {leadership.map((item, i) => {
          const Icon = badgeIcons[item.id as BadgeIconKey]
          return (
            <Reveal key={item.id} delay={(i % 2) * 90}>
              <article className="flex h-full flex-col rounded-3xl border border-border bg-card p-7 shadow-soft sm:p-8">
                <div className="flex items-start justify-between gap-4">
                  <span className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-secondary p-1.5 text-primary">
                    {item.logo ? (
                      <Image src={item.logo.src} alt={item.logo.alt} width={40} height={40} className="h-full w-full object-contain" />
                    ) : Icon ? (
                      <Icon className="h-6 w-6" />
                    ) : null}
                  </span>
                  {item.period ? <span className="pt-1 text-xs tabular-nums text-muted-foreground">{item.period}</span> : null}
                </div>
                <h3 className="mt-5 text-xl font-semibold text-foreground">{item.role}</h3>
                <p className="mt-1 text-sm text-foreground/70">{item.org}</p>
                <p className="mt-4 text-pretty text-[15px] leading-relaxed text-muted-foreground">{item.summary}</p>
                {item.link ? (
                  <a
                    href={item.link.href}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="mt-auto inline-flex items-center gap-1 pt-5 text-sm font-medium text-primary hover:underline"
                  >
                    {item.link.label}
                    <ArrowUpRight className="h-4 w-4" />
                  </a>
                ) : null}
              </article>
            </Reveal>
          )
        })}
      </div>
    </section>
  )
}

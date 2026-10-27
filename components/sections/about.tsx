import { about } from "@/lib/content"
import { SectionHeading } from "@/components/section-heading"
import { Reveal } from "@/components/reveal"
import { TextPlate } from "@/components/text-plate"

export function About() {
  return (
    <section id="about" className="relative mx-auto max-w-6xl px-4 py-28 sm:px-8 sm:py-40">
      <SectionHeading index="01" title="About" />

      <div className="flex max-w-3xl flex-col gap-7">
        {about.map((para, i) => (
          <Reveal key={i} delay={i * 90}>
            <p className="text-pretty text-xl leading-relaxed text-foreground/80 sm:text-[1.375rem] sm:leading-relaxed">
              <TextPlate>{para}</TextPlate>
            </p>
          </Reveal>
        ))}
      </div>
    </section>
  )
}

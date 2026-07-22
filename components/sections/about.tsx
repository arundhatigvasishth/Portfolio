import { about } from "@/lib/content"
import { SectionHeading } from "@/components/section-heading"
import { Reveal } from "@/components/reveal"
import { TextPlate } from "@/components/text-plate"

export function About() {
  return (
    <section id="about" className="relative mx-auto max-w-6xl px-5 py-24 sm:px-8 sm:py-32">
      <SectionHeading index="01" title="About" />

      <div className="flex flex-col gap-6">
        {about.map((para, i) => (
          <Reveal key={i} delay={i * 90}>
            <p className="text-pretty text-lg leading-relaxed text-foreground/85">
              <TextPlate>{para}</TextPlate>
            </p>
          </Reveal>
        ))}
      </div>
    </section>
  )
}

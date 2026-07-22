import { BeatStrip } from "@/components/beat-strip"
import { Reveal } from "@/components/reveal"
import { TextPlate } from "@/components/text-plate"

export function SectionHeading({
  index,
  title,
  kicker,
}: {
  index: string
  title: string
  kicker?: string
}) {
  return (
    <Reveal className="mb-10 flex flex-col gap-4 sm:mb-14">
      <div className="flex items-center gap-4">
        <TextPlate className="px-1 py-0.5 -mx-1 -my-0.5 font-mono text-xs tracking-[0.3em] text-accent">
          {index}
        </TextPlate>
        <BeatStrip />
      </div>
      <div>
        <h2 className="text-balance font-serif text-3xl font-semibold tracking-tight text-foreground sm:text-4xl md:text-5xl">
          <TextPlate className="px-1.5 py-0.5 -mx-1.5 -my-0.5">{title}</TextPlate>
        </h2>
        {kicker ? (
          <p className="mt-3 max-w-xl text-pretty text-muted-foreground">
            <TextPlate>{kicker}</TextPlate>
          </p>
        ) : null}
      </div>
    </Reveal>
  )
}

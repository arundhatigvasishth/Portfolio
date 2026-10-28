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
    <Reveal className="mb-8 flex flex-col gap-4 sm:mb-10">
      <div className="flex items-center gap-3">
        <TextPlate className="px-1 py-0.5 -mx-1 -my-0.5 text-xs font-medium tabular-nums tracking-[0.12em] text-muted-foreground">
          {index}
        </TextPlate>
        <BeatStrip className="opacity-70" />
      </div>
      <div>
        <h2 className="text-balance text-4xl font-semibold leading-[1.05] text-foreground sm:text-5xl">
          <TextPlate className="px-1.5 py-0.5 -mx-1.5 -my-0.5">{title}</TextPlate>
        </h2>
        {kicker ? (
          <p className="mt-4 max-w-xl text-pretty text-lg leading-snug text-muted-foreground sm:text-xl">
            <TextPlate>{kicker}</TextPlate>
          </p>
        ) : null}
      </div>
    </Reveal>
  )
}

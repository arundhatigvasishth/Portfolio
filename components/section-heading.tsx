import { BeatStrip } from "@/components/beat-strip"
import { Reveal } from "@/components/reveal"

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
        <span className="font-mono text-xs tracking-[0.3em] text-accent">{index}</span>
        <BeatStrip />
      </div>
      <div>
        <h2 className="text-balance font-serif text-3xl font-semibold tracking-tight text-foreground sm:text-4xl md:text-5xl">
          {title}
        </h2>
        {kicker ? <p className="mt-3 max-w-xl text-pretty text-muted-foreground">{kicker}</p> : null}
      </div>
    </Reveal>
  )
}

import { OrbitMark } from "@/components/orbit-mark"
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
    <Reveal className="mb-8 flex flex-col gap-4 sm:mb-10">
      <div className="flex items-center gap-3">
        <span className="text-xs text-muted-foreground">
          {index}
        </span>
        <OrbitMark className="opacity-80" />
      </div>
      <div>
        <h2 className="text-balance text-4xl font-semibold leading-[1.05] text-foreground sm:text-5xl">
          {title}
        </h2>
        {kicker ? (
          <p className="mt-4 max-w-xl text-pretty text-lg leading-snug text-muted-foreground sm:text-xl">
            {kicker}
          </p>
        ) : null}
      </div>
    </Reveal>
  )
}

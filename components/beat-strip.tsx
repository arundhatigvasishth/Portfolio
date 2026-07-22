import { BEATS, BEAT_SECONDS, CYCLE_SECONDS } from "@/lib/rhythm"

// A 16 bar taal strip: bars light up one at a time, sweeping across the cycle.
// Used as a rhythmic divider / label accent. Purely CSS so it costs nothing.
export function BeatStrip({ className = "" }: { className?: string }) {
  return (
    <div
      className={`flex items-end gap-[3px] ${className}`}
      aria-hidden="true"
      role="presentation"
    >
      {Array.from({ length: BEATS }).map((_, i) => (
        <span
          key={i}
          className="beat-bar h-4 w-[3px] origin-bottom rounded-full"
          style={{
            backgroundColor: "var(--primary)",
            animation: `beat ${CYCLE_SECONDS}s linear infinite`,
            animationDelay: `${i * BEAT_SECONDS}s`,
          }}
        />
      ))}
    </div>
  )
}

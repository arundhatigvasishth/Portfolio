// A small orbit: a dot circling a ring, trailing into a fading line. Used as
// the section label accent. Pure CSS.
export function OrbitMark({ className = "" }: { className?: string }) {
  return (
    <span className={`inline-flex items-center gap-2 ${className}`} aria-hidden="true">
      <span className="relative h-3.5 w-3.5 rounded-full border border-primary/45">
        <span className="absolute inset-[4px] rounded-full bg-primary/70" />
        <span className="absolute -inset-px animate-[spin_5s_linear_infinite] motion-reduce:animate-none">
          <span className="absolute -top-[2px] left-1/2 h-[5px] w-[5px] -translate-x-1/2 rounded-full bg-primary" />
        </span>
      </span>
      <span className="h-px w-16 bg-gradient-to-r from-primary/60 to-transparent" />
    </span>
  )
}

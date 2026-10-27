"use client"

import { useEffect, useState } from "react"
import { usePrefersReducedMotion } from "@/lib/use-reduced-motion"
import { cn } from "@/lib/utils"

// Written to show the idea, not output from the model. The four languages
// are the ones MedEcho's explain route accepts: en, es, fr, hi.
const REPORT = "Patchy opacity in the right lower lobe, consistent with pneumonia."

const PLAIN = [
  {
    code: "EN",
    lang: "en",
    text: "Part of your right lung looks cloudy on the X-ray. That's often a sign of an infection like pneumonia. Your doctor will go over it with you.",
  },
  {
    code: "ES",
    lang: "es",
    text: "Una parte de tu pulmón derecho se ve nublada en la radiografía. Suele ser señal de una infección como la neumonía. Tu médico lo revisará contigo.",
  },
  {
    code: "FR",
    lang: "fr",
    text: "Une partie de votre poumon droit paraît voilée sur la radio. C'est souvent le signe d'une infection comme une pneumonie. Votre médecin en parlera avec vous.",
  },
  {
    code: "HI",
    lang: "hi",
    text: "एक्स-रे में आपके दाहिने फेफड़े का एक हिस्सा धुंधला दिखता है। यह अक्सर निमोनिया जैसे संक्रमण का संकेत होता है। आपके डॉक्टर इसके बारे में आपसे बात करेंगे।",
  },
]

const BARS = 28

export function MedEchoTranslate() {
  const reduced = usePrefersReducedMotion()
  const [i, setI] = useState(0)
  const [pinned, setPinned] = useState(false)

  useEffect(() => {
    if (reduced || pinned) return
    const id = window.setInterval(() => setI((n) => (n + 1) % PLAIN.length), 3800)
    return () => window.clearInterval(id)
  }, [reduced, pinned])

  const current = PLAIN[i]

  return (
    <div className="flex flex-col gap-3">
      <div className="rounded-2xl border border-border bg-background p-4">
        <p className="text-[11px] font-medium uppercase tracking-[0.12em] text-muted-foreground">Radiology report</p>
        <p className="mt-1.5 font-mono text-[13px] leading-snug text-foreground/70">{REPORT}</p>
      </div>

      <div className="relative rounded-2xl border border-primary/40 bg-primary/[0.05] p-4">
        <div className="flex items-center gap-3">
          <span className="relative flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-semibold text-primary-foreground">
            {current.code}
            {!reduced ? <span className="absolute inset-0 animate-ping rounded-full bg-primary/30" /> : null}
          </span>
          {/* A talking waveform: decorative, keyed to the language so it restarts. */}
          <div key={current.code} className="flex h-6 flex-1 items-center gap-[3px]" aria-hidden="true">
            {Array.from({ length: BARS }).map((_, b) => (
              <span
                key={b}
                className="speak-bar w-[3px] rounded-full bg-primary/70"
                style={{ height: `${30 + ((b * 47) % 70)}%`, animationDelay: `${(b % 7) * 0.09}s` }}
              />
            ))}
          </div>
        </div>
        <p key={current.lang} lang={current.lang} className="medecho-line mt-3 min-h-[4.5rem] text-pretty text-[15px] leading-relaxed text-foreground" aria-live="polite">
          {current.text}
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        {PLAIN.map((p, n) => (
          <button
            key={p.code}
            type="button"
            onClick={() => {
              setI(n)
              setPinned(true)
            }}
            aria-pressed={n === i}
            className={cn(
              "rounded-full border px-3 py-1 text-xs font-medium transition-colors duration-200 ease-apple",
              n === i ? "border-primary bg-primary text-primary-foreground" : "border-border bg-background text-foreground/75 hover:border-primary hover:text-primary",
            )}
          >
            {p.code}
          </button>
        ))}
        <span className="ml-auto text-[11px] text-muted-foreground">Illustrative example</span>
      </div>
    </div>
  )
}

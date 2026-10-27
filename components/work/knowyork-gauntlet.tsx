"use client"

import { useEffect, useState } from "react"
import { Check, X } from "lucide-react"
import { usePrefersReducedMotion } from "@/lib/use-reduced-motion"
import { cn } from "@/lib/utils"

// The layers every visit passes through, and who enforces each one, from the
// "Who enforces what" table in the KnowYork README.
const layers = [
  { name: "Solvency", by: "XRPL balance read" },
  { name: "Sentinel", by: "Plain code, SQLite, Solana" },
  { name: "Photo check", by: "Grok vision" },
  { name: "Payout agent", by: "Grok, treated as untrusted" },
  { name: "Policy engine", by: "Fixed TypeScript rules" },
  { name: "Reviewer", by: "Second Grok call, no caption" },
  { name: "Ledger cap", by: "XRPL trust line limit" },
]

type Scenario = { id: string; label: string; stopAt: number | null; reason: string }

const scenarios: Scenario[] = [
  { id: "honest", label: "Honest visit", stopAt: null, reason: "Every layer passes. RLUSD is paid, then the soulbound stamp is minted with the payment's hash." },
  { id: "gps", label: "Spoofed GPS", stopAt: 1, reason: "Sentinel reads a five-point GPS trail and flags overrides, typed coordinates, and impossible travel." },
  { id: "replay", label: "Repeat claim after a database wipe", stopAt: 1, reason: "Sentinel asks Solana whether the wallet already holds this stamp, so a lost database can't be used to claim twice." },
  { id: "photo", label: "Photo of the wrong place", stopAt: 2, reason: "Grok vision must be confident the photo shows the place before anything is claimed or paid." },
  { id: "inject", label: "Caption tells the AI to pay 50", stopAt: 4, reason: "The agent may believe it, but the policy engine caps a visit at 5 RLUSD and checks the recipient in plain code." },
  { id: "bypass", label: "Every app check bypassed", stopAt: 6, reason: "The agent wallet's trust line is capped at 10 RLUSD on the ledger, so the XRPL itself refuses the overspend." },
]

export function KnowYorkGauntlet({ compact = false }: { compact?: boolean }) {
  const reduced = usePrefersReducedMotion()
  const [scenario, setScenario] = useState<Scenario>(scenarios[0])
  const [step, setStep] = useState(0)

  const end = scenario.stopAt ?? layers.length

  // The homepage preview cycles through the attacks on its own.
  useEffect(() => {
    if (!compact || reduced) return
    const id = window.setInterval(() => {
      setScenario((s) => scenarios[(scenarios.indexOf(s) + 1) % scenarios.length])
    }, 4200)
    return () => window.clearInterval(id)
  }, [compact, reduced])

  useEffect(() => {
    if (reduced) {
      setStep(end + 1)
      return
    }
    setStep(0)
    let i = 0
    const id = window.setInterval(() => {
      i += 1
      setStep(i)
      if (i > end) window.clearInterval(id)
    }, 320)
    return () => window.clearInterval(id)
  }, [scenario, reduced, end])

  const settled = scenario.stopAt === null && step > layers.length - 1

  return (
    <div className="flex flex-col gap-5">
      {!compact ? (
        <div className="flex flex-wrap gap-2" role="radiogroup" aria-label="Choose a visit to send through the pipeline">
          {scenarios.map((s) => (
            <button
              key={s.id}
              type="button"
              role="radio"
              aria-checked={scenario.id === s.id}
              onClick={() => setScenario(s)}
              className={cn(
                "rounded-full border px-3.5 py-1.5 text-sm transition-colors duration-200 ease-apple",
                scenario.id === s.id
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border bg-background text-foreground/80 hover:border-primary hover:text-primary",
              )}
            >
              {s.label}
            </button>
          ))}
        </div>
      ) : null}

      {compact ? (
        <p className="text-sm text-muted-foreground" aria-live="polite">
          Visit: <span className="font-medium text-foreground">{scenario.label}</span>
        </p>
      ) : null}

      <ol className={cn("grid gap-2", compact ? "grid-cols-1" : "grid-cols-1 sm:grid-cols-7")}>
        {layers.map((layer, i) => {
          const reached = step > i
          const stopped = scenario.stopAt === i && step > i
          const passed = reached && !stopped
          const after = scenario.stopAt !== null && i > scenario.stopAt
          return (
            <li
              key={layer.name}
              className={cn(
                "relative flex rounded-2xl border transition-all duration-500 ease-apple",
                compact ? "items-center gap-3 px-3 py-1.5" : "items-center gap-3 p-3 sm:flex-col sm:items-start sm:gap-2",
                stopped
                  ? "border-destructive/60 bg-destructive/10"
                  : passed
                    ? "border-primary/40 bg-primary/[0.06]"
                    : "border-border bg-background",
                after && step > end ? "opacity-40" : undefined,
              )}
            >
              <span
                className={cn(
                  "flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[11px] font-medium",
                  stopped
                    ? "bg-destructive text-white"
                    : passed
                      ? "bg-primary text-primary-foreground"
                      : "bg-secondary text-muted-foreground",
                )}
                aria-hidden="true"
              >
                {stopped ? <X className="h-3.5 w-3.5" /> : passed ? <Check className="h-3.5 w-3.5" /> : i + 1}
              </span>
              {!compact ? (
                <span className="min-w-0">
                  <span className="block text-sm font-medium text-foreground">{layer.name}</span>
                  <span className="block text-xs leading-snug text-muted-foreground">{layer.by}</span>
                </span>
              ) : (
                <span className="text-sm text-foreground/85">{layer.name}</span>
              )}
            </li>
          )
        })}
      </ol>

      {compact ? (
        <p className={cn("text-sm font-medium transition-opacity duration-300", step > end ? "opacity-100" : "opacity-0", scenario.stopAt === null ? "text-primary" : "text-destructive")}>
          {scenario.stopAt === null ? "Paid and stamped." : `Stopped at ${layers[scenario.stopAt].name}. No money moved.`}
        </p>
      ) : (
        <p
          className={cn(
            "min-h-[3rem] rounded-2xl px-4 py-3 text-sm leading-relaxed transition-opacity duration-300",
            step > end || settled ? "opacity-100" : "opacity-0",
            scenario.stopAt === null ? "bg-primary/[0.06] text-foreground/85" : "bg-destructive/10 text-foreground/85",
          )}
          aria-live="polite"
        >
          <span className="font-medium">
            {scenario.stopAt === null ? "Paid and stamped. " : `Stopped at ${layers[scenario.stopAt].name}. No money moved. `}
          </span>
          {scenario.reason}
        </p>
      )}
    </div>
  )
}

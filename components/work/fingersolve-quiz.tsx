"use client"

import { useEffect, useRef, useState } from "react"
import { Check, X } from "lucide-react"
import { BONES, GESTURES, pose, type V } from "@/lib/hand-poses"
import { usePrefersReducedMotion } from "@/lib/use-reduced-motion"
import { cn } from "@/lib/utils"

// A toy version of the FingerSolve loop: a question appears, a hand answers
// it. Visitors can answer too. Poses are hand-placed, not recorded data.

const QUESTIONS = [
  { q: "2 + 1", a: 3 },
  { q: "4 − 3", a: 1 },
  { q: "3 + 2", a: 5 },
  { q: "1 + 1", a: 2 },
  { q: "6 − 2", a: 4 },
]
const FIST = pose([])

// Project the 3D landmarks onto the card, with a little depth shear.
const px = (v: V) => 112 + (v[0] + v[2] * 0.35) * 74
const py = (v: V) => 178 - v[1] * 74

type Verdict = { pick: number; right: boolean } | null

export function FingerSolveQuiz() {
  const reduced = usePrefersReducedMotion()
  const [round, setRound] = useState(0)
  const [shown, setShown] = useState<number | null>(null) // digit the hand is showing
  const [verdict, setVerdict] = useState<Verdict>(null)
  const [points, setPoints] = useState<V[]>(FIST)
  const current = useRef<V[]>(FIST.map((v) => [...v] as V))
  const userTurn = useRef(false)
  const timers = useRef<number[]>([])

  const question = QUESTIONS[round % QUESTIONS.length]
  const target = shown ? GESTURES[shown - 1].points : FIST

  // Auto-play: think, answer, celebrate, next.
  useEffect(() => {
    if (userTurn.current) return
    timers.current = [
      window.setTimeout(() => setShown(question.a), reduced ? 0 : 1100),
      window.setTimeout(() => setVerdict({ pick: question.a, right: true }), reduced ? 0 : 1900),
      window.setTimeout(() => {
        setVerdict(null)
        setShown(null)
        setRound((r) => r + 1)
      }, 4200),
    ]
    return () => timers.current.forEach(window.clearTimeout)
  }, [round, question.a, reduced])

  // Ease the joints toward the target pose.
  useEffect(() => {
    if (reduced) {
      current.current = target.map((v) => [...v] as V)
      setPoints(current.current)
      return
    }
    let raf = 0
    let last = performance.now()
    const tick = (t: number) => {
      const k = 1 - Math.pow(0.0015, (t - last) / 1000)
      last = t
      let moving = false
      current.current = current.current.map((v, i) => {
        const g = target[i]
        const n: V = [v[0] + (g[0] - v[0]) * k, v[1] + (g[1] - v[1]) * k, v[2] + (g[2] - v[2]) * k]
        if (Math.abs(n[0] - g[0]) + Math.abs(n[1] - g[1]) > 0.002) moving = true
        return n
      })
      setPoints(current.current)
      if (moving) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [target, reduced])

  const answer = (n: number) => {
    // The visitor takes over this round: cancel the auto-answer.
    timers.current.forEach(window.clearTimeout)
    userTurn.current = true
    setShown(n)
    setVerdict({ pick: n, right: n === question.a })
    timers.current = [window.setTimeout(() => {
      userTurn.current = false
      setVerdict(null)
      setShown(null)
      setRound((r) => r + 1)
    }, 2600)]
  }

  const tips = new Set([4, 8, 12, 16, 20])

  return (
    <div className="flex flex-col gap-4">
      <div className="relative overflow-hidden rounded-2xl border border-border bg-background">
        <div className="absolute left-4 top-4 z-10">
          <p className="text-[11px] font-medium uppercase tracking-[0.12em] text-muted-foreground">Show me</p>
          <p className="text-3xl font-semibold tabular-nums tracking-tight text-foreground">{question.q} = ?</p>
        </div>

        <div
          className={cn(
            "absolute right-4 top-4 z-10 flex items-center gap-1.5 rounded-full px-3 py-1 text-sm font-medium transition-all duration-300 ease-apple",
            verdict ? "translate-y-0 opacity-100" : "-translate-y-1 opacity-0",
            verdict?.right ? "bg-[oklch(0.68_0.15_150/0.15)] text-[oklch(0.5_0.14_150)] dark:text-[oklch(0.8_0.14_150)]" : "bg-destructive/10 text-destructive",
          )}
          aria-live="polite"
        >
          {verdict ? (
            verdict.right ? (
              <>
                <Check className="h-4 w-4" /> {verdict.pick}. Nice.
              </>
            ) : (
              <>
                <X className="h-4 w-4" /> {verdict.pick}? Try again.
              </>
            )
          ) : null}
        </div>

        <svg viewBox="0 0 224 200" className="mx-auto h-auto w-full max-w-[320px]" aria-hidden="true">
          {BONES.map(([a, b], i) => (
            <line
              key={i}
              x1={px(points[a])}
              y1={py(points[a])}
              x2={px(points[b])}
              y2={py(points[b])}
              stroke="var(--muted-foreground)"
              strokeOpacity={0.5}
              strokeWidth={1.6}
              strokeLinecap="round"
            />
          ))}
          {points.map((v, i) => (
            <circle
              key={i}
              cx={px(v)}
              cy={py(v)}
              r={i === 0 ? 5.5 : tips.has(i) ? 4.5 : 3.2}
              fill={tips.has(i) ? "var(--primary)" : "var(--foreground)"}
              fillOpacity={tips.has(i) ? 1 : 0.75}
            />
          ))}
        </svg>
      </div>

      <div className="flex items-center gap-2">
        <span className="mr-1 text-xs text-muted-foreground">Your turn:</span>
        {[1, 2, 3, 4, 5].map((n) => (
          <button
            key={n}
            type="button"
            onClick={() => answer(n)}
            className={cn(
              "h-9 w-9 rounded-full border text-sm tabular-nums transition-colors duration-200 ease-apple",
              shown === n ? "border-primary bg-primary text-primary-foreground" : "border-border bg-background text-foreground/80 hover:border-primary hover:text-primary",
            )}
            aria-label={`Answer ${n}`}
          >
            {n}
          </button>
        ))}
      </div>
    </div>
  )
}

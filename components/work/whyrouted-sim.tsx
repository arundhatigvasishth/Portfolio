"use client"

import { useEffect, useRef, useState } from "react"
import { usePrefersReducedMotion } from "@/lib/use-reduced-motion"
import { cn } from "@/lib/utils"

// A small, honest model of whyrouted's routing path: least-loaded selection,
// request-driven ejection, one retry against the next-best replica, and
// hysteresis on recovery. Timings are slowed down so the eye can follow them.

type Health = "healthy" | "ejected"
type Replica = { id: number; killed: boolean; health: Health; revivedAt?: number }
type Req = { id: number; target: number; start: number; legStart: number; retry: boolean; failed?: number; done?: number }

const W = 600
const H = 300
const CLIENT = { x: 48, y: 150 }
const ROUTER = { x: 250, y: 150 }
const REPLICA_X = 520
const replicaY = (i: number) => 48 + i * 68
const TRAVEL_MS = 1500
const SPAWN_MS = 650
const RECOVER_MS = 1600 // two healthy probes, slowed for viewing

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t
}

export function WhyroutedSim({ compact = false }: { compact?: boolean }) {
  const reduced = usePrefersReducedMotion()
  const [replicas, setReplicas] = useState<Replica[]>(() =>
    [0, 1, 2, 3].map((id) => ({ id, killed: false, health: "healthy" as Health })),
  )
  const [reqs, setReqs] = useState<Req[]>([])
  const [now, setNow] = useState(0)
  const [log, setLog] = useState<string[]>(["Fleet healthy. Strategy: least-loaded."])
  const [visible, setVisible] = useState(false)
  const nextId = useRef(1)
  const lastSpawn = useRef(0)
  const box = useRef<HTMLDivElement>(null)

  // Mirrors of state for the animation loop.
  const replicasRef = useRef(replicas)
  replicasRef.current = replicas
  const reqsRef = useRef(reqs)
  reqsRef.current = reqs

  useEffect(() => {
    const el = box.current
    if (!el) return
    const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting), { threshold: 0.2 })
    io.observe(el)
    return () => io.disconnect()
  }, [])

  const push = (line: string) => setLog((l) => [line, ...l].slice(0, compact ? 2 : 5))

  const pick = (exclude: number[]) => {
    const live = replicasRef.current.filter((r) => r.health === "healthy" && !exclude.includes(r.id))
    if (live.length === 0) return -1
    const load = (id: number) => reqsRef.current.filter((q) => q.target === id && !q.done && !q.failed).length
    return live.sort((a, b) => load(a.id) - load(b.id) || a.id - b.id)[0].id
  }

  useEffect(() => {
    if (reduced || !visible) return
    let raf = 0
    const tick = (t: number) => {
      setNow(t)

      // All bookkeeping runs on the refs, then state is committed once per frame.
      let reps = replicasRef.current
      let rs = reqsRef.current
      let repsChanged = false
      let reqsChanged = false
      const lines: string[] = []

      // Hysteresis: a revived replica rejoins only after a run of good probes.
      if (reps.some((r) => r.health === "ejected" && !r.killed && r.revivedAt && t - r.revivedAt > RECOVER_MS)) {
        reps = reps.map((r) =>
          r.health === "ejected" && !r.killed && r.revivedAt && t - r.revivedAt > RECOVER_MS
            ? { ...r, health: "healthy", revivedAt: undefined }
            : r,
        )
        repsChanged = true
      }

      // Resolve arrivals and clear finished requests.
      const out: Req[] = []
      for (const q of rs) {
        const p = (t - q.legStart) / TRAVEL_MS
        if (!q.done && !q.failed && p >= 1) {
          reqsChanged = true
          if (reps[q.target].killed) {
            out.push({ ...q, failed: t })
            reps = reps.map((r) => (r.id === q.target ? { ...r, health: "ejected" } : r))
            repsChanged = true
            replicasRef.current = reps
            const next = pick([q.target])
            if (next >= 0 && !q.retry) {
              out.push({ id: nextId.current++, target: next, start: q.start, legStart: t - TRAVEL_MS * 0.35, retry: true })
              lines.push(`req ${q.id}: replica-${q.target + 1} failed, ejected. Retry → replica-${next + 1}.`)
            } else {
              lines.push(`req ${q.id}: replica-${q.target + 1} failed, no replica left to retry.`)
            }
          } else {
            out.push({ ...q, done: t })
            if (q.retry) lines.push(`req ${q.id}: served by replica-${q.target + 1} after one retry. Zero loss.`)
          }
        } else if ((q.done && t - q.done > 400) || (q.failed && t - q.failed > 500)) {
          reqsChanged = true
        } else {
          out.push(q)
        }
      }
      if (reqsChanged) rs = out
      replicasRef.current = reps
      reqsRef.current = rs

      // Spawn new traffic.
      if (t - lastSpawn.current > SPAWN_MS) {
        lastSpawn.current = t
        const target = pick([])
        if (target >= 0) {
          rs = [...rs, { id: nextId.current++, target, start: t, legStart: t, retry: false }]
          reqsRef.current = rs
          reqsChanged = true
        }
      }

      if (repsChanged) setReplicas(reps)
      if (reqsChanged) setReqs(rs)
      lines.forEach(push)

      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reduced, visible])

  const toggle = (id: number) => {
    const r = replicas[id]
    if (r.killed) {
      setReplicas((reps) => reps.map((x) => (x.id === id ? { ...x, killed: false, revivedAt: performance.now() } : x)))
      push(`replica-${id + 1} revived. Waiting for healthy probes before it rejoins.`)
    } else {
      setReplicas((reps) => reps.map((x) => (x.id === id ? { ...x, killed: true } : x)))
      push(`replica-${id + 1} killed. Its health check hasn't noticed yet.`)
    }
  }

  const position = (q: Req) => {
    const p = Math.min(1, (now - q.legStart) / TRAVEL_MS)
    const ty = replicaY(q.target)
    // First 35% of the trip is client → router, the rest router → replica.
    if (p < 0.35) {
      const k = p / 0.35
      return { x: lerp(CLIENT.x, ROUTER.x, k), y: lerp(CLIENT.y, ROUTER.y, k) }
    }
    const k = (p - 0.35) / 0.65
    const e = 1 - Math.pow(1 - k, 2)
    return { x: lerp(ROUTER.x, REPLICA_X - 34, e), y: lerp(ROUTER.y, ty, e) }
  }

  const load = (id: number) => reqs.filter((q) => q.target === id && !q.done && !q.failed).length
  // SVG labels scale up in the compact preview, which renders at roughly half size.
  const fs = (px: number) => (compact ? px * 1.4 : px)

  return (
    <div ref={box} className="flex flex-col gap-4">
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="h-auto w-full"
        role="img"
        aria-label="Requests flow from a client through the whyrouted router to four replicas. A failed replica is ejected and its request retried on another."
      >
        {/* links */}
        <line x1={CLIENT.x} y1={CLIENT.y} x2={ROUTER.x} y2={ROUTER.y} stroke="var(--border)" strokeWidth={2} />
        {replicas.map((r) => (
          <path
            key={r.id}
            d={`M${ROUTER.x} ${ROUTER.y} C ${ROUTER.x + 120} ${ROUTER.y}, ${REPLICA_X - 150} ${replicaY(r.id)}, ${REPLICA_X - 34} ${replicaY(r.id)}`}
            fill="none"
            stroke={r.health === "healthy" ? "var(--border)" : "var(--destructive)"}
            strokeOpacity={r.health === "healthy" ? 1 : 0.35}
            strokeDasharray={r.health === "healthy" ? undefined : "4 6"}
            strokeWidth={2}
          />
        ))}

        {/* client */}
        <g>
          <circle cx={CLIENT.x} cy={CLIENT.y} r={18} fill="var(--card)" stroke="var(--border)" strokeWidth={1.5} />
          <text x={CLIENT.x} y={CLIENT.y + 40} textAnchor="middle" className="fill-muted-foreground " fontSize={fs(12)}>
            client
          </text>
        </g>

        {/* router */}
        <g>
          <rect x={ROUTER.x - 46} y={ROUTER.y - 28} width={92} height={56} rx={16} fill="var(--card)" stroke="var(--primary)" strokeWidth={1.5} />
          <text x={ROUTER.x} y={ROUTER.y - 2} textAnchor="middle" className="fill-foreground  font-semibold" fontSize={fs(13)}>
            router
          </text>
          <text x={ROUTER.x} y={ROUTER.y + 15} textAnchor="middle" className="fill-muted-foreground " fontSize={fs(10)}>
            least-loaded
          </text>
        </g>

        {/* replicas */}
        {replicas.map((r) => {
          const y = replicaY(r.id)
          const bad = r.killed || r.health === "ejected"
          return (
            <g key={r.id}>
              <rect
                x={REPLICA_X - 34}
                y={y - 22}
                width={compact ? 114 : 96}
                height={44}
                rx={12}
                fill="var(--card)"
                stroke={bad ? "var(--destructive)" : "var(--border)"}
                strokeWidth={1.5}
              />
              <circle cx={REPLICA_X - 18} cy={y} r={4} fill={bad ? "var(--destructive)" : "oklch(0.7 0.17 150)"} />
              <text x={REPLICA_X - 8} y={y - 3} className="fill-foreground  font-medium" fontSize={fs(11)}>
                replica-{r.id + 1}
              </text>
              <text x={REPLICA_X - 8} y={y + 12} className="fill-muted-foreground " fontSize={fs(10)}>
                {r.killed ? "failing" : r.health === "ejected" ? "recovering" : `${load(r.id)} in flight`}
              </text>
            </g>
          )
        })}

        {/* requests */}
        {!reduced &&
          reqs.map((q) => {
            const { x, y } = position(q)
            const failing = Boolean(q.failed)
            const fade = q.done ? Math.max(0, 1 - (now - q.done) / 400) : failing ? Math.max(0, 1 - (now - (q.failed ?? 0)) / 500) : 1
            return (
              <circle
                key={q.id}
                cx={x}
                cy={y}
                r={failing ? 7 : 5}
                fill={failing ? "var(--destructive)" : q.retry ? "oklch(0.75 0.15 75)" : "var(--primary)"}
                opacity={fade}
              />
            )
          })}
      </svg>

      {!compact ? (
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex flex-wrap gap-2" role="group" aria-label="Fail or revive a replica">
            {replicas.map((r) => (
              <button
                key={r.id}
                type="button"
                onClick={() => toggle(r.id)}
                aria-pressed={r.killed}
                className={cn(
                  "rounded-full border px-3.5 py-1.5 text-sm transition-colors duration-200 ease-apple",
                  r.killed
                    ? "border-destructive/50 bg-destructive/10 text-destructive"
                    : "border-border bg-background text-foreground/80 hover:border-primary hover:text-primary",
                )}
              >
                {r.killed ? `Revive replica-${r.id + 1}` : `Fail replica-${r.id + 1}`}
              </button>
            ))}
          </div>
          <ul className="flex min-h-[7.5rem] flex-col gap-1 text-[13px] leading-snug text-muted-foreground sm:max-w-xs" aria-live="polite">
            {log.map((line, i) => (
              <li key={`${line}-${i}`} className={i === 0 ? "text-foreground/85" : undefined}>
                {line}
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      {!compact ? (
        <div className="flex flex-wrap gap-x-5 gap-y-1 text-xs text-muted-foreground">
          <Legend color="var(--primary)" label="request" />
          <Legend color="oklch(0.75 0.15 75)" label="retried request" />
          <Legend color="var(--destructive)" label="failed attempt" />
          {reduced ? <span>Animation is off because your system asks for reduced motion.</span> : null}
        </div>
      ) : null}
    </div>
  )
}

function Legend({ color, label }: { color: string; label: string }) {
  return (
    <span className="inline-flex items-center gap-1.5">
      <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: color }} />
      {label}
    </span>
  )
}

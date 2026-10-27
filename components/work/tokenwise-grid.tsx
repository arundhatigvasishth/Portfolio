"use client"

import { useState } from "react"

// ISO New England hourly demand, June 24, 2025 (EIA API v2, respondent ISNE),
// copied from data/grid/june24.json in the Tokenwise repository.
const LOAD_MW = [
  19715, 18868, 17857, 16925, 16730, 16630, 16761, 17596, 18450, 18571, 18747, 19375, 20158, 20975, 21890, 22765,
  23717, 24817, 25433, 25898, 25673, 25233, 24144, 22366,
]

// The grid agent's thresholds.
const GREEN_MAX = 20000
const YELLOW_MAX = 23500

const levels = [
  { key: "green", label: "Green", color: "oklch(0.68 0.15 150)", test: (v: number) => v <= GREEN_MAX },
  { key: "yellow", label: "Yellow", color: "oklch(0.78 0.15 85)", test: (v: number) => v > GREEN_MAX && v <= YELLOW_MAX },
  { key: "red", label: "Red", color: "oklch(0.62 0.2 27)", test: (v: number) => v > YELLOW_MAX },
]
const levelOf = (v: number) => levels.find((l) => l.test(v))!

const W = 640
const H = 280
const PAD = { l: 52, r: 16, t: 20, b: 34 }
const MIN = 15000
const MAX = 27000

const x = (h: number) => PAD.l + (h / 23) * (W - PAD.l - PAD.r)
const y = (v: number) => PAD.t + (1 - (v - MIN) / (MAX - MIN)) * (H - PAD.t - PAD.b)
const hourLabel = (h: number) => (h === 0 ? "12 AM" : h < 12 ? `${h} AM` : h === 12 ? "12 PM" : `${h - 12} PM`)

export function TokenwiseGrid({ compact = false }: { compact?: boolean }) {
  const [hover, setHover] = useState<number | null>(null)
  const peak = LOAD_MW.indexOf(Math.max(...LOAD_MW))
  const line = LOAD_MW.map((v, h) => `${h === 0 ? "M" : "L"}${x(h).toFixed(1)} ${y(v).toFixed(1)}`).join(" ")
  const area = `${line} L${x(23)} ${y(MIN)} L${x(0)} ${y(MIN)} Z`

  const onMove = (e: React.PointerEvent<SVGSVGElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const px = ((e.clientX - rect.left) / rect.width) * W
    const h = Math.round(((px - PAD.l) / (W - PAD.l - PAD.r)) * 23)
    setHover(Math.max(0, Math.min(23, h)))
  }

  return (
    <figure className="flex flex-col gap-3">
      <div className="relative">
        <svg
          viewBox={`0 0 ${W} ${H}`}
          className="h-auto w-full touch-none select-none"
          role="img"
          aria-label="New England electricity demand on June 24, 2025, rising from about 16,600 megawatts at dawn to a peak of 25,898 megawatts at 7 PM, crossing the yellow threshold around noon and the red threshold in the late afternoon."
          onPointerMove={compact ? undefined : onMove}
          onPointerLeave={() => setHover(null)}
        >
          <defs>
            <linearGradient id="tw-fill" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor="var(--primary)" stopOpacity="0.18" />
              <stop offset="100%" stopColor="var(--primary)" stopOpacity="0" />
            </linearGradient>
          </defs>

          {/* threshold bands */}
          <rect x={PAD.l} y={y(MAX)} width={W - PAD.l - PAD.r} height={y(YELLOW_MAX) - y(MAX)} fill={levels[2].color} opacity={0.08} />
          <rect x={PAD.l} y={y(YELLOW_MAX)} width={W - PAD.l - PAD.r} height={y(GREEN_MAX) - y(YELLOW_MAX)} fill={levels[1].color} opacity={0.08} />
          {[GREEN_MAX, YELLOW_MAX].map((v) => (
            <line key={v} x1={PAD.l} x2={W - PAD.r} y1={y(v)} y2={y(v)} stroke="var(--muted-foreground)" strokeOpacity={0.35} strokeDasharray="3 5" />
          ))}
          {!compact ? (
            <>
              {/* Labelled over the overnight trough, where the curve sits well below both lines. */}
              <text x={x(3)} y={y(YELLOW_MAX) - 6} className="fill-muted-foreground text-[10px]">
                red above 23,500 MW
              </text>
              <text x={x(3)} y={y(GREEN_MAX) - 6} className="fill-muted-foreground text-[10px]">
                yellow above 20,000 MW
              </text>
            </>
          ) : null}

          {/* axes */}
          {[16000, 20000, 24000].map((v) => (
            <text key={v} x={PAD.l - 8} y={y(v) + 3} textAnchor="end" className="fill-muted-foreground text-[10px] tabular-nums">
              {(v / 1000).toFixed(0)}k
            </text>
          ))}
          {[0, 6, 12, 18, 23].map((h) => (
            <text key={h} x={x(h)} y={H - 10} textAnchor="middle" className="fill-muted-foreground text-[10px]">
              {hourLabel(h)}
            </text>
          ))}

          <path d={area} fill="url(#tw-fill)" />
          <path d={line} fill="none" stroke="var(--foreground)" strokeOpacity={0.85} strokeWidth={2} strokeLinejoin="round" />

          {/* level markers along the curve */}
          {LOAD_MW.map((v, h) => (
            <circle key={h} cx={x(h)} cy={y(v)} r={compact ? 2.5 : 3.5} fill={levelOf(v).color} stroke="var(--card)" strokeWidth={1.5} />
          ))}

          {/* peak label */}
          <text x={x(peak)} y={y(LOAD_MW[peak]) - 12} textAnchor="middle" className="fill-foreground text-[11px] font-medium tabular-nums">
            25,898 MW peak
          </text>

          {hover !== null ? (
            <g pointerEvents="none">
              <line x1={x(hover)} x2={x(hover)} y1={PAD.t} y2={H - PAD.b} stroke="var(--foreground)" strokeOpacity={0.25} />
              <circle cx={x(hover)} cy={y(LOAD_MW[hover])} r={6} fill={levelOf(LOAD_MW[hover]).color} stroke="var(--card)" strokeWidth={2} />
            </g>
          ) : null}
        </svg>

        {hover !== null ? (
          <div
            className="pointer-events-none absolute top-2 rounded-xl border border-border bg-popover px-3 py-2 text-xs shadow-soft backdrop-blur"
            style={{ left: `${(x(hover) / W) * 100}%`, transform: hover > 16 ? "translateX(-105%)" : "translateX(8px)" }}
          >
            <p className="font-medium text-foreground">{hourLabel(hover)}</p>
            <p className="tabular-nums text-muted-foreground">{LOAD_MW[hover].toLocaleString()} MW</p>
            <p className="text-muted-foreground">Grid level: {levelOf(LOAD_MW[hover]).label}</p>
          </div>
        ) : null}
      </div>

      {!compact ? (
        <>
          <div className="flex flex-wrap gap-x-5 gap-y-1 text-xs text-muted-foreground">
            {levels.map((l) => (
              <span key={l.key} className="inline-flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: l.color }} />
                {l.label}
              </span>
            ))}
          </div>
          <details className="text-sm text-muted-foreground">
            <summary className="cursor-pointer select-none text-foreground/80 hover:text-primary">Show the data</summary>
            <table className="mt-3 w-full max-w-sm text-left text-xs tabular-nums">
              <thead>
                <tr className="text-foreground/80">
                  <th className="py-1 font-medium">Hour</th>
                  <th className="py-1 font-medium">Demand (MW)</th>
                  <th className="py-1 font-medium">Level</th>
                </tr>
              </thead>
              <tbody>
                {LOAD_MW.map((v, h) => (
                  <tr key={h} className="border-t border-border">
                    <td className="py-1">{hourLabel(h)}</td>
                    <td className="py-1">{v.toLocaleString()}</td>
                    <td className="py-1">{levelOf(v).label}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </details>
        </>
      ) : null}
    </figure>
  )
}

import { ImageResponse } from "next/og"

export const ogSize = { width: 1200, height: 630 }

// One social card layout for the site and every case study: plain type on
// near-black, with a small system of project planets echoing the hero.
const PLANETS = ["#22d3ee", "#fb7185", "#a78bfa", "#60a5fa", "#f59e0b", "#34d399"]

export function renderOg({ eyebrow, title, subtitle }: { eyebrow: string; title: string; subtitle: string }) {
  const cx = 960
  const cy = 190
  const sky = []
  for (let i = 0; i < 60; i++) {
    const x = (i * 197) % 1200
    const y = (i * 113) % 630
    const r = i % 7 === 0 ? 3 : 2
    sky.push(
      <div key={`s${i}`} style={{ position: "absolute", left: x, top: y, width: r, height: r, borderRadius: 999, background: "#ffffff", opacity: 0.25 + (i % 5) * 0.1 }} />,
    )
  }
  const system = PLANETS.flatMap((color, i) => {
    const rx = 60 + i * 34
    const ry = rx * 0.38
    const a = i * 2.4
    const size = 12 + (i % 3) * 4
    return [
      <div key={`o${i}`} style={{ position: "absolute", left: cx - rx, top: cy - ry, width: rx * 2, height: ry * 2, borderRadius: "50%", border: "1.5px solid #2c2c2e" }} />,
      <div
        key={`p${i}`}
        style={{ position: "absolute", left: cx + Math.cos(a) * rx - size / 2, top: cy + Math.sin(a) * ry - size / 2, width: size, height: size, borderRadius: 999, background: color }}
      />,
    ]
  })
  const star = <div key="star" style={{ position: "absolute", left: cx - 18, top: cy - 18, width: 36, height: 36, borderRadius: 999, background: "#fff4e0", boxShadow: "0 0 40px 12px rgba(255,213,154,0.45)" }} />

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-end",
          padding: 72,
          background: "#111113",
          color: "#f5f5f7",
          fontFamily: "sans-serif",
          position: "relative",
        }}
      >
        {sky}
        {system}
        {star}
        <div style={{ fontSize: 26, color: "#a1a1a6", marginBottom: 18 }}>{eyebrow}</div>
        <div style={{ fontSize: 76, fontWeight: 700, letterSpacing: -2.5, lineHeight: 1.02, maxWidth: 980 }}>{title}</div>
        <div style={{ fontSize: 32, color: "#d1d1d6", marginTop: 22, lineHeight: 1.25, maxWidth: 940 }}>{subtitle}</div>
      </div>
    ),
    ogSize,
  )
}

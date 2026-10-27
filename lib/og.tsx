import { ImageResponse } from "next/og"

export const ogSize = { width: 1200, height: 630 }

// One social card layout for the site and every case study: plain type on
// near-black, with the lattice dots echoing the site's 3D field.
export function renderOg({ eyebrow, title, subtitle }: { eyebrow: string; title: string; subtitle: string }) {
  const dots = []
  for (let y = 0; y < 7; y++) {
    for (let x = 0; x < 9; x++) {
      const lit = (x - 6) ** 2 + (y - 2) ** 2 < 6
      dots.push(
        <div
          key={`${x}-${y}`}
          style={{
            position: "absolute",
            left: 760 + x * 44,
            top: 70 + y * 44,
            width: lit ? 14 : 10,
            height: lit ? 14 : 10,
            borderRadius: 999,
            background: lit ? "#4fa3ff" : "#3a3a3c",
          }}
        />,
      )
    }
  }

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
        {dots}
        <div style={{ fontSize: 26, color: "#a1a1a6", marginBottom: 18 }}>{eyebrow}</div>
        <div style={{ fontSize: 76, fontWeight: 700, letterSpacing: -2.5, lineHeight: 1.02, maxWidth: 980 }}>{title}</div>
        <div style={{ fontSize: 32, color: "#d1d1d6", marginTop: 22, lineHeight: 1.25, maxWidth: 940 }}>{subtitle}</div>
      </div>
    ),
    ogSize,
  )
}

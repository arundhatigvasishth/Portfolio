import type { SVGProps } from "react"

type IconProps = SVGProps<SVGSVGElement>

const base = {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.5,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
}

// EOHHS: regulatory / government AI — a shield holding a document with a chat cursor.
export function IconRegulatory(props: IconProps) {
  return (
    <svg aria-hidden="true" {...base} {...props}>
      <path d="M12 3l7 2.5v5c0 4.2-2.9 7.4-7 8.5-4.1-1.1-7-4.3-7-8.5v-5L12 3z" />
      <path d="M9 9h6M9 12h6M9 15h3" />
    </svg>
  )
}

// IISc: medical imaging research — a scan frame with a pulse line and target reticle.
export function IconImaging(props: IconProps) {
  return (
    <svg aria-hidden="true" {...base} {...props}>
      <path d="M4 8V6a2 2 0 0 1 2-2h2M16 4h2a2 2 0 0 1 2 2v2M20 16v2a2 2 0 0 1-2 2h-2M8 20H6a2 2 0 0 1-2-2v-2" />
      <path d="M5 12h3l1.5-3 2 6 1.5-3h6" />
    </svg>
  )
}

// FingerSolve: a raised hand / gesture glyph.
export function IconGesture(props: IconProps) {
  return (
    <svg aria-hidden="true" {...base} {...props}>
      <path d="M9 11V5.5a1.5 1.5 0 0 1 3 0V10" />
      <path d="M12 10V4.5a1.5 1.5 0 0 1 3 0V10" />
      <path d="M15 10.5V6.5a1.5 1.5 0 0 1 3 0V14a6 6 0 0 1-6 6h-1.5a5 5 0 0 1-4-2l-2.2-3a1.5 1.5 0 0 1 2.4-1.8L9 15V7.5a1.5 1.5 0 0 1 3 0" />
    </svg>
  )
}

// MedEcho: echoing pulse waves emanating outward.
export function IconEcho(props: IconProps) {
  return (
    <svg aria-hidden="true" {...base} {...props}>
      <path d="M3 12h2.5L7 8l3 8 2-11 2 14 1.5-9 1 4H21" />
    </svg>
  )
}

// MAIF: candlestick chart / arbitrage between two markets.
export function IconArbitrage(props: IconProps) {
  return (
    <svg aria-hidden="true" {...base} {...props}>
      <path d="M6 4v3M6 15v5M6 7h0a0 0 0 0 1 0 0" />
      <rect x="4.5" y="7" width="3" height="8" rx="0.5" />
      <path d="M18 4v4M18 16v4" />
      <rect x="16.5" y="8" width="3" height="8" rx="0.5" />
      <path d="M9 6l6 12" opacity="0.55" />
    </svg>
  )
}

// EcoForecast: a leaf resting inside a cloud.
export function IconEco(props: IconProps) {
  return (
    <svg aria-hidden="true" {...base} {...props}>
      <path d="M7 18h9a3.5 3.5 0 0 0 .5-6.96A5 5 0 0 0 7.2 10.2 3.4 3.4 0 0 0 7 18z" />
      <path d="M9.5 14.5c1.2-2.6 3.2-3.6 5-3.8-.3 2-1.4 3.9-3.8 4.1" />
    </svg>
  )
}

// Brand marks (not shipped in this lucide version).
export function IconGithub(props: IconProps) {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M12 2C6.48 2 2 6.58 2 12.25c0 4.53 2.87 8.37 6.84 9.73.5.09.68-.22.68-.49 0-.24-.01-.87-.01-1.71-2.78.62-3.37-1.37-3.37-1.37-.45-1.18-1.11-1.49-1.11-1.49-.91-.64.07-.62.07-.62 1 .07 1.53 1.06 1.53 1.06.89 1.56 2.34 1.11 2.91.85.09-.66.35-1.11.63-1.37-2.22-.26-4.55-1.14-4.55-5.06 0-1.12.39-2.03 1.03-2.75-.1-.26-.45-1.3.1-2.71 0 0 .84-.28 2.75 1.05a9.35 9.35 0 0 1 5 0c1.91-1.33 2.75-1.05 2.75-1.05.55 1.41.2 2.45.1 2.71.64.72 1.03 1.63 1.03 2.75 0 3.93-2.34 4.79-4.57 5.05.36.32.68.94.68 1.9 0 1.37-.01 2.48-.01 2.82 0 .27.18.59.69.49A10.02 10.02 0 0 0 22 12.25C22 6.58 17.52 2 12 2z" />
    </svg>
  )
}

export function IconLinkedin(props: IconProps) {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M4.98 3.5A2.5 2.5 0 1 1 5 8.5a2.5 2.5 0 0 1-.02-5zM3 9h4v12H3zM9 9h3.8v1.71h.05c.53-.95 1.83-1.96 3.77-1.96 4.03 0 4.78 2.5 4.78 5.75V21h-4v-5.15c0-1.23-.02-2.81-1.75-2.81-1.75 0-2.02 1.34-2.02 2.72V21H9z" />
    </svg>
  )
}

export const badgeIcons = {
  eohhs: IconRegulatory,
  iisc: IconImaging,
  fingersolve: IconGesture,
  medecho: IconEcho,
  maif: IconArbitrage,
  ecoforecast: IconEco,
} as const

export type BadgeIconKey = keyof typeof badgeIcons

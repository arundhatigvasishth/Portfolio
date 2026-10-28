// Each project is its own planet: invented, not Mercury or Venus. Colors are
// picked to sit together on near-black and on white. Orbits follow the order
// the work happened, oldest closest to the star.
export type Planet = { color: string; size: number; ring?: boolean; moon?: boolean }

export const planets: Record<string, Planet> = {
  fingersolve: { color: "#22d3ee", size: 0.07 },
  medecho: { color: "#fb7185", size: 0.075, moon: true },
  tracify: { color: "#a78bfa", size: 0.09 },
  whyrouted: { color: "#60a5fa", size: 0.095, ring: true },
  knowyork: { color: "#f59e0b", size: 0.085, moon: true },
  tokenwise: { color: "#34d399", size: 0.1, ring: true },
}

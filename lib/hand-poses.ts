// Shared by the 3D hand on the FingerSolve case study and the 2D quiz preview.

// MediaPipe Hands' 21 landmarks and the bones that connect them.
// 0 wrist · 1–4 thumb · 5–8 index · 9–12 middle · 13–16 ring · 17–20 pinky.
export const BONES: [number, number][] = [
  [0, 1], [1, 2], [2, 3], [3, 4],
  [0, 5], [5, 6], [6, 7], [7, 8],
  [5, 9], [9, 10], [10, 11], [11, 12],
  [9, 13], [13, 14], [14, 15], [15, 16],
  [13, 17], [0, 17], [17, 18], [18, 19], [19, 20],
]

export type V = [number, number, number]

// An open right palm, hand-placed. Illustrative, not recorded data.
export const OPEN: V[] = [
  [0, 0, 0],
  [-0.35, 0.25, 0.05], [-0.6, 0.5, 0.08], [-0.8, 0.72, 0.1], [-0.95, 0.92, 0.12],
  [-0.22, 0.95, 0], [-0.27, 1.35, 0.02], [-0.3, 1.6, 0.03], [-0.32, 1.82, 0.04],
  [0.02, 1.0, 0], [0.02, 1.45, 0.02], [0.02, 1.72, 0.03], [0.02, 1.95, 0.04],
  [0.25, 0.93, 0], [0.29, 1.33, 0.02], [0.31, 1.58, 0.03], [0.33, 1.78, 0.04],
  [0.45, 0.8, 0], [0.55, 1.1, 0.02], [0.6, 1.3, 0.03], [0.65, 1.48, 0.04],
]

const FINGERS = { thumb: [1, 2, 3, 4], index: [5, 6, 7, 8], middle: [9, 10, 11, 12], ring: [13, 14, 15, 16], pinky: [17, 18, 19, 20] }
type Finger = keyof typeof FINGERS

export function pose(up: Finger[]): V[] {
  const p = OPEN.map((v) => [...v] as V)
  for (const [name, idx] of Object.entries(FINGERS) as [Finger, number[]][]) {
    if (up.includes(name)) continue
    if (name === "thumb") {
      p[2] = [-0.35, 0.45, 0.2]
      p[3] = [-0.15, 0.55, 0.3]
      p[4] = [0.0, 0.55, 0.32]
      continue
    }
    const b = OPEN[idx[0]]
    p[idx[1]] = [b[0], b[1] + 0.22, 0.24]
    p[idx[2]] = [b[0], b[1] + 0.06, 0.4]
    p[idx[3]] = [b[0], b[1] - 0.1, 0.3]
  }
  return p
}

export const GESTURES: { label: string; points: V[] }[] = [
  { label: "1", points: pose(["index"]) },
  { label: "2", points: pose(["index", "middle"]) },
  { label: "3", points: pose(["index", "middle", "ring"]) },
  { label: "4", points: pose(["index", "middle", "ring", "pinky"]) },
  { label: "5", points: pose(["thumb", "index", "middle", "ring", "pinky"]) },
]

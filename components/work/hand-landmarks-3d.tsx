"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import { Canvas, useFrame } from "@react-three/fiber"
import { OrbitControls } from "@react-three/drei"
import * as THREE from "three"
import { useTheme } from "next-themes"
import { usePrefersReducedMotion } from "@/lib/use-reduced-motion"

// MediaPipe Hands' 21 landmarks and the bones that connect them.
// 0 wrist · 1–4 thumb · 5–8 index · 9–12 middle · 13–16 ring · 17–20 pinky.
const BONES: [number, number][] = [
  [0, 1], [1, 2], [2, 3], [3, 4],
  [0, 5], [5, 6], [6, 7], [7, 8],
  [5, 9], [9, 10], [10, 11], [11, 12],
  [9, 13], [13, 14], [14, 15], [15, 16],
  [13, 17], [0, 17], [17, 18], [18, 19], [19, 20],
]

type V = [number, number, number]

// An open right palm, hand-placed. Illustrative, not recorded data.
const OPEN: V[] = [
  [0, 0, 0],
  [-0.35, 0.25, 0.05], [-0.6, 0.5, 0.08], [-0.8, 0.72, 0.1], [-0.95, 0.92, 0.12],
  [-0.22, 0.95, 0], [-0.27, 1.35, 0.02], [-0.3, 1.6, 0.03], [-0.32, 1.82, 0.04],
  [0.02, 1.0, 0], [0.02, 1.45, 0.02], [0.02, 1.72, 0.03], [0.02, 1.95, 0.04],
  [0.25, 0.93, 0], [0.29, 1.33, 0.02], [0.31, 1.58, 0.03], [0.33, 1.78, 0.04],
  [0.45, 0.8, 0], [0.55, 1.1, 0.02], [0.6, 1.3, 0.03], [0.65, 1.48, 0.04],
]

const FINGERS = { thumb: [1, 2, 3, 4], index: [5, 6, 7, 8], middle: [9, 10, 11, 12], ring: [13, 14, 15, 16], pinky: [17, 18, 19, 20] }
type Finger = keyof typeof FINGERS

function pose(up: Finger[]): V[] {
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

const GESTURES: { label: string; points: V[] }[] = [
  { label: "1", points: pose(["index"]) },
  { label: "2", points: pose(["index", "middle"]) },
  { label: "3", points: pose(["index", "middle", "ring"]) },
  { label: "4", points: pose(["index", "middle", "ring", "pinky"]) },
  { label: "5", points: pose(["thumb", "index", "middle", "ring", "pinky"]) },
]

function Hand({ target, reduced }: { target: V[]; reduced: boolean }) {
  const { resolvedTheme } = useTheme()
  const dark = resolvedTheme === "dark"
  const group = useRef<THREE.Group>(null)
  const joints = useRef<(THREE.Mesh | null)[]>([])
  const current = useRef(target.map((v) => new THREE.Vector3(...v)))
  const geometry = useMemo(() => {
    const g = new THREE.BufferGeometry()
    g.setAttribute("position", new THREE.BufferAttribute(new Float32Array(BONES.length * 6), 3))
    return g
  }, [])

  useFrame((_, delta) => {
    const k = reduced ? 1 : 1 - Math.pow(0.002, delta)
    const pos = geometry.getAttribute("position") as THREE.BufferAttribute
    current.current.forEach((v, i) => {
      v.lerp(new THREE.Vector3(...target[i]), k)
      joints.current[i]?.position.copy(v)
    })
    BONES.forEach(([a, b], i) => {
      const va = current.current[a]
      const vb = current.current[b]
      pos.setXYZ(i * 2, va.x, va.y, va.z)
      pos.setXYZ(i * 2 + 1, vb.x, vb.y, vb.z)
    })
    pos.needsUpdate = true
  })

  const tip = new Set([4, 8, 12, 16, 20])

  return (
    <group ref={group} position={[0.1, -0.95, 0]}>
      <lineSegments geometry={geometry}>
        <lineBasicMaterial color={dark ? "#8e8e93" : "#aeaeb2"} />
      </lineSegments>
      {OPEN.map((_, i) => (
        <mesh key={i} ref={(m) => { joints.current[i] = m }}>
          <sphereGeometry args={[i === 0 ? 0.075 : tip.has(i) ? 0.06 : 0.045, 20, 20]} />
          <meshStandardMaterial
            color={tip.has(i) ? (dark ? "#4fa3ff" : "#0071e3") : dark ? "#e5e5ea" : "#3a3a3c"}
            roughness={0.35}
            metalness={0.1}
          />
        </mesh>
      ))}
    </group>
  )
}

export function HandLandmarks3D() {
  const reduced = usePrefersReducedMotion()
  const [index, setIndex] = useState(2)

  useEffect(() => {
    if (reduced) return
    const id = window.setInterval(() => setIndex((i) => (i + 1) % GESTURES.length), 2200)
    return () => window.clearInterval(id)
  }, [reduced])

  const gesture = GESTURES[index]

  return (
    <div className="relative">
      <div className="aspect-[4/3] max-h-[520px] w-full cursor-grab active:cursor-grabbing" aria-hidden="true">
        <Canvas camera={{ position: [0, 0, 3.6], fov: 40 }} dpr={[1, 2]}>
          <ambientLight intensity={0.7} />
          <directionalLight position={[2, 3, 4]} intensity={1.2} />
          <directionalLight position={[-3, -1, 2]} intensity={0.4} color="#9ecbff" />
          <Hand target={gesture.points} reduced={reduced} />
          <OrbitControls enableZoom={false} enablePan={false} autoRotate={!reduced} autoRotateSpeed={0.8} />
        </Canvas>
      </div>
      <div className="pointer-events-none absolute left-4 top-4 rounded-2xl border border-border bg-popover px-3.5 py-2 shadow-soft backdrop-blur">
        <p className="text-[11px] uppercase tracking-[0.12em] text-muted-foreground">Gesture</p>
        <p className="text-2xl font-semibold tabular-nums text-foreground" aria-live="polite">
          {gesture.label}
        </p>
      </div>
      <div className="mt-3 flex flex-wrap gap-2" role="group" aria-label="Choose a gesture">
        {GESTURES.map((g, i) => (
          <button
            key={g.label}
            type="button"
            onClick={() => setIndex(i)}
            aria-pressed={i === index}
            className={
              i === index
                ? "h-9 w-9 rounded-full bg-primary text-sm font-medium text-primary-foreground"
                : "h-9 w-9 rounded-full border border-border bg-background text-sm text-foreground/80 transition-colors hover:border-primary hover:text-primary"
            }
          >
            {g.label}
          </button>
        ))}
      </div>
    </div>
  )
}

"use client"

import { Canvas, useFrame, useThree } from "@react-three/fiber"
import { useEffect, useMemo, useRef, useState } from "react"
import * as THREE from "three"
import { usePrefersReducedMotion } from "@/lib/use-reduced-motion"

// Deep field behind the whole site. Stars sit at different depths, so
// scrolling slides near ones past faster than far ones; faint nebulae tint
// the sky, the camera leans toward the cursor, and now and then a meteor
// crosses.

const FAR = 2200
const NEBULAE: { at: [number, number, number]; size: number; color: string; opacity: number }[] = [
  { at: [-9, 5, -24], size: 22, color: "#5b3fd6", opacity: 0.16 },
  { at: [10, -4, -26], size: 26, color: "#1e6fd9", opacity: 0.14 },
  { at: [3, -22, -24], size: 24, color: "#0f9b8e", opacity: 0.1 },
  { at: [-8, -38, -25], size: 26, color: "#9b3fd6", opacity: 0.12 },
]
const NEAR = 260

function dotTexture() {
  const c = document.createElement("canvas")
  c.width = c.height = 64
  const g = c.getContext("2d")!
  const grad = g.createRadialGradient(32, 32, 0, 32, 32, 32)
  grad.addColorStop(0, "rgba(255,255,255,1)")
  grad.addColorStop(0.25, "rgba(255,255,255,0.8)")
  grad.addColorStop(1, "rgba(255,255,255,0)")
  g.fillStyle = grad
  g.fillRect(0, 0, 64, 64)
  return new THREE.CanvasTexture(c)
}

// Seeded so the sky is the same on every visit.
function rng(seed: number) {
  return () => {
    seed = (seed * 16807) % 2147483647
    return (seed - 1) / 2147483646
  }
}

function layer(count: number, seed: number, zMin: number, zMax: number, tints: THREE.Color[]) {
  const r = rng(seed)
  const pos = new Float32Array(count * 3)
  const col = new Float32Array(count * 3)
  for (let i = 0; i < count; i++) {
    pos[i * 3] = (r() - 0.5) * 34
    pos[i * 3 + 1] = (r() - 0.5) * 60 - 14
    pos[i * 3 + 2] = zMin + r() * (zMax - zMin)
    const c = tints[Math.floor(r() * tints.length)]
    const dim = 0.45 + r() * 0.55
    col[i * 3] = c.r * dim
    col[i * 3 + 1] = c.g * dim
    col[i * 3 + 2] = c.b * dim
  }
  const geo = new THREE.BufferGeometry()
  geo.setAttribute("position", new THREE.BufferAttribute(pos, 3))
  geo.setAttribute("color", new THREE.BufferAttribute(col, 3))
  return geo
}

function Sky({ reduced }: { reduced: boolean }) {
  const tex = useMemo(dotTexture, [])
  const tints = useMemo(() => ["#ffffff", "#cfe3ff", "#9ecbff", "#ffe9c7"].map((c) => new THREE.Color(c)), [])
  const far = useMemo(() => layer(FAR, 7, -26, -8, tints), [tints])
  const near = useMemo(() => layer(NEAR, 19, -7, 0, tints), [tints])
  const blending = THREE.AdditiveBlending

  const field = useRef<THREE.Group>(null)
  const nearMat = useRef<THREE.PointsMaterial>(null)
  const meteor = useRef<THREE.Mesh>(null)
  const next = useRef(4)
  const flight = useRef({ start: -10, from: new THREE.Vector3(), dir: new THREE.Vector3() })
  const scroll = useRef(0)
  const pointer = useRef({ x: 0, y: 0 })
  const { camera } = useThree()

  useEffect(() => {
    const onScroll = () => (scroll.current = window.scrollY)
    const onMove = (e: PointerEvent) => {
      pointer.current = { x: (e.clientX / window.innerWidth) * 2 - 1, y: (e.clientY / window.innerHeight) * 2 - 1 }
    }
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    window.addEventListener("pointermove", onMove, { passive: true })
    return () => {
      window.removeEventListener("scroll", onScroll)
      window.removeEventListener("pointermove", onMove)
    }
  }, [])

  useFrame((state) => {
    const t = state.clock.elapsedTime
    const g = field.current
    if (g) {
      // Scrolling lifts the field; depth turns that into parallax.
      g.position.y += (scroll.current * 0.0016 - g.position.y) * 0.12
      if (!reduced) g.rotation.z = t * 0.004
    }
    if (!reduced) {
      camera.rotation.y += (-pointer.current.x * 0.035 - camera.rotation.y) * 0.04
      camera.rotation.x += (-pointer.current.y * 0.025 - camera.rotation.x) * 0.04
    }
    if (nearMat.current) nearMat.current.opacity = 0.75 + Math.sin(t * 1.7) * 0.15

    // A meteor every so often, crossing the upper part of the view.
    const m = meteor.current
    if (!m || reduced) return
    const f = flight.current
    if (t > next.current) {
      next.current = t + 7 + Math.random() * 7
      f.start = t
      f.from.set(-4 + Math.random() * 10, 2.5 + Math.random() * 1.5, -4)
      f.dir.set(-1, -0.42, 0).normalize()
      m.rotation.z = Math.atan2(f.dir.y, f.dir.x)
    }
    const p = (t - f.start) / 0.9
    m.visible = p >= 0 && p <= 1
    if (m.visible) {
      m.position.copy(f.from).addScaledVector(f.dir, p * 7)
      ;(m.material as THREE.MeshBasicMaterial).opacity = Math.sin(p * Math.PI) * 0.9
    }
  })

  return (
    <>
      <group ref={field}>
        {NEBULAE.map((n, i) => (
          <sprite key={i} position={n.at} scale={n.size}>
            <spriteMaterial map={tex} color={n.color} transparent opacity={n.opacity} depthWrite={false} blending={blending} />
          </sprite>
        ))}
        <points geometry={far}>
          <pointsMaterial map={tex} size={0.09} sizeAttenuation vertexColors transparent depthWrite={false} blending={blending} opacity={0.9} />
        </points>
        <points geometry={near}>
          <pointsMaterial ref={nearMat} map={tex} size={0.07} sizeAttenuation vertexColors transparent depthWrite={false} blending={blending} />
        </points>
      </group>
      <mesh ref={meteor} visible={false}>
        <planeGeometry args={[1.4, 0.012]} />
        <meshBasicMaterial color="#cfe3ff" transparent depthWrite={false} blending={blending} />
      </mesh>
    </>
  )
}

export function Starfield() {
  const reduced = usePrefersReducedMotion()
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])
  if (!mounted) return null

  return (
    <Canvas dpr={[1, 1.5]} gl={{ antialias: false, alpha: true }} camera={{ position: [0, 0, 6], fov: 50 }}>
      <Sky reduced={reduced} />
    </Canvas>
  )
}

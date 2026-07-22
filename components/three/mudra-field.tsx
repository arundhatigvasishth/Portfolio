"use client"

import { Canvas, useFrame, useThree } from "@react-three/fiber"
import { useMemo, useRef, useEffect, useState } from "react"
import * as THREE from "three"
import { useTheme } from "next-themes"
import { BEAT_SECONDS, pulse } from "@/lib/rhythm"
import { usePrefersReducedMotion } from "@/lib/use-reduced-motion"

// A lattice of nodes. The cursor behaves like a hand passing over the field:
// nearby nodes lift and light up in gold, as if a gesture is being read.
function Field({ reduced }: { reduced: boolean }) {
  const { resolvedTheme } = useTheme()
  const cols = 26
  const rows = 12
  const gapX = 0.52
  const gapY = 0.52
  const count = cols * rows

  const mesh = useRef<THREE.InstancedMesh>(null)
  const dummy = useMemo(() => new THREE.Object3D(), [])
  const target = useRef(new THREE.Vector3(999, 999, 0))
  const plane = useMemo(() => new THREE.Plane(new THREE.Vector3(0, 0, 1), 0), [])
  const hit = useMemo(() => new THREE.Vector3(), [])

  const colors = useMemo(() => {
    const dark = resolvedTheme === "dark"
    return {
      rest: new THREE.Color(dark ? "#4a2a33" : "#c2a488"),
      active: new THREE.Color(dark ? "#e6b352" : "#b9822a"),
    }
  }, [resolvedTheme])

  const positions = useMemo(() => {
    const arr: THREE.Vector3[] = []
    for (let y = 0; y < rows; y++) {
      for (let x = 0; x < cols; x++) {
        arr.push(new THREE.Vector3((x - (cols - 1) / 2) * gapX, (y - (rows - 1) / 2) * gapY, 0))
      }
    }
    return arr
  }, [cols, rows])

  const { raycaster, pointer, camera } = useThree()

  useFrame((state) => {
    const m = mesh.current
    if (!m) return
    raycaster.setFromCamera(pointer, camera)
    raycaster.ray.intersectPlane(plane, hit)
    if (hit) target.current.lerp(hit, 0.2)
    const t = state.clock.elapsedTime
    const tmp = new THREE.Color()

    for (let i = 0; i < count; i++) {
      const p = positions[i]
      const dx = p.x - target.current.x
      const dy = p.y - target.current.y
      const dist = Math.sqrt(dx * dx + dy * dy)
      const near = Math.max(0, 1 - dist / 2.2)
      // gentle rhythmic shimmer so the field is never fully still
      const beat = reduced ? 0 : pulse(((t / BEAT_SECONDS) + (p.x + p.y) * 0.08) % 1) * 0.12
      const lift = near * near
      dummy.position.set(p.x, p.y, lift * 1.4 + beat)
      const s = 0.05 + lift * 0.14 + beat * 0.2
      dummy.scale.setScalar(s)
      dummy.updateMatrix()
      m.setMatrixAt(i, dummy.matrix)
      tmp.copy(colors.rest).lerp(colors.active, Math.min(1, lift * 1.2 + beat))
      m.setColorAt(i, tmp)
    }
    m.instanceMatrix.needsUpdate = true
    if (m.instanceColor) m.instanceColor.needsUpdate = true
  })

  return (
    <instancedMesh ref={mesh} args={[undefined, undefined, count]}>
      <icosahedronGeometry args={[1, 0]} />
      <meshStandardMaterial roughness={0.4} metalness={0.3} />
    </instancedMesh>
  )
}

function Rig() {
  const { camera } = useThree()
  useEffect(() => {
    camera.position.set(0, 0, 8)
  }, [camera])
  return (
    <>
      <ambientLight intensity={0.7} />
      <pointLight position={[0, 0, 6]} intensity={30} color="#e6b352" />
    </>
  )
}

export function MudraField() {
  const reduced = usePrefersReducedMotion()
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])
  if (!mounted) return null

  return (
    <Canvas
      dpr={[1, 1.5]}
      gl={{ antialias: true, alpha: true }}
      camera={{ position: [0, 0, 8], fov: 45 }}
      eventSource={document.body}
      eventPrefix="client"
    >
      <Rig />
      <Field reduced={reduced} />
    </Canvas>
  )
}

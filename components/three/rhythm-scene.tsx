"use client"

import { Canvas, useFrame, useThree } from "@react-three/fiber"
import { Icosahedron, MeshDistortMaterial } from "@react-three/drei"
import { useMemo, useRef, useEffect, useState } from "react"
import * as THREE from "three"
import { useTheme } from "next-themes"
import { BEATS, BEAT_SECONDS, pulse } from "@/lib/rhythm"
import { usePrefersReducedMotion } from "@/lib/use-reduced-motion"

type Palette = {
  maroon: THREE.Color
  gold: THREE.Color
  soft: THREE.Color
  points: THREE.Color
}

function usePalette(): Palette {
  const { resolvedTheme } = useTheme()
  return useMemo(() => {
    const dark = resolvedTheme === "dark"
    return {
      maroon: new THREE.Color(dark ? "#8a2b3d" : "#7a2233"),
      gold: new THREE.Color(dark ? "#e0ad4a" : "#c99326"),
      soft: new THREE.Color(dark ? "#3a1f2a" : "#c9a98f"),
      points: new THREE.Color(dark ? "#e0ad4a" : "#8a5a2b"),
    }
  }, [resolvedTheme])
}

// The taal ring: 16 beads on a circle. A highlight sweeps around one beat at a
// time; each bead swells on its beat and rings out, like a struck sam.
function TaalRing({ palette, reduced }: { palette: Palette; reduced: boolean }) {
  const mesh = useRef<THREE.InstancedMesh>(null)
  const dummy = useMemo(() => new THREE.Object3D(), [])
  const radius = 2.35

  const positions = useMemo(
    () =>
      Array.from({ length: BEATS }, (_, i) => {
        const a = (i / BEATS) * Math.PI * 2 - Math.PI / 2
        return new THREE.Vector3(Math.cos(a) * radius, Math.sin(a) * radius, 0)
      }),
    [],
  )

  useEffect(() => {
    if (!mesh.current) return
    for (let i = 0; i < BEATS; i++) {
      mesh.current.setColorAt(i, i === 0 ? palette.gold : palette.maroon)
    }
    if (mesh.current.instanceColor) mesh.current.instanceColor.needsUpdate = true
  }, [palette])

  useFrame((state) => {
    const m = mesh.current
    if (!m) return
    const t = reduced ? 0 : state.clock.elapsedTime
    const head = (t / BEAT_SECONDS) % BEATS
    const tmp = new THREE.Color()

    for (let i = 0; i < BEATS; i++) {
      // circular distance from the sweeping head to this beat
      let d = i - head
      d = ((d % BEATS) + BEATS) % BEATS
      const dist = Math.min(d, BEATS - d)
      const energy = reduced ? (i === 0 ? 1 : 0.15) : pulse(dist / 2)

      const p = positions[i]
      const base = i % 4 === 0 ? 0.17 : 0.1 // sam and vibhaag accents larger
      const s = base + energy * 0.26
      dummy.position.set(p.x, p.y, energy * 0.6)
      dummy.scale.setScalar(s)
      dummy.updateMatrix()
      m.setMatrixAt(i, dummy.matrix)

      tmp.copy(palette.maroon).lerp(palette.gold, Math.min(1, energy * (i % 4 === 0 ? 1.3 : 1)))
      m.setColorAt(i, tmp)
    }
    m.instanceMatrix.needsUpdate = true
    if (m.instanceColor) m.instanceColor.needsUpdate = true
  })

  return (
    <instancedMesh ref={mesh} args={[undefined, undefined, BEATS]} castShadow={false}>
      <sphereGeometry args={[1, 24, 24]} />
      <meshStandardMaterial roughness={0.35} metalness={0.35} emissiveIntensity={0.4} />
    </instancedMesh>
  )
}

// A thin orbital thread connecting the beats, evoking the continuity of a cycle.
function CycleThread({ palette }: { palette: Palette }) {
  const points = useMemo(() => {
    const r = 2.35
    return Array.from({ length: 129 }, (_, i) => {
      const a = (i / 128) * Math.PI * 2 - Math.PI / 2
      return new THREE.Vector3(Math.cos(a) * r, Math.sin(a) * r, 0)
    })
  }, [])
  const geo = useMemo(() => new THREE.BufferGeometry().setFromPoints(points), [points])
  return (
    <line>
      {/* @ts-expect-error r3f accepts geometry as a prop */}
      <primitive object={geo} attach="geometry" />
      <lineBasicMaterial color={palette.soft} transparent opacity={0.5} />
    </line>
  )
}

// The morphing core: a distorted icosahedron that breathes with the beat and
// leans toward the cursor, a single gesture at the center of the stage.
function Core({ palette, reduced }: { palette: Palette; reduced: boolean }) {
  const group = useRef<THREE.Group>(null)
  const matRef = useRef<any>(null)

  useFrame((state, delta) => {
    const g = group.current
    if (!g) return
    if (!reduced) {
      g.rotation.y += delta * 0.25
      g.rotation.x += delta * 0.08
      const t = state.clock.elapsedTime
      const beatPhase = (t / BEAT_SECONDS) % 1
      const swell = 1 + pulse(beatPhase) * 0.09
      g.scale.setScalar(swell)
      if (matRef.current) matRef.current.distort = 0.28 + pulse(beatPhase) * 0.18
    }
    // lean toward pointer
    const px = state.pointer.x
    const py = state.pointer.y
    g.rotation.z += (px * 0.3 - g.rotation.z) * 0.05
    g.position.x += (px * 0.25 - g.position.x) * 0.05
    g.position.y += (py * 0.25 - g.position.y) * 0.05
  })

  return (
    <group ref={group}>
      <Icosahedron args={[0.95, 4]}>
        <MeshDistortMaterial
          ref={matRef}
          color={palette.maroon}
          emissive={palette.gold}
          emissiveIntensity={0.12}
          roughness={0.25}
          metalness={0.5}
          distort={0.3}
          speed={reduced ? 0 : 1.6}
        />
      </Icosahedron>
    </group>
  )
}

// Drifting particle field with gentle parallax toward the cursor.
function Particles({ palette, reduced, count = 340 }: { palette: Palette; reduced: boolean; count?: number }) {
  const ref = useRef<THREE.Points>(null)
  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      const r = 3 + Math.random() * 5
      const a = Math.random() * Math.PI * 2
      arr[i * 3] = Math.cos(a) * r * (0.6 + Math.random() * 0.6)
      arr[i * 3 + 1] = Math.sin(a) * r * (0.6 + Math.random() * 0.6)
      arr[i * 3 + 2] = -2 - Math.random() * 6
    }
    return arr
  }, [count])

  useFrame((state, delta) => {
    const p = ref.current
    if (!p) return
    if (!reduced) p.rotation.z += delta * 0.02
    p.position.x += (state.pointer.x * 0.6 - p.position.x) * 0.03
    p.position.y += (state.pointer.y * 0.6 - p.position.y) * 0.03
  })

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        color={palette.points}
        size={0.045}
        sizeAttenuation
        transparent
        opacity={0.7}
        depthWrite={false}
      />
    </points>
  )
}

function Scene({ reduced }: { reduced: boolean }) {
  const palette = usePalette()
  const { camera } = useThree()
  useEffect(() => {
    camera.position.set(0, 0, 7)
  }, [camera])

  return (
    <>
      <ambientLight intensity={0.6} />
      <pointLight position={[4, 4, 6]} intensity={40} color={palette.gold} />
      <pointLight position={[-5, -3, 4]} intensity={18} color={palette.maroon} />
      <Particles palette={palette} reduced={reduced} />
      <group>
        <CycleThread palette={palette} />
        <TaalRing palette={palette} reduced={reduced} />
        <Core palette={palette} reduced={reduced} />
      </group>
    </>
  )
}

export function RhythmScene() {
  const reduced = usePrefersReducedMotion()
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])

  if (!mounted) return null

  return (
    <Canvas
      dpr={[1, 1.75]}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      camera={{ position: [0, 0, 7], fov: 45 }}
      frameloop={reduced ? "demand" : "always"}
    >
      <Scene reduced={reduced} />
    </Canvas>
  )
}

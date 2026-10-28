"use client"

import { Canvas, useFrame, useThree } from "@react-three/fiber"
import { Html } from "@react-three/drei"
import { useEffect, useMemo, useRef, useState } from "react"
import * as THREE from "three"
import { ArrowDown, FileText, Mail, X } from "lucide-react"
import { profile, projects, thread } from "@/lib/content"
import { planets } from "@/lib/planets"
import { usePrefersReducedMotion } from "@/lib/use-reduced-motion"
import { IconGithub, IconLinkedin } from "@/components/icons"

// The whole first screen. The star at the center is me; every project is a
// planet, oldest closest in. Each planet carries its name, and one at a time
// its pitch shows in a panel in the corner. Hover picks a planet, click opens
// it below; clicking the star opens a short intro with resume and links.

const BODIES = thread.stops.flatMap((stop) => {
  const project = projects.find((p) => `/work/${p.slug}` === stop.href)
  const planet = project && planets[project.slug]
  return project && planet ? [{ slug: project.slug, name: project.name, tagline: project.tagline, period: stop.period, ...planet }] : []
})
type Body = (typeof BODIES)[number]

// Seen nearly edge-on on wide screens; more face-on on phones, so the
// orbits spread down the taller screen instead of piling up.
const TILT_WIDE = 1.12
const TILT_TALL = 0.72
const SUN = 0.2
const CAMERA_Z = 7.5
const FOV = 40
const radius = (i: number) => 0.8 + i * 0.3
// Kepler-ish: outer planets move slower. Offsets spread them around the ring.
const speed = (i: number) => 0.3 / Math.pow(radius(i), 1.5)
const phase = (i: number) => i * 2.4

export function openProject(slug: string) {
  const row = document.getElementById(`project-${slug}`)
  if (!row) return
  row.scrollIntoView({ behavior: "smooth", block: "center" })
  const trigger = row.querySelector<HTMLElement>("[data-slot=accordion-trigger]")
  if (trigger && trigger.getAttribute("aria-expanded") !== "true") trigger.click()
}

const NOISE = /* glsl */ `
  float hash(vec3 p) { p = fract(p * 0.3183099 + 0.1); p *= 17.0; return fract(p.x * p.y * p.z * (p.x + p.y + p.z)); }
  float noise(vec3 x) {
    vec3 i = floor(x); vec3 f = fract(x); f = f * f * (3.0 - 2.0 * f);
    return mix(mix(mix(hash(i), hash(i + vec3(1,0,0)), f.x), mix(hash(i + vec3(0,1,0)), hash(i + vec3(1,1,0)), f.x), f.y),
               mix(mix(hash(i + vec3(0,0,1)), hash(i + vec3(1,0,1)), f.x), mix(hash(i + vec3(0,1,1)), hash(i + vec3(1,1,1)), f.x), f.y), f.z);
  }
`

const SURFACE_VERT = /* glsl */ `
  varying vec3 vN; varying vec3 vW; varying vec3 vP;
  void main() {
    vP = position;
    vN = normalize(mat3(modelMatrix) * normal);
    vec4 w = modelMatrix * vec4(position, 1.0);
    vW = w.xyz;
    gl_Position = projectionMatrix * viewMatrix * w;
  }
`

// Banded gas-giant look, lit by the star: a day side, a dark night side, and
// a thin atmosphere on the rim.
const PLANET_FRAG = /* glsl */ `
  uniform vec3 uColor; uniform vec3 uSun; uniform float uSeed; uniform float uActive;
  varying vec3 vN; varying vec3 vW; varying vec3 vP;
  ${NOISE}
  void main() {
    vec3 n = normalize(vN);
    vec3 L = normalize(uSun - vW);
    vec3 V = normalize(cameraPosition - vW);
    vec3 p = normalize(vP);
    float bands = sin(p.y * (7.0 + uSeed * 5.0) + noise(p * 3.5 + uSeed * 9.0) * 3.0);
    float grain = noise(p * 10.0 + uSeed * 3.0);
    vec3 base = uColor * (0.78 + 0.22 * bands) * (0.85 + 0.3 * grain);
    float day = smoothstep(-0.15, 0.6, dot(n, L));
    float rim = pow(1.0 - max(dot(n, V), 0.0), 2.5);
    vec3 col = base * (0.16 + 1.05 * day) + uColor * rim * (0.35 + 0.65 * day) * (1.0 + uActive);
    gl_FragColor = vec4(col, 1.0);
  }
`

const SUN_FRAG = /* glsl */ `
  uniform float uTime;
  varying vec3 vN; varying vec3 vW; varying vec3 vP;
  ${NOISE}
  void main() {
    vec3 n = normalize(vN);
    vec3 V = normalize(cameraPosition - vW);
    vec3 p = normalize(vP) * 4.0;
    float f = noise(p + uTime * 0.25) * 0.6 + noise(p * 2.3 - uTime * 0.18) * 0.4;
    vec3 col = mix(vec3(1.0, 0.52, 0.16), vec3(1.0, 0.95, 0.8), smoothstep(0.25, 0.85, f));
    float limb = pow(max(dot(n, V), 0.0), 0.45);
    gl_FragColor = vec4(col * (0.55 + 0.6 * limb), 1.0);
  }
`

// An orbit that glows just behind its planet, like a trail, and fades to a
// faint line elsewhere.
const ORBIT_VERT = /* glsl */ `
  attribute float aAngle; varying float vA;
  void main() { vA = aAngle; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }
`
const ORBIT_FRAG = /* glsl */ `
  uniform vec3 uColor; uniform float uHead; uniform float uActive; varying float vA;
  void main() {
    float behind = mod(uHead - vA, 6.2831853) / 6.2831853;
    float trail = pow(1.0 - behind, 5.0);
    float a = 0.1 + trail * 0.85 + uActive * 0.25;
    gl_FragColor = vec4(mix(vec3(0.45), uColor, min(1.0, trail * 1.5 + uActive)), a);
  }
`

function glowTexture() {
  const c = document.createElement("canvas")
  c.width = c.height = 128
  const g = c.getContext("2d")!
  const grad = g.createRadialGradient(64, 64, 0, 64, 64, 64)
  grad.addColorStop(0, "rgba(255,255,255,1)")
  grad.addColorStop(0.18, "rgba(255,255,255,0.5)")
  grad.addColorStop(0.5, "rgba(255,255,255,0.12)")
  grad.addColorStop(1, "rgba(255,255,255,0)")
  g.fillStyle = grad
  g.fillRect(0, 0, 128, 128)
  return new THREE.CanvasTexture(c)
}

function orbitGeometry(r: number) {
  const n = 256
  const pos = new Float32Array(n * 3)
  const ang = new Float32Array(n)
  for (let i = 0; i < n; i++) {
    const a = (i / n) * Math.PI * 2
    pos.set([Math.cos(a) * r, Math.sin(a) * r, 0], i * 3)
    ang[i] = a
  }
  const g = new THREE.BufferGeometry()
  g.setAttribute("position", new THREE.BufferAttribute(pos, 3))
  g.setAttribute("aAngle", new THREE.BufferAttribute(ang, 1))
  return g
}

function Planet({
  body,
  index,
  active,
  onHover,
  reduced,
  glow,
  sun,
  tilt,
}: {
  body: Body
  index: number
  active: boolean
  onHover: (slug: string | null) => void
  reduced: boolean
  glow: THREE.Texture
  sun: React.RefObject<THREE.Vector3>
  tilt: number
}) {
  const ndc = useMemo(() => ({ p: new THREE.Vector3(), s: new THREE.Vector3() }), [])
  const holder = useRef<THREE.Group>(null)
  const sphere = useRef<THREE.Mesh>(null)
  const moon = useRef<THREE.Mesh>(null)
  const card = useRef<HTMLDivElement>(null)
  const angle = useRef(phase(index))
  const r = radius(index)
  const color = useMemo(() => new THREE.Color(body.color), [body.color])
  const orbit = useMemo(() => orbitGeometry(r), [r])
  const line = useMemo(() => {
    const mat = new THREE.ShaderMaterial({
      vertexShader: ORBIT_VERT,
      fragmentShader: ORBIT_FRAG,
      uniforms: { uColor: { value: color }, uHead: { value: 0 }, uActive: { value: 0 } },
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    })
    return new THREE.LineLoop(orbit, mat)
  }, [orbit, color])
  const surface = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader: SURFACE_VERT,
        fragmentShader: PLANET_FRAG,
        uniforms: { uColor: { value: color }, uSun: { value: new THREE.Vector3() }, uSeed: { value: index * 0.37 }, uActive: { value: 0 } },
      }),
    [color, index],
  )

  useFrame((state, delta) => {
    // Everything slows to a crawl while a planet is being looked at.
    if (!reduced) angle.current += delta * speed(index) * (active ? 0.08 : 1)
    const a = angle.current
    holder.current?.position.set(Math.cos(a) * r, Math.sin(a) * r, 0)
    const lm = line.material as THREE.ShaderMaterial
    lm.uniforms.uHead.value = ((a % (Math.PI * 2)) + Math.PI * 2) % (Math.PI * 2)
    lm.uniforms.uActive.value += ((active ? 1 : 0) - lm.uniforms.uActive.value) * 0.1
    if (sun.current) surface.uniforms.uSun.value.copy(sun.current)
    surface.uniforms.uActive.value = lm.uniforms.uActive.value
    if (sphere.current) {
      const s = sphere.current.scale.x + ((active ? 1.4 : 1) - sphere.current.scale.x) * 0.12
      sphere.current.scale.setScalar(s)
      sphere.current.rotation.y += delta * 0.4
    }
    if (moon.current) {
      const m = state.clock.elapsedTime * 1.4 + index
      moon.current.position.set(Math.cos(m) * body.size * 2.6, Math.sin(m) * body.size * 0.8, Math.sin(m) * body.size * 2.2)
    }
    // Fade the name while the planet passes under my name at the center.
    if (card.current && holder.current && sun.current) {
      ndc.p.setFromMatrixPosition(holder.current.matrixWorld).project(state.camera)
      ndc.s.copy(sun.current).project(state.camera)
      const dx = Math.abs(ndc.p.x - ndc.s.x)
      const dy = ndc.s.y - ndc.p.y
      card.current.style.opacity = dx < 0.2 && dy > 0 && dy < 0.32 ? "0.12" : "1"
    }
  })

  const hover = {
    onPointerOver: (e: { stopPropagation: () => void }) => {
      e.stopPropagation()
      onHover(body.slug)
    },
    onPointerOut: () => onHover(null),
    onClick: (e: { stopPropagation: () => void }) => {
      e.stopPropagation()
      openProject(body.slug)
    },
  }

  return (
    <>
      <primitive object={line} />
      <group ref={holder}>
        {/* Undo the plane's tilt so the planet itself reads upright. */}
        <group rotation={[-tilt, 0, 0]}>
          <sprite scale={body.size * (active ? 11 : 7)}>
            <spriteMaterial map={glow} color={color} transparent opacity={active ? 0.55 : 0.28} depthWrite={false} blending={THREE.AdditiveBlending} />
          </sprite>
          <mesh ref={sphere} material={surface} {...hover}>
            <sphereGeometry args={[body.size, 64, 64]} />
            {body.ring ? (
              <mesh rotation={[1.3, 0.3, 0]}>
                <ringGeometry args={[body.size * 1.45, body.size * 2.2, 96]} />
                <meshBasicMaterial color={color} transparent opacity={0.35} side={THREE.DoubleSide} depthWrite={false} />
              </mesh>
            ) : null}
          </mesh>
          {/* A larger invisible target so small planets are easy to hover. */}
          <mesh {...hover}>
            <sphereGeometry args={[Math.max(0.22, body.size * 2.2), 12, 12]} />
            <meshBasicMaterial transparent opacity={0} depthWrite={false} />
          </mesh>
          {body.moon ? (
            <mesh ref={moon}>
              <sphereGeometry args={[0.022, 16, 16]} />
              <meshStandardMaterial color="#d1d1d6" emissive="#d1d1d6" emissiveIntensity={0.25} />
            </mesh>
          ) : null}
          <Html position={[0, -body.size - 0.08, 0]} zIndexRange={active ? [40, 30] : [10, 0]} style={{ pointerEvents: "none" }}>
            <div ref={card} className="-translate-x-1/2 transition-opacity duration-300">
              <p
                className="whitespace-nowrap text-[11px] font-medium tracking-wide transition-colors duration-300 [text-shadow:0_1px_8px_rgba(0,0,0,0.9)]"
                style={{ color: active ? body.color : "rgba(255,255,255,0.65)" }}
              >
                {body.name}
              </p>
            </div>
          </Html>
        </group>
      </group>
    </>
  )
}

function System({
  reduced,
  active,
  onHover,
  onSun,
  pointer,
}: {
  reduced: boolean
  active: string | null
  onHover: (slug: string | null) => void
  onSun: () => void
  pointer: React.RefObject<{ x: number; y: number }>
}) {
  const glow = useMemo(glowTexture, [])
  const rig = useRef<THREE.Group>(null)
  const star = useRef<THREE.Mesh>(null)
  const corona = useRef<THREE.Sprite>(null)
  const sunWorld = useRef(new THREE.Vector3())
  const sunMat = useMemo(
    () => new THREE.ShaderMaterial({ vertexShader: SURFACE_VERT, fragmentShader: SUN_FRAG, uniforms: { uTime: { value: 0 } } }),
    [],
  )
  const { size } = useThree()
  const sunHover = useRef(false)

  // Size the system for where the camera ends up, not where the glide starts.
  const h = 2 * Math.tan(((FOV / 2) * Math.PI) / 180) * CAMERA_Z
  const w = h * (size.width / size.height)
  const wide = w > h
  const tilt = wide ? TILT_WIDE : TILT_TALL
  const outer = radius(BODIES.length - 1)
  // On phones the outermost orbits may run past the edges; the planets
  // still swing back into view.
  const fit = wide ? Math.min((w * 0.82) / (outer * 2), (h * 1.15) / (outer * 2 * 0.62)) : (w * 1.3) / (outer * 2)
  const place: [number, number, number] = [0, wide ? h * 0.01 : h * 0.09, 0]

  useFrame((state) => {
    const t = state.clock.elapsedTime
    // Glide in on load.
    state.camera.position.z += (CAMERA_Z - state.camera.position.z) * (reduced ? 1 : 0.03)
    if (rig.current) {
      const p = pointer.current ?? { x: 0, y: 0 }
      rig.current.rotation.y += (p.x * 0.14 - rig.current.rotation.y) * 0.04
      rig.current.rotation.x += (tilt + p.y * 0.08 - rig.current.rotation.x) * 0.04
    }
    sunMat.uniforms.uTime.value = reduced ? 0 : t
    star.current?.getWorldPosition(sunWorld.current)
    if (corona.current) corona.current.scale.setScalar((sunHover.current ? 2.4 : 2.1) + (reduced ? 0 : Math.sin(t * 1.1) * 0.08))
  })

  return (
    <group position={place} scale={fit}>
      <group ref={rig} rotation={[tilt, 0, 0]}>
        {/* The star: me. */}
        <group rotation={[-tilt, 0, 0]}>
          <sprite scale={4.2}>
            <spriteMaterial map={glow} color="#ff9a4d" transparent opacity={0.22} depthWrite={false} blending={THREE.AdditiveBlending} />
          </sprite>
          <sprite ref={corona} scale={2.1}>
            <spriteMaterial map={glow} color="#ffd29a" transparent opacity={0.75} depthWrite={false} blending={THREE.AdditiveBlending} />
          </sprite>
          <mesh
            ref={star}
            material={sunMat}
            onPointerOver={(e) => {
              e.stopPropagation()
              sunHover.current = true
              document.body.style.cursor = "pointer"
            }}
            onPointerOut={() => {
              sunHover.current = false
              document.body.style.cursor = ""
            }}
            onClick={(e) => {
              e.stopPropagation()
              onSun()
            }}
          >
            <sphereGeometry args={[SUN, 64, 64]} />
          </mesh>
          <Html center position={[0, -SUN - 0.24, 0]} zIndexRange={[25, 15]}>
            <button type="button" onClick={onSun} className="group flex flex-col items-center whitespace-nowrap text-center outline-none">
              <span className="text-[clamp(1.05rem,2vw,1.6rem)] font-semibold tracking-tight text-white [text-shadow:0_2px_18px_rgba(0,0,0,0.9)]">
                {profile.name}
              </span>
              <span className="mt-0.5 text-[11px] text-white/65 [text-shadow:0_1px_10px_rgba(0,0,0,0.9)] sm:text-xs">
                Software engineer · CS @ UMass Amherst
              </span>
              <span className="mt-2 rounded-full border border-white/15 bg-white/[0.06] px-3 py-1 text-[11px] font-medium text-white/85 backdrop-blur transition-colors group-hover:border-[#ffd29a]/60 group-hover:text-white group-focus-visible:border-[#ffd29a]">
                About me
              </span>
            </button>
          </Html>
        </group>

        {BODIES.map((body, i) => (
          <Planet key={body.slug} body={body} index={i} active={active === body.slug} onHover={onHover} reduced={reduced} glow={glow} sun={sunWorld} tilt={tilt} />
        ))}
      </group>
    </group>
  )
}

function About({ onClose }: { onClose: () => void }) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose()
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [onClose])

  const link =
    "inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.05] px-3.5 py-2 text-[13px] font-medium text-white/90 transition-colors hover:border-white/30 hover:text-white"

  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/45 px-4 backdrop-blur-[2px]" onClick={onClose}>
      <div
        role="dialog"
        aria-modal="true"
        aria-label={`About ${profile.name}`}
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-md animate-in fade-in zoom-in-95 rounded-3xl border border-white/10 bg-[#0f0f12]/90 p-6 shadow-lift backdrop-blur-xl duration-300 sm:p-7"
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          autoFocus
          className="absolute right-4 top-4 inline-flex h-8 w-8 items-center justify-center rounded-full text-white/60 hover:bg-white/10 hover:text-white"
        >
          <X className="h-4 w-4" />
        </button>
        <span
          aria-hidden="true"
          className="block h-10 w-10 rounded-full"
          style={{ background: "radial-gradient(circle at 35% 30%, #fff3d6, #ffb054 55%, #e0631c)", boxShadow: "0 0 30px rgba(255,170,90,0.55)" }}
        />
        <p className="mt-4 text-xs font-medium text-white/55">{profile.school}</p>
        <h2 className="mt-1 text-2xl font-semibold tracking-tight text-white">{profile.name}</h2>
        <p className="mt-3 text-pretty text-[15px] font-medium leading-snug text-white/90">{profile.tagline}</p>
        <p className="mt-2 text-pretty text-sm leading-relaxed text-white/65">{profile.intro}</p>
        <div className="mt-5 flex flex-wrap gap-2">
          <a href={profile.resume} target="_blank" rel="noreferrer noopener" className={link}>
            <FileText className="h-4 w-4" /> Resume
          </a>
          <a href={`mailto:${profile.email}`} className={link}>
            <Mail className="h-4 w-4" /> Email
          </a>
          <a href={profile.github} target="_blank" rel="noreferrer noopener" className={link}>
            <IconGithub className="h-4 w-4" /> GitHub
          </a>
          <a href={profile.linkedin} target="_blank" rel="noreferrer noopener" className={link}>
            <IconLinkedin className="h-4 w-4" /> LinkedIn
          </a>
        </div>
        <a
          href="#projects"
          onClick={onClose}
          className="mt-5 inline-flex items-center gap-1.5 rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
        >
          See the work <ArrowDown className="h-4 w-4" />
        </a>
      </div>
    </div>
  )
}

export function SolarSystem() {
  const reduced = usePrefersReducedMotion()
  const wrap = useRef<HTMLDivElement>(null)
  const pointer = useRef({ x: 0, y: 0 })
  const [visible, setVisible] = useState(true)
  const [hovered, setHovered] = useState<string | null>(null)
  const [spotlight, setSpotlight] = useState(BODIES.length - 1)
  const [about, setAbout] = useState(false)
  const [holdPanel, setHoldPanel] = useState(false)

  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      pointer.current = { x: (e.clientX / window.innerWidth) * 2 - 1, y: (e.clientY / window.innerHeight) * 2 - 1 }
    }
    window.addEventListener("pointermove", onMove, { passive: true })
    // Stop rendering once the hero is off screen.
    const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting))
    if (wrap.current) io.observe(wrap.current)
    return () => {
      window.removeEventListener("pointermove", onMove)
      io.disconnect()
    }
  }, [])

  // With nobody hovering, the pitch card walks inward from the newest planet.
  useEffect(() => {
    if (hovered || reduced || about || holdPanel) return
    const id = window.setInterval(() => setSpotlight((s) => (s - 1 + BODIES.length) % BODIES.length), 3000)
    return () => window.clearInterval(id)
  }, [hovered, reduced, about, holdPanel])

  const active = about ? null : (hovered ?? BODIES[spotlight]?.slug ?? null)
  const current = BODIES.find((b) => b.slug === active)

  return (
    <div ref={wrap} className="relative h-full w-full">
      <div className={hovered ? "h-full w-full cursor-pointer" : "h-full w-full"}>
        <Canvas
          dpr={[1, 2]}
          gl={{ antialias: true, alpha: true }}
          camera={{ position: [0, 0, 15], fov: FOV }}
          frameloop={visible ? "always" : "never"}
        >
          <System reduced={reduced} active={active} onHover={setHovered} onSun={() => setAbout(true)} pointer={pointer} />
        </Canvas>
      </div>
      {current ? (
        <div
          onMouseEnter={() => setHoldPanel(true)}
          onMouseLeave={() => setHoldPanel(false)}
          className="absolute inset-x-4 bottom-20 z-20 sm:inset-x-auto sm:bottom-24 sm:left-8 sm:w-80 lg:left-12"
        >
          <div key={current.slug} className="animate-in fade-in slide-in-from-bottom-1 rounded-2xl border border-white/10 bg-[#0f0f12]/80 p-4 shadow-lift backdrop-blur-xl duration-500">
            <p className="flex items-center gap-2 text-sm font-semibold text-white">
              <span className="h-2.5 w-2.5 rounded-full" style={{ background: current.color, boxShadow: `0 0 10px ${current.color}` }} />
              {current.name}
              <span className="ml-auto text-[11px] font-normal text-white/50">{current.period}</span>
            </p>
            <p className="mt-1.5 text-pretty text-[13px] leading-snug text-white/75">{current.tagline}</p>
            <div className="mt-3 flex items-center gap-3">
              <button
                type="button"
                onClick={() => openProject(current.slug)}
                className="rounded-full px-3.5 py-1.5 text-xs font-medium text-black transition-opacity hover:opacity-90"
                style={{ background: current.color }}
              >
                Open project
              </button>
              <span className="flex gap-1" aria-hidden="true">
                {BODIES.map((b) => (
                  <span key={b.slug} className="h-1 w-3 rounded-full transition-colors" style={{ background: b.slug === current.slug ? current.color : "rgba(255,255,255,0.15)" }} />
                ))}
              </span>
            </div>
          </div>
        </div>
      ) : null}
      {about ? <About onClose={() => setAbout(false)} /> : null}
    </div>
  )
}

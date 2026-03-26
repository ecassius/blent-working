import React, { useRef, useMemo, Suspense } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import {
  MarchingCubes, MarchingCube, MeshTransmissionMaterial,
  Environment, Text3D, Center,
} from '@react-three/drei'
import * as THREE from 'three'

// ─── Timing (seconds) ─────────────────────────────────────────────────────────
const T_POUR_END          = 3.0   // droplets reach orbit positions
const T_MERGE_END         = 6.5   // fully merged at origin
const T_BLOB_SHRINK_START = 7.0   // blob begins collapsing
const T_BLOB_SHRINK_END   = 8.5   // blob gone
const T_TEXT_GROW_START   = 7.5   // 3D text begins growing (overlaps collapse for fluidity)
const T_TEXT_GROW_END     = 10.5  // text fully revealed

// ─── Easing ───────────────────────────────────────────────────────────────────
const easeOut   = (t) => 1 - Math.pow(1 - t, 3)
const easeInOut = (t) =>
  t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2

function clamp(v, lo, hi) { return Math.max(lo, Math.min(hi, v)) }
function lerp(a, b, t)    { return a + (b - a) * t }

// ─── Shared oily transmission material props ──────────────────────────────────
const OIL_MATERIAL = {
  backside: true,
  samples: 4,
  thickness: 1.5,
  chromaticAberration: 0.08,
  anisotropy: 0.1,
  distortion: 0.5,
  distortionScale: 0.5,
  temporalDistortion: 0.1,
}

// ─── Full scene ───────────────────────────────────────────────────────────────
const Scene = () => {
  const marchRef  = useRef()  // MarchingCubes mesh
  const blobGroup = useRef()  // wrapper — scaled to 0 to collapse blob
  const textGroup = useRef()  // wrapper — scaled from 0 to reveal text

  // 15 droplets: 3 lime, 12 purple, evenly spaced around a circle
  const droplets = useMemo(() =>
    Array.from({ length: 15 }, (_, i) => ({
      angle: (i / 15) * Math.PI * 2,
      speed: 0.25 + (i % 5) * 0.08,   // deterministic, no random()
      color: i % 4 === 0 ? '#D9F99D' : '#5D4AD4',
    })), [])

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()

    // ── 1. Drive metaball positions ─────────────────────────────────────────
    if (marchRef.current) {
      marchRef.current.children.forEach((child, i) => {
        if (i >= droplets.length) return
        const d = droplets[i]

        if (t < T_POUR_END) {
          // POUR: rain in from the top and fan out into an orbit ring
          const p = easeOut(clamp(t / T_POUR_END, 0, 1))
          child.position.x = lerp(Math.sin(d.angle) * 0.4, Math.sin(d.angle) * 2.2, p)
          child.position.y = lerp(3.2,                      Math.cos(d.angle) * 1.8, p)
          child.position.z = lerp(0,                        Math.sin(d.angle * 1.4) * 0.4, p)

        } else if (t < T_MERGE_END) {
          // CONVERGE: orbit while radius shrinks to zero
          const p      = easeInOut(clamp((t - T_POUR_END) / (T_MERGE_END - T_POUR_END), 0, 1))
          const radius = lerp(2.2, 0, p)
          const spd    = d.speed * lerp(1, 2.5, p)  // accelerate on approach
          child.position.x = Math.sin(t * spd + d.angle) * radius
          child.position.y = Math.cos(t * spd + d.angle) * radius * 0.9
          child.position.z = Math.sin(t * spd * 0.7 + d.angle) * radius * 0.3

        } else {
          // MERGED: park at origin — single blob
          child.position.set(0, 0, 0)
        }
      })
    }

    // ── 2. Collapse the blob ────────────────────────────────────────────────
    if (blobGroup.current && t > T_BLOB_SHRINK_START) {
      const p = easeInOut(clamp(
        (t - T_BLOB_SHRINK_START) / (T_BLOB_SHRINK_END - T_BLOB_SHRINK_START), 0, 1))
      blobGroup.current.scale.setScalar(lerp(1, 0, p))
    }

    // ── 3. Grow the 3D text ─────────────────────────────────────────────────
    if (textGroup.current && t > T_TEXT_GROW_START) {
      const p = easeOut(clamp(
        (t - T_TEXT_GROW_START) / (T_TEXT_GROW_END - T_TEXT_GROW_START), 0, 1))
      textGroup.current.scale.setScalar(p)
      // Slight Y-bob once fully in
      if (p >= 1) {
        textGroup.current.position.y = Math.sin((t - T_TEXT_GROW_END) * 0.8) * 0.04
      }
    }
  })

  return (
    <>
      {/* ── Oily blob (marching cubes) ── */}
      <group ref={blobGroup}>
        <MarchingCubes
          ref={marchRef}
          resolution={64}
          maxPolyCount={20000}
          enableUvs={false}
          enableColors
        >
          <MeshTransmissionMaterial {...OIL_MATERIAL} color="#ffffff" />
          {droplets.map((d, i) => (
            <MarchingCube
              key={i}
              strength={0.35}
              subtract={12}
              color={new THREE.Color(d.color)}
            />
          ))}
        </MarchingCubes>
      </group>

      {/* ── 3D "blent" logo — same oily glass, purple-tinted ── */}
      <Suspense fallback={null}>
        <group ref={textGroup} scale={0}>
          <Center>
            <Text3D
              font="/fonts/helvetiker_bold.typeface.json"
              size={0.72}
              height={0.28}
              curveSegments={16}
              bevelEnabled
              bevelThickness={0.04}
              bevelSize={0.03}
              bevelOffset={0}
              bevelSegments={8}
            >
              blent
              <MeshTransmissionMaterial
                {...OIL_MATERIAL}
                thickness={0.9}
                chromaticAberration={0.12}
                distortion={0.35}
                distortionScale={0.35}
                temporalDistortion={0.06}
                color="#7B5CF0"
              />
            </Text3D>
          </Center>
        </group>
      </Suspense>
    </>
  )
}

// ─── Root ─────────────────────────────────────────────────────────────────────
export default function OilLogo() {
  return (
    <div style={{ width: '100vw', height: '100vh', background: '#0B0B0B' }}>
      <Canvas camera={{ position: [0, 0, 5], fov: 45 }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={2} />
        <spotLight position={[-10, 10, 10]} angle={0.15} penumbra={1} />
        <Scene />
        <Environment preset="studio" />
      </Canvas>
    </div>
  )
}

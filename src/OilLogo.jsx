import React, { useRef, useMemo, Suspense } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import {
  MarchingCubes, MarchingCube, MeshTransmissionMaterial,
  Environment, Text3D, Center,
} from '@react-three/drei'
import * as THREE from 'three'

// ─── Stream geometry ──────────────────────────────────────────────────────────
// MarchingCubes maps world positions through px = pos.x/2 + 0.5
// so only [-1,1] world coords render inside the volume.
// Camera at z=1.8, fov=58 → visible half-height ≈ 1.0 — the whole [-1,1]
// range fills the screen.

const N_PER_STREAM  = 32     // metaballs per stream  (32 × 2 = 64 total)
const STREAM_X      = 0.48   // ±X position of each stream
const STREAM_TOP    = 0.95   // top of stream column (just on-screen)
const POOL_Y        = -0.72  // where liquid pools at the bottom
const STREAM_H      = STREAM_TOP - POOL_Y  // 1.67 units
const FLOW_SPEED    = 0.38   // stream velocity (cycles / sec)

// Each ball radius ≈ 0.085 world units (strength=0.16, subtract=7, isolation≈80)
// Ball spacing  = STREAM_H / N = 1.67/32 = 0.052 — radius > spacing → continuous stream

// ─── Timing ───────────────────────────────────────────────────────────────────
const T_POUR_END          =  6.0
const T_MERGE_END         =  9.5
const T_BLOB_SHRINK_START = 10.0
const T_BLOB_SHRINK_END   = 11.2
const T_TEXT_GROW_START   = 10.4
const T_TEXT_GROW_END     = 13.5

// ─── Easing ───────────────────────────────────────────────────────────────────
const easeOut   = (t) => 1 - Math.pow(1 - t, 3)
const easeInOut = (t) =>
  t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2
const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v))
const lerp  = (a, b, t)   => a + (b - a) * t

// ─── Scene ────────────────────────────────────────────────────────────────────
const Scene = () => {
  const marchRef  = useRef()
  const blobGroup = useRef()
  const textGroup = useRef()

  // 32 purple (left) + 32 lime (right)
  const droplets = useMemo(() => [
    ...Array.from({ length: N_PER_STREAM }, (_, i) => ({
      side:        -1,
      phase:       i / N_PER_STREAM,
      splashAngle: (i / N_PER_STREAM) * Math.PI * 2,
      color:       '#5D4AD4',
    })),
    ...Array.from({ length: N_PER_STREAM }, (_, i) => ({
      side:        +1,
      phase:       i / N_PER_STREAM,
      splashAngle: (i / N_PER_STREAM) * Math.PI * 2 + 0.55,
      color:       '#D9F99D',
    })),
  ], [])

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()
    if (!marchRef.current) return

    marchRef.current.children.forEach((child, i) => {
      if (i >= droplets.length) return
      const d = droplets[i]

      if (t < T_POUR_END) {
        // ── POUR: two separate falling streams ────────────────────────────
        const streamX = d.side * STREAM_X
        // cycle 0→1: ball moves from STREAM_TOP down past POOL_Y
        const cycle = (d.phase + t * FLOW_SPEED) % 1.0
        const rawY  = STREAM_TOP - cycle * (STREAM_H + 0.45)  // overshoot past pool

        if (rawY > POOL_Y) {
          // ── In the falling column ─────────────────────────────────────
          // Very slight natural wobble — real water streams are nearly straight
          child.position.x = streamX + Math.sin(rawY * 6 + t * 5) * 0.018
          child.position.y = rawY
          child.position.z = Math.cos(rawY * 5 + t * 4) * 0.012

        } else {
          // ── Pooled / splash ───────────────────────────────────────────
          const depth   = POOL_Y - rawY                      // 0 → grows as cycle continues
          const spreadR = Math.min(depth * 2.0, 0.52)        // capped splash radius
          const angle   = d.splashAngle + t * 0.45
          child.position.x = streamX + Math.cos(angle) * spreadR * 0.75
          child.position.y = POOL_Y - depth * 0.08           // barely sink below pool line
          child.position.z = Math.sin(angle) * spreadR * 0.28
        }

      } else if (t < T_MERGE_END) {
        // ── MERGE: streams converge and pool rises to origin ─────────────
        const p       = easeInOut(clamp((t - T_POUR_END) / (T_MERGE_END - T_POUR_END), 0, 1))
        const factor  = 1 - p                                 // shrinks 1→0

        // Lerp stream and pool positions toward origin
        child.position.x =
          d.side * STREAM_X * factor
          + Math.cos(d.splashAngle) * 0.4 * factor
        child.position.y = POOL_Y * factor
        child.position.z = Math.sin(d.splashAngle) * 0.18 * factor

      } else {
        // ── MERGED: everything parked at origin → single blob ─────────────
        child.position.set(0, 0, 0)
      }
    })

    // Collapse the blob group to zero
    if (blobGroup.current && t > T_BLOB_SHRINK_START) {
      const p = easeInOut(clamp(
        (t - T_BLOB_SHRINK_START) / (T_BLOB_SHRINK_END - T_BLOB_SHRINK_START), 0, 1))
      blobGroup.current.scale.setScalar(lerp(1, 0, p))
    }

    // Grow the 3D text logo
    if (textGroup.current && t > T_TEXT_GROW_START) {
      const p = easeOut(clamp(
        (t - T_TEXT_GROW_START) / (T_TEXT_GROW_END - T_TEXT_GROW_START), 0, 1))
      textGroup.current.scale.setScalar(p)
      // Gentle float once fully in
      if (p >= 1) {
        textGroup.current.position.y =
          Math.sin((t - T_TEXT_GROW_END) * 0.75) * 0.035
      }
    }
  })

  return (
    <>
      {/* ── Liquid streams (MarchingCubes) ── */}
      <group ref={blobGroup}>
        <MarchingCubes
          ref={marchRef}
          resolution={64}
          maxPolyCount={30000}
          enableUvs={false}
          enableColors
        >
          {/*
            meshPhysicalMaterial with vertexColors gives opaque, glossy
            coloured liquid — purple and lime show through vividly.
            No transmission so the streams read as real liquid, not glass.
          */}
          <meshPhysicalMaterial
            roughness={0.04}
            metalness={0.0}
            envMapIntensity={3}
            vertexColors
          />
          {droplets.map((d, i) => (
            <MarchingCube
              key={i}
              strength={0.16}
              subtract={7}
              color={new THREE.Color(d.color)}
            />
          ))}
        </MarchingCubes>
      </group>

      {/* ── 3D glass "blent" logo — grows from the collapsed blob ── */}
      <Suspense fallback={null}>
        <group ref={textGroup} scale={0}>
          <Center>
            <Text3D
              font="/fonts/helvetiker_bold.typeface.json"
              size={0.44}
              height={0.16}
              curveSegments={16}
              bevelEnabled
              bevelThickness={0.018}
              bevelSize={0.012}
              bevelOffset={0}
              bevelSegments={8}
            >
              blent
              <MeshTransmissionMaterial
                backside
                samples={4}
                thickness={0.7}
                chromaticAberration={0.12}
                anisotropy={0.3}
                distortion={0.2}
                distortionScale={0.2}
                temporalDistortion={0.05}
                color="#8B6CF7"
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
      {/*
        Camera at z=1.8, fov=58 → visible half-height ≈ 1.0 unit.
        The MarchingCubes [-1, 1] world volume fills the full screen height,
        so the streams pour from the very top to the very bottom.
      */}
      <Canvas camera={{ position: [0, 0, 1.8], fov: 58 }}>
        <ambientLight intensity={0.4} />
        <pointLight position={[5, 8, 5]}  intensity={3} color="#ffffff" />
        <pointLight position={[-5, 2, 3]} intensity={1.5} color="#b8a0ff" />
        <spotLight
          position={[0, 6, 4]}
          angle={0.3}
          penumbra={0.8}
          intensity={2}
          color="#ffffff"
        />
        <Scene />
        <Environment preset="studio" />
      </Canvas>
    </div>
  )
}

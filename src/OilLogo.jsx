import React, { useRef, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { MarchingCubes, MarchingCube, MeshTransmissionMaterial, Environment } from '@react-three/drei'
import * as THREE from 'three'

// ─── Timing (seconds) ────────────────────────────────────────────────────────
const T_POUR_END   = 3.0   // droplets reach orbit positions
const T_MERGE_END  = 6.5   // all fully merged at center
const T_LOGO_START = 7.2   // logo begins to fade in
const T_LOGO_END   = 10.0  // logo fully visible

// ─── Easing ──────────────────────────────────────────────────────────────────
const easeOut   = (t) => 1 - Math.pow(1 - t, 3)
const easeInOut = (t) =>
  t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2

function clamp(v, lo, hi) { return Math.max(lo, Math.min(hi, v)) }
function lerp(a, b, t)    { return a + (b - a) * t }

// ─── Three.js scene ──────────────────────────────────────────────────────────
const DropletScene = ({ logoRef }) => {
  const marchRef = useRef()

  // 15 droplets: mostly purple, a few lime, evenly spread around a circle
  const droplets = useMemo(() =>
    Array.from({ length: 15 }, (_, i) => ({
      angle: (i / 15) * Math.PI * 2,
      speed: 0.25 + (i % 5) * 0.08,   // deterministic speeds (avoids hydration issues)
      color: i % 4 === 0 ? '#D9F99D' : '#5D4AD4',
    })), [])

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()
    if (!marchRef.current) return

    // ── Animate each marching-cube ball ──────────────────────────────────────
    marchRef.current.children.forEach((child, i) => {
      if (i >= droplets.length) return
      const d = droplets[i]

      if (t < T_POUR_END) {
        // POUR: fall from top into spread orbit positions
        const p = easeOut(clamp(t / T_POUR_END, 0, 1))
        child.position.x = lerp(Math.sin(d.angle) * 0.5, Math.sin(d.angle) * 2.2, p)
        child.position.y = lerp(3.2,                      Math.cos(d.angle) * 1.8, p)
        child.position.z = lerp(0,                        Math.sin(d.angle * 1.4) * 0.4, p)

      } else if (t < T_MERGE_END) {
        // CONVERGE: orbit while radius shrinks to zero
        const p      = easeInOut(clamp((t - T_POUR_END) / (T_MERGE_END - T_POUR_END), 0, 1))
        const radius = lerp(2.2, 0, p)
        const spd    = d.speed * lerp(1, 2.5, p)   // accelerate as they close in

        child.position.x = Math.sin(t * spd + d.angle) * radius
        child.position.y = Math.cos(t * spd + d.angle) * radius * 0.9
        child.position.z = Math.sin(t * spd * 0.7 + d.angle) * radius * 0.3

      } else {
        // MERGED: park everything at origin so they form a single blob
        child.position.set(0, 0, 0)
      }
    })

    // ── Drive logo opacity directly on the DOM element (no React setState) ──
    if (logoRef.current && t > T_LOGO_START) {
      const p = easeInOut(clamp((t - T_LOGO_START) / (T_LOGO_END - T_LOGO_START), 0, 1))
      logoRef.current.style.opacity = p
    }
  })

  return (
    <MarchingCubes
      ref={marchRef}
      resolution={64}
      maxPolyCount={20000}
      enableUvs={false}
      enableColors
    >
      {/* Thick, oily transmission material */}
      <MeshTransmissionMaterial
        backside
        samples={4}
        thickness={1.5}
        chromaticAberration={0.06}
        anisotropy={0.1}
        distortion={0.5}
        distortionScale={0.5}
        temporalDistortion={0.1}
        color="#ffffff"
      />

      {droplets.map((d, i) => (
        <MarchingCube
          key={i}
          strength={0.35}
          subtract={12}
          color={new THREE.Color(d.color)}
        />
      ))}
    </MarchingCubes>
  )
}

// ─── Root component ───────────────────────────────────────────────────────────
export default function OilLogo() {
  const logoRef = useRef()

  return (
    <div style={{ width: '100vw', height: '100vh', background: '#0B0B0B', position: 'relative' }}>

      {/* Three.js canvas */}
      <Canvas camera={{ position: [0, 0, 5], fov: 45 }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={2} />
        <spotLight position={[-10, 10, 10]} angle={0.15} penumbra={1} />
        <DropletScene logoRef={logoRef} />
        <Environment preset="studio" />
      </Canvas>

      {/*
        Logo overlay — starts invisible (opacity:0).
        DropletScene drives opacity imperatively via logoRef so we
        get a smooth per-frame fade without React re-renders.
      */}
      <div
        ref={logoRef}
        style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          opacity: 0,
          pointerEvents: 'none',
        }}
      >
        <img
          src="/blent-logo.svg"
          alt="blent"
          style={{ width: '201px', height: 'auto' }}
        />
      </div>
    </div>
  )
}

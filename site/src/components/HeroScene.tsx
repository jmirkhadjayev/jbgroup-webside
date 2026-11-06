'use client'

import { Canvas, useFrame } from '@react-three/fiber'
import { useRef } from 'react'
import type { Group } from 'three'

// Stellaj (rafli ombor) va oltin halqadan iborat sodda 3D sahna.
function Racks() {
  const group = useRef<Group>(null)

  useFrame((state, delta) => {
    if (!group.current) return
    // Sichqonchaga yumshoq moslashadi, o‘zi ham sekin aylanadi
    group.current.rotation.y += delta * 0.12
    group.current.rotation.x = state.pointer.y * 0.06
  })

  const posts: [number, number, number][] = []
  for (let col = -3; col <= 3; col++) {
    for (const z of [-1.2, 1.2]) posts.push([col * 1.1, 0, z])
  }

  return (
    <group ref={group} rotation={[0.1, -0.5, 0]}>
      {posts.map(([x, , z], i) => (
        <mesh key={i} position={[x, 0, z]}>
          <boxGeometry args={[0.07, 3.2, 0.07]} />
          <meshStandardMaterial color="#0B2545" roughness={0.45} metalness={0.4} />
        </mesh>
      ))}
      {[-1.2, -0.2, 0.8].map((y) =>
        [-1.2, 1.2].map((z) => (
          <mesh key={`beam-${y}-${z}`} position={[0, y, z]}>
            <boxGeometry args={[7.2, 0.08, 0.08]} />
            <meshStandardMaterial color="#15345F" roughness={0.5} metalness={0.3} />
          </mesh>
        )),
      )}
      {/* Yuk qutilari */}
      {[
        [-2.2, -1.2, 0.9],
        [-1.1, -1.2, -0.4],
        [1.1, -0.2, 1.2],
        [2.2, -1.2, -1.2],
      ].map(([x, y, z], i) => (
        <mesh key={`box-${i}`} position={[x, y, z]}>
          <boxGeometry args={[0.7, 0.5, 0.6]} />
          <meshStandardMaterial color="#8a6d1f" roughness={0.8} />
        </mesh>
      ))}
      {/* Oltin halqa */}
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
        <torusGeometry args={[2.6, 0.02, 16, 120]} />
        <meshStandardMaterial color="#C9A227" metalness={0.8} roughness={0.2} />
      </mesh>
    </group>
  )
}

export default function HeroScene() {
  return (
    <Canvas
      camera={{ position: [0, 0.6, 7], fov: 40 }}
      dpr={[1, 1.75]}
      gl={{ antialias: true, alpha: true }}
    >
      <ambientLight intensity={0.8} />
      <directionalLight position={[4, 6, 5]} intensity={1.2} />
      <Racks />
    </Canvas>
  )
}

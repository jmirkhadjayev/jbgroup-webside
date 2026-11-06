'use client'

import { Canvas, useFrame } from '@react-three/fiber'
import { useMemo } from 'react'
import * as THREE from 'three'
import { heroScroll } from '@/lib/scroll-store'

// Yo‘lak geometriyasi: ikki tomonda stellajlar, ustida yuk qutilari, oltin chiroqlar.
const BAY_STEP = 3
const BAYS = 16
const LEVELS = [0.4, 1.9, 3.4]
const RACK_X = [-2.4, 2.4]

// Deterministik “tasodifiy” — har safar bir xil joylashuv (SSR/hydration uchun muhim emas, lekin barqaror)
const rand = (i: number) => {
  const x = Math.sin(i * 127.1 + 311.7) * 43758.5453
  return x - Math.floor(x)
}

function Aisle() {
  const { posts, beams, boxes } = useMemo(() => {
    const steel = new THREE.MeshStandardMaterial({ color: '#15345f', roughness: 0.4, metalness: 0.5 })
    const beamMat = new THREE.MeshStandardMaterial({ color: '#c9a227', roughness: 0.35, metalness: 0.6 })
    const cargo = new THREE.MeshStandardMaterial({ color: '#8a6d1f', roughness: 0.85 })

    const dummy = new THREE.Object3D()

    // Ustunlar: har bay chegarasida ikki tomonda
    const postCount = (BAYS + 1) * RACK_X.length
    const postMesh = new THREE.InstancedMesh(new THREE.BoxGeometry(0.1, 5.2, 0.1), steel, postCount)
    let pi = 0
    for (let b = 0; b <= BAYS; b++) {
      const z = -b * BAY_STEP
      for (const x of RACK_X) {
        dummy.position.set(x, 2.2, z)
        dummy.rotation.set(0, 0, 0)
        dummy.updateMatrix()
        postMesh.setMatrixAt(pi++, dummy.matrix)
      }
    }
    postMesh.instanceMatrix.needsUpdate = true

    // To‘sinlar: har bay, har daraja, ikki tomonda — oltin rang
    const beamCount = BAYS * LEVELS.length * RACK_X.length
    const beamMesh = new THREE.InstancedMesh(new THREE.BoxGeometry(0.08, 0.08, BAY_STEP), beamMat, beamCount)
    let bi = 0
    for (let b = 0; b < BAYS; b++) {
      const z = -b * BAY_STEP - BAY_STEP / 2
      for (const x of RACK_X) {
        for (const y of LEVELS) {
          dummy.position.set(x, y, z)
          dummy.updateMatrix()
          beamMesh.setMatrixAt(bi++, dummy.matrix)
        }
      }
    }
    beamMesh.instanceMatrix.needsUpdate = true

    // Yuk qutilari: raflar ustida tasodifiy joylashgan
    const boxCount = BAYS * RACK_X.length * 2
    const boxMesh = new THREE.InstancedMesh(new THREE.BoxGeometry(1.0, 0.75, 0.85), cargo, boxCount)
    let ki = 0
    for (let b = 0; b < BAYS; b++) {
      for (const side of [-1, 1]) {
        for (let k = 0; k < 2; k++) {
          const level = LEVELS[Math.floor(rand(b * 5 + k + side * 3) * LEVELS.length)]
          dummy.position.set(
            side * (1.7 + rand(b * 3 + k) * 0.35),
            level + 0.42,
            -b * BAY_STEP - BAY_STEP / 2 + (rand(k + b * 11) - 0.5) * 1.4,
          )
          dummy.rotation.set(0, (rand(b + side * 2) - 0.5) * 0.25, 0)
          dummy.updateMatrix()
          boxMesh.setMatrixAt(ki++, dummy.matrix)
        }
      }
    }
    boxMesh.instanceMatrix.needsUpdate = true

    return { posts: postMesh, beams: beamMesh, boxes: boxMesh }
  }, [])

  return (
    <group>
      <primitive object={posts} />
      <primitive object={beams} />
      <primitive object={boxes} />
      {Array.from({ length: 7 }).map((_, i) => (
        <pointLight
          key={i}
          position={[0, 4.6, -i * 8 - 2]}
          intensity={9}
          distance={12}
          color="#f2d27a"
        />
      ))}
    </group>
  )
}

function Camera() {
  useFrame((state, delta) => {
    const cam = state.camera
    const p = heroScroll.progress
    // Scroll bilan yo‘lak bo‘ylab siljiydi, sichqoncha bilan yumshoq og‘adi
    const targetZ = THREE.MathUtils.lerp(5.5, -34, p)
    cam.position.z = THREE.MathUtils.damp(cam.position.z, targetZ, 4, delta)
    cam.position.x = THREE.MathUtils.damp(cam.position.x, state.pointer.x * 0.4, 3, delta)
    cam.position.y = THREE.MathUtils.damp(cam.position.y, 1.6 + state.pointer.y * 0.2, 3, delta)
    cam.lookAt(0, 1.5, cam.position.z - 8)
  })
  return null
}

export default function HeroScene() {
  return (
    <Canvas
      camera={{ position: [0, 1.6, 5.5], fov: 55, near: 0.1, far: 120 }}
      dpr={[1, 1.5]}
      gl={{ antialias: true }}
      onCreated={({ scene }) => {
        scene.background = new THREE.Color('#0b2545')
        scene.fog = new THREE.Fog('#0b2545', 6, 32)
      }}
    >
      <ambientLight intensity={0.6} />
      <Aisle />
      <Camera />
    </Canvas>
  )
}

'use client'

import { Canvas, useFrame } from '@react-three/fiber'
import { Edges, Sparkles } from '@react-three/drei'
import { useEffect, useMemo, useRef } from 'react'
import * as THREE from 'three'
import { flow } from './flow'

// Ombor yo‘lagi: forklift yukni dock’dan olib, 2-bay (Bay 02) ga joylaydi.
// Barcha harakat `flow.p` (0..1) ga bog‘langan — scroll bilan boshqariladi.

const { lerp, clamp, damp } = THREE.MathUtils
const seg = (p: number, a: number, b: number) => clamp((p - a) / (b - a), 0, 1)
const smooth = (t: number) => t * t * (3 - 2 * t)

const NBAYS = 9
const ROW_Z = 5.2 // rafning markazi yo‘lakdan masofa
const ROW_DEPTH = 3.2
const bayEdge = (k: number) => 1.5 + 3 * k // post chegarasi (k = 0..NBAYS)
const bayCenter = (i: number) => 3 + 3 * i // bay markazi (i = 0..NBAYS-1)
const TARGET_BAY = 1 // yuk tushadigan bay
const TARGET = { x: bayCenter(TARGET_BAY), z: -ROW_Z }
const PICK_X = -10 // dock’dagi yuk markazi
const FORKLIFT_START = -26
const LIFT_MAX = 1.0
const CARRY = 3.1 // forklift markazidan yuk markazigacha (forks 1.6 + yuk yarmi 1.5)

type Pose = { x: number; z: number; th: number; lift: number }

// Forklift yo‘li (p bo‘yicha bosqichlar)
function forkliftAt(p: number): Pose {
  if (p < 0.35)
    return { x: lerp(FORKLIFT_START, -13.1, smooth(seg(p, 0.05, 0.35))), z: 0, th: 0, lift: 0 }
  if (p < 0.42) return { x: -13.1, z: 0, th: 0, lift: LIFT_MAX * smooth(seg(p, 0.36, 0.42)) }
  if (p < 0.55)
    return { x: lerp(-13.1, TARGET.x, smooth(seg(p, 0.42, 0.55))), z: 0, th: 0, lift: LIFT_MAX }
  if (p < 0.6) {
    const s = smooth(seg(p, 0.55, 0.6))
    return { x: TARGET.x, z: lerp(0, 1, s), th: lerp(0, Math.PI / 2, s), lift: LIFT_MAX }
  }
  if (p < 0.68) {
    const s = smooth(seg(p, 0.6, 0.68))
    return { x: TARGET.x, z: lerp(1, -2.1, s), th: Math.PI / 2, lift: LIFT_MAX }
  }
  if (p < 0.72)
    return { x: TARGET.x, z: -2.1, th: Math.PI / 2, lift: LIFT_MAX * (1 - smooth(seg(p, 0.68, 0.72))) }
  if (p < 0.8)
    return { x: TARGET.x, z: lerp(-2.1, 0, smooth(seg(p, 0.72, 0.8))), th: Math.PI / 2, lift: 0 }
  if (p < 0.86)
    return { x: TARGET.x, z: 0, th: lerp(Math.PI / 2, 0, smooth(seg(p, 0.8, 0.86))), lift: 0 }
  return { x: lerp(TARGET.x, FORKLIFT_START, smooth(seg(p, 0.86, 1))), z: 0, th: 0, lift: 0 }
}

// Yuk (konteyner) joylashuvi: dock → forklift bilan birga → rafdagi joy
function cargoAt(p: number, fk: Pose) {
  if (p < 0.36) return { x: PICK_X, y: 1.2, z: 0, th: 0 }
  if (p < 0.72) {
    const fx = Math.cos(fk.th)
    const fz = -Math.sin(fk.th)
    return { x: fk.x + CARRY * fx, y: 1.2 + fk.lift, z: fk.z + CARRY * fz, th: fk.th }
  }
  return { x: TARGET.x, y: 1.2, z: TARGET.z, th: Math.PI / 2 }
}

// Deterministik “tasodifiy” (har safar bir xil joylashuv)
const rand = (i: number) => {
  const x = Math.sin(i * 127.1 + 311.7) * 43758.5453
  return x - Math.floor(x)
}

const CARGO_COLORS = ['#8a6d1f', '#6b5a2e', '#a88a3a', '#4f5d70', '#9c7a2c']

function Racks() {
  const { posts, beams, boxes } = useMemo(() => {
    const dummy = new THREE.Object3D()
    const steel = new THREE.MeshStandardMaterial({ color: '#1b4a85', roughness: 0.45, metalness: 0.5 })
    const gold = new THREE.MeshStandardMaterial({ color: '#c9a227', roughness: 0.35, metalness: 0.6 })
    const cargoMat = new THREE.MeshStandardMaterial({ color: '#ffffff', roughness: 0.8 })
    const rows = [-ROW_Z, ROW_Z]
    const edges = [-ROW_DEPTH / 2, ROW_DEPTH / 2]
    const levels = [
      { y: 2.45, base: 0 },
      { y: 4.65, base: 2.5 },
    ]

    // Ustunlar
    const postMesh = new THREE.InstancedMesh(
      new THREE.BoxGeometry(0.12, 5.2, 0.12),
      steel,
      (NBAYS + 1) * rows.length * edges.length,
    )
    let pi = 0
    for (let k = 0; k <= NBAYS; k++)
      for (const r of rows)
        for (const e of edges) {
          dummy.position.set(bayEdge(k), 2.6, r + e)
          dummy.updateMatrix()
          postMesh.setMatrixAt(pi++, dummy.matrix)
        }
    postMesh.instanceMatrix.needsUpdate = true

    // To‘sinlar (har bay, daraja, qator, chekka)
    const beamMesh = new THREE.InstancedMesh(
      new THREE.BoxGeometry(3, 0.08, 0.08),
      gold,
      NBAYS * levels.length * rows.length * edges.length,
    )
    let bi = 0
    for (let i = 0; i < NBAYS; i++)
      for (const l of levels)
        for (const r of rows)
          for (const e of edges) {
            dummy.position.set(bayCenter(i), l.y, r + e)
            dummy.updateMatrix()
            beamMesh.setMatrixAt(bi++, dummy.matrix)
          }
    beamMesh.instanceMatrix.needsUpdate = true

    // Yuk qutilari (Bay 02 pastki qatori bo‘sh — u yerga konteyner tushadi)
    const boxMesh = new THREE.InstancedMesh(
      new THREE.BoxGeometry(1.8, 0.8, 1.2),
      cargoMat,
      NBAYS * levels.length * rows.length - 1,
    )
    let ki = 0
    const color = new THREE.Color()
    for (let i = 0; i < NBAYS; i++)
      for (let li = 0; li < levels.length; li++)
        for (let ri = 0; ri < rows.length; ri++) {
          if (i === TARGET_BAY && li === 0 && ri === 0) continue
          const seed = i * 7 + li * 3 + ri * 11
          dummy.position.set(
            bayCenter(i) + (rand(seed) - 0.5) * 0.4,
            levels[li].base + 0.4,
            rows[ri] + (rand(seed + 1) - 0.5) * 0.4,
          )
          dummy.rotation.set(0, (rand(seed + 2) - 0.5) * 0.15, 0)
          dummy.updateMatrix()
          boxMesh.setMatrixAt(ki, dummy.matrix)
          boxMesh.setColorAt(ki, color.set(CARGO_COLORS[Math.floor(rand(seed + 3) * CARGO_COLORS.length)]))
          ki++
        }
    boxMesh.instanceMatrix.needsUpdate = true
    if (boxMesh.instanceColor) boxMesh.instanceColor.needsUpdate = true

    return { posts: postMesh, beams: beamMesh, boxes: boxMesh }
  }, [])

  return (
    <group>
      <primitive object={posts} />
      <primitive object={beams} />
      <primitive object={boxes} />
    </group>
  )
}

function Truck() {
  const wheels: Array<[number, number]> = []
  for (const x of [-2.6, 2.6, 4.2]) for (const z of [-1.2, 1.2]) wheels.push([x, z])
  return (
    <group position={[-11, 0, -8.6]}>
      <mesh position={[0, 1.9, 0]} castShadow>
        <boxGeometry args={[8, 2.8, 2.6]} />
        <meshStandardMaterial color="#c9d3df" roughness={0.6} />
      </mesh>
      <mesh position={[5.1, 1.4, 0]} castShadow>
        <boxGeometry args={[2.2, 2.2, 2.4]} />
        <meshStandardMaterial color="#15345f" roughness={0.5} />
      </mesh>
      {wheels.map(([x, z]) => (
        <mesh key={`${x}-${z}`} position={[x, 0.5, z]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.5, 0.5, 0.4, 16]} />
          <meshStandardMaterial color="#0a0f18" roughness={0.9} />
        </mesh>
      ))}
    </group>
  )
}

// Yuk oqimi: darvozadan bayga yorug‘ chiziq va unda siljiydigan nur.
// flow.p bilan bog‘langan: nur konteyner joylanguncha yo‘lda, keyin so‘nadi.
function FlowLine() {
  const pulse = useRef<THREE.Mesh>(null)
  const { curve, tube } = useMemo(() => {
    const c = new THREE.CatmullRomCurve3(
      [
        new THREE.Vector3(-22, 0.25, -1.8),
        new THREE.Vector3(-10, 0.25, -1.8),
        new THREE.Vector3(6, 0.25, -1.8),
        new THREE.Vector3(6, 0.25, -3.6),
        new THREE.Vector3(6, 0.25, -5.2),
      ],
      false,
      'catmullrom',
      0.2,
    )
    return { curve: c, tube: new THREE.TubeGeometry(c, 160, 0.035, 8, false) }
  }, [])
  const lineMat = useMemo(
    () => new THREE.MeshBasicMaterial({ color: '#f2d27a', transparent: true, opacity: 0.32, toneMapped: false }),
    [],
  )
  const glowMat = useMemo(
    () => new THREE.MeshBasicMaterial({ color: '#f2d27a', transparent: true, opacity: 0.35, toneMapped: false }),
    [],
  )

  useFrame(() => {
    const m = pulse.current
    if (!m) return
    const p = flow.p
    const k = clamp(p / 0.72, 0, 1)
    m.position.copy(curve.getPointAt(k))
    m.visible = p < 0.8
  })

  return (
    <group>
      <mesh geometry={tube} material={lineMat} />
      <mesh ref={pulse}>
        <sphereGeometry args={[0.13, 16, 16]} />
        <meshBasicMaterial color="#fff3c4" toneMapped={false} />
        <mesh scale={3} material={glowMat}>
          <sphereGeometry args={[0.13, 12, 12]} />
        </mesh>
      </mesh>
    </group>
  )
}

// Skanerlash va yorliq: dock'da lazer skaneri konteyner ustidan o‘tadi,
// joylashtirilgach bay ustida 3D yorliq paydo bo‘ladi. flow.p bilan bog‘langan.
function ScanTag() {
  const beam = useRef<THREE.Mesh>(null)
  const tag = useRef<THREE.Group>(null)
  const beamMat = useMemo(
    () =>
      new THREE.MeshBasicMaterial({
        color: '#ffe39a',
        transparent: true,
        opacity: 0.45,
        side: THREE.DoubleSide,
        depthWrite: false,
        toneMapped: false,
      }),
    [],
  )
  const tagMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: '#0b2545',
        roughness: 0.3,
        metalness: 0.2,
        emissive: '#c9a227',
        emissiveIntensity: 0.35,
      }),
    [],
  )
  const barMat = useMemo(() => new THREE.MeshBasicMaterial({ color: '#f2d27a', toneMapped: false }), [])

  useFrame((_, delta) => {
    const p = flow.p
    const b = beam.current
    if (b) {
      const scanning = p > 0.06 && p < 0.3
      b.visible = scanning
      // Lazer tekisligi konteyner ustidan chapdan o‘ngga siljiydi
      b.position.x = lerp(-12.4, -7.6, clamp(seg(p, 0.06, 0.3), 0, 1))
    }
    const g = tag.current
    if (g) {
      const target = p > 0.78 ? 1 : 0
      g.scale.setScalar(damp(g.scale.x, target, 6, delta) || 0.0001)
      g.visible = g.scale.x > 0.01
    }
  })

  return (
    <group>
      {/* Lazer skaneri (vertikal tekislik) */}
      <mesh ref={beam} position={[-12.4, 1.2, 0]} rotation={[0, Math.PI / 2, 0]} material={beamMat}>
        <planeGeometry args={[3.2, 2.8]} />
      </mesh>

      {/* Bay ustidagi yorliq */}
      <group ref={tag} position={[TARGET.x, 3.7, TARGET.z]}>
        <mesh material={tagMat}>
          <boxGeometry args={[1.5, 0.7, 0.06]} />
        </mesh>
        <mesh position={[0, -0.2, 0.035]} material={barMat}>
          <boxGeometry args={[1.1, 0.06, 0.01]} />
        </mesh>
        <mesh position={[0, 0.18, 0.035]} material={barMat}>
          <boxGeometry args={[0.6, 0.06, 0.01]} />
        </mesh>
      </group>
    </group>
  )
}

function Scene() {
  const fk = useRef<THREE.Group>(null)
  const forks = useRef<THREE.Group>(null)
  const cargo = useRef<THREE.Group>(null)
  const bayLight = useRef<THREE.PointLight>(null)
  const pointer = useRef({ x: 0, y: 0 })
  const isMobile = window.innerWidth < 768
  const cam = useRef({ x: -17, y: 3.4 })

  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      pointer.current.x = e.clientX / window.innerWidth - 0.5
      pointer.current.y = e.clientY / window.innerHeight - 0.5
    }
    window.addEventListener('pointermove', onMove)
    return () => window.removeEventListener('pointermove', onMove)
  }, [])

  useFrame((state, delta) => {
    const cam0 = state.camera as THREE.PerspectiveCamera
    const wantFov = cam0.aspect < 1 ? 72 : 50
    if (cam0.fov !== wantFov) {
      cam0.fov = wantFov
      cam0.updateProjectionMatrix()
    }
    const p = flow.p
    const pose = forkliftAt(p)
    if (fk.current) {
      fk.current.position.set(pose.x, 0, pose.z)
      fk.current.rotation.y = pose.th
    }
    if (forks.current) forks.current.position.y = pose.lift

    const c = cargoAt(p, pose)
    if (cargo.current) {
      cargo.current.position.set(c.x, c.y, c.z)
      cargo.current.rotation.y = c.th
    }
    if (bayLight.current) bayLight.current.intensity = 14 * seg(p, 0.7, 0.82)

    // Kamera yuk bilan birga yo‘lak bo‘ylab siljiydi, sichqoncha bilan yumshoq og‘adi
    const tx = lerp(-17, 9, smooth(p)) + pointer.current.x * 0.8
    const ty = 3.4 - pointer.current.y * 0.6
    cam.current.x = damp(cam.current.x, tx, 3, delta)
    cam.current.y = damp(cam.current.y, ty, 3, delta)
    state.camera.position.set(cam.current.x, cam.current.y, 11)
    state.camera.lookAt(cam.current.x + 7, 1.4, -1.2)
  })

  return (
    <>
      <ambientLight intensity={0.55} />
      <directionalLight position={[-8, 14, 10]} intensity={0.9} color="#dfe9ff" />
      {[-10, 0, 10, 20].map((x) => (
        <pointLight key={x} position={[x, 6.2, 0]} intensity={18} distance={22} color="#f2d27a" />
      ))}
      <pointLight ref={bayLight} position={[TARGET.x, 4.6, -1.2]} intensity={0} distance={12} color="#ffe39a" />

      {/* Pol va yo‘lak chiziqlari */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[140, 80]} />
        <meshStandardMaterial color="#0c2445" roughness={0.9} metalness={0.1} />
      </mesh>
      <gridHelper args={[140, 70, '#27507f', '#163764']} position={[0, 0.01, 0]} />
      {[-1.8, 1.8].map((z) => (
        <mesh key={z} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, z]}>
          <planeGeometry args={[140, 0.12]} />
          <meshBasicMaterial color="#c9a227" />
        </mesh>
      ))}

      <Racks />
      <Truck />

      {/* Forklift */}
      <group ref={fk}>
        <mesh position={[-0.1, 0.5, 0]} castShadow>
          <boxGeometry args={[1.8, 0.9, 1.4]} />
          <meshStandardMaterial color="#e0b43a" roughness={0.5} />
        </mesh>
        <mesh position={[-0.6, 1.45, 0.6]}>
          <boxGeometry args={[0.07, 1.1, 0.07]} />
          <meshStandardMaterial color="#15345f" />
        </mesh>
        <mesh position={[-0.6, 1.45, -0.6]}>
          <boxGeometry args={[0.07, 1.1, 0.07]} />
          <meshStandardMaterial color="#15345f" />
        </mesh>
        <mesh position={[-0.6, 2.0, 0]}>
          <boxGeometry args={[0.9, 0.08, 1.35]} />
          <meshStandardMaterial color="#15345f" />
        </mesh>
        {[-0.45, 0.45].map((z) => (
          <mesh key={z} position={[1.0, 1.25, z]}>
            <boxGeometry args={[0.08, 2.5, 0.08]} />
            <meshStandardMaterial color="#15345f" metalness={0.5} roughness={0.4} />
          </mesh>
        ))}
        {[-0.7, 0.7].map((z) => (
          <mesh key={`w-${z}`} position={[-0.7, 0.22, z]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.22, 0.22, 0.16, 14]} />
            <meshStandardMaterial color="#0a0f18" roughness={0.9} />
          </mesh>
        ))}
        {/* Forks guruhi — ko‘tarilish (lift) bilan birga harakatlanadi */}
        <group ref={forks}>
          {[-0.45, 0.45].map((z) => (
            <mesh key={`f-${z}`} position={[0.9, 0.12, z]}>
              <boxGeometry args={[1.4, 0.07, 0.16]} />
              <meshStandardMaterial color="#c9a227" metalness={0.6} roughness={0.35} />
            </mesh>
          ))}
          <mesh position={[1.0, 0.5, 0]}>
            <boxGeometry args={[0.1, 0.8, 1.2]} />
            <meshStandardMaterial color="#15345f" />
          </mesh>
        </group>
      </group>

      {/* Konteyner (yuk) */}
      <group ref={cargo}>
        <mesh castShadow>
          <boxGeometry args={[3, 2.4, 2.2]} />
          <meshStandardMaterial color="#8a6d1f" roughness={0.7} metalness={0.2} />
          <Edges color="#f2d27a" />
        </mesh>
      </group>

      {/* Yuk oqimi */}
      <FlowLine />
      <ScanTag />

      {/* Chang zarralari — atmosfera */}
      <Sparkles count={isMobile ? 0 : 70} scale={[40, 6, 16]} position={[4, 3, 0]} size={2.5} speed={0.25} color="#f2d27a" opacity={0.7} />
    </>
  )
}

export default function WarehouseScene() {
  return (
    <Canvas
      camera={{ position: [-17, 3.4, 11], fov: 50, near: 0.1, far: 200 }}
      dpr={window.innerWidth < 768 ? 1 : [1, 1.5]}
      gl={{ antialias: true }}
      onCreated={({ scene }) => {
        scene.background = new THREE.Color('#0b2545')
        scene.fog = new THREE.Fog('#0b2545', 18, 60)
      }}
    >
      <Scene />
    </Canvas>
  )
}

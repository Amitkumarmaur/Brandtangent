"use client"

import { useRef, useMemo } from "react"
import { Canvas, useFrame } from "@react-three/fiber"
import { OrbitControls } from "@react-three/drei"
import * as THREE from "three"

function Node({ position, color = "#FF5722" }: { position: [number, number, number]; color?: string }) {
  const meshRef = useRef<THREE.Mesh>(null)
  const pulseRef = useRef(0)

  useFrame((state) => {
    if (meshRef.current) {
      pulseRef.current += 0.02
      const scale = 1 + Math.sin(pulseRef.current + position[0]) * 0.2
      meshRef.current.scale.setScalar(scale)
    }
  })

  return (
    <mesh ref={meshRef} position={position}>
      <sphereGeometry args={[0.15, 16, 16]} />
      <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.5} />
    </mesh>
  )
}

function Connection({ start, end }: { start: [number, number, number]; end: [number, number, number] }) {
  const lineRef = useRef<THREE.Line>(null)

  const points = useMemo(() => {
    return [new THREE.Vector3(...start), new THREE.Vector3(...end)]
  }, [start, end])

  const geometry = useMemo(() => {
    return new THREE.BufferGeometry().setFromPoints(points)
  }, [points])

  return (
    <line ref={lineRef} geometry={geometry}>
      <lineBasicMaterial color="#FF5722" opacity={0.3} transparent />
    </line>
  )
}

function NetworkScene() {
  const groupRef = useRef<THREE.Group>(null)

  const nodes: [number, number, number][] = [
    [0, 0, 0],
    [2, 1, 0],
    [-2, 1, 0],
    [1, -1.5, 1],
    [-1, -1.5, -1],
    [0, 2, 1],
    [2, -1, -1],
    [-2, -1, 1],
  ]

  const connections: [[number, number, number], [number, number, number]][] = [
    [nodes[0], nodes[1]],
    [nodes[0], nodes[2]],
    [nodes[0], nodes[3]],
    [nodes[0], nodes[4]],
    [nodes[0], nodes[5]],
    [nodes[1], nodes[5]],
    [nodes[2], nodes[5]],
    [nodes[1], nodes[6]],
    [nodes[2], nodes[7]],
    [nodes[3], nodes[6]],
    [nodes[4], nodes[7]],
  ]

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.1
    }
  })

  return (
    <group ref={groupRef}>
      {nodes.map((pos, i) => (
        <Node key={i} position={pos} color={i === 0 ? "#FF5722" : i % 2 === 0 ? "#10B981" : "#7D7D7D"} />
      ))}
      {connections.map(([start, end], i) => (
        <Connection key={i} start={start} end={end} />
      ))}
    </group>
  )
}

export default function NetworkGraph() {
  return (
    <Canvas camera={{ position: [0, 0, 6], fov: 50 }}>
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} intensity={1} />
      <NetworkScene />
      <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={0.5} />
    </Canvas>
  )
}

"use client"

import { useRef, Suspense } from "react"
import { Canvas, useFrame } from "@react-three/fiber"
import { Sphere } from "@react-three/drei"
import * as THREE from "three"

function GlobeMesh() {
  const groupRef = useRef<THREE.Group>(null)

  useFrame((state) => {
    if (groupRef.current) {
      // Rotate the globe slowly
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.1
    }
  })

  return (
    <group ref={groupRef} rotation={[0.4, 0, 0]}>
      {/* Inner solid sphere (pristine light surface) */}
      <Sphere args={[2.8, 64, 64]}>
        <meshStandardMaterial 
          color="#F8F8F8" 
          roughness={0.7} 
          metalness={0.1}
        />
      </Sphere>
      
      {/* Outer subtle tech wireframe (creates the longitude/latitude effect without a halo) */}
      <Sphere args={[2.82, 32, 24]}>
        <meshStandardMaterial 
          color="#FF5722" 
          wireframe={true} 
          transparent={true}
          opacity={0.15} 
        />
      </Sphere>

      {/* Floating data dots/satellites around the globe */}
      {Array.from({ length: 40 }).map((_, i) => {
        const phi = Math.acos(-1 + (2 * i) / 40)
        const theta = Math.sqrt(40 * Math.PI) * phi
        return (
          <mesh 
            key={i} 
            position={[
              3.2 * Math.cos(theta) * Math.sin(phi),
              3.2 * Math.sin(theta) * Math.sin(phi),
              3.2 * Math.cos(phi)
            ]}
          >
            <sphereGeometry args={[0.03, 8, 8]} />
            <meshBasicMaterial color="#0A0A0A" transparent opacity={0.3} />
          </mesh>
        )
      })}
    </group>
  )
}

export default function TechGlobe() {
  return (
    <div className="w-full h-full absolute inset-0 pointer-events-none">
      <Canvas camera={{ position: [0, 0, 7], fov: 45 }}>
        <ambientLight intensity={1.5} />
        <directionalLight position={[10, 10, 5]} intensity={2} color="#ffffff" />
        <directionalLight position={[-10, 10, -5]} intensity={1} color="#FF5722" />
        <Suspense fallback={null}>
          <GlobeMesh />
        </Suspense>
      </Canvas>
    </div>
  )
}

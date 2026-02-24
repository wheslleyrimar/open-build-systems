import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import * as THREE from 'three'
import { Label3D } from './Label3D'
import { FlowParticle } from './FlowParticle'
import { ConnectionLine } from './ConnectionLine'

const PRIMARY_POS: [number, number, number] = [0, 0.65, 0]
const REPLICA1_POS: [number, number, number] = [-2.2, 0.65, 0]
const REPLICA2_POS: [number, number, number] = [2.2, 0.65, 0]

function DatabaseInstance({
  position,
  color,
  label,
  isPrimary,
}: {
  position: [number, number, number]
  color: string
  label: string
  isPrimary: boolean
}) {
  const ref = useRef<THREE.Group>(null)
  useFrame((_, delta) => {
    if (ref.current) ref.current.rotation.y += delta * 0.08
  })
  return (
    <group ref={ref} position={position}>
      {/* Três “discos” empilhados (cilindros) */}
      <mesh position={[0, 0.25, 0]} castShadow>
        <cylinderGeometry args={[0.48, 0.56, 0.22, 24]} />
        <meshStandardMaterial color={color} metalness={0.35} roughness={0.55} />
      </mesh>
      <mesh position={[0, 0.55, 0]} castShadow>
        <cylinderGeometry args={[0.56, 0.5, 0.22, 24]} />
        <meshStandardMaterial color={color} metalness={0.35} roughness={0.55} />
      </mesh>
      <mesh position={[0, 0.85, 0]} castShadow>
        <cylinderGeometry args={[0.5, 0.54, 0.22, 24]} />
        <meshStandardMaterial color={color} metalness={0.35} roughness={0.55} />
      </mesh>
      {isPrimary && (
        <mesh position={[0.35, 0.55, 0.28]} castShadow>
          <sphereGeometry args={[0.06, 8, 8]} />
          <meshStandardMaterial color="#22c55e" emissive="#22c55e" emissiveIntensity={0.5} />
        </mesh>
      )}
      <Label3D yOffset={1.05}>{label}</Label3D>
    </group>
  )
}

export function SceneDatabase() {
  return (
    <>
      <ambientLight intensity={0.55} />
      <directionalLight position={[5, 8, 5]} intensity={1.2} castShadow shadow-mapSize={[1024, 1024]} />
      <pointLight position={[0, 4, 2]} intensity={0.4} color="#3b82f6" />
      <OrbitControls enableZoom enablePan maxDistance={20} minDistance={3} />
      <DatabaseInstance position={[0, 0, 0]} color="#2563eb" label="Primary (R/W)" isPrimary />
      <DatabaseInstance position={[-2.2, 0, 0]} color="#15803d" label="Replica 1 (Read)" isPrimary={false} />
      <DatabaseInstance position={[2.2, 0, 0]} color="#15803d" label="Replica 2 (Read)" isPrimary={false} />
      <ConnectionLine from={PRIMARY_POS} to={REPLICA1_POS} color="#334155" radius={0.02} />
      <ConnectionLine from={PRIMARY_POS} to={REPLICA2_POS} color="#334155" radius={0.02} />
      <FlowParticle path={[PRIMARY_POS, REPLICA1_POS]} speed={0.14} color="#34d399" size={0.09} />
      <FlowParticle path={[PRIMARY_POS, REPLICA2_POS]} speed={0.14} color="#34d399" size={0.09} />
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1, 0]} receiveShadow>
        <planeGeometry args={[20, 20]} />
        <meshStandardMaterial color="#0f172a" />
      </mesh>
    </>
  )
}

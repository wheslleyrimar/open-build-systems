import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import * as THREE from 'three'
import { Label3D } from './Label3D'
import { FlowParticle } from './FlowParticle'
import { ConnectionLine } from './ConnectionLine'

const ORIGIN_POS: [number, number, number] = [0, 1.6, 0]
const CDN_POS: [number, number, number] = [0, 0.4, 0]
const POP_POSITIONS: [number, number, number][] = [[-2.2, -0.6, 0], [0, -0.6, 0], [2.2, -0.6, 0]]

function EdgePoP({ position, label }: { position: [number, number, number]; label: string }) {
  const ref = useRef<THREE.Mesh>(null)
  useFrame((_, delta) => {
    if (ref.current) ref.current.rotation.y += delta * 0.2
  })
  return (
    <group position={position}>
      <mesh ref={ref} castShadow>
        <sphereGeometry args={[0.52, 24, 24]} />
        <meshStandardMaterial color="#0891b2" metalness={0.3} roughness={0.5} emissive="#06b6d4" emissiveIntensity={0.18} />
      </mesh>
      <Label3D yOffset={0.68}>{label}</Label3D>
    </group>
  )
}

function OriginNode() {
  const ref = useRef<THREE.Group>(null)
  useFrame((_, delta) => {
    if (ref.current) ref.current.rotation.y += delta * 0.08
  })
  return (
    <group ref={ref} position={ORIGIN_POS}>
      <mesh castShadow>
        <boxGeometry args={[1.5, 0.9, 0.9]} />
        <meshStandardMaterial color="#475569" metalness={0.4} roughness={0.5} />
      </mesh>
      <Label3D yOffset={0.6}>Origin</Label3D>
    </group>
  )
}

function CDNLayer() {
  const ref = useRef<THREE.Mesh>(null)
  useFrame((_, delta) => {
    if (ref.current) ref.current.rotation.y += delta * 0.06
  })
  return (
    <group position={CDN_POS}>
      <mesh ref={ref} castShadow>
        <cylinderGeometry args={[1.15, 1.35, 0.35, 32]} />
        <meshStandardMaterial color="#0e7490" metalness={0.3} roughness={0.55} emissive="#06b6d4" emissiveIntensity={0.1} />
      </mesh>
      <Label3D yOffset={0.3}>CDN (Edge)</Label3D>
    </group>
  )
}

export function SceneCDN() {
  return (
    <>
      <ambientLight intensity={0.55} />
      <directionalLight position={[5, 8, 5]} intensity={1.2} castShadow shadow-mapSize={[1024, 1024]} />
      <pointLight position={[0, 2, 2]} intensity={0.5} color="#22d3ee" />
      <OrbitControls enableZoom enablePan maxDistance={20} minDistance={3} />
      <OriginNode />
      <CDNLayer />
      {POP_POSITIONS.map((pos, i) => (
        <EdgePoP key={i} position={pos} label={`PoP ${i + 1}`} />
      ))}
      <ConnectionLine from={ORIGIN_POS} to={CDN_POS} color="#475569" radius={0.03} />
      {POP_POSITIONS.map((pos) => (
        <ConnectionLine key={pos[0]} from={CDN_POS} to={pos} color="#334155" radius={0.022} />
      ))}
      <FlowParticle path={[ORIGIN_POS, CDN_POS]} speed={0.18} color="#06b6d4" size={0.1} />
      <FlowParticle path={[CDN_POS, POP_POSITIONS[0]]} speed={0.2} color="#22d3ee" size={0.09} />
      <FlowParticle path={[CDN_POS, POP_POSITIONS[1]]} speed={0.2} color="#22d3ee" size={0.09} />
      <FlowParticle path={[CDN_POS, POP_POSITIONS[2]]} speed={0.2} color="#22d3ee" size={0.09} />
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1, 0]} receiveShadow>
        <planeGeometry args={[20, 20]} />
        <meshStandardMaterial color="#0f172a" />
      </mesh>
    </>
  )
}

import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import * as THREE from 'three'
import { Label3D } from './Label3D'
import { FlowParticle } from './FlowParticle'
import { ConnectionLine } from './ConnectionLine'

const SERVICES: { position: [number, number, number]; color: string; label: string }[] = [
  { position: [0, 1.35, 0], color: '#5b21b6', label: 'API Gateway' },
  { position: [-1.7, 0.1, 0], color: '#0e7490', label: 'Auth' },
  { position: [0, 0.1, 0], color: '#047857', label: 'Users' },
  { position: [1.7, 0.1, 0], color: '#b45309', label: 'Orders' },
  { position: [0, -1.15, 0], color: '#be185d', label: 'Notifications' },
]

function ServiceNode({ position, color, label }: { position: [number, number, number]; color: string; label: string }) {
  const ref = useRef<THREE.Mesh>(null)
  useFrame((_, delta) => {
    if (ref.current) ref.current.rotation.y += delta * 0.15
  })
  return (
    <group position={position}>
      <mesh ref={ref} castShadow>
        <boxGeometry args={[0.95, 0.95, 0.45]} />
        <meshStandardMaterial color={color} metalness={0.2} roughness={0.65} />
      </mesh>
      <mesh castShadow position={[0, 0.35, 0.24]}>
        <boxGeometry args={[0.5, 0.08, 0.02]} />
        <meshStandardMaterial color="#334155" />
      </mesh>
      <Label3D yOffset={0.65}>{label}</Label3D>
    </group>
  )
}

export function SceneMicroservices() {
  const gateway = SERVICES[0].position
  const auth = SERVICES[1].position
  const users = SERVICES[2].position
  const orders = SERVICES[3].position
  const notifications = SERVICES[4].position

  return (
    <>
      <ambientLight intensity={0.55} />
      <directionalLight position={[5, 8, 5]} intensity={1.2} castShadow shadow-mapSize={[1024, 1024]} />
      <pointLight position={[0, 3, 3]} intensity={0.5} color="#a78bfa" />
      <OrbitControls enableZoom enablePan maxDistance={20} minDistance={3} />
      {SERVICES.map((s, i) => (
        <ServiceNode key={i} position={s.position} color={s.color} label={s.label} />
      ))}
      <ConnectionLine from={gateway} to={auth} color="#475569" radius={0.018} />
      <ConnectionLine from={gateway} to={users} color="#475569" radius={0.018} />
      <ConnectionLine from={gateway} to={orders} color="#475569" radius={0.018} />
      <ConnectionLine from={gateway} to={notifications} color="#475569" radius={0.018} />
      <ConnectionLine from={orders} to={notifications} color="#475569" radius={0.018} />
      <FlowParticle path={[gateway, auth]} speed={0.2} color="#a78bfa" size={0.08} />
      <FlowParticle path={[gateway, users]} speed={0.2} color="#a78bfa" size={0.08} />
      <FlowParticle path={[gateway, orders]} speed={0.2} color="#a78bfa" size={0.08} />
      <FlowParticle path={[orders, notifications]} speed={0.22} color="#f472b6" size={0.08} />
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.5, 0]} receiveShadow>
        <planeGeometry args={[20, 20]} />
        <meshStandardMaterial color="#0f172a" />
      </mesh>
    </>
  )
}

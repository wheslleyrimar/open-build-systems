import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import * as THREE from 'three'
import { Label3D } from './Label3D'
import { FlowParticle } from './FlowParticle'
import { ConnectionLine } from './ConnectionLine'

const SERVER_POSITIONS: [number, number, number][] = [[-2.8, -0.6, 0], [0, -0.6, 0], [2.8, -0.6, 0]]
const CLIENT_POS: [number, number, number] = [0, 2.4, 0]
const LB_POS: [number, number, number] = [0, 1.2, 0]

function ServerRack({ position, label }: { position: [number, number, number]; label: string }) {
  const ref = useRef<THREE.Group>(null)
  useFrame((_, delta) => {
    if (ref.current) ref.current.rotation.y += delta * 0.15
  })
  return (
    <group ref={ref} position={position}>
      {/* Chassis tipo rack: base + painel frontal com “slots” */}
      <mesh castShadow receiveShadow position={[0, 0.35, 0]}>
        <boxGeometry args={[1.1, 0.7, 0.55]} />
        <meshStandardMaterial color="#1e293b" metalness={0.5} roughness={0.4} />
      </mesh>
      <mesh castShadow position={[0, 0.35, 0.28]}>
        <boxGeometry args={[0.95, 0.5, 0.05]} />
        <meshStandardMaterial color="#334155" metalness={0.6} roughness={0.3} />
      </mesh>
      <mesh castShadow position={[0, 0.15, 0.28]}>
        <boxGeometry args={[0.3, 0.08, 0.02]} />
        <meshStandardMaterial color="#22c55e" emissive="#22c55e" emissiveIntensity={0.3} />
      </mesh>
      <Label3D yOffset={0.85}>{label}</Label3D>
    </group>
  )
}

function LoadBalancerNode() {
  const ref = useRef<THREE.Group>(null)
  useFrame((_, delta) => {
    if (ref.current) ref.current.rotation.y += delta * 0.1
  })
  return (
    <group ref={ref} position={LB_POS}>
      {/* Forma de “switch” / equipamento de rede: mais largo e baixo */}
      <mesh castShadow receiveShadow position={[0, 0, 0]}>
        <boxGeometry args={[2.4, 0.35, 1]} />
        <meshStandardMaterial color="#4c1d95" metalness={0.5} roughness={0.4} emissive="#5b21b6" emissiveIntensity={0.15} />
      </mesh>
      {/* Indicadores de portas */}
      {[-0.7, 0, 0.7].map((x, i) => (
        <mesh key={i} castShadow position={[x, 0.18, 0.45]}>
          <boxGeometry args={[0.12, 0.06, 0.04]} />
          <meshStandardMaterial color="#7c3aed" emissive="#7c3aed" emissiveIntensity={0.4} />
        </mesh>
      ))}
      <Label3D yOffset={0.4}>Load Balancer</Label3D>
    </group>
  )
}

function ClientsNode() {
  const ref = useRef<THREE.Group>(null)
  useFrame((_, delta) => {
    if (ref.current) ref.current.rotation.y += delta * 0.08
  })
  return (
    <group ref={ref} position={CLIENT_POS}>
      <mesh castShadow position={[0, 0.15, 0]}>
        <boxGeometry args={[1.5, 0.25, 0.9]} />
        <meshStandardMaterial color="#0e7490" metalness={0.2} roughness={0.7} />
      </mesh>
      <mesh castShadow position={[0, 0.05, 0.4]}>
        <boxGeometry args={[1.2, 0.02, 0.5]} />
        <meshStandardMaterial color="#164e63" />
      </mesh>
      <Label3D yOffset={0.35}>Requisições (clientes)</Label3D>
    </group>
  )
}

export function SceneLoadBalancer() {
  return (
    <>
      <ambientLight intensity={0.55} />
      <directionalLight position={[5, 8, 5]} intensity={1.2} castShadow shadow-mapSize={[1024, 1024]} />
      <pointLight position={[-3, 2, 2]} intensity={0.35} color="#22d3ee" />
      <OrbitControls enableZoom enablePan maxDistance={22} minDistance={4} />
      <ClientsNode />
      <LoadBalancerNode />
      {SERVER_POSITIONS.map((pos, i) => (
        <ServerRack key={i} position={pos} label={`Server ${i + 1}`} />
      ))}
      {/* Conexões físicas (tubos) */}
      <ConnectionLine from={CLIENT_POS} to={LB_POS} color="#64748b" radius={0.025} />
      {SERVER_POSITIONS.map((pos) => (
        <ConnectionLine key={pos[0]} from={LB_POS} to={pos} color="#334155" radius={0.02} />
      ))}
      {/* Fluxo de requisições animado */}
      <FlowParticle path={[CLIENT_POS, LB_POS, SERVER_POSITIONS[0]]} speed={0.18} color="#22d3ee" size={0.1} />
      <FlowParticle path={[CLIENT_POS, LB_POS, SERVER_POSITIONS[1]]} speed={0.18} color="#22d3ee" size={0.1} />
      <FlowParticle path={[CLIENT_POS, LB_POS, SERVER_POSITIONS[2]]} speed={0.18} color="#22d3ee" size={0.1} />
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.2, 0]} receiveShadow>
        <planeGeometry args={[20, 20]} />
        <meshStandardMaterial color="#0f172a" />
      </mesh>
    </>
  )
}

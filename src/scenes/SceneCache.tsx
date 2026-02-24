import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import * as THREE from 'three'
import { Label3D } from './Label3D'
import { FlowParticle } from './FlowParticle'
import { ConnectionLine } from './ConnectionLine'

const APP_POS: [number, number, number] = [-2.8, 0.5, 0]
const CACHE_POS: [number, number, number] = [0, 0.7, 0]
const DB_POS: [number, number, number] = [2.8, 0.55, 0]

function CacheNode() {
  const ref = useRef<THREE.Group>(null)
  useFrame((_, delta) => {
    if (ref.current) ref.current.rotation.y += delta * 0.2
  })
  return (
    <group ref={ref} position={CACHE_POS}>
      {/* Forma de “storage” em memória: cilindro + anel */}
      <mesh castShadow>
        <cylinderGeometry args={[0.9, 1.05, 0.9, 32]} />
        <meshStandardMaterial color="#b45309" metalness={0.2} roughness={0.65} emissive="#d97706" emissiveIntensity={0.12} />
      </mesh>
      <mesh castShadow position={[0, 0.5, 0]}>
        <torusGeometry args={[1.1, 0.06, 12, 24]} />
        <meshStandardMaterial color="#f59e0b" metalness={0.3} roughness={0.5} />
      </mesh>
      <Label3D yOffset={0.75}>Cache (Redis)</Label3D>
    </group>
  )
}

function AppNode() {
  const ref = useRef<THREE.Group>(null)
  useFrame((_, delta) => {
    if (ref.current) ref.current.rotation.y += delta * 0.08
  })
  return (
    <group ref={ref} position={APP_POS}>
      <mesh castShadow>
        <boxGeometry args={[1.2, 1, 0.7]} />
        <meshStandardMaterial color="#0e7490" metalness={0.25} roughness={0.6} />
      </mesh>
      <mesh castShadow position={[0, 0.1, 0.32]}>
        <boxGeometry args={[0.8, 0.08, 0.4]} />
        <meshStandardMaterial color="#155e75" />
      </mesh>
      <Label3D yOffset={0.7}>Aplicação</Label3D>
    </group>
  )
}

function DBNode() {
  const ref = useRef<THREE.Group>(null)
  useFrame((_, delta) => {
    if (ref.current) ref.current.rotation.y += delta * 0.05
  })
  return (
    <group ref={ref} position={DB_POS}>
      {/* Banco: pilha de “discos” (cilindros) */}
      <mesh position={[0, 0.2, 0]} castShadow>
        <cylinderGeometry args={[0.5, 0.58, 0.25, 24]} />
        <meshStandardMaterial color="#475569" metalness={0.4} roughness={0.5} />
      </mesh>
      <mesh position={[0, 0.5, 0]} castShadow>
        <cylinderGeometry args={[0.58, 0.52, 0.25, 24]} />
        <meshStandardMaterial color="#475569" metalness={0.4} roughness={0.5} />
      </mesh>
      <mesh position={[0, 0.8, 0]} castShadow>
        <cylinderGeometry args={[0.52, 0.55, 0.25, 24]} />
        <meshStandardMaterial color="#475569" metalness={0.4} roughness={0.5} />
      </mesh>
      <Label3D yOffset={1.05}>Banco de dados</Label3D>
    </group>
  )
}

export function SceneCache() {
  return (
    <>
      <ambientLight intensity={0.55} />
      <directionalLight position={[5, 8, 5]} intensity={1.2} castShadow shadow-mapSize={[1024, 1024]} />
      <pointLight position={[0, 3, 2]} intensity={0.45} color="#fbbf24" />
      <OrbitControls enableZoom enablePan maxDistance={20} minDistance={3} />
      <CacheNode />
      <AppNode />
      <DBNode />
      {/* Conexões: App–Cache, Cache–DB, DB–Cache (miss), Cache–App (resposta) */}
      <ConnectionLine from={APP_POS} to={CACHE_POS} color="#64748b" radius={0.025} />
      <ConnectionLine from={CACHE_POS} to={DB_POS} color="#64748b" radius={0.02} />
      <ConnectionLine from={DB_POS} to={CACHE_POS} color="#475569" radius={0.02} />
      <ConnectionLine from={CACHE_POS} to={APP_POS} color="#475569" radius={0.02} />
      <FlowParticle path={[APP_POS, CACHE_POS]} speed={0.22} color="#22d3ee" size={0.1} />
      <FlowParticle path={[CACHE_POS, DB_POS]} speed={0.18} color="#f59e0b" size={0.1} />
      <FlowParticle path={[DB_POS, CACHE_POS]} speed={0.18} color="#34d399" size={0.1} />
      <FlowParticle path={[CACHE_POS, APP_POS]} speed={0.22} color="#34d399" size={0.1} />
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1, 0]} receiveShadow>
        <planeGeometry args={[20, 20]} />
        <meshStandardMaterial color="#0f172a" />
      </mesh>
    </>
  )
}

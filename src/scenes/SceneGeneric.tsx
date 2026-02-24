import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import * as THREE from 'three'
import { Label3D } from './Label3D'
import { FlowParticle } from './FlowParticle'
import { ConnectionLine } from './ConnectionLine'

type NodeConfig = { position: [number, number, number]; label: string; color: string }
type ConnectionConfig = { from: [number, number, number]; to: [number, number, number] }
type FlowConfig = { path: [number, number, number][]; color?: string }

const SCENE_CONFIG: Record<
  string,
  { nodes: NodeConfig[]; connections: ConnectionConfig[]; flows: FlowConfig[] }
> = {
  'message-queue': {
    nodes: [
      { position: [-2.2, 0.5, 0], label: 'Produtor', color: '#22d3ee' },
      { position: [0, 0.5, 0], label: 'Fila (Kafka/SQS)', color: '#8b5cf6' },
      { position: [2.2, 0.5, 0], label: 'Consumidor', color: '#34d399' },
    ],
    connections: [
      { from: [-2.2, 0.5, 0], to: [0, 0.5, 0] },
      { from: [0, 0.5, 0], to: [2.2, 0.5, 0] },
    ],
    flows: [{ path: [[-2.2, 0.5, 0], [0, 0.5, 0], [2.2, 0.5, 0]], color: '#a78bfa' }],
  },
  'api-gateway': {
    nodes: [
      { position: [0, 1.2, 0], label: 'Clientes', color: '#22d3ee' },
      { position: [0, 0.4, 0], label: 'API Gateway', color: '#7c3aed' },
      { position: [-1.5, -0.4, 0], label: 'Auth', color: '#34d399' },
      { position: [0, -0.4, 0], label: 'Users', color: '#34d399' },
      { position: [1.5, -0.4, 0], label: 'Orders', color: '#34d399' },
    ],
    connections: [
      { from: [0, 1.2, 0], to: [0, 0.4, 0] },
      { from: [0, 0.4, 0], to: [-1.5, -0.4, 0] },
      { from: [0, 0.4, 0], to: [0, -0.4, 0] },
      { from: [0, 0.4, 0], to: [1.5, -0.4, 0] },
    ],
    flows: [
      { path: [[0, 1.2, 0], [0, 0.4, 0], [-1.5, -0.4, 0]] },
      { path: [[0, 0.4, 0], [0, -0.4, 0]] },
    ],
  },
  'rate-limiting': {
    nodes: [
      { position: [-2, 0.5, 0], label: 'Requisições', color: '#22d3ee' },
      { position: [0, 0.5, 0], label: 'Rate Limiter', color: '#f59e0b' },
      { position: [2, 0.5, 0], label: 'Backend', color: '#34d399' },
    ],
    connections: [
      { from: [-2, 0.5, 0], to: [0, 0.5, 0] },
      { from: [0, 0.5, 0], to: [2, 0.5, 0] },
    ],
    flows: [{ path: [[-2, 0.5, 0], [0, 0.5, 0], [2, 0.5, 0]], color: '#fbbf24' }],
  },
  'service-discovery': {
    nodes: [
      { position: [-2, 0.5, 0], label: 'Cliente', color: '#22d3ee' },
      { position: [0, 0.5, 0], label: 'Registry', color: '#0ea5e9' },
      { position: [2, 0.5, 0], label: 'Instâncias', color: '#34d399' },
    ],
    connections: [
      { from: [-2, 0.5, 0], to: [0, 0.5, 0] },
      { from: [0, 0.5, 0], to: [2, 0.5, 0] },
    ],
    flows: [{ path: [[-2, 0.5, 0], [0, 0.5, 0], [2, 0.5, 0]] }],
  },
  'circuit-breaker': {
    nodes: [
      { position: [-2, 0.5, 0], label: 'Cliente', color: '#22d3ee' },
      { position: [0, 0.5, 0], label: 'Circuit Breaker', color: '#f59e0b' },
      { position: [2, 0.5, 0], label: 'Serviço', color: '#ef4444' },
    ],
    connections: [
      { from: [-2, 0.5, 0], to: [0, 0.5, 0] },
      { from: [0, 0.5, 0], to: [2, 0.5, 0] },
    ],
    flows: [{ path: [[-2, 0.5, 0], [0, 0.5, 0], [2, 0.5, 0]], color: '#fbbf24' }],
  },
  'consistent-hashing': {
    nodes: [
      { position: [0, 0.8, 0], label: 'Anel', color: '#475569' },
      { position: [-1.2, -0.3, 0], label: 'Nó A', color: '#34d399' },
      { position: [1.2, -0.3, 0], label: 'Nó B', color: '#34d399' },
      { position: [0, -0.9, 0], label: 'Nó C', color: '#34d399' },
    ],
    connections: [
      { from: [0, 0.8, 0], to: [-1.2, -0.3, 0] },
      { from: [0, 0.8, 0], to: [1.2, -0.3, 0] },
      { from: [0, 0.8, 0], to: [0, -0.9, 0] },
    ],
    flows: [],
  },
  'object-storage': {
    nodes: [
      { position: [-2, 0.5, 0], label: 'App', color: '#22d3ee' },
      { position: [0, 0.5, 0], label: 'S3 / Object Storage', color: '#f59e0b' },
      { position: [2, 0.5, 0], label: 'Blob', color: '#34d399' },
    ],
    connections: [
      { from: [-2, 0.5, 0], to: [0, 0.5, 0] },
      { from: [0, 0.5, 0], to: [2, 0.5, 0] },
    ],
    flows: [{ path: [[-2, 0.5, 0], [0, 0.5, 0], [2, 0.5, 0]], color: '#fbbf24' }],
  },
  search: {
    nodes: [
      { position: [-2, 0.5, 0], label: 'Query', color: '#22d3ee' },
      { position: [0, 0.5, 0], label: 'Elasticsearch', color: '#0d9488' },
      { position: [2, 0.5, 0], label: 'Documentos', color: '#34d399' },
    ],
    connections: [
      { from: [-2, 0.5, 0], to: [0, 0.5, 0] },
      { from: [0, 0.5, 0], to: [2, 0.5, 0] },
    ],
    flows: [{ path: [[-2, 0.5, 0], [0, 0.5, 0], [2, 0.5, 0]] }],
  },
  websockets: {
    nodes: [
      { position: [-2, 0.5, 0], label: 'Cliente', color: '#22d3ee' },
      { position: [0, 0.5, 0], label: 'WebSocket', color: '#a78bfa' },
      { position: [2, 0.5, 0], label: 'Servidor', color: '#34d399' },
    ],
    connections: [
      { from: [-2, 0.5, 0], to: [0, 0.5, 0] },
      { from: [0, 0.5, 0], to: [2, 0.5, 0] },
    ],
    flows: [
      { path: [[-2, 0.5, 0], [0, 0.5, 0], [2, 0.5, 0]], color: '#a78bfa' },
      { path: [[2, 0.5, 0], [0, 0.5, 0], [-2, 0.5, 0]], color: '#34d399' },
    ],
  },
  pubsub: {
    nodes: [
      { position: [-2, 0.5, 0], label: 'Publicador', color: '#22d3ee' },
      { position: [0, 0.5, 0], label: 'Tópico', color: '#ec4899' },
      { position: [1.8, -0.6, 0], label: 'Assinante 1', color: '#34d399' },
      { position: [1.8, 0, 0], label: 'Assinante 2', color: '#34d399' },
      { position: [1.8, 0.6, 0], label: 'Assinante 3', color: '#34d399' },
    ],
    connections: [
      { from: [-2, 0.5, 0], to: [0, 0.5, 0] },
      { from: [0, 0.5, 0], to: [1.8, -0.6, 0] },
      { from: [0, 0.5, 0], to: [1.8, 0, 0] },
      { from: [0, 0.5, 0], to: [1.8, 0.6, 0] },
    ],
    flows: [
      { path: [[-2, 0.5, 0], [0, 0.5, 0], [1.8, -0.6, 0]], color: '#f472b6' },
      { path: [[-2, 0.5, 0], [0, 0.5, 0], [1.8, 0.6, 0]], color: '#f472b6' },
    ],
  },
  'cap-theorem': {
    nodes: [
      { position: [-1.2, 0.5, 0], label: 'Consistência', color: '#8b5cf6' },
      { position: [1.2, 0.5, 0], label: 'Disponibilidade', color: '#22d3ee' },
      { position: [0, -0.6, 0], label: 'Partição', color: '#f59e0b' },
    ],
    connections: [
      { from: [-1.2, 0.5, 0], to: [0, -0.6, 0] },
      { from: [1.2, 0.5, 0], to: [0, -0.6, 0] },
    ],
    flows: [],
  },
  idempotency: {
    nodes: [
      { position: [-2, 0.5, 0], label: 'Cliente', color: '#22d3ee' },
      { position: [0, 0.5, 0], label: 'Idempotency Key', color: '#f59e0b' },
      { position: [2, 0.5, 0], label: 'Serviço', color: '#34d399' },
    ],
    connections: [
      { from: [-2, 0.5, 0], to: [0, 0.5, 0] },
      { from: [0, 0.5, 0], to: [2, 0.5, 0] },
    ],
    flows: [{ path: [[-2, 0.5, 0], [0, 0.5, 0], [2, 0.5, 0]], color: '#a78bfa' }],
  },
  observability: {
    nodes: [
      { position: [-1.5, 0.5, 0], label: 'Métricas', color: '#22d3ee' },
      { position: [0, 0.5, 0], label: 'Logs', color: '#f59e0b' },
      { position: [1.5, 0.5, 0], label: 'Traces', color: '#34d399' },
    ],
    connections: [
      { from: [-1.5, 0.5, 0], to: [0, 0.5, 0] },
      { from: [0, 0.5, 0], to: [1.5, 0.5, 0] },
    ],
    flows: [{ path: [[-1.5, 0.5, 0], [0, 0.5, 0], [1.5, 0.5, 0]], color: '#64748b' }],
  },
  bff: {
    nodes: [
      { position: [0, 1, 0], label: 'Cliente', color: '#22d3ee' },
      { position: [0, 0.3, 0], label: 'BFF', color: '#8b5cf6' },
      { position: [-1.2, -0.5, 0], label: 'Users', color: '#34d399' },
      { position: [0, -0.5, 0], label: 'Orders', color: '#f59e0b' },
      { position: [1.2, -0.5, 0], label: 'Notify', color: '#f472b6' },
    ],
    connections: [
      { from: [0, 1, 0], to: [0, 0.3, 0] },
      { from: [0, 0.3, 0], to: [-1.2, -0.5, 0] },
      { from: [0, 0.3, 0], to: [0, -0.5, 0] },
      { from: [0, 0.3, 0], to: [1.2, -0.5, 0] },
    ],
    flows: [
      { path: [[0, 1, 0], [0, 0.3, 0], [-1.2, -0.5, 0]], color: '#a78bfa' },
      { path: [[0, 0.3, 0], [1.2, -0.5, 0]], color: '#a78bfa' },
    ],
  },
  'saga-pattern': {
    nodes: [
      { position: [-2, 0.5, 0], label: 'Reservar', color: '#34d399' },
      { position: [0, 0.5, 0], label: 'Cobrar', color: '#f59e0b' },
      { position: [2, 0.5, 0], label: 'Criar pedido', color: '#8b5cf6' },
    ],
    connections: [
      { from: [-2, 0.5, 0], to: [0, 0.5, 0] },
      { from: [0, 0.5, 0], to: [2, 0.5, 0] },
    ],
    flows: [{ path: [[-2, 0.5, 0], [0, 0.5, 0], [2, 0.5, 0]], color: '#a78bfa' }],
  },
  'cqrs-event-sourcing': {
    nodes: [
      { position: [-1.5, 0.5, 0], label: 'Comandos', color: '#8b5cf6' },
      { position: [0, 0.5, 0], label: 'Event Store', color: '#0ea5e9' },
      { position: [1.5, 0.5, 0], label: 'Read Models', color: '#34d399' },
    ],
    connections: [
      { from: [-1.5, 0.5, 0], to: [0, 0.5, 0] },
      { from: [0, 0.5, 0], to: [1.5, 0.5, 0] },
    ],
    flows: [{ path: [[-1.5, 0.5, 0], [0, 0.5, 0], [1.5, 0.5, 0]], color: '#22d3ee' }],
  },
  'strangler-fig': {
    nodes: [
      { position: [0, 1, 0], label: 'Gateway', color: '#8b5cf6' },
      { position: [-1.5, -0.3, 0], label: 'Monolito', color: '#64748b' },
      { position: [1.5, -0.3, 0], label: 'Novo serviço', color: '#34d399' },
    ],
    connections: [
      { from: [0, 1, 0], to: [-1.5, -0.3, 0] },
      { from: [0, 1, 0], to: [1.5, -0.3, 0] },
    ],
    flows: [
      { path: [[0, 1, 0], [-1.5, -0.3, 0]], color: '#94a3b8' },
      { path: [[0, 1, 0], [1.5, -0.3, 0]], color: '#34d399' },
    ],
  },
  'database-per-service': {
    nodes: [
      { position: [-1.5, 0.5, 0], label: 'Serviço A', color: '#34d399' },
      { position: [-1.5, -0.5, 0], label: 'DB A', color: '#0ea5e9' },
      { position: [1.5, 0.5, 0], label: 'Serviço B', color: '#f59e0b' },
      { position: [1.5, -0.5, 0], label: 'DB B', color: '#0ea5e9' },
    ],
    connections: [
      { from: [-1.5, 0.5, 0], to: [-1.5, -0.5, 0] },
      { from: [1.5, 0.5, 0], to: [1.5, -0.5, 0] },
      { from: [-1.5, 0.5, 0], to: [1.5, 0.5, 0] },
    ],
    flows: [{ path: [[-1.5, 0.5, 0], [1.5, 0.5, 0]], color: '#8b5cf6' }],
  },
  'retry-timeout': {
    nodes: [
      { position: [-2, 0.5, 0], label: 'Cliente', color: '#22d3ee' },
      { position: [0, 0.5, 0], label: 'Retry + Timeout', color: '#f59e0b' },
      { position: [2, 0.5, 0], label: 'Serviço', color: '#34d399' },
    ],
    connections: [
      { from: [-2, 0.5, 0], to: [0, 0.5, 0] },
      { from: [0, 0.5, 0], to: [2, 0.5, 0] },
    ],
    flows: [{ path: [[-2, 0.5, 0], [0, 0.5, 0], [2, 0.5, 0]], color: '#fbbf24' }],
  },
  bulkhead: {
    nodes: [
      { position: [-1.5, 0.5, 0], label: 'Partição 1', color: '#34d399' },
      { position: [0, 0.5, 0], label: 'Partição 2', color: '#f59e0b' },
      { position: [1.5, 0.5, 0], label: 'Partição 3', color: '#8b5cf6' },
    ],
    connections: [
      { from: [-1.5, 0.5, 0], to: [0, 0.5, 0] },
      { from: [0, 0.5, 0], to: [1.5, 0.5, 0] },
    ],
    flows: [],
  },
  'health-checks': {
    nodes: [
      { position: [-1.5, 0.5, 0], label: 'Liveness', color: '#22d3ee' },
      { position: [0, 0.5, 0], label: 'App', color: '#8b5cf6' },
      { position: [1.5, 0.5, 0], label: 'Readiness', color: '#34d399' },
    ],
    connections: [
      { from: [-1.5, 0.5, 0], to: [0, 0.5, 0] },
      { from: [0, 0.5, 0], to: [1.5, 0.5, 0] },
    ],
    flows: [{ path: [[-1.5, 0.5, 0], [0, 0.5, 0], [1.5, 0.5, 0]], color: '#64748b' }],
  },
}

function NodeBox({ position, label, color }: NodeConfig) {
  const ref = useRef<THREE.Mesh>(null)
  useFrame((_, delta) => {
    if (ref.current) ref.current.rotation.y += delta * 0.12
  })
  const isRing = label === 'Anel'
  return (
    <group position={position}>
      {isRing ? (
        <mesh ref={ref} castShadow>
          <torusGeometry args={[0.6, 0.08, 16, 32]} />
          <meshStandardMaterial color={color} metalness={0.2} roughness={0.7} />
        </mesh>
      ) : (
        <mesh ref={ref} castShadow>
          <boxGeometry args={[0.9, 0.9, 0.5]} />
          <meshStandardMaterial color={color} metalness={0.25} roughness={0.6} />
        </mesh>
      )}
      <Label3D yOffset={0.65}>{label}</Label3D>
    </group>
  )
}

export function SceneGeneric({ name }: { name: string }) {
  const config = SCENE_CONFIG[name]
  if (!config) return null

  return (
    <>
      <ambientLight intensity={0.55} />
      <directionalLight position={[5, 8, 5]} intensity={1.2} castShadow shadow-mapSize={[1024, 1024]} />
      <pointLight position={[0, 3, 2]} intensity={0.4} color="#64748b" />
      <OrbitControls enableZoom enablePan maxDistance={20} minDistance={3} />
      {config.nodes.map((node, i) => (
        <NodeBox key={i} {...node} />
      ))}
      {config.connections.map((conn, i) => (
        <ConnectionLine key={i} from={conn.from} to={conn.to} color="#475569" radius={0.02} />
      ))}
      {config.flows.map((flow, i) => (
        <FlowParticle key={i} path={flow.path} speed={0.18} color={flow.color || '#22d3ee'} size={0.08} />
      ))}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.2, 0]} receiveShadow>
        <planeGeometry args={[20, 20]} />
        <meshStandardMaterial color="#0f172a" />
      </mesh>
    </>
  )
}

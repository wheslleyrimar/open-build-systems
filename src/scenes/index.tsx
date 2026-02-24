import { SceneLoadBalancer } from './SceneLoadBalancer'
import { SceneCache } from './SceneCache'
import { SceneDatabase } from './SceneDatabase'
import { SceneMicroservices } from './SceneMicroservices'
import { SceneCDN } from './SceneCDN'
import { SceneGeneric } from './SceneGeneric'

const dedicatedScenes: Record<string, React.ComponentType> = {
  'load-balancer': SceneLoadBalancer,
  cache: SceneCache,
  database: SceneDatabase,
  microservices: SceneMicroservices,
  cdn: SceneCDN,
}

const genericSceneNames = [
  'message-queue',
  'api-gateway',
  'rate-limiting',
  'service-discovery',
  'circuit-breaker',
  'consistent-hashing',
  'object-storage',
  'search',
  'websockets',
  'pubsub',
  'cap-theorem',
  'idempotency',
  'observability',
  'bff',
  'saga-pattern',
  'cqrs-event-sourcing',
  'strangler-fig',
  'database-per-service',
  'retry-timeout',
  'bulkhead',
  'health-checks',
]

export function Scene3D({ name }: { name: string }) {
  const Dedicated = dedicatedScenes[name]
  if (Dedicated) return <Dedicated />
  if (genericSceneNames.includes(name)) return <SceneGeneric name={name} />
  return null
}

export { SceneLoadBalancer, SceneCache, SceneDatabase, SceneMicroservices, SceneCDN, SceneGeneric }

import { DiagramLoadBalancer } from './DiagramLoadBalancer'
import { DiagramCache } from './DiagramCache'
import { DiagramDatabase } from './DiagramDatabase'
import { DiagramMicroservices } from './DiagramMicroservices'
import { DiagramCDN } from './DiagramCDN'
import { DiagramMessageQueue } from './DiagramMessageQueue'
import { DiagramAPIGateway } from './DiagramAPIGateway'
import { DiagramRateLimiting } from './DiagramRateLimiting'
import { DiagramServiceDiscovery } from './DiagramServiceDiscovery'
import { DiagramCircuitBreaker } from './DiagramCircuitBreaker'
import { DiagramConsistentHashing } from './DiagramConsistentHashing'
import { DiagramObjectStorage } from './DiagramObjectStorage'
import { DiagramSearch } from './DiagramSearch'
import { DiagramWebSockets } from './DiagramWebSockets'
import { DiagramPubSub } from './DiagramPubSub'
import { DiagramCap } from './DiagramCap'
import { DiagramBFF } from './DiagramBFF'
import { DiagramSaga } from './DiagramSaga'
import { DiagramCQRS } from './DiagramCQRS'
import { DiagramStrangler } from './DiagramStrangler'
import { DiagramDatabasePerService } from './DiagramDatabasePerService'

const diagrams: Record<string, React.ComponentType> = {
  'load-balancer': DiagramLoadBalancer,
  cache: DiagramCache,
  database: DiagramDatabase,
  microservices: DiagramMicroservices,
  cdn: DiagramCDN,
  'message-queue': DiagramMessageQueue,
  'api-gateway': DiagramAPIGateway,
  'rate-limiting': DiagramRateLimiting,
  'service-discovery': DiagramServiceDiscovery,
  'circuit-breaker': DiagramCircuitBreaker,
  'consistent-hashing': DiagramConsistentHashing,
  'object-storage': DiagramObjectStorage,
  search: DiagramSearch,
  websockets: DiagramWebSockets,
  pubsub: DiagramPubSub,
  'cap-theorem': DiagramCap,
  bff: DiagramBFF,
  'saga-pattern': DiagramSaga,
  'cqrs-event-sourcing': DiagramCQRS,
  'strangler-fig': DiagramStrangler,
  'database-per-service': DiagramDatabasePerService,
}

export function Diagram({ name }: { name: string }) {
  const Component = diagrams[name]
  if (!Component) return null
  return <Component />
}

export { DiagramLoadBalancer, DiagramCache, DiagramDatabase, DiagramMicroservices, DiagramCDN }

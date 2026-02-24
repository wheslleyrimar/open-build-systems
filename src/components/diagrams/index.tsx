import { DiagramLoadBalancer } from './DiagramLoadBalancer'
import { DiagramCache } from './DiagramCache'
import { DiagramDatabase } from './DiagramDatabase'
import { DiagramMicroservices } from './DiagramMicroservices'
import { DiagramCDN } from './DiagramCDN'

const diagrams: Record<string, React.ComponentType> = {
  'load-balancer': DiagramLoadBalancer,
  cache: DiagramCache,
  database: DiagramDatabase,
  microservices: DiagramMicroservices,
  cdn: DiagramCDN,
}

export function Diagram({ name }: { name: string }) {
  const Component = diagrams[name]
  if (!Component) return null
  return <Component />
}

export { DiagramLoadBalancer, DiagramCache, DiagramDatabase, DiagramMicroservices, DiagramCDN }

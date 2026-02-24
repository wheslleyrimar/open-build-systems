import { SceneLoadBalancer } from './SceneLoadBalancer'
import { SceneCache } from './SceneCache'
import { SceneDatabase } from './SceneDatabase'
import { SceneMicroservices } from './SceneMicroservices'
import { SceneCDN } from './SceneCDN'

const scenes: Record<string, React.ComponentType> = {
  'load-balancer': SceneLoadBalancer,
  cache: SceneCache,
  database: SceneDatabase,
  microservices: SceneMicroservices,
  cdn: SceneCDN,
}

export function Scene3D({ name }: { name: string }) {
  const Component = scenes[name]
  if (!Component) return null
  return <Component />
}

export { SceneLoadBalancer, SceneCache, SceneDatabase, SceneMicroservices, SceneCDN }

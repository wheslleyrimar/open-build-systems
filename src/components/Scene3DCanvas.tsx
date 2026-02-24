import { Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import { Scene3D } from '../scenes'

export function Scene3DCanvas({ sceneName }: { sceneName: string }) {
  return (
    <div className="w-full aspect-video max-w-2xl mx-auto rounded-2xl overflow-hidden border border-[var(--color-border)] bg-[#0a0a0f] shadow-2xl">
      <Canvas
        shadows
        camera={{ position: [0, 1.5, 8], fov: 50 }}
        gl={{ antialias: true, alpha: false }}
      >
        <Suspense
          fallback={
            <mesh>
              <boxGeometry args={[1, 1, 1]} />
              <meshBasicMaterial color="#7c3aed" wireframe />
            </mesh>
          }
        >
          <Scene3D name={sceneName} />
        </Suspense>
      </Canvas>
    </div>
  )
}

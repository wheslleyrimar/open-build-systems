import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

/** Animates a small sphere along a path (array of 3D points). t goes 0..1. */
export function FlowParticle({
  path,
  speed = 0.15,
  color = '#22d3ee',
  size = 0.12,
}: {
  path: [number, number, number][]
  speed?: number
  color?: string
  size?: number
}) {
  const ref = useRef<THREE.Mesh>(null)
  const progress = useRef(0)

  useFrame((_, delta) => {
    if (!ref.current || path.length < 2) return
    progress.current += delta * speed
    if (progress.current > 1) progress.current = 0
    const t = progress.current
    const segmentCount = path.length - 1
    const segmentIndex = Math.min(Math.floor(t * segmentCount), segmentCount - 1)
    const localT = t * segmentCount - segmentIndex
    const a = new THREE.Vector3(...path[segmentIndex])
    const b = new THREE.Vector3(...path[segmentIndex + 1])
    ref.current.position.lerpVectors(a, b, localT)
  })

  return (
    <mesh ref={ref} position={path[0]}>
      <sphereGeometry args={[size, 12, 12]} />
      <meshBasicMaterial color={color} />
    </mesh>
  )
}

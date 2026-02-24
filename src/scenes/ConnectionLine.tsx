import { useMemo } from 'react'
import * as THREE from 'three'

/** Cylinder between two points to represent a connection (tube). */
export function ConnectionLine({
  from,
  to,
  color = '#475569',
  radius = 0.03,
}: {
  from: [number, number, number]
  to: [number, number, number]
  color?: string
  radius?: number
}) {
  const { position, quaternion, length } = useMemo(() => {
    const start = new THREE.Vector3(...from)
    const end = new THREE.Vector3(...to)
    const mid = start.clone().add(end).multiplyScalar(0.5)
    const length = start.distanceTo(end)
    const dir = end.clone().sub(start).normalize()
    const quat = new THREE.Quaternion().setFromUnitVectors(
      new THREE.Vector3(0, 1, 0),
      dir
    )
    return { position: mid, quaternion: quat, length }
  }, [from, to])

  return (
    <mesh position={position} quaternion={quaternion}>
      <cylinderGeometry args={[radius, radius, length, 8]} />
      <meshStandardMaterial color={color} metalness={0.1} roughness={0.8} />
    </mesh>
  )
}

import { Html } from '@react-three/drei'

const style: React.CSSProperties = {
  fontFamily: 'Space Grotesk, system-ui, sans-serif',
  fontSize: '12px',
  fontWeight: 600,
  color: '#e2e8f0',
  whiteSpace: 'nowrap',
  padding: '4px 8px',
  borderRadius: '6px',
  background: 'rgba(15, 15, 20, 0.9)',
  border: '1px solid rgba(148, 163, 184, 0.3)',
  pointerEvents: 'none',
  userSelect: 'none',
}

export function Label3D({ children, yOffset = 0.8 }: { children: React.ReactNode; yOffset?: number }) {
  return (
    <Html
      position={[0, yOffset, 0]}
      center
      style={style}
      transform
      occlude
      distanceFactor={8}
    >
      {children}
    </Html>
  )
}

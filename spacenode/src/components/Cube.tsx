import { useFrame } from '@react-three/fiber'
import { useMemo, useRef } from 'react'
import * as THREE from 'three'

export function Cube() {
  const ref = useRef<THREE.Mesh>(null!)

  const { geometry, edges } = useMemo(() => {
    const g = new THREE.BoxGeometry()
    return {
      geometry: g,
      edges: new THREE.EdgesGeometry(g),
    }
  }, [])

  useFrame(() => {
    ref.current.rotation.x += 0.01
    ref.current.rotation.y += 0.01
  })

  return (
    <mesh ref={ref} geometry={geometry}> {/* primitive for cam alignment */}
      <meshBasicMaterial color="hotpink" />

      <lineSegments geometry={edges}>
        <lineBasicMaterial attach="material" color="black" />
      </lineSegments>
    </mesh>
  )
}


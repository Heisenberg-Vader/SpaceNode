import { useEffect, useMemo, useRef, forwardRef, useImperativeHandle } from 'react'
import { useThree } from '@react-three/fiber'
import * as THREE from 'three'

export type InstancedNodesHandle = {
  mesh: THREE.InstancedMesh
  positions: THREE.Vector3[]
}

type InstancedNodesProps = {
  count: number
  spread?: number
  renderDistance: number
}

export const InstancedNodes = forwardRef<InstancedNodesHandle, InstancedNodesProps>(({ count, spread = 100, renderDistance }, ref) => {
    const { camera } = useThree()

    const meshRef = useRef<THREE.InstancedMesh>(null!)

    // Shared geometry
    const geometry = useMemo(
        () => new THREE.SphereGeometry(0.2, 12, 12),
        []
    )

    const positions = useMemo<THREE.Vector3[]>(() => [], [])
    const dummy = useMemo(() => new THREE.Object3D(), [])
    const camPos = useMemo(() => new THREE.Vector3(), [])

    // Initial placement
    useEffect(() => {
        if (!meshRef.current) return

        for (let i = 0; i < count; i++) {
        const pos = new THREE.Vector3(
            (Math.random() - 0.5) * spread,
            (Math.random() - 0.5) * spread,
            (Math.random() - 0.5) * spread
        )

        positions[i] = pos
        dummy.position.copy(pos)
        dummy.scale.set(1, 1, 1)
        dummy.updateMatrix()
        meshRef.current.setMatrixAt(i, dummy.matrix)
        }

        meshRef.current.instanceMatrix.needsUpdate = true
    }, [count, spread, dummy, positions])

    // Render-distance culling (runs ONLY when slider changes)
    useEffect(() => {
        if (!meshRef.current) return

        camPos.copy(camera.position)

        for (let i = 0; i < count; i++) {
        const pos = positions[i]
        const dist = camPos.distanceTo(pos)

        dummy.position.copy(pos)

        if (dist > renderDistance) {
            dummy.scale.set(0, 0, 0)
        } else {
            dummy.scale.set(1, 1, 1)
        }

        dummy.updateMatrix()
        meshRef.current.setMatrixAt(i, dummy.matrix)
        }

        meshRef.current.instanceMatrix.needsUpdate = true
    }, [renderDistance, count, camera, positions, dummy, camPos])

    useImperativeHandle(ref, () => ({
        mesh: meshRef.current,
        positions,
    }))

    return (
        <instancedMesh
        ref={meshRef}
        args={[undefined, undefined, count]}
        frustumCulled={false}
        >
        <primitive object={geometry} attach="geometry" />
        <meshBasicMaterial color="cyan" />
        </instancedMesh>
    )
})

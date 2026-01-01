import { useEffect, useMemo, useRef, forwardRef, useImperativeHandle } from 'react'
import { useThree } from '@react-three/fiber'
import type { VideoNode } from '../data/useNodes'
import * as THREE from 'three'

export type InstancedNodesHandle = {
    mesh: THREE.InstancedMesh
    positions: THREE.Vector3[]
}

type InstancedNodesProps = {
    nodes: VideoNode[]
    renderDistance: number
}

export const InstancedNodes = forwardRef<InstancedNodesHandle, InstancedNodesProps>(({ nodes, renderDistance }, ref) => {
    const { camera } = useThree()

    const meshRef = useRef<THREE.InstancedMesh>(null!)

    const geometry = useMemo(
        () => new THREE.SphereGeometry(0.2, 12, 12),
        []
    )

    const positions = useMemo<THREE.Vector3[]>(() => [], [])
    const dummy = useMemo(() => new THREE.Object3D(), [])
    const camPos = useMemo(() => new THREE.Vector3(), [])

    // -------------------------
    // INITIAL PLACEMENT (backend-driven)
    // -------------------------
    useEffect(() => {
        if (!meshRef.current) return
        if (nodes.length === 0) return

        for (let i = 0; i < nodes.length; i++) {
        const [x, y, z] = nodes[i].position

        const pos = new THREE.Vector3(x, y, z)
        positions[i] = pos

        dummy.position.copy(pos)
        dummy.scale.set(1, 1, 1)
        dummy.updateMatrix()
        meshRef.current.setMatrixAt(i, dummy.matrix)
        }

        meshRef.current.instanceMatrix.needsUpdate = true
    }, [nodes])

    // -------------------------
    // RENDER DISTANCE CULLING
    // -------------------------
    useEffect(() => {
        if (!meshRef.current) return
        if (nodes.length === 0) return

        camPos.copy(camera.position)

        for (let i = 0; i < nodes.length; i++) {
        const pos = positions[i]
        if (!pos) continue

        const dist = camPos.distanceTo(pos)

        dummy.position.copy(pos)
        dummy.scale.set(
            dist > renderDistance ? 0 : 1,
            dist > renderDistance ? 0 : 1,
            dist > renderDistance ? 0 : 1
        )

        dummy.updateMatrix()
        meshRef.current.setMatrixAt(i, dummy.matrix)
        }

        meshRef.current.instanceMatrix.needsUpdate = true
    }, [renderDistance, nodes])

    useImperativeHandle(ref, () => ({
        mesh: meshRef.current,
        positions,
    }))

    return (
        <instancedMesh
            ref={meshRef}
            args={[undefined, undefined, nodes.length]}
            frustumCulled={false}
        >
        <primitive object={geometry} attach="geometry" />
        <meshBasicMaterial color="cyan" />
        </instancedMesh>
    )
})

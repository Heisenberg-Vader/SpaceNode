import { useFrame, useThree } from '@react-three/fiber'
import { useRef, useEffect } from 'react'
import * as THREE from 'three'
import type { InstancedNodesHandle } from '../components/InstancedNodes'

export function useInstancedRaycast(
  nodesRef: React.RefObject<InstancedNodesHandle | null>
) {
    const { camera } = useThree()

    const raycaster = useRef(new THREE.Raycaster())
    const mouse = useRef(new THREE.Vector2(0, 0)) // screen center
    const lastHit = useRef<number | null>(null)

    const dummy = useRef(new THREE.Object3D())
    const forward = useRef(new THREE.Vector3())
    const dirToNode = useRef(new THREE.Vector3())

    useEffect(() => {
        raycaster.current.near = 0.5
        raycaster.current.far = 50
    }, [])

    useFrame(() => {
        if (!nodesRef.current) return

        const { mesh, positions } = nodesRef.current

        // Safety: don’t raycast if camera state is invalid
        if (camera.position.lengthSq() < 0.0001) return

        raycaster.current.setFromCamera(mouse.current, camera)
        const hits = raycaster.current.intersectObject(mesh, false)

        if (hits.length === 0) {
        clearHighlight(mesh, positions)
        return
        }

        camera.getWorldDirection(forward.current)

        let bestId: number | null = null
        let bestScore = -Infinity

        for (const hit of hits) {
        if (hit.distance < 0.5 || hit.distance > 50) continue

        const id = hit.instanceId!
        const nodePos = positions[id]

        dirToNode.current
            .copy(nodePos)
            .sub(camera.position)
            .normalize()

        const angleScore = forward.current.dot(dirToNode.current)

        // FRONT CONE (critical)
        if (angleScore < 0.85) continue

        const distanceScore = 1 / hit.distance
        const score = angleScore * 2 + distanceScore

        if (score > bestScore) {
            bestScore = score
            bestId = id
        }
        }

        if (bestId === null) {
        clearHighlight(mesh, positions)
        return
        }

        highlight(bestId, mesh, positions)
    })

    function clearHighlight(
        mesh: THREE.InstancedMesh,
        positions: THREE.Vector3[]
    ) {
        if (lastHit.current === null) return

        const i = lastHit.current
        dummy.current.position.copy(positions[i])
        dummy.current.scale.set(1, 1, 1)
        dummy.current.updateMatrix()
        mesh.setMatrixAt(i, dummy.current.matrix)
        mesh.instanceMatrix.needsUpdate = true
        lastHit.current = null
    }

    function highlight(
        id: number,
        mesh: THREE.InstancedMesh,
        positions: THREE.Vector3[]
    ) {
        if (lastHit.current === id) return

        clearHighlight(mesh, positions)

        dummy.current.position.copy(positions[id])
        dummy.current.scale.set(1.6, 1.6, 1.6)
        dummy.current.updateMatrix()
        mesh.setMatrixAt(id, dummy.current.matrix)
        mesh.instanceMatrix.needsUpdate = true

        lastHit.current = id
    }
}

import { Canvas } from '@react-three/fiber'
import { FPSCamera } from './components/FPSCamera'
import { InstancedNodes } from './components/InstancedNodes'
import type { InstancedNodesHandle } from './components/InstancedNodes'
import { useRef, useState } from 'react'
import { useInstancedRaycast } from './shaders/useInstancedRaycast'
import { RenderControls } from './components/RenderControls'
import { Crosshair } from './components/Crosshair'
import { useNodes } from './data/useNodes'

type SceneProps = {
  renderDistance: number
}

function Scene({ renderDistance }: SceneProps) {
  const nodesRef = useRef<InstancedNodesHandle>(null)
  useInstancedRaycast(nodesRef)

  const { nodes, loading } = useNodes()

  if (loading) return null

  return (
    <>
      <FPSCamera />
      <InstancedNodes
        ref={nodesRef}
        nodes={nodes}
        renderDistance={renderDistance}
      />
    </>
  )
}

export default function App() {
  const [renderDistance, setRenderDistance] = useState(40)

  return (
    <>
      <Crosshair />
      <RenderControls
        renderDistance={renderDistance}
        setRenderDistance={setRenderDistance}
      />

      <Canvas
        camera={{ position: [0, 1.6, 5], fov: 75 }}
        style={{ background: '#0b0f14' }}
        gl={{ antialias: true }}
      >
        <fog attach="fog" args={['#0b0f14', 10, renderDistance]} />
        <Scene renderDistance={renderDistance} />
      </Canvas>
    </>
  )
}

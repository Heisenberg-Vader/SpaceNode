import { Canvas } from '@react-three/fiber'
import { FPSCamera } from './components/FPSCamera'
import { InstancedNodes } from './components/InstancedNodes'
import type { InstancedNodesHandle } from './components/InstancedNodes'
import { useRef, useState } from 'react'
import { useInstancedRaycast } from './shaders/useInstancedRaycast'
import { RenderControls } from './components/RenderControls'

type SceneProps = {
  renderDistance: number
}

function Scene({ renderDistance }: SceneProps) {
  const nodesRef = useRef<InstancedNodesHandle>(null)
  useInstancedRaycast(nodesRef)

  return (
    <>
      <FPSCamera />
      <InstancedNodes
        ref={nodesRef}
        count={10000}
        spread={500}
        renderDistance={renderDistance}
      />
    </>
  )
}

export default function App() {
  const [renderDistance, setRenderDistance] = useState(40)

  return (
    <>
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

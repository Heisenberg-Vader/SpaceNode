import { Canvas } from '@react-three/fiber'
import { FPSCamera } from './components/FPSCamera'
import { Cube } from './components/Cube'

export default function App() {
  return (
    <Canvas camera={{ position: [0, 1.6, 5], fov: 75 }}>
      <FPSCamera />
      <Cube />
    </Canvas>
  )
}

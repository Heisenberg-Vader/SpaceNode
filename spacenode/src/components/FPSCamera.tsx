import { useFrame, useThree } from '@react-three/fiber'
import { useEffect, useRef } from 'react'
import * as THREE from 'three'

export function FPSCamera() {
  const { camera, gl } = useThree()

  const yaw = useRef(0)
  const pitch = useRef(0)

  const direction = useRef(new THREE.Vector3())
  const keys = useRef<Record<string, boolean>>({})

  const sensitivity = 0.002
  const speed = 5

  // Pointer lock
  useEffect(() => {
    const canvas = gl.domElement

    const handleClick = () => {
      canvas.requestPointerLock()
    }

    canvas.addEventListener('click', handleClick)
    return () => canvas.removeEventListener('click', handleClick)
  }, [gl])

  // Mouse movement
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (document.pointerLockElement !== gl.domElement) return

      yaw.current -= e.movementX * sensitivity
      pitch.current -= e.movementY * sensitivity

      pitch.current = Math.max(
        -Math.PI / 2,
        Math.min(Math.PI / 2, pitch.current)
      )
    }

    document.addEventListener('mousemove', handleMouseMove)
    return () => document.removeEventListener('mousemove', handleMouseMove)
  }, [gl])

  // Keyboard
  useEffect(() => {
    const down = (e: KeyboardEvent) => (keys.current[e.code] = true)
    const up = (e: KeyboardEvent) => (keys.current[e.code] = false)

    window.addEventListener('keydown', down)
    window.addEventListener('keyup', up)

    return () => {
      window.removeEventListener('keydown', down)
      window.removeEventListener('keyup', up)
    }
  }, [])

  // Game loop
  useFrame((_, delta) => {
    camera.rotation.order = 'YXZ'
    camera.rotation.y = yaw.current
    camera.rotation.x = pitch.current

    direction.current.set(0, 0, 0)

    if (keys.current['KeyW']) direction.current.z -= 1
    if (keys.current['KeyS']) direction.current.z += 1
    if (keys.current['KeyA']) direction.current.x -= 1
    if (keys.current['KeyD']) direction.current.x += 1
    if (keys.current['Space']) direction.current.y += 1
    if (keys.current['ShiftLeft']) direction.current.y -= 1

    direction.current.normalize()
    direction.current.applyEuler(camera.rotation)

    camera.position.addScaledVector(direction.current, speed * delta)
  })

  return null
}

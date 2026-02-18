import { useEffect, useRef } from 'react'
import * as THREE from 'three'

// Match landing (PortfolioLanding) particle setup for consistent look
const POINT_COUNT = 1400
const FIELD_WIDTH = 1200
const FIELD_HEIGHT = 600
const FIELD_DEPTH = 600

const REPULSION_RADIUS = 120
const REPULSION_STRENGTH = 0.6
const MOUSE_SCENE_SCALE_X = 300
const MOUSE_SCENE_SCALE_Y = 200
const CAMERA_FOLLOW_X = 50
const CAMERA_FOLLOW_Y = 30
const LERP = 0.04851
const VELOCITY_SCALE = 0.064575

const DEFAULT_POINT_SIZE = 2.4
const FLOW_DRIFT_X = 0.4

/**
 * Standalone particle background matching landing section: same point count,
 * field size, dot size/opacity, velocities, mouse repulsion, and camera parallax.
 * Sizes to its container (Contact section or Currently strip).
 * Use pointSize prop to scale dots when container is shorter (e.g. strip) so they match hero apparent size.
 * Use flowLeftToRight to enable slow left-to-right drift with horizontal wrap (Currently section only).
 */
export default function ParticleBackground({ className = '', pointSize = DEFAULT_POINT_SIZE, flowLeftToRight = false }) {
  const containerRef = useRef(null)
  const mouseRef = useRef({ x: 0, y: 0 })

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const backgroundColor = 0x000000
    const pointColor = 0x60a5fa // blue-400, same as landing

    const scene = new THREE.Scene()
    scene.background = new THREE.Color(backgroundColor)
    scene.fog = new THREE.Fog(backgroundColor, 200, 900)

    const camera = new THREE.PerspectiveCamera(60, 1, 1, 2000)
    camera.position.set(0, 0, 550)

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false })
    renderer.setPixelRatio(window.devicePixelRatio)

    const handleMouseMove = (e) => {
      const rect = container.getBoundingClientRect()
      if (e.clientX < rect.left || e.clientX > rect.right || e.clientY < rect.top || e.clientY > rect.bottom) return
      const w = rect.width || 1
      const h = rect.height || 1
      mouseRef.current.x = (e.clientX - rect.left) / w * 2 - 1
      mouseRef.current.y = -((e.clientY - rect.top) / h) * 2 + 1
    }

    window.addEventListener('mousemove', handleMouseMove)

    const geometry = new THREE.BufferGeometry()
    const positions = new Float32Array(POINT_COUNT * 3)
    const basePositions = new Float32Array(POINT_COUNT * 3)
    const velocities = new Float32Array(POINT_COUNT * 3)

    for (let i = 0; i < POINT_COUNT; i++) {
      const i3 = i * 3
      const x = (Math.random() - 0.5) * FIELD_WIDTH
      const y = (Math.random() - 0.5) * FIELD_HEIGHT
      const z = (Math.random() - 0.5) * FIELD_DEPTH
      positions[i3] = x
      positions[i3 + 1] = y
      positions[i3 + 2] = z
      basePositions[i3] = x
      basePositions[i3 + 1] = y
      basePositions[i3 + 2] = z
      velocities[i3] = (Math.random() - 0.5) * VELOCITY_SCALE
      velocities[i3 + 1] = (Math.random() - 0.5) * VELOCITY_SCALE
      velocities[i3 + 2] = (Math.random() - 0.5) * VELOCITY_SCALE
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))

    const material = new THREE.PointsMaterial({
      color: pointColor,
      size: pointSize,
      opacity: 0.8,
      transparent: true,
      sizeAttenuation: true,
    })

    const points = new THREE.Points(geometry, material)
    scene.add(points)

    let animationId
    let time = 0
    let lastTime = performance.now()

    container.appendChild(renderer.domElement)

    function setSize() {
      if (!container) return
      const w = container.offsetWidth
      const h = container.offsetHeight
      if (w === 0 || h === 0) return
      renderer.setSize(w, h)
      camera.aspect = w / h
      camera.updateProjectionMatrix()
    }

    function animate() {
      animationId = requestAnimationFrame(animate)
      const now = performance.now()
      const deltaSec = Math.min((now - lastTime) / 1000, 0.1)
      lastTime = now
      time += 0.097 * deltaSec

      const pos = geometry.attributes.position.array
      const scale = 1 + Math.sin(time) * 0.01
      const mouseX = mouseRef.current.x * MOUSE_SCENE_SCALE_X
      const mouseY = mouseRef.current.y * MOUSE_SCENE_SCALE_Y

      for (let i = 0; i < POINT_COUNT; i++) {
        const i3 = i * 3
        basePositions[i3] += velocities[i3] + (flowLeftToRight ? FLOW_DRIFT_X : 0)
        basePositions[i3 + 1] += velocities[i3 + 1]
        basePositions[i3 + 2] += velocities[i3 + 2]

        if (flowLeftToRight) {
          if (basePositions[i3] > FIELD_WIDTH / 2) {
            basePositions[i3] = -FIELD_WIDTH / 2
            pos[i3] = -FIELD_WIDTH / 2  // snap rendered pos too
          }
          if (basePositions[i3] < -FIELD_WIDTH / 2) {
            basePositions[i3] = FIELD_WIDTH / 2
            pos[i3] = FIELD_WIDTH / 2   // snap rendered pos too
          }
        } else {
          if (basePositions[i3] < -FIELD_WIDTH / 2 || basePositions[i3] > FIELD_WIDTH / 2) velocities[i3] *= -1
        }
        if (basePositions[i3 + 1] < -FIELD_HEIGHT / 2 || basePositions[i3 + 1] > FIELD_HEIGHT / 2) velocities[i3 + 1] *= -1
        if (basePositions[i3 + 2] < -FIELD_DEPTH / 2 || basePositions[i3 + 2] > FIELD_DEPTH / 2) velocities[i3 + 2] *= -1

        const dx = basePositions[i3] - mouseX
        const dy = basePositions[i3 + 1] - mouseY
        const dist = Math.hypot(dx, dy)
        if (dist < REPULSION_RADIUS && dist > 0) {
          const push = (1 - dist / REPULSION_RADIUS) * REPULSION_STRENGTH
          basePositions[i3] += (dx / dist) * push
          basePositions[i3 + 1] += (dy / dist) * push
        }

        const targetX = basePositions[i3] * scale
        const targetY = basePositions[i3 + 1] * scale
        const targetZ = basePositions[i3 + 2] * scale
        pos[i3] += (targetX - pos[i3]) * LERP
        pos[i3 + 1] += (targetY - pos[i3 + 1]) * LERP
        pos[i3 + 2] += (targetZ - pos[i3 + 2]) * LERP
      }
      geometry.attributes.position.needsUpdate = true

      const camTargetX = mouseRef.current.x * CAMERA_FOLLOW_X
      const camTargetY = mouseRef.current.y * CAMERA_FOLLOW_Y
      camera.position.x += (camTargetX - camera.position.x) * 0.024255
      camera.position.y += (camTargetY - camera.position.y) * 0.024255
      camera.lookAt(0, 0, 0)

      renderer.render(scene, camera)
    }

    setSize()
    animate()

    const resizeObserver = new ResizeObserver(() => setSize())
    resizeObserver.observe(container)

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      resizeObserver.disconnect()
      if (animationId) cancelAnimationFrame(animationId)
      container?.removeChild(renderer.domElement)
      geometry.dispose()
      material.dispose()
      renderer.dispose()
    }
  }, [pointSize, flowLeftToRight])

  return <div ref={containerRef} className={className} aria-hidden="true" />
}

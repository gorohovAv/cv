import { useRef, useEffect, useState } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, Stars } from '@react-three/drei'
import * as THREE from 'three'
import './space.css'
import { useStore, type StarData } from '../store/store'

function parseCSV(csv: string): StarData[] {
  const lines = csv.split(/\r?\n/).map(l => l.trim()).filter(Boolean)
  if (lines.length < 2) return []
  return lines.slice(1).map(line => {
    const values = line.split(',').map(v => v.trim())
    const colorRaw = values[5] || '#ffffff'
    // Нормализуем цвет: убеждаемся что это валидный 6-значный hex
    const colorMatch = colorRaw.match(/^#?([0-9a-fA-F]{6})$/)
    const color = colorMatch ? `#${colorMatch[1]}` : '#ffffff'
    return {
      name: values[0] || 'Unknown',
      x: parseFloat(values[1]) || 0,
      y: parseFloat(values[2]) || 0,
      z: parseFloat(values[3]) || 0,
      magnitude: parseFloat(values[4]) || 1,
      color,
    }
  })
}

interface StarFieldProps {
  stars: StarData[]
}

function StarField({ stars }: StarFieldProps) {
  const meshRef = useRef<THREE.InstancedMesh>(null)
  const setSelectedStar = useStore(s => s.setSelectedStar)

  useEffect(() => {
    if (!meshRef.current) return
    const dummy = new THREE.Object3D()
    const color = new THREE.Color()
    stars.forEach((star, i) => {
      dummy.position.set(star.x, star.y, star.z)
      const scale = Math.max(0.3, star.magnitude * 0.8)
      dummy.scale.set(scale, scale, scale)
      dummy.updateMatrix()
      meshRef.current!.setMatrixAt(i, dummy.matrix)
      color.set(star.color)
      meshRef.current!.setColorAt(i, color)
    })
    meshRef.current.instanceMatrix.needsUpdate = true
    if (meshRef.current.instanceColor) {
      meshRef.current.instanceColor.needsUpdate = true
    }
  }, [stars])

  const handleClick = (e: any) => {
    e.stopPropagation()
    if (e.instanceId !== undefined && e.instanceId < stars.length) {
      setSelectedStar(stars[e.instanceId])
    }
  }

  return (
    <instancedMesh
      ref={meshRef}
      args={[undefined, undefined, stars.length]}
      onClick={handleClick}
    >
      <sphereGeometry args={[0.3, 12, 12]} />
      <meshBasicMaterial toneMapped={false} />
    </instancedMesh>
  )
}

function BackgroundStars() {
  return (
    <Stars
      radius={300}
      depth={100}
      count={3000}
      factor={3}
      saturation={0.1}
      fade
      speed={0.5}
    />
  )
}

function SpaceScene() {
  const [stars, setStars] = useState<StarData[]>([])

  useEffect(() => {
    fetch('/stars.csv')
      .then(res => res.text())
      .then(csv => {
        setStars(parseCSV(csv))
      })
      .catch(err => console.error('Failed to load stars:', err))
  }, [])

  return (
    <>
      <ambientLight intensity={0.1} />
      <BackgroundStars />
      {stars.length > 0 && <StarField stars={stars} />}
      <OrbitControls
        enablePan={true}
        enableZoom={true}
        enableRotate={true}
        autoRotate
        autoRotateSpeed={0.3}
        maxDistance={300}
        minDistance={10}
      />
    </>
  )
}

export default function Space() {
  return (
    <div className="space-container">
      <Canvas
        camera={{ position: [0, 0, 80], fov: 60 }}
        gl={{ antialias: true, alpha: false }}
      >
        <color attach="background" args={['#000008']} />
        <fog attach="fog" args={['#000008', 100, 300]} />
        <SpaceScene />
      </Canvas>
    </div>
  )
}
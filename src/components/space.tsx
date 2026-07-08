import { useRef, useEffect, useState } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, Stars } from '@react-three/drei'
import * as THREE from 'three'
import './space.css'
import { useStore, type StarData } from '../store/store'

function parseCSV(csv: string): StarData[] {
  const lines = csv.trim().split('\n')
  return lines.slice(1).map(line => {
    const values = line.split(',')
    return {
      name: values[0],
      x: parseFloat(values[1]),
      y: parseFloat(values[2]),
      z: parseFloat(values[3]),
      magnitude: parseFloat(values[4]),
      color: values[5] || '#ffffff',
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
    stars.forEach((star, i) => {
      dummy.position.set(star.x, star.y, star.z)
      const scale = star.magnitude
      dummy.scale.set(scale, scale, scale)
      dummy.updateMatrix()
      meshRef.current!.setMatrixAt(i, dummy.matrix)
      meshRef.current!.setColorAt(i, new THREE.Color(star.color))
    })
    meshRef.current.instanceMatrix.needsUpdate = true
    if (meshRef.current.instanceColor) meshRef.current.instanceColor.needsUpdate = true
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
      <sphereGeometry args={[0.3, 8, 8]} />
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
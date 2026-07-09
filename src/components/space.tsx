// File: space.tsx
import { useEffect, useState } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, Stars } from '@react-three/drei'
import './space.css'
import { type StarSystemData } from '../store/store'
import StarHover from './starHover'
import PlanetHover from './planetHover'
import StarField from './star'

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
  const [systems, setSystems] = useState<StarSystemData[]>([])

  useEffect(() => {
    fetch('/stars.json')
      .then(res => res.json())
      .then(data => {
        setSystems(data.stars || [])
      })
      .catch(err => console.error('Failed to load stars:', err))
  }, [])

  return (
    <>
      <ambientLight intensity={0.1} />
      <BackgroundStars />
      {systems.length > 0 && <StarField systems={systems} />}
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
      {/* Hover компоненты вынесены из Canvas для правильного позиционирования */}
      <StarHover />
      <PlanetHover />
    </div>
  )
}

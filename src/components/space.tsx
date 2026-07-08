// File: space.tsx
import { useRef, useEffect, useState } from 'react'
import { Canvas, useThree } from '@react-three/fiber'
import { OrbitControls, Stars } from '@react-three/drei'
import * as THREE from 'three'
import './space.css'
import { useStore, type StarSystemData, type StarData } from '../store/store'
import StarHover from './starHover'
import PlanetHover from './planetHover'

interface StarFieldProps {
  systems: StarSystemData[]
}

function StarField({ systems }: StarFieldProps) {
  const meshRef = useRef<THREE.InstancedMesh>(null)
  const setSelectedStar = useStore(s => s.setSelectedStar)
  const setHoveredSystem = useStore(s => s.setHoveredSystem)
  
  // Flatten all stars from all systems
  const allStars: (StarData & { systemIndex: number })[] = []
  systems.forEach((system, systemIndex) => {
    system.stars.forEach(star => {
      allStars.push({ ...star, systemIndex })
    })
  })

  useEffect(() => {
    if (!meshRef.current) return
    const dummy = new THREE.Object3D()
    const color = new THREE.Color()
    allStars.forEach((star, i) => {
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
  }, [systems])

  const handleClick = (e: any) => {
    e.stopPropagation()
    if (e.instanceId !== undefined && e.instanceId < allStars.length) {
      const star = allStars[e.instanceId]
      setSelectedStar(star)
    }
  }

  const handlePointerMove = (e: any) => {
    if (e.instanceId !== undefined && e.instanceId < allStars.length) {
      const star = allStars[e.instanceId]
      setHoveredSystem(systems[star.systemIndex])
      
      // Position hover near cursor
      const hoverElement = document.querySelector('.star-hover') as HTMLElement
      if (hoverElement && e.clientX !== undefined) {
        hoverElement.style.left = `${e.clientX + 15}px`
        hoverElement.style.top = `${e.clientY + 15}px`
      }
    } else {
      setHoveredSystem(null)
    }
  }

  const handlePointerOut = () => {
    setHoveredSystem(null)
  }

  return (
    <>
      <instancedMesh
        ref={meshRef}
        args={[undefined, undefined, allStars.length]}
        onClick={handleClick}
        onPointerMove={handlePointerMove}
        onPointerOut={handlePointerOut}
      >
        <sphereGeometry args={[0.3, 12, 12]} />
        <meshBasicMaterial toneMapped={false} />
      </instancedMesh>
    </>
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
// File: src/components/space.tsx
import { useEffect, useState } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, Stars } from '@react-three/drei'
import './space.css'
import { useStore, type StarSystemData } from '../store/store'
import StarHover from './starHover'
import PlanetHover from './planetHover'
import StarField from './star'
import Loader from './loader'

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
  const systems = useStore(s => s.systems)
  
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
  const setSystems = useStore(s => s.setSystems)
  const setLoading = useStore(s => s.setLoading)
  const loadingProgress = useStore(s => s.loadingProgress)
  const loadingText = useStore(s => s.loadingText)
  
  const [isFullyLoaded, setIsFullyLoaded] = useState(false)

  useEffect(() => {
    if (isFullyLoaded) return
    
    const loadData = async () => {
      try {
        setLoading(true, 10, 'Loading space data')
        
        const baseUrl = import.meta.env.BASE_URL
        const response = await fetch(`${baseUrl}systems.json`)
        
        if (!response.ok) {
          throw new Error(`Failed to fetch systems.json: ${response.status} ${response.statusText}`)
        }
        
        const systems: StarSystemData[] = await response.json()
        
        setLoading(true, 100, 'Finalizing')
        setSystems(systems)
        
        setTimeout(() => {
          setLoading(false, 0, '')
          setIsFullyLoaded(true)
        }, 500)
        
      } catch (error) {
        console.error('Failed to load data:', error)
        setLoading(false, 0, 'Ошибка загрузки данных. Проверьте консоль.')
        setIsFullyLoaded(true)
      }
    }
    
    loadData()
  }, [isFullyLoaded, setSystems, setLoading])

  return (
    <div className="space-container" style={{ position: 'relative', width: '100%', height: '100%', zIndex: 1 }}>
      <Canvas
        camera={{ position: [0, 0, 80], fov: 60 }}
        gl={{ antialias: true, alpha: false }}
        style={{ width: '100%', height: '100%' }}
      >
        <color attach="background" args={['#000008']} />
        <fog attach="fog" args={['#000008', 100, 300]} />
        <SpaceScene />
      </Canvas>
      
      <StarHover />
      <PlanetHover />
      
      {!isFullyLoaded && <Loader progress={loadingProgress ?? 0} text={loadingText ?? 'Инициализация'} />}
    </div>
  )
}
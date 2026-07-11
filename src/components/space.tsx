// File: src/components/space.tsx
import { useEffect, useState } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, Stars } from '@react-three/drei'
import './space.css'
import { useStore, type StarSystemData } from '../store/store'
import { parseHYG, parseNASAExoplanets, type StarData, type PlanetData } from '../csvParser'
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

function getStarColor(spect: string): string {
  if (!spect) return '#ffffff'
  const spectralClass = spect.charAt(0).toUpperCase()
  
  switch (spectralClass) {
    case 'O': return '#9bb0ff'
    case 'B': return '#aabfff'
    case 'A': return '#cad7ff'
    case 'F': return '#f8f7ff'
    case 'G': return '#fff4ea'
    case 'K': return '#ffd2a1'
    case 'M': return '#ffcc6f'
    case 'L': return '#ff8844'
    case 'T': return '#cc5533'
    default: return '#ffffff'
  }
}

function SpaceScene() {
  const stars = useStore(s => s.stars)
  const planets = useStore(s => s.planets)
  
  // Convert StarData to StarSystemData with color and planets
  const systems: StarSystemData[] = stars.map(star => {
    // Логируем процесс матчинга для каждой звезды
    console.log(`\n🔍 Matching star: ${star.name} (id: ${star.id})`)
    console.log(`   Coordinates: ra=${star.ra}, dec=${star.dec}, dist=${star.dist}`)
    
    // Сначала пробуем точный матч по имени (hostname из NASA = name из HYG)
    let starPlanets = planets.filter(p => {
      const hostname = p.hostname?.trim().toLowerCase()
      const starName = star.name?.trim().toLowerCase()
      return hostname && starName && hostname === starName
    })
    
    if (starPlanets.length > 0) {
      console.log(`   ✅ Found ${starPlanets.length} planet(s) by exact hostname match`)
      starPlanets.forEach(p => {
        console.log(`      - ${p.pl_name} (hostname: ${p.hostname})`)
      })
    } else {
      // Если точного матча нет, пробуем частичное совпадение
      starPlanets = planets.filter(p => {
        const hostname = p.hostname?.trim().toLowerCase() || ''
        const starName = star.name?.trim().toLowerCase() || ''
        // Проверяем, содержит ли hostname имя звезды или наоборот
        return hostname.includes(starName) || starName.includes(hostname)
      })
      
      if (starPlanets.length > 0) {
        console.log(`   ⚠️ Found ${starPlanets.length} planet(s) by partial name match`)
        starPlanets.forEach(p => {
          console.log(`      - ${p.pl_name} (hostname: ${p.hostname})`)
        })
      } else {
        // Если и частичного матча нет, пробуем матч по координатам
        starPlanets = planets.filter(p => {
          const distance = Math.sqrt(
            Math.pow(p.ra - star.ra, 2) + 
            Math.pow(p.dec - star.dec, 2) + 
            Math.pow(p.sy_dist - star.dist, 2)
          )
          return distance < 0.1
        })
        
        if (starPlanets.length > 0) {
          console.log(`   📍 Found ${starPlanets.length} planet(s) by coordinate match`)
          starPlanets.forEach(p => {
            console.log(`      - ${p.pl_name} (hostname: ${p.hostname})`)
          })
        } else {
          console.log(`   ❌ No planets found for this star`)
        }
      }
    }
    
    return {
      id: star.id,
      name: star.name,
      ra: star.ra,
      dec: star.dec,
      dist: star.dist,
      mag: star.mag,
      spect: star.spect,
      x: star.x,
      y: star.y,
      z: star.z,
      color: getStarColor(star.spect),
      planets: starPlanets,
    }
  })
  
  // Логируем общую статистику
  const starsWithPlanets = systems.filter(s => s.planets.length > 0)
  console.log(`\n📊 Matching summary:`)
  console.log(`   Total stars: ${systems.length}`)
  console.log(`   Stars with planets: ${starsWithPlanets.length}`)
  console.log(`   Stars without planets: ${systems.length - starsWithPlanets.length}`)

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
  const setStars = useStore(s => s.setStars)
  const setPlanets = useStore(s => s.setPlanets)
  const isLoading = useStore(s => s.isLoading)
  const loadingProgress = useStore(s => s.loadingProgress)
  const loadingText = useStore(s => s.loadingText)
  const setLoading = useStore(s => s.setLoading)
  
  const [dataLoaded, setDataLoaded] = useState(false)

  useEffect(() => {
    if (dataLoaded) return
    
    const loadData = async () => {
      try {
        setLoading(true, 0, 'Loading star catalog')
        
        // Load HYG star catalog
        const hygResponse = await fetch('/hyg_v42.csv')
        const hygText = await hygResponse.text()
        setLoading(true, 30, 'Parsing star catalog')
        
        const stars = parseHYG(hygText)
        setStars(stars)
        setLoading(true, 50, 'Loading exoplanet database')
        
        // Load NASA exoplanet database
        const nasaResponse = await fetch('/PS_2026.07.09_23.35.24.csv')
        const nasaText = await nasaResponse.text()
        setLoading(true, 80, 'Parsing exoplanet database')
        
        const planets = parseNASAExoplanets(nasaText)
        setPlanets(planets)
        
        setLoading(true, 100, 'Initializing space')
        
        // Small delay to show 100% progress
        setTimeout(() => {
          setLoading(false, 0, '')
          setDataLoaded(true)
        }, 500)
        
      } catch (error) {
        console.error('Failed to load data:', error)
        setLoading(false, 0, '')
      }
    }
    
    loadData()
  }, [dataLoaded, setStars, setPlanets, setLoading])

  if (isLoading) {
    return <Loader progress={loadingProgress} text={loadingText} />
  }

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
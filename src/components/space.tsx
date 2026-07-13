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

// Извлекает числовой идентификатор из Gliese/GJ/GL имени
// Примеры: "GL 273" -> "273", "GJ 273" -> "273", "Gliese 273" -> "273"
function extractGlieseNumber(name: string): string | null {
  if (!name) return null
  const normalized = name.trim().toUpperCase()
  
  // Ищем паттерны: GL 273, GJ 273, GLIESE 273, GJ273, GL273
  const match = normalized.match(/^(?:GL|GJ|GLIESE)\s*(\d+)(?:\s*[A-Z])?$/)
  if (match) {
    return match[1]
  }
  
  return null
}

// Извлекает идентификаторы каталогов из hostname NASA
// Возвращает объект с возможными идентификаторами
function extractCatalogIds(hostname: string): { gliese?: string; hd?: string; hip?: string } {
  if (!hostname) return {}
  
  const result: { gliese?: string; hd?: string; hip?: string } = {}
  const upper = hostname.toUpperCase()
  
  // Gliese/GJ/GL
  const glMatch = upper.match(/(?:GL|GJ|GLIESE)\s*(\d+)/)
  if (glMatch) {
    result.gliese = glMatch[1]
  }
  
  // HD
  const hdMatch = upper.match(/HD\s*(\d+)/)
  if (hdMatch) {
    result.hd = hdMatch[1]
  }
  
  // HIP
  const hipMatch = upper.match(/HIP\s*(\d+)/)
  if (hipMatch) {
    result.hip = hipMatch[1]
  }
  
  return result
}

// Проверяет, соответствует ли планета звезде
function matchPlanetToStar(planet: PlanetData, star: StarData): { matched: boolean; method: string } {
  const hostname = planet.hostname || ''
  const starName = star.name || ''
  
  // 1. Точный матч по имени (hostname = name)
  if (hostname.toLowerCase().trim() === starName.toLowerCase().trim()) {
    return { matched: true, method: 'exact name' }
  }
  
  // 2. Матч по Gliese/GJ/GL идентификатору
  const starGlNum = extractGlieseNumber(star.gl)
  const hostCatalogIds = extractCatalogIds(hostname)
  
  if (starGlNum && hostCatalogIds.gliese && starGlNum === hostCatalogIds.gliese) {
    return { matched: true, method: 'Gliese/GJ/GL ID' }
  }
  
  // 3. Матч по HD идентификатору
  if (star.hd && hostCatalogIds.hd) {
    const starHdNum = star.hd.replace(/\D/g, '')
    if (starHdNum === hostCatalogIds.hd) {
      return { matched: true, method: 'HD ID' }
    }
  }
  
  // 4. Матч по Hipparcos идентификатору
  if (star.hip && hostCatalogIds.hip) {
    const starHipNum = star.hip.replace(/\D/g, '')
    if (starHipNum === hostCatalogIds.hip) {
      return { matched: true, method: 'HIP ID' }
    }
  }
  
  // 5. Частичный матч по имени (hostname содержит name или наоборот)
  const hostnameLower = hostname.toLowerCase().trim()
  const starNameLower = starName.toLowerCase().trim()
  if (hostnameLower.includes(starNameLower) || starNameLower.includes(hostnameLower)) {
    return { matched: true, method: 'partial name' }
  }
  
  return { matched: false, method: 'none' }
}

function SpaceScene() {
  const stars = useStore(s => s.stars)
  const planets = useStore(s => s.planets)
  
  // Логируем статистику по методам матчинга
  const matchStats = {
    'exact name': 0,
    'Gliese/GJ/GL ID': 0,
    'HD ID': 0,
    'HIP ID': 0,
    'partial name': 0,
    'none': 0,
  }
  
  // Convert StarData to StarSystemData with color and planets
  const systems: StarSystemData[] = stars.map(star => {
    const starPlanets: PlanetData[] = []
    
    planets.forEach(planet => {
      const result = matchPlanetToStar(planet, star)
      if (result.matched) {
        starPlanets.push(planet)
        matchStats[result.method as keyof typeof matchStats]++
      }
    })
    
    // Логируем только звезды с планетами
    if (starPlanets.length > 0) {
      console.log(`\n🔍 Star: ${star.name}`)
      console.log(`   GL: ${star.gl || 'N/A'}, HD: ${star.hd || 'N/A'}, HIP: ${star.hip || 'N/A'}`)
      console.log(`   Found ${starPlanets.length} planet(s):`)
      starPlanets.forEach(p => {
        const result = matchPlanetToStar(p, star)
        console.log(`      - ${p.pl_name} (hostname: ${p.hostname}) via ${result.method}`)
      })
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
  console.log(`   Match methods:`)
  Object.entries(matchStats).forEach(([method, count]) => {
    if (count > 0) {
      console.log(`      ${method}: ${count}`)
    }
  })

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
        
        // Используем BASE_URL для корректного разрешения путей как в dev, так и в prod (GitHub Pages)
        const baseUrl = import.meta.env.BASE_URL
        
        // Load HYG star catalog
        const hygUrl = `${baseUrl}hyg_v42.csv`
        const hygResponse = await fetch(hygUrl)
        if (!hygResponse.ok) {
          throw new Error(`Failed to fetch star catalog: ${hygResponse.status} ${hygResponse.statusText} at ${hygUrl}`)
        }
        const hygText = await hygResponse.text()
        setLoading(true, 30, 'Parsing star catalog')
        
        let stars = parseHYG(hygText)
        setLoading(true, 50, 'Loading exoplanet database')
        
        // Load NASA exoplanet database
        const nasaUrl = `${baseUrl}PS_2026.07.09_23.35.24.csv`
        const nasaResponse = await fetch(nasaUrl)
        if (!nasaResponse.ok) {
          throw new Error(`Failed to fetch exoplanet database: ${nasaResponse.status} ${nasaResponse.statusText} at ${nasaUrl}`)
        }
        const nasaText = await nasaResponse.text()
        setLoading(true, 80, 'Parsing exoplanet database')
        
        let planets = parseNASAExoplanets(nasaText)
        
        // Add Solar System programmatically
        const sun: StarData = {
          id: 0,
          name: 'Sun',
          ra: 0,
          dec: 0,
          dist: 0,
          mag: 4.83, // Absolute magnitude for proper rendering size
          spect: 'G2V',
          x: 0,
          y: 0,
          z: 0,
          gl: '',
          hd: 'HD 1757',
          hip: 'HIP 1757',
        }
        
        const solarPlanetsData = [
          { pl_name: 'Mercury', hostname: 'Sun', pl_orbsmax: 2.0, pl_orbper: 88.0, pl_rade: 0.05 },
          { pl_name: 'Venus', hostname: 'Sun', pl_orbsmax: 3.5, pl_orbper: 224.7, pl_rade: 0.12 },
          { pl_name: 'Earth', hostname: 'Sun', pl_orbsmax: 5.0, pl_orbper: 365.25, pl_rade: 0.13 },
          { pl_name: 'Mars', hostname: 'Sun', pl_orbsmax: 7.0, pl_orbper: 687.0, pl_rade: 0.08 },
          { pl_name: 'Jupiter', hostname: 'Sun', pl_orbsmax: 10.0, pl_orbper: 4331, pl_rade: 2.4 },
          { pl_name: 'Saturn', hostname: 'Sun', pl_orbsmax: 13.0, pl_orbper: 10747, pl_rade: 1.8 },
          { pl_name: 'Uranus', hostname: 'Sun', pl_orbsmax: 16.0, pl_orbper: 30589, pl_rade: 1.2 },
          { pl_name: 'Neptune', hostname: 'Sun', pl_orbsmax: 19.0, pl_orbper: 59800, pl_rade: 1.0 },
        ]
        
        const solarPlanets = solarPlanetsData.map(p => ({
          pl_name: p.pl_name,
          hostname: p.hostname,
          default_flag: 1,
          sy_snum: 1,
          sy_pnum: 1,
          discoverymethod: '',
          disc_year: 0,
          disc_facility: '',
          soltype: '',
          pl_controv_flag: 0,
          pl_refname: '',
          pl_orbper: p.pl_orbper,
          pl_orbpererr1: 0, pl_orbpererr2: 0, pl_orbperlim: 0,
          pl_orbsmax: p.pl_orbsmax,
          pl_orbsmaxerr1: 0, pl_orbsmaxerr2: 0, pl_orbsmaxlim: 0,
          pl_rade: p.pl_rade,
          pl_radeerr1: 0, pl_radeerr2: 0, pl_radelim: 0,
          pl_radj: 0, pl_radjerr1: 0, pl_radjerr2: 0, pl_radjlim: 0,
          pl_bmasse: 0, pl_bmasseerr1: 0, pl_bmasseerr2: 0, pl_bmasselim: 0,
          pl_bmassj: 0, pl_bmassjerr1: 0, pl_bmassjerr2: 0, pl_bmassjlim: 0,
          pl_bmassprov: '',
          pl_orbeccen: 0, pl_orbeccenerr1: 0, pl_orbeccenerr2: 0, pl_orbeccenlim: 0,
          pl_insol: 0, pl_insolerr1: 0, pl_insolerr2: 0, pl_insollim: 0,
          pl_eqt: 0, pl_eqterr1: 0, pl_eqterr2: 0, pl_eqtlim: 0,
          ttv_flag: 0,
          st_refname: '', st_spectype: 'G2V', st_teff: 5778, st_tefferr1: 0, st_tefferr2: 0, st_tefflim: 0,
          st_rad: 1, st_raderr1: 0, st_raderr2: 0, st_radlim: 0,
          st_mass: 1, st_masserr1: 0, st_masserr2: 0, st_masslim: 0,
          st_met: 0, st_meterr1: 0, st_meterr2: 0, st_metlim: 0, st_metratio: '',
          st_logg: 0, st_loggerr1: 0, st_loggerr2: 0, st_logglim: 0,
          sy_refname: '', rastr: '', ra: 0, decstr: '', dec: 0,
          sy_dist: 0, sy_disterr1: 0, sy_disterr2: 0,
          sy_vmag: 0, sy_vmagerr1: 0, sy_vmagerr2: 0,
          sy_kmag: 0, sy_kmagerr1: 0, sy_kmagerr2: 0,
          sy_gaiamag: 0, sy_gaiamagerr1: 0, sy_gaiamagerr2: 0,
          rowupdate: '', pl_pubdate: '', releasedate: '',
        } as PlanetData))
        
        stars = [sun, ...stars]
        planets = [...planets, ...solarPlanets]
        
        setStars(stars)
        setPlanets(planets)
        
        setLoading(true, 100, 'Initializing space')
        
        // Увеличенная задержка позволяет Canvas и WebGL полностью инициализироваться в фоне,
        // пока пользователь видит лоадер. Это полностью устраняет "мигание" пустого экрана.
        setTimeout(() => {
          setLoading(false, 0, '')
          setDataLoaded(true)
        }, 2500)
        
      } catch (error) {
        console.error('Failed to load data:', error)
        setLoading(false, 0, 'Ошибка загрузки данных. Проверьте консоль.')
      }
    }
    
    loadData()
  }, [dataLoaded, setStars, setPlanets, setLoading])

  return (
    <>
      {/* Canvas рендерится всегда, чтобы инициализация WebGL происходила в фоне под лоадером */}
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
      
      {/* Лоадер отображается поверх Canvas, пока идет загрузка */}
      {isLoading && <Loader progress={loadingProgress} text={loadingText} />}
    </>
  )
}
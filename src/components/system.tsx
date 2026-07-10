// File: src/components/system.tsx
import { useRef, useEffect } from 'react'
import './system.css'
import { useStore } from '../store/store'
import { texts } from '../text'
import { type PlanetData } from '../csvParser'

interface Planet {
  distance: number
  radius: number
  speed: number
  color: string
  angle: number
  name: string
  data?: PlanetData
}

function hexToRgba(hex: string, alpha: number): string {
  if (!hex || typeof hex !== 'string') {
    return `rgba(255, 255, 255, ${alpha})`
  }
  const clean = hex.replace('#', '')
  const r = parseInt(clean.substring(0, 2), 16) || 255
  const g = parseInt(clean.substring(2, 4), 16) || 255
  const b = parseInt(clean.substring(4, 6), 16) || 255
  return `rgba(${r}, ${g}, ${b}, ${alpha})`
}

// Валидация числа - возвращает value если валидно, иначе fallback
function safeNumber(value: any, fallback: number): number {
  const num = Number(value)
  return isFinite(num) ? num : fallback
}

function generateSystemFromPlanets(starPlanets: PlanetData[]): Planet[] {
  if (starPlanets.length === 0) {
    return []
  }
  
  const colors = ['#ff8844', '#44aaff', '#88ff44', '#ffaa44', '#aa88ff', '#ff6688', '#44ffcc']
  const getColor = (name: string) => {
    let hash = 0
    for (let i = 0; i < name.length; i++) {
      hash = ((hash << 5) - hash) + name.charCodeAt(i)
      hash |= 0
    }
    return colors[Math.abs(hash) % colors.length]
  }
  
  const maxVisualDistance = 120
  const auToPixels = (au: number) => {
    const safeAu = safeNumber(au, 0.05)
    const logValue = Math.log(safeAu + 1)
    const distance = 25 + logValue * 40
    return Math.min(maxVisualDistance, Math.max(25, distance))
  }
  
  return starPlanets.map((planet: PlanetData, index: number) => {
    const orbitalPeriod = safeNumber(planet.pl_orbper, 100)
    const baseSpeed = 0.5
    const speed = orbitalPeriod > 0 ? baseSpeed / orbitalPeriod : 0.1
    
    const radiusEarth = safeNumber(planet.pl_rade, 1)
    const semiMajorAxis = safeNumber(planet.pl_orbsmax, 0.05)
    
    return {
      name: planet.pl_name || `Planet ${index + 1}`,
      distance: auToPixels(semiMajorAxis),
      radius: Math.max(3, 3 + (radiusEarth * 2)),
      speed: speed,
      color: getColor(planet.pl_name || `planet${index}`),
      angle: (index * Math.PI * 2) / Math.max(1, starPlanets.length),
      data: planet,
    }
  })
}

function generateFallbackPlanets(seed: string): Planet[] {
  let hash = 0
  for (let i = 0; i < seed.length; i++) {
    hash = ((hash << 5) - hash) + seed.charCodeAt(i)
    hash |= 0
  }
  const rng = () => {
    hash = (hash * 1103515245 + 12345) & 0x7fffffff
    return hash / 0x7fffffff
  }

  const count = Math.floor(rng() * 5) + 2
  const planets: Planet[] = []
  const colors = ['#ff8844', '#44aaff', '#88ff44', '#ffaa44', '#aa88ff', '#ff6688', '#44ffcc']

  for (let i = 0; i < count; i++) {
    planets.push({
      name: `Planet ${i+1}`,
      distance: 30 + i * 22 + rng() * 10,
      radius: 3 + rng() * 5,
      speed: 0.2 + rng() * 0.8,
      color: colors[Math.floor(rng() * colors.length)],
      angle: rng() * Math.PI * 2,
    })
  }
  return planets
}

export default function System() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animRef = useRef<number>(0)
  const selectedStar = useStore(s => s.selectedStar)
  const language = useStore(s => s.language)
  const planetsRef = useRef<Planet[]>([])
  const setHoveredPlanet = useStore(s => s.setHoveredPlanet)
  
  useEffect(() => {
    if (selectedStar && selectedStar.planets && selectedStar.planets.length > 0) {
      planetsRef.current = generateSystemFromPlanets(selectedStar.planets)
    } else if (selectedStar) {
      planetsRef.current = generateFallbackPlanets(selectedStar.name)
    } else {
      planetsRef.current = []
    }
  }, [selectedStar])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const animate = () => {
      const w = canvas.width
      const h = canvas.height
      const cx = w / 2
      const cy = h / 2

      ctx.clearRect(0, 0, w, h)

      // Draw orbits
      planetsRef.current.forEach(planet => {
        const distance = safeNumber(planet.distance, 0)
        if (distance > 0) {
          ctx.beginPath()
          ctx.arc(cx, cy, distance, 0, Math.PI * 2)
          ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)'
          ctx.lineWidth = 1
          ctx.stroke()
        }
      })

      // Draw star
      if (selectedStar) {
        const starColor = selectedStar.color || '#ffffff'
        const gradient = ctx.createRadialGradient(cx, cy, 0, cx, cy, 22)
        gradient.addColorStop(0, hexToRgba(starColor, 1))
        gradient.addColorStop(0.4, hexToRgba(starColor, 0.5))
        gradient.addColorStop(1, hexToRgba(starColor, 0))
        ctx.beginPath()
        ctx.arc(cx, cy, 22, 0, Math.PI * 2)
        ctx.fillStyle = gradient
        ctx.fill()

        ctx.beginPath()
        ctx.arc(cx, cy, 7, 0, Math.PI * 2)
        ctx.fillStyle = starColor
        ctx.fill()
      }

      // Draw planets
      planetsRef.current.forEach(planet => {
        // Валидация всех значений
        const distance = safeNumber(planet.distance, 30)
        const radius = safeNumber(planet.radius, 3)
        const speed = safeNumber(planet.speed, 0.1)
        let angle = safeNumber(planet.angle, 0)
        
        // Обновляем угол
        angle += speed * 0.01
        planet.angle = angle
        
        // Вычисляем позицию
        const px = cx + Math.cos(angle) * distance
        const py = cy + Math.sin(angle) * distance

        // Проверяем что координаты валидные
        if (!isFinite(px) || !isFinite(py)) {
          return
        }

        // Planet glow
        const glowRadius = Math.max(1, radius * 2.5)
        if (isFinite(glowRadius)) {
          const glow = ctx.createRadialGradient(px, py, 0, px, py, glowRadius)
          glow.addColorStop(0, hexToRgba(planet.color, 0.3))
          glow.addColorStop(1, hexToRgba(planet.color, 0))
          ctx.beginPath()
          ctx.arc(px, py, glowRadius, 0, Math.PI * 2)
          ctx.fillStyle = glow
          ctx.fill()
        }

        // Planet body
        const bodyRadius = Math.max(1, radius)
        if (isFinite(bodyRadius)) {
          ctx.beginPath()
          ctx.arc(px, py, bodyRadius, 0, Math.PI * 2)
          ctx.fillStyle = planet.color
          ctx.fill()
        }
      })

      animRef.current = requestAnimationFrame(animate)
    }

    animate()
    return () => cancelAnimationFrame(animRef.current)
  }, [selectedStar])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    
    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top
      const cx = canvas.width / 2
      const cy = canvas.height / 2
      
      let closestPlanet: Planet | null = null
      let minDist = Infinity
      
      planetsRef.current.forEach(planet => {
        const distance = safeNumber(planet.distance, 0)
        const radius = safeNumber(planet.radius, 3)
        const angle = safeNumber(planet.angle, 0)
        
        const px = cx + Math.cos(angle) * distance
        const py = cy + Math.sin(angle) * distance
        const dist = Math.sqrt((x - px) ** 2 + (y - py) ** 2)
        
        if (dist < radius * 2 && dist < minDist) {
          minDist = dist
          closestPlanet = planet
        }
      })
      
      if (closestPlanet && closestPlanet.data) {
        setHoveredPlanet(closestPlanet.data)
        const hoverElement = document.querySelector('.planet-hover') as HTMLElement
        if (hoverElement) {
          hoverElement.style.left = `${e.clientX + 15}px`
          hoverElement.style.top = `${e.clientY + 15}px`
        }
      } else {
        setHoveredPlanet(null)
      }
    }
    
    const handleMouseOut = () => {
      setHoveredPlanet(null)
    }
    
    canvas.addEventListener('mousemove', handleMouseMove)
    canvas.addEventListener('mouseout', handleMouseOut)
    
    return () => {
      canvas.removeEventListener('mousemove', handleMouseMove)
      canvas.removeEventListener('mouseout', handleMouseOut)
    }
  }, [selectedStar, setHoveredPlanet])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const resize = () => {
      const parent = canvas.parentElement
      if (parent) {
        const rect = parent.getBoundingClientRect()
        canvas.width = rect.width
        canvas.height = rect.height
      }
    }
    resize()
    window.addEventListener('resize', resize)
    return () => window.removeEventListener('resize', resize)
  }, [])

  return (
    <div className="system-container">
      {selectedStar ? (
        <>
          <div className="system-header">
            <span className="system-star-name">{selectedStar.name}</span>
            <span className="system-planet-count">
              {planetsRef.current.length} {texts['system.planets'][language]}
            </span>
          </div>
          <canvas ref={canvasRef} className="system-canvas" />
        </>
      ) : (
        <div className="system-empty">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <circle cx="12" cy="12" r="3" />
            <circle cx="12" cy="12" r="8" strokeDasharray="4 2" />
            <circle cx="12" cy="12" r="11" strokeDasharray="2 3" />
          </svg>
          <span>{texts['system.empty'][language]}</span>
        </div>
      )}
    </div>
  )
}
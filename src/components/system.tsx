// File: src/components/system.tsx
import { useRef, useEffect, useState } from 'react'
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
  
  console.log(`\n🔬 Analyzing ${starPlanets.length} planet record(s):`)
  
  // Дедупликация по имени планеты - оставляем только уникальные планеты
  const uniquePlanetsMap = new Map<string, PlanetData>()
  starPlanets.forEach(planet => {
    const planetName = planet.pl_name?.trim()
    if (!planetName) return
    
    // Если планеты с таким именем ещё нет, или текущая запись имеет default_flag = 1
    if (!uniquePlanetsMap.has(planetName) || planet.default_flag === 1) {
      uniquePlanetsMap.set(planetName, planet)
    }
  })
  
  const uniquePlanets = Array.from(uniquePlanetsMap.values())
  console.log(`   Unique planets after deduplication: ${uniquePlanets.length}`)
  
  if (uniquePlanets.length < starPlanets.length) {
    console.log(`   ⚠️ Removed ${starPlanets.length - uniquePlanets.length} duplicate record(s)`)
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
  
  // Собираем все валидные значения полуосей
  const semiMajorAxes: number[] = []
  uniquePlanets.forEach(planet => {
    const semiMajorAxis = safeNumber(planet.pl_orbsmax, NaN)
    if (isFinite(semiMajorAxis) && semiMajorAxis > 0) {
      semiMajorAxes.push(semiMajorAxis)
    }
  })
  
  console.log(`   Valid semi-major axes found: ${semiMajorAxes.length}/${uniquePlanets.length}`)
  if (semiMajorAxes.length > 0) {
    const minAu = Math.min(...semiMajorAxes)
    const maxAu = Math.max(...semiMajorAxes)
    console.log(`   Range: ${minAu.toFixed(3)} - ${maxAu.toFixed(3)} AU`)
  }
  
  const minVisualDistance = 25
  const maxVisualDistance = 120
  
  // Функция нормализации - распределяет планеты пропорционально их реальным расстояниям
  const auToPixels = (au: number, index: number) => {
    if (!isFinite(au) || au <= 0) {
      // Если значение невалидное, распределяем равномерно
      const spacing = (maxVisualDistance - minVisualDistance) / Math.max(1, uniquePlanets.length - 1)
      return minVisualDistance + index * spacing
    }
    
    // Если только одна планета или все имеют одинаковую полуось
    if (semiMajorAxes.length === 0) {
      return minVisualDistance + 20
    }
    
    const minAu = Math.min(...semiMajorAxes)
    const maxAu = Math.max(...semiMajorAxes)
    
    // Если все планеты на одинаковом расстоянии
    if (maxAu === minAu) {
      // Распределяем их равномерно
      const spacing = (maxVisualDistance - minVisualDistance) / Math.max(1, uniquePlanets.length - 1)
      return minVisualDistance + index * spacing
    }
    
    // Нормализуем значение в диапазон [minVisualDistance, maxVisualDistance]
    const normalized = (au - minAu) / (maxAu - minAu)
    return minVisualDistance + normalized * (maxVisualDistance - minVisualDistance)
  }
  
  return uniquePlanets.map((planet: PlanetData, index: number) => {
    const orbitalPeriod = safeNumber(planet.pl_orbper, 100)
    const baseSpeed = 0.5
    const speed = orbitalPeriod > 0 ? baseSpeed / orbitalPeriod : 0.1
    
    const radiusEarth = safeNumber(planet.pl_rade, 1)
    const semiMajorAxis = safeNumber(planet.pl_orbsmax, NaN)
    
    const distance = auToPixels(semiMajorAxis, index)
    
    console.log(`   Planet ${index + 1}: ${planet.pl_name}`)
    console.log(`      - Semi-major axis: ${isFinite(semiMajorAxis) ? semiMajorAxis.toFixed(3) : 'N/A'} AU`)
    console.log(`      - Orbital period: ${isFinite(orbitalPeriod) ? orbitalPeriod.toFixed(1) : 'N/A'} days`)
    console.log(`      - Visual distance: ${distance.toFixed(1)}px`)
    console.log(`      - Speed: ${speed.toFixed(4)}`)
    
    return {
      name: planet.pl_name || `Planet ${index + 1}`,
      distance: distance,
      radius: Math.max(3, 3 + (radiusEarth * 2)),
      speed: speed,
      color: getColor(planet.pl_name || `planet${index}`),
      angle: (index * Math.PI * 2) / Math.max(1, uniquePlanets.length),
      data: planet,
    }
  })
}

export default function System() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animRef = useRef<number>(0)
  const selectedStar = useStore(s => s.selectedStar)
  const language = useStore(s => s.language)
  const [planets, setPlanets] = useState<Planet[]>([])
  const setHoveredPlanet = useStore(s => s.setHoveredPlanet)
  
  useEffect(() => {
    if (selectedStar && selectedStar.planets && selectedStar.planets.length > 0) {
      console.log(`\n🪐 Generating system for star: ${selectedStar.name}`)
      console.log(`   Planet records in data: ${selectedStar.planets.length}`)
      const generatedPlanets = generateSystemFromPlanets(selectedStar.planets)
      setPlanets(generatedPlanets)
      console.log(`   Generated ${generatedPlanets.length} unique visual planet(s)`)
    } else if (selectedStar) {
      console.log(`\n⭐ Star ${selectedStar.name} has no confirmed planets - showing star only`)
      setPlanets([])
    } else {
      setPlanets([])
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
      planets.forEach(planet => {
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
      planets.forEach(planet => {
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
  }, [selectedStar, planets])

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
      
      planets.forEach(planet => {
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
  }, [selectedStar, planets, setHoveredPlanet])

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
              {planets.length} {texts['system.planets'][language]}
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
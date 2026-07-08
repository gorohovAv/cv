import { useRef, useEffect } from 'react'
import './system.css'
import { useStore } from '../store/store'
import { texts } from '../text'

interface Planet {
  distance: number
  radius: number
  speed: number
  color: string
  angle: number
}

function generateSystem(seed: string): Planet[] {
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

  useEffect(() => {
    if (selectedStar) {
      planetsRef.current = generateSystem(selectedStar.name)
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
        ctx.beginPath()
        ctx.arc(cx, cy, planet.distance, 0, Math.PI * 2)
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)'
        ctx.lineWidth = 1
        ctx.stroke()
      })

      // Draw star
      if (selectedStar) {
        const gradient = ctx.createRadialGradient(cx, cy, 0, cx, cy, 20)
        gradient.addColorStop(0, selectedStar.color)
        gradient.addColorStop(0.5, selectedStar.color + '88')
        gradient.addColorStop(1, 'transparent')
        ctx.beginPath()
        ctx.arc(cx, cy, 20, 0, Math.PI * 2)
        ctx.fillStyle = gradient
        ctx.fill()

        // Core
        ctx.beginPath()
        ctx.arc(cx, cy, 8, 0, Math.PI * 2)
        ctx.fillStyle = selectedStar.color
        ctx.fill()
      }

      // Draw planets
      planetsRef.current.forEach(planet => {
        planet.angle += planet.speed * 0.01
        const px = cx + Math.cos(planet.angle) * planet.distance
        const py = cy + Math.sin(planet.angle) * planet.distance

        ctx.beginPath()
        ctx.arc(px, py, planet.radius, 0, Math.PI * 2)
        ctx.fillStyle = planet.color
        ctx.fill()

        // Glow
        const glow = ctx.createRadialGradient(px, py, 0, px, py, planet.radius * 2)
        glow.addColorStop(0, planet.color + '44')
        glow.addColorStop(1, 'transparent')
        ctx.beginPath()
        ctx.arc(px, py, planet.radius * 2, 0, Math.PI * 2)
        ctx.fillStyle = glow
        ctx.fill()
      })

      animRef.current = requestAnimationFrame(animate)
    }

    animate()
    return () => cancelAnimationFrame(animRef.current)
  }, [selectedStar])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const resize = () => {
      const parent = canvas.parentElement
      if (parent) {
        canvas.width = parent.clientWidth
        canvas.height = parent.clientHeight
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
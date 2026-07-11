// File: src/components/starHover.tsx
import { useStore } from '../store/store'
import { texts } from '../text'
import './starHover.css'

export default function StarHover() {
  const hoveredSystem = useStore(s => s.hoveredSystem)
  const language = useStore(s => s.language)

  if (!hoveredSystem) return null

  // Безопасное получение текстов с fallback
  const getText = (key: string, fallback: string) => {
    const textObj = texts[key as keyof typeof texts]
    if (!textObj) return fallback
    return textObj[language as keyof typeof textObj] || fallback
  }

  // Конвертируем парсеки в световые годы (1 pc = 3.26156 ly)
  const distanceInLightYears = hoveredSystem.dist * 3.26156
  const distanceText = getText('starHover.distance', 'Distance: {distance} ly')
    .replace('{distance}', distanceInLightYears.toFixed(2))

  // Дедупликация планет по имени (как в system.tsx)
  const uniquePlanetsMap = new Map<string, any>()
  if (hoveredSystem.planets) {
    hoveredSystem.planets.forEach(planet => {
      const planetName = planet.pl_name?.trim()
      if (!planetName) return
      
      if (!uniquePlanetsMap.has(planetName) || planet.default_flag === 1) {
        uniquePlanetsMap.set(planetName, planet)
      }
    })
  }
  
  const uniquePlanetsCount = uniquePlanetsMap.size

  return (
    <div className="star-hover">
      <div className="star-hover-content">
        <h3 className="star-hover-name">{hoveredSystem.name}</h3>
        <p className="star-hover-distance">
          {distanceText}
        </p>
        {hoveredSystem.spect && (
          <p className="star-hover-spect">
            {getText('starHover.spect', 'Spectral class')}: {hoveredSystem.spect}
          </p>
        )}
        <p className="star-hover-magnitude">
          {getText('starHover.magnitude', 'Magnitude')}: {hoveredSystem.mag.toFixed(2)}
        </p>
        {uniquePlanetsCount > 0 && (
          <p className="star-hover-planets">
            {getText('starHover.planets', '{count} planets').replace('{count}', uniquePlanetsCount.toString())}
          </p>
        )}
      </div>
    </div>
  )
}
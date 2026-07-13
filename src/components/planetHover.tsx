// File: src/components/planetHover.tsx
import { useStore } from '../store/store'
import { texts } from '../text'
import './planetHover.css'

export default function PlanetHover() {
  const hoveredPlanet = useStore(s => s.hoveredPlanet)
  const language = useStore(s => s.language)

  if (!hoveredPlanet) return null

  // Безопасное получение текстов с fallback
  const getText = (key: string, fallback: string) => {
    const textObj = texts[key as keyof typeof texts]
    if (!textObj) return fallback
    if (Array.isArray(textObj)) return fallback
    return textObj[language as keyof typeof textObj] || fallback
  }

  // Маппинг полей из реального интерфейса PlanetData
  const orbitalPeriod = hoveredPlanet.pl_orbper ?? 0
  const massEarth = hoveredPlanet.pl_bmasse ?? 0
  const radiusEarth = hoveredPlanet.pl_rade ?? 0
  const name = hoveredPlanet.pl_name || 'Unknown Planet'
  const star = hoveredPlanet.hostname || 'Unknown Star'
  
  // Проверка на зону обитаемости (приблизительно: поток излучения от 0.35 до 1.1 от земного)
  const insolation = hoveredPlanet.pl_insol
  const isHabitable = typeof insolation === 'number' && !Number.isNaN(insolation) && insolation >= 0.35 && insolation <= 1.1

  return (
    <div className="planet-hover">
      <div className="planet-hover-content">
        <h3 className="planet-hover-name">{name}</h3>
        <p className="planet-hover-star">
          {getText('planetHover.orbits', 'Orbits')} {star}
        </p>
        <div className="planet-hover-details">
          <span className="planet-hover-detail">
            {getText('planetHover.period', 'Period')}: {Number.isFinite(orbitalPeriod) ? orbitalPeriod.toFixed(1) : 'N/A'} {getText('planetHover.days', 'days')}
          </span>
          <span className="planet-hover-detail">
            {getText('planetHover.mass', 'Mass')}: {Number.isFinite(massEarth) ? massEarth.toFixed(2) : 'N/A'} M⊕
          </span>
          <span className="planet-hover-detail">
            {getText('planetHover.radius', 'Radius')}: {Number.isFinite(radiusEarth) ? radiusEarth.toFixed(2) : 'N/A'} R⊕
          </span>
        </div>
        {isHabitable && (
          <p className="planet-hover-habitable">
            {getText('planetHover.habitable', 'In habitable zone')}
          </p>
        )}
      </div>
    </div>
  )
}
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
    return textObj[language as keyof typeof textObj] || fallback
  }

  // Безопасные значения по умолчанию
  const orbitalPeriod = hoveredPlanet.orbital_period_days ?? 0
  const massEarth = hoveredPlanet.mass_earth ?? 0
  const radiusEarth = hoveredPlanet.radius_earth ?? 0

  return (
    <div className="planet-hover">
      <div className="planet-hover-content">
        <h3 className="planet-hover-name">{hoveredPlanet.name}</h3>
        <p className="planet-hover-star">
          {getText('planetHover.orbits', 'Orbits')} {hoveredPlanet.star}
        </p>
        <div className="planet-hover-details">
          <span className="planet-hover-detail">
            {getText('planetHover.period', 'Period')}: {orbitalPeriod} {getText('planetHover.days', 'days')}
          </span>
          <span className="planet-hover-detail">
            {getText('planetHover.mass', 'Mass')}: {massEarth.toFixed(2)} M⊕
          </span>
          <span className="planet-hover-detail">
            {getText('planetHover.radius', 'Radius')}: {radiusEarth.toFixed(2)} R⊕
          </span>
        </div>
        {hoveredPlanet.habitable_zone && (
          <p className="planet-hover-habitable">
            {getText('planetHover.habitable', 'In habitable zone')}
          </p>
        )}
      </div>
    </div>
  )
}
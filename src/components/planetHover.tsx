// File: planetHover.tsx
import { useStore } from '../store/store'
import { texts } from '../text'
import './planetHover.css'

export default function PlanetHover() {
  const hoveredPlanet = useStore(s => s.hoveredPlanet)
  const language = useStore(s => s.language)

  if (!hoveredPlanet) return null

  // Безопасные значения по умолчанию
  const orbitalPeriod = hoveredPlanet.orbital_period_days ?? 0
  const massEarth = hoveredPlanet.mass_earth ?? 0
  const radiusEarth = hoveredPlanet.radius_earth ?? 0

  return (
    <div className="planet-hover">
      <div className="planet-hover-content">
        <h3 className="planet-hover-name">{hoveredPlanet.name}</h3>
        <p className="planet-hover-star">
          {texts['planetHover.orbits'][language]} {hoveredPlanet.star}
        </p>
        <div className="planet-hover-details">
          <span className="planet-hover-detail">
            {texts['planetHover.period'][language]}: {orbitalPeriod} {texts['planetHover.days'][language]}
          </span>
          <span className="planet-hover-detail">
            {texts['planetHover.mass'][language]}: {massEarth.toFixed(2)} M⊕
          </span>
          <span className="planet-hover-detail">
            {texts['planetHover.radius'][language]}: {radiusEarth.toFixed(2)} R⊕
          </span>
        </div>
        {hoveredPlanet.habitable_zone && (
          <p className="planet-hover-habitable">
            {texts['planetHover.habitable'][language]}
          </p>
        )}
      </div>
    </div>
  )
}
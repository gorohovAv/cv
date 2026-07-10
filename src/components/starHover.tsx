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

  const distanceText = getText('starHover.distance', 'Distance: {distance} pc')
    .replace('{distance}', hoveredSystem.dist.toFixed(2))

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
        {hoveredSystem.planets && hoveredSystem.planets.length > 0 && (
          <p className="star-hover-planets">
            {getText('starHover.planets', '{count} planets').replace('{count}', hoveredSystem.planets.length.toString())}
          </p>
        )}
      </div>
    </div>
  )
}
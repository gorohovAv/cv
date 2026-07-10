// File: src/components/starHover.tsx
import { useStore } from '../store/store'
import { texts } from '../text'
import './starHover.css'

export default function StarHover() {
  const hoveredSystem = useStore(s => s.hoveredSystem)
  const language = useStore(s => s.language)

  if (!hoveredSystem) return null

  return (
    <div className="star-hover">
      <div className="star-hover-content">
        <h3 className="star-hover-name">{hoveredSystem.name}</h3>
        <p className="star-hover-distance">
          {texts['starHover.distance'][language].replace('{distance}', hoveredSystem.dist.toFixed(2))}
        </p>
        {hoveredSystem.spect && (
          <p className="star-hover-spect">
            {texts['starHover.spect'][language] || 'Spectral class'}: {hoveredSystem.spect}
          </p>
        )}
        <p className="star-hover-magnitude">
          {texts['starHover.magnitude'][language] || 'Magnitude'}: {hoveredSystem.mag.toFixed(2)}
        </p>
        {hoveredSystem.planets && hoveredSystem.planets.length > 0 && (
          <p className="star-hover-planets">
            {texts['starHover.planets'][language].replace('{count}', hoveredSystem.planets.length.toString())}
          </p>
        )}
      </div>
    </div>
  )
}
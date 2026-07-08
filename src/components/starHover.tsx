// File: starHover.tsx
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
          {texts['starHover.distance'][language].replace('{distance}', hoveredSystem.distance_ly.toString())}
        </p>
        <p className="star-hover-constellation">
          {texts['starHover.constellation'][language]}: {hoveredSystem.constellation}
        </p>
        <p className="star-hover-stars">
          {texts['starHover.stars'][language].replace('{count}', hoveredSystem.stars.length.toString())}
        </p>
        {hoveredSystem.planets.length > 0 && (
          <p className="star-hover-planets">
            {texts['starHover.planets'][language].replace('{count}', hoveredSystem.planets.length.toString())}
          </p>
        )}
      </div>
    </div>
  )
}
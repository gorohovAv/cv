import { useStore } from '../../store/store'
import { texts } from '../../text'

export default function Projects() {
  const language = useStore(s => s.language)
  const t = (key: string) => texts[key]?.[language] ?? key

  return (
    <div className="overlay-section projects-section">
      <div className="project-card">
        <h4>{t('projects.project1.name')}</h4>
        <p>{t('projects.project1.desc')}</p>
        <div className="project-tags">
          <span>Three.js</span>
          <span>WebGL</span>
          <span>TypeScript</span>
        </div>
      </div>
      <div className="project-card">
        <h4>{t('projects.project2.name')}</h4>
        <p>{t('projects.project2.desc')}</p>
        <div className="project-tags">
          <span>Go</span>
          <span>Redis</span>
          <span>gRPC</span>
        </div>
      </div>
      <div className="project-card">
        <h4>{t('projects.project3.name')}</h4>
        <p>{t('projects.project3.desc')}</p>
        <div className="project-tags">
          <span>Python</span>
          <span>PyTorch</span>
          <span>FastAPI</span>
        </div>
      </div>
    </div>
  )
}
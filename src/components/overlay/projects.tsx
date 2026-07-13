import { useStore } from '../../store/store'
import { getText } from '../../text'

export default function Projects() {
  const language = useStore(s => s.language)
  const t = (key: string) => getText(key, language)

  return (
    <div className="overlay-section projects-section">
      <div className="project-card">
        <h4>{t('projects.project1.name')}</h4>
        <p>{t('projects.project1.desc')}</p>
        <div className="project-tags">
          <span>Go</span>
          <span>Gin</span>
          <span>GORM</span>
          <span>Python</span>
          <span>React</span>
          <span>Zustand</span>
          <span>Electron</span>
        </div>
      </div>

      <div className="project-card">
        <h4>{t('projects.project2.name')}</h4>
        <p>{t('projects.project2.desc')}</p>
        <div className="project-tags">
          <span>Next.js</span>
          <span>Redux</span>
          <span>Prisma</span>
          <span>BEM</span>
          <span>TypeScript</span>
        </div>
      </div>

      <div className="project-card">
        <h4>{t('projects.project3.name')}</h4>
        <p>{t('projects.project3.desc')}</p>
        <div className="project-tags">
          <span>LLM</span>
          <span>RAG</span>
          <span>Python</span>
          <span>AI Pipelines</span>
        </div>
      </div>

      <div className="project-card">
        <h4>{t('projects.project4.name')}</h4>
        <p>{t('projects.project4.desc')}</p>
        <div className="project-tags">
          <span>Rust</span>
          <span>Python</span>
          <span>Performance</span>
        </div>
      </div>
    </div>
  )
}
// File: src/components/overlay/projects.tsx
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
        <div className="project-links">
          <a href="https://github.com/gorohovAv/fit-plot" target="_blank" rel="noreferrer" className="project-link">
            <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 .5C5.73.5.5 5.73.5 12c0 5.08 3.29 9.39 7.86 10.91.58.1.79-.25.79-.56v-2c-3.2.7-3.88-1.37-3.88-1.37-.52-1.33-1.27-1.69-1.27-1.69-1.04-.71.08-.7.08-.7 1.15.08 1.76 1.18 1.76 1.18 1.02 1.75 2.68 1.25 3.33.96.1-.74.4-1.25.73-1.54-2.55-.29-5.24-1.28-5.24-5.69 0-1.26.45-2.29 1.18-3.1-.12-.29-.51-1.46.11-3.04 0 0 .97-.31 3.18 1.18a11 11 0 015.79 0c2.2-1.49 3.17-1.18 3.17-1.18.63 1.58.24 2.75.12 3.04.74.81 1.18 1.84 1.18 3.1 0 4.42-2.69 5.39-5.25 5.68.41.36.78 1.06.78 2.14v3.17c0 .31.21.67.8.56C20.21 21.39 23.5 17.07 23.5 12 23.5 5.73 18.27.5 12 .5z" /></svg>
            {t('projects.project1.link1')}
          </a>
          <a href="https://marketplace.visualstudio.com/items?itemName=Eggplant11.chatcontextmanager" target="_blank" rel="noreferrer" className="project-link">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 3h7l2 2h9v14a2 2 0 01-2 2H5a2 2 0 01-2-2V3z" /></svg>
            {t('projects.project1.link2')}
          </a>
        </div>
        <div className="project-tags">
          <span>TypeScript</span>
          <span>JavaScript</span>
          <span>VS Code API</span>
        </div>
      </div>

      <div className="project-card">
        <h4>{t('projects.project2.name')}</h4>
        <p>{t('projects.project2.desc')}</p>
        <div className="project-links">
          <a href="https://github.com/gorohovAv/fit-plot" target="_blank" rel="noreferrer" className="project-link">
            <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 .5C5.73.5.5 5.73.5 12c0 5.08 3.29 9.39 7.86 10.91.58.1.79-.25.79-.56v-2c-3.2.7-3.88-1.37-3.88-1.37-.52-1.33-1.27-1.69-1.27-1.69-1.04-.71.08-.7.08-.7 1.15.08 1.76 1.18 1.76 1.18 1.02 1.75 2.68 1.25 3.33.96.1-.74.4-1.25.73-1.54-2.55-.29-5.24-1.28-5.24-5.69 0-1.26.45-2.29 1.18-3.1-.12-.29-.51-1.46.11-3.04 0 0 .97-.31 3.18 1.18a11 11 0 015.79 0c2.2-1.49 3.17-1.18 3.17-1.18.63 1.58.24 2.75.12 3.04.74.81 1.18 1.84 1.18 3.1 0 4.42-2.69 5.39-5.25 5.68.41.36.78 1.06.78 2.14v3.17c0 .31.21.67.8.56C20.21 21.39 23.5 17.07 23.5 12 23.5 5.73 18.27.5 12 .5z" /></svg>
            {t('projects.project2.link1')}
          </a>
          <a href="https://www.rustore.ru/catalog/app/com.anonymous.fitplot" target="_blank" rel="noreferrer" className="project-link">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="5" y="2" width="14" height="20" rx="2" ry="2" /><line x1="12" y1="18" x2="12.01" y2="18" /></svg>
            {t('projects.project2.link2')}
          </a>
        </div>
        <div className="project-tags">
          <span>TypeScript</span>
          <span>React Native</span>
          <span>Zustand</span>
        </div>
      </div>

      <div className="project-card">
        <h4>{t('projects.project3.name')}</h4>
        <p>{t('projects.project3.desc')}</p>
        <div className="project-tags">
          <span>WebGL</span>
          <span>React</span>
          <span>Astronomy Data</span>
        </div>
      </div>
    </div>
  )
}
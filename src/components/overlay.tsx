import './overlay.css'
import { useStore } from '../store/store'
import { getText } from '../text'
import About from './overlay/about'
import Education from './overlay/education'
import Experience from './overlay/experience'
import Projects from './overlay/projects'
import Skills from './overlay/skills'
import Contacts from './overlay/contacts'
import License from './overlay/license'

export default function Overlay() {
  const activeOverlay = useStore(s => s.activeOverlay)
  const setActiveOverlay = useStore(s => s.setActiveOverlay)
  const language = useStore(s => s.language)

  if (!activeOverlay) return null

  const renderContent = () => {
    switch (activeOverlay) {
      case 'about': return <About />
      case 'education': return <Education />
      case 'experience': return <Experience />
      case 'projects': return <Projects />
      case 'skills': return <Skills />
      case 'contacts': return <Contacts />
      case 'license': return <License />
      default: return null
    }
  }

  return (
    <div className="overlay-backdrop" onClick={() => setActiveOverlay(null)}>
      <div className="overlay-panel" onClick={e => e.stopPropagation()}>
        <div className="overlay-header">
          <h2>{getText(`${activeOverlay}.title`, language)}</h2>
          <button className="overlay-close" onClick={() => setActiveOverlay(null)}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>
        <div className="overlay-content">
          {renderContent()}
        </div>
      </div>
    </div>
  )
}
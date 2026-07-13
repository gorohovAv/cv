import './sidebar.css'
import { useStore } from '../store/store'
import { getText } from '../text'

function t(key: string, lang: 'ru' | 'en'): string {
  return getText(key, lang)
}

export default function Sidebar() {
  const language = useStore(s => s.language)
  const setLanguage = useStore(s => s.setLanguage)
  const activeOverlay = useStore(s => s.activeOverlay)
  const setActiveOverlay = useStore(s => s.setActiveOverlay)

  const toggleLanguage = () => {
    setLanguage(language === 'ru' ? 'en' : 'ru')
  }

  const handleIconClick = (type: 'about' | 'education' | 'experience' | 'projects' | 'skills' | 'contacts' | 'license') => {
    if (activeOverlay === type) {
      setActiveOverlay(null)
    } else {
      setActiveOverlay(type)
    }
  }

  return (
    <div className="sidebar">
      <div className="sidebar-icons">
        <button
          className={`sidebar-icon ${activeOverlay === 'about' ? 'active' : ''}`}
          onClick={() => handleIconClick('about')}
          title={t('sidebar.about', language)}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="8" r="4" />
            <path d="M4 20c0-4 4-7 8-7s8 3 8 7" />
          </svg>
        </button>

        <button
          className={`sidebar-icon ${activeOverlay === 'education' ? 'active' : ''}`}
          onClick={() => handleIconClick('education')}
          title={t('sidebar.education', language)}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M22 10L12 4 2 10l10 6 10-6z" />
            <path d="M6 12v5c0 1.5 3 3 6 3s6-1.5 6-3v-5" />
            <line x1="22" y1="10" x2="22" y2="16" />
          </svg>
        </button>

        <button
          className={`sidebar-icon ${activeOverlay === 'experience' ? 'active' : ''}`}
          onClick={() => handleIconClick('experience')}
          title={t('sidebar.experience', language)}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="2" y="7" width="20" height="14" rx="2" />
            <path d="M8 7V5a2 2 0 012-2h4a2 2 0 012 2v2" />
            <line x1="2" y1="13" x2="22" y2="13" />
          </svg>
        </button>

        <button
          className={`sidebar-icon ${activeOverlay === 'projects' ? 'active' : ''}`}
          onClick={() => handleIconClick('projects')}
          title={t('sidebar.projects', language)}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M3 3h7l2 2h9v14a2 2 0 01-2 2H5a2 2 0 01-2-2V3z" />
          </svg>
        </button>

        <button
          className={`sidebar-icon ${activeOverlay === 'skills' ? 'active' : ''}`}
          onClick={() => handleIconClick('skills')}
          title={t('sidebar.skills', language)}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 2L2 7l10 5 10-5-10-5z" />
            <path d="M2 17l10 5 10-5" />
            <path d="M2 12l10 5 10-5" />
          </svg>
        </button>

        <button
          className={`sidebar-icon ${activeOverlay === 'contacts' ? 'active' : ''}`}
          onClick={() => handleIconClick('contacts')}
          title={t('sidebar.contacts', language)}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
            <polyline points="22,6 12,13 2,6" />
          </svg>
        </button>

        <button
          className={`sidebar-icon ${activeOverlay === 'license' ? 'active' : ''}`}
          onClick={() => handleIconClick('license')}
          title={t('sidebar.license', language)}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
          </svg>
        </button>
      </div>

      <div className="sidebar-bottom">
        <button
          className="sidebar-icon language-toggle"
          onClick={toggleLanguage}
          title={t('sidebar.language', language)}
        >
          <span className="lang-label">{language === 'ru' ? 'RU' : 'EN'}</span>
        </button>
      </div>
    </div>
  )
}
import { useStore } from '../../store/store'
import { getText } from '../../text'

export default function About() {
  const language = useStore(s => s.language)
  const t = (key: string) => getText(key, language)

  return (
    <div className="overlay-section about-section">
      <div className="about-avatar">
        <svg viewBox="0 0 80 80" fill="none">
          <circle cx="40" cy="40" r="38" stroke="rgba(255, 170, 0, 0.3)" strokeWidth="2" />
          <circle cx="40" cy="30" r="12" fill="rgba(255, 170, 0, 0.2)" />
          <path d="M16 68c0-12 10-20 24-20s24 8 24 20" fill="rgba(255, 170, 0, 0.15)" />
        </svg>
      </div>
      <h3 className="about-name">{t('about.name')}</h3>
      <p className="about-role">{t('about.role')}</p>
      <p className="about-meta">
        <span>🎂 {t('about.age')}</span>
        <span>📍 {t('about.location')}</span>
      </p>

      <p className="about-description">{t('about.description')}</p>
    </div>
  )
}
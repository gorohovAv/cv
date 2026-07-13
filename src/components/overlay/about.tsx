import { useStore } from '../../store/store'
import { getText } from '../../text'

export default function About() {
  const language = useStore(s => s.language)
  const t = (key: string) => getText(key, language)

  const mainStack = t('about.stack.main').split(', ')
  const extraStack = t('about.stack.extra').split(', ')

  return (
    <div className="overlay-section about-section">
      <div className="about-avatar">
        <svg viewBox="0 0 80 80" fill="none">
          <circle cx="40" cy="40" r="38" stroke="rgba(100,140,255,0.3)" strokeWidth="2" />
          <circle cx="40" cy="30" r="12" fill="rgba(100,140,255,0.2)" />
          <path d="M16 68c0-12 10-20 24-20s24 8 24 20" fill="rgba(100,140,255,0.15)" />
        </svg>
      </div>
      <h3 className="about-name">{t('about.name')}</h3>
      <p className="about-role">{t('about.role')}</p>
      <p className="about-meta">
        <span>🎂 {t('about.age')}</span>
        <span>📍 {t('about.location')}</span>
      </p>

      <div className="about-contacts">
        <a className="about-contact-link" href={`mailto:${t('about.email')}`}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="2" y="4" width="20" height="16" rx="2" />
            <path d="M2 7l10 7 10-7" />
          </svg>
          {t('about.email')}
        </a>
        <a className="about-contact-link" href={`tel:${t('about.phone').replace(/[^+\d]/g, '')}`}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M22 16.92v3a2 2 0 01-2.18 2 19.86 19.86 0 01-8.63-3.07 19.5 19.5 0 01-6-6A19.86 19.86 0 012.12 4.18 2 2 0 014.11 2h3a2 2 0 012 1.72c.13.96.37 1.9.72 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.91.35 1.85.59 2.81.72A2 2 0 0122 16.92z" />
          </svg>
          {t('about.phone')}
        </a>
        <a className="about-contact-link" href={t('about.github.url')} target="_blank" rel="noreferrer">
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 .5C5.73.5.5 5.73.5 12c0 5.08 3.29 9.39 7.86 10.91.58.1.79-.25.79-.56v-2c-3.2.7-3.88-1.37-3.88-1.37-.52-1.33-1.27-1.69-1.27-1.69-1.04-.71.08-.7.08-.7 1.15.08 1.76 1.18 1.76 1.18 1.02 1.75 2.68 1.25 3.33.96.1-.74.4-1.25.73-1.54-2.55-.29-5.24-1.28-5.24-5.69 0-1.26.45-2.29 1.18-3.1-.12-.29-.51-1.46.11-3.04 0 0 .97-.31 3.18 1.18a11 11 0 015.79 0c2.2-1.49 3.17-1.18 3.17-1.18.63 1.58.24 2.75.12 3.04.74.81 1.18 1.84 1.18 3.1 0 4.42-2.69 5.39-5.25 5.68.41.36.78 1.06.78 2.14v3.17c0 .31.21.67.8.56C20.21 21.39 23.5 17.07 23.5 12 23.5 5.73 18.27.5 12 .5z" />
          </svg>
          {t('about.github')}
        </a>
      </div>

      <p className="about-description">{t('about.description')}</p>

      <div className="about-stack-block">
        <h4 className="about-stack-title">{t('about.stack.title')}</h4>
        <div className="about-stack-chips">
          {mainStack.map((s: string) => (
            <span key={s} className="chip chip-primary">{s.trim()}</span>
          ))}
        </div>
      </div>

      <div className="about-stack-block">
        <h4 className="about-stack-title">{t('about.stack.extra.title')}</h4>
        <div className="about-stack-chips">
          {extraStack.map((s: string) => (
            <span key={s} className="chip chip-secondary">{s.trim()}</span>
          ))}
        </div>
      </div>
    </div>
  )
}
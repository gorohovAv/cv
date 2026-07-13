// File: src/components/overlay/license.tsx
import { useStore } from '../../store/store'
import { getText } from '../../text'

export default function License() {
  const language = useStore(s => s.language)
  const t = (key: string) => getText(key, language)

  return (
    <div className="overlay-section license-section">
      <div className="license-block">
        <h4>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
          </svg>
          {t('license.title')}
        </h4>
        <p>{t('license.app')}</p>
      </div>

      <div className="license-block">
        <h4>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10" />
            <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
            <path d="M2 12h20" />
          </svg>
          HYG Dataset
        </h4>
        <p>{t('license.stars')}</p>
      </div>

      <div className="license-block">
        <h4>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10" />
            <circle cx="12" cy="12" r="4" />
          </svg>
          NASA Exoplanet Archive
        </h4>
        <p>{t('license.planets')}</p>
      </div>
    </div>
  )
}
import { useStore } from '../../store/store'
import { texts } from '../../text'

export default function Education() {
  const language = useStore(s => s.language)
  const t = (key: string) => texts[key]?.[language] ?? key

  return (
    <div className="overlay-section education-section">
      <div className="timeline-item">
        <div className="timeline-dot" />
        <div className="timeline-content">
          <h4>{t('education.msu')}</h4>
          <span className="timeline-year">{t('education.msu.year')}</span>
          <p className="timeline-degree">{t('education.msu.degree')}</p>
          <p className="timeline-desc">{t('education.msu.desc')}</p>
        </div>
      </div>
      <div className="timeline-item">
        <div className="timeline-dot" />
        <div className="timeline-content">
          <h4>{t('education.bachelor')}</h4>
          <span className="timeline-year">{t('education.bachelor.year')}</span>
          <p className="timeline-degree">{t('education.bachelor.degree')}</p>
          <p className="timeline-desc">{t('education.bachelor.desc')}</p>
        </div>
      </div>
    </div>
  )
}
import { useStore } from '../../store/store'
import { texts } from '../../text'

export default function Experience() {
  const language = useStore(s => s.language)
  const t = (key: string) => texts[key]?.[language] ?? key

  return (
    <div className="overlay-section experience-section">
      <div className="timeline-item">
        <div className="timeline-dot" />
        <div className="timeline-content">
          <h4>{t('experience.job1.company')}</h4>
          <span className="timeline-year">{t('experience.job1.year')}</span>
          <p className="timeline-degree">{t('experience.job1.role')}</p>
          <p className="timeline-desc">{t('experience.job1.desc')}</p>
        </div>
      </div>
      <div className="timeline-item">
        <div className="timeline-dot" />
        <div className="timeline-content">
          <h4>{t('experience.job2.company')}</h4>
          <span className="timeline-year">{t('experience.job2.year')}</span>
          <p className="timeline-degree">{t('experience.job2.role')}</p>
          <p className="timeline-desc">{t('experience.job2.desc')}</p>
        </div>
      </div>
      <div className="timeline-item">
        <div className="timeline-dot" />
        <div className="timeline-content">
          <h4>{t('experience.job3.company')}</h4>
          <span className="timeline-year">{t('experience.job3.year')}</span>
          <p className="timeline-degree">{t('experience.job3.role')}</p>
          <p className="timeline-desc">{t('experience.job3.desc')}</p>
        </div>
      </div>
    </div>
  )
}
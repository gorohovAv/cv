import { useStore } from '../../store/store'
import { texts } from '../../text'

interface Bullet {
  ru: string
  en: string
}

export default function Experience() {
  const language = useStore(s => s.language)
  const t = (key: string) => texts[key]?.[language] ?? key

  const job1Bullets = texts['experience.job1.bullets'] as unknown as Bullet[]
  const job2Bullets = texts['experience.job2.bullets'] as unknown as Bullet[]
  const job3Bullets = texts['experience.job3.bullets'] as unknown as Bullet[]

  return (
    <div className="overlay-section experience-section">
      <div className="timeline-total">
        <span>{language === 'ru' ? 'Общий опыт' : 'Total experience'}:</span>
        <strong>{t('experience.total')}</strong>
      </div>

      <div className="timeline-item">
        <div className="timeline-dot timeline-dot-current" />
        <div className="timeline-content">
          <h4>{t('experience.job1.company')}</h4>
          <span className="timeline-year">{t('experience.job1.year')}</span>
          <p className="timeline-degree">{t('experience.job1.role')} · {t('experience.job1.duration')}</p>
          <p className="timeline-desc">{t('experience.job1.desc')}</p>
          <ul className="timeline-bullets">
            {job1Bullets.map((b, i) => (
              <li key={i}>{b[language]}</li>
            ))}
          </ul>
        </div>
      </div>

      <div className="timeline-item">
        <div className="timeline-dot" />
        <div className="timeline-content">
          <h4>{t('experience.job2.company')}</h4>
          <span className="timeline-year">{t('experience.job2.year')}</span>
          <p className="timeline-degree">{t('experience.job2.role')} · {t('experience.job2.duration')}</p>
          <p className="timeline-desc">{t('experience.job2.desc')}</p>
          <ul className="timeline-bullets">
            {job2Bullets.map((b, i) => (
              <li key={i}>{b[language]}</li>
            ))}
          </ul>
        </div>
      </div>

      <div className="timeline-item">
        <div className="timeline-dot" />
        <div className="timeline-content">
          <h4>{t('experience.job3.company')}</h4>
          <span className="timeline-year">{t('experience.job3.year')}</span>
          <p className="timeline-degree">{t('experience.job3.role')} · {t('experience.job3.duration')}</p>
          <p className="timeline-desc">{t('experience.job3.desc')}</p>
          <ul className="timeline-bullets">
            {job3Bullets.map((b, i) => (
              <li key={i}>{b[language]}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}
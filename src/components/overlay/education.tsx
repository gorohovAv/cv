import { useStore } from '../../store/store'
import { getText } from '../../text'

export default function Education() {
  const language = useStore(s => s.language)
  const t = (key: string) => getText(key, language)

  return (
    <div className="overlay-section education-section">
      <div className="timeline-item">
        <div className="timeline-dot" />
        <div className="timeline-content">
          <h4>{t('education.spbpu')}</h4>
          <span className="timeline-year">{t('education.spbpu.year')}</span>
          <p className="timeline-degree">{t('education.spbpu.degree')}</p>
          <p className="timeline-desc">{t('education.spbpu.faculty')}</p>
        </div>
      </div>

      <div className="timeline-divider">
        <span>{language === 'ru' ? 'Повышение квалификации' : 'Advanced Training'}</span>
      </div>

      <div className="timeline-item">
        <div className="timeline-dot" />
        <div className="timeline-content">
          <h4>{t('education.course.python')}</h4>
          <span className="timeline-year">{t('education.course.python.year')}</span>
          <p className="timeline-degree">{t('education.course.python.place')}</p>
        </div>
      </div>

      <div className="timeline-item">
        <div className="timeline-dot" />
        <div className="timeline-content">
          <h4>{t('education.course.simulation')}</h4>
          <span className="timeline-year">{t('education.course.simulation.year')}</span>
          <p className="timeline-degree">{t('education.course.simulation.place')}</p>
        </div>
      </div>

      <div className="timeline-item">
        <div className="timeline-dot" />
        <div className="timeline-content">
          <h4>{t('education.course.cad')}</h4>
          <span className="timeline-year">{t('education.course.cad.year')}</span>
          <p className="timeline-degree">{t('education.course.cad.place')}</p>
        </div>
      </div>
    </div>
  )
}
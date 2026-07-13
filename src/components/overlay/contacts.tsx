// File: src/components/overlay/contacts.tsx
import { useStore } from '../../store/store'
import { getText } from '../../text'

export default function Contacts() {
  const language = useStore(s => s.language)
  const t = (key: string) => getText(key, language)

  return (
    <div className="overlay-section contacts-section">
      <div className="contact-item">
        <span className="contact-label">{t('contacts.email.label')}</span>
        <a className="contact-link" href={`mailto:${t('about.email')}`}>
          {t('about.email')}
        </a>
      </div>

      <div className="contact-item">
        <span className="contact-label">{t('contacts.telegram.label')}</span>
        <a className="contact-link" href="https://t.me/Eggplant11" target="_blank" rel="noreferrer">
          {t('about.phone')} {/* Здесь теперь будет @Eggplant11 */}
        </a>
      </div>

      <div className="contact-item">
        <span className="contact-label">{t('contacts.github.label')}</span>
        <a className="contact-link" href={t('about.github.url')} target="_blank" rel="noreferrer">
          {t('about.github')}
        </a>
      </div>
    </div>
  )
}
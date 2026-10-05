import { useLocale } from '../i18n/useLocale'
import './Contact.css'
import './LandingPanel.css'

export function Contact() {
  const { t } = useLocale()

  return (
    <section id="contact" className="landing-panel contact">
      <h2 className="landing-panel__title">{t('pages.contact')}</h2>
      <div className="landing-panel__body" />
    </section>
  )
}

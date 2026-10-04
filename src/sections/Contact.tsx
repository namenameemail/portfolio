import { useLocale } from '../i18n/useLocale'
import './LandingPanel.css'

export function Contact() {
  const { t } = useLocale()

  return (
    <section id="contact" className="landing-panel">
      <h2 className="landing-panel__title">{t('pages.contact')}</h2>
      <div className="landing-panel__body" />
    </section>
  )
}

import { useLocale } from '../i18n/useLocale'
import './LandingPanel.css'
import './CvBio.css'

export function CvBio() {
  const { t } = useLocale()

  return (
    <section id="cv-bio" className="landing-panel">
      <h2 className="landing-panel__title">{t('pages.cvBio')}</h2>
      <div className="landing-panel__body cv-bio">
        <p className="cv-bio__lead">{t('cvBio.lead')}</p>
        <div className="cv-bio__section">
          <h3 className="cv-bio__heading">{t('cvBio.sectionExperience')}</h3>
          <p className="cv-bio__text">{t('cvBio.experienceBody')}</p>
        </div>
        <div className="cv-bio__section">
          <h3 className="cv-bio__heading">{t('cvBio.sectionSkills')}</h3>
          <p className="cv-bio__text">{t('cvBio.skillsBody')}</p>
        </div>
      </div>
    </section>
  )
}

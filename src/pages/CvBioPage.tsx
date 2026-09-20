import { useLocale } from '../i18n/useLocale'
import './CvBioPage.css'

export function CvBioPage() {
  const { t } = useLocale()

  return (
    <div className="cv-bio-page">
      <p className="cv-bio-page__lead">{t('cvBio.lead')}</p>
      <section className="cv-bio-page__section">
        <h2 className="cv-bio-page__heading">{t('cvBio.sectionExperience')}</h2>
        <p className="cv-bio-page__body">{t('cvBio.experienceBody')}</p>
      </section>
      <section className="cv-bio-page__section">
        <h2 className="cv-bio-page__heading">{t('cvBio.sectionSkills')}</h2>
        <p className="cv-bio-page__body">{t('cvBio.skillsBody')}</p>
      </section>
    </div>
  )
}

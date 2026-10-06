import { useState } from 'react'
import { motion } from 'motion/react'
import { useLocale } from '../i18n/useLocale'
import { CV_EDUCATION, CV_EXHIBITIONS, CV_LINKS } from './cvBioData'
import './LandingPanel.css'
import './CvBio.css'

function ExternalMark() {
  return (
    <svg className="cv-bio__external" viewBox="0 0 16 16" aria-hidden>
      <path
        d="M6 3H3.5v9.5H13V10M9 3h4v4M13 3 7 9"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.4"
      />
    </svg>
  )
}

function CvLink({ href, children }: { href: string; children: string }) {
  return (
    <a href={href} target="_blank" rel="noreferrer">
      {children}
    </a>
  )
}

function SocialLink({ href, children }: { href: string; children: string }) {
  const [point, setPoint] = useState<{ x: number; y: number } | null>(null)
  const place = (event: { clientX: number; clientY: number }) => {
    setPoint({ x: event.clientX, y: event.clientY })
  }

  return (
    <>
      <a
        href={href}
        target="_blank"
        rel="noreferrer"
        onMouseEnter={place}
        onMouseMove={place}
        onMouseLeave={() => setPoint(null)}
      >
        <span>{children}</span>
        <ExternalMark />
      </a>
      {point ? (
        <motion.span
          className="cv-bio__tip"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.12, ease: 'easeOut' }}
          style={{
            left: point.x,
            top: point.y,
            transform:
              point.x > window.innerWidth - 280
                ? 'translate(calc(-100% - 14px), 18px)'
                : 'translate(14px, 18px)',
          }}
        >
          {href}
        </motion.span>
      ) : null}
    </>
  )
}

export function CvBio() {
  const { t } = useLocale()

  return (
    <section id="cv-bio" className="landing-panel">
      <h2 className="landing-panel__title">{t('pages.cvBio')}</h2>
      <div className="landing-panel__body cv-bio">
        <div className="cv-bio__intro">
          <p className="cv-bio__lead">
            {t('cvBio.role')}
            <br />
            {t('cvBio.place')}
            <br />
            {t('cvBio.born')}
          </p>
          <div className="cv-bio__section">
            <h3 className="cv-bio__heading">{t('cvBio.education')}</h3>
            {CV_EDUCATION.map((item) => (
              <p key={item.years} className="cv-bio__text">
                {t(item.years)} {t(item.text)}
              </p>
            ))}
          </div>
          <div className="cv-bio__section cv-bio__social">
            <h3 className="cv-bio__heading">{t('cvBio.social')}</h3>
            <ul className="cv-bio__links">
              {CV_LINKS.map((item) => (
                <li key={item.href}>
                  <SocialLink href={item.href}>{t(item.label)}</SocialLink>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="cv-bio__section cv-bio__shows">
          <h3 className="cv-bio__heading">{t('cvBio.exhibitions')}</h3>
          <ul className="cv-bio__entries">
            {CV_EXHIBITIONS.map((item) => (
              <li key={item.title} className="cv-bio__entry">
                <span className="cv-bio__year">{t(item.year)}</span>
                <span>
                  {item.href ? (
                    <CvLink href={item.href}>{t(item.title)}</CvLink>
                  ) : (
                    t(item.title)
                  )}
                  {', '}
                  {t(item.place)}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}

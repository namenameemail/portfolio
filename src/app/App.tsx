import { useEffect } from 'react'
import { AimMenu } from '../components/aim-menu/AimMenu'
import type { AimMenuItemId } from '../components/aim-menu/aimMenuItems'
import { NoiseFrame } from '../components/noise-frame/NoiseFrame'
import { useLocale } from '../i18n/useLocale'
import { FocalPage } from '../pages/focal/FocalPage'
import { SpectralPage } from '../pages/spectral/SpectralPage'
import { Contact } from '../sections/Contact'
import { CvBio } from '../sections/CvBio'
import { Projects } from '../sections/Projects'
import { projectIdFromHash } from '../sections/projectsData'
import { animateScrollTo, animateScrollToElement } from './animateScrollTo'
import { isPageId, PAGE_TITLE_KEYS, type PageId } from './routes'
import { usePathRoute } from './usePathRoute'
import './Landing.css'

function scrollToSection(id: PageId) {
  const el = document.getElementById(id)
  if (el) animateScrollToElement(el)
}

export function App() {
  const { route, navigate } = usePathRoute()
  const { t } = useLocale()

  useEffect(() => {
    if (route === 'home') {
      document.title = t('meta.title')
      return
    }
    if (isPageId(route)) {
      document.title = t(PAGE_TITLE_KEYS[route])
    }
  }, [route, t])

  useEffect(() => {
    if (route === 'home') {
      if (projectIdFromHash()) return
      animateScrollTo(0)
      return
    }
    if (isPageId(route)) {
      if (route === 'projects' && projectIdFromHash()) return
      scrollToSection(route)
    }
  }, [route])

  if (route === 'spectral') {
    return <SpectralPage onClose={() => navigate('home')} />
  }

  if (route === 'focal') {
    return <FocalPage onClose={() => navigate('home')} />
  }

  const onSelect = (id: AimMenuItemId) => {
    if (id === 'locale' || !isPageId(id)) return
    if (route === id) {
      scrollToSection(id)
      return
    }
    navigate(id)
  }

  return (
    <>
      <div className="landing-hero">
        <NoiseFrame>
          <AimMenu onSelect={onSelect} />
        </NoiseFrame>
      </div>
      <CvBio />
      <Projects />
      <Contact />
    </>
  )
}

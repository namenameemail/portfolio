import { useEffect, useState } from 'react'
import { AimMenu } from '../components/aim-menu/AimMenu'
import type { AimMenuItemId } from '../components/aim-menu/aimMenuItems'
import { NoiseFrame } from '../components/noise-frame/NoiseFrame'
import { useLocale } from '../i18n/useLocale'
import { PageScreen } from '../pages/PageScreen'
import { About } from '../sections/About'
import { Contact } from '../sections/Contact'
import { Hero } from '../sections/Hero'
import { Projects } from '../sections/Projects'
import { isPageId, type PageId } from './routes'
import { usePathRoute } from './usePathRoute'

function initialPageId(route: ReturnType<typeof usePathRoute>['route']): PageId {
  return isPageId(route) ? route : 'cv-bio'
}

export function App() {
  const { route, navigate, skipEnter } = usePathRoute()
  const { t } = useLocale()
  const pageOpen = route !== 'home'
  const [pageId, setPageId] = useState<PageId>(() => initialPageId(route))

  if (isPageId(route) && route !== pageId) {
    setPageId(route)
  }

  useEffect(() => {
    if (pageOpen) return
    document.title = t('meta.title')
  }, [pageOpen, t])

  const onSelect = (id: AimMenuItemId) => {
    if (id === 'locale' || !isPageId(id)) return
    navigate(id)
  }

  return (
    <NoiseFrame devMode>
      <AimMenu
        devMode
        covered={pageOpen}
        onSelect={onSelect}
      >
        <main>
          <Hero />
          <About />
          <Projects />
          <Contact />
        </main>
      </AimMenu>
      <PageScreen
        pageId={pageId}
        open={pageOpen}
        skipEnter={skipEnter}
        onClose={() => navigate('home')}
      />
    </NoiseFrame>
  )
}

import { useEffect } from 'react'
import { PAGE_TITLE_KEYS, type PageId } from '../app/routes'
import { useLocale } from '../i18n/useLocale'
import { CvBioPage } from './CvBioPage'
import './PageScreen.css'

type PageScreenProps = {
  pageId: PageId
  open: boolean
  skipEnter: boolean
  onClose: () => void
}

export function PageScreen({ pageId, open, skipEnter, onClose }: PageScreenProps) {
  const { t } = useLocale()
  const title = t(PAGE_TITLE_KEYS[pageId])

  useEffect(() => {
    if (!open) return
    document.title = title
  }, [open, title])

  const className = [
    'page-screen',
    pageId === 'projects' ? 'page-screen--wide' : '',
    open ? 'page-screen--open' : '',
    open && skipEnter ? 'page-screen--ready' : '',
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <div className={className} aria-hidden={!open}>
      <button
        type="button"
        className="page-screen__back"
        onClick={onClose}
        tabIndex={open ? 0 : -1}
      >
        {t('pages.back')}
      </button>
      <h1 className="page-screen__title">{title}</h1>
      <div className="page-screen__body">
        {pageId === 'cv-bio' ? <CvBioPage /> : null}
      </div>
    </div>
  )
}

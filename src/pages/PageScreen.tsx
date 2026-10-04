import { useEffect } from 'react'
import { motion } from 'motion/react'
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
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <motion.div
      className={className}
      aria-hidden={!open}
      initial={false}
      animate={{
        opacity: open ? 1 : 0,
        x: '-50%',
        y: open ? 0 : 12,
      }}
      transition={
        open && skipEnter
          ? { duration: 0 }
          : { duration: 0.3, ease: 'easeOut' }
      }
      style={{ pointerEvents: open ? 'auto' : 'none' }}
    >
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
    </motion.div>
  )
}

import { useEffect } from 'react'
import focalSecretUrl from '../../assets/focal-secret.jpg'
import { Focal } from '../../components/focal/Focal'
import { useLocale } from '../../i18n/useLocale'
import './FocalPage.css'

type FocalPageProps = {
  onClose: () => void
}

export function FocalPage({ onClose }: FocalPageProps) {
  const { t } = useLocale()

  useEffect(() => {
    document.title = t('pages.focal')
  }, [t])

  return (
    <Focal src={focalSecretUrl}>
      <button type="button" className="focal-page__back" onClick={onClose}>
        {t('pages.back')}
      </button>
    </Focal>
  )
}

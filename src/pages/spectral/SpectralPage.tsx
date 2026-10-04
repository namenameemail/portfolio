import { useEffect, useRef } from 'react'
import { useFinePointer } from '../../components/aim-menu/useFinePointer'
import { useLocale } from '../../i18n/useLocale'
import { LENS_SIZE_CSS, useSpectralDecoder } from './useSpectralDecoder'
import { useSpectralPointer } from './useSpectralPointer'
import './SpectralPage.css'

type SpectralPageProps = {
  onClose: () => void
}

export function SpectralPage({ onClose }: SpectralPageProps) {
  const { t } = useLocale()
  const finePointer = useFinePointer()
  const rootRef = useRef<HTMLDivElement>(null)
  const bgRef = useRef<HTMLCanvasElement>(null)
  const lensRef = useRef<HTMLCanvasElement>(null)
  const frameRef = useRef<HTMLDivElement>(null)
  const pointerRef = useSpectralPointer(true)
  const mark = t('spectral.mark')

  useSpectralDecoder({
    rootRef,
    bgRef,
    lensRef,
    frameRef,
    pointerRef,
    mark,
    active: true,
  })

  useEffect(() => {
    document.title = t('pages.spectral')
  }, [t])

  const rootClass = [
    'spectral-page',
    finePointer ? 'spectral-page--fine' : '',
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <div ref={rootRef} className={rootClass}>
      <canvas ref={bgRef} className="spectral-page__bg" aria-hidden />
      <div
        ref={frameRef}
        className="spectral-page__lens"
        style={{ width: LENS_SIZE_CSS, height: LENS_SIZE_CSS }}
        aria-hidden
      >
        <canvas ref={lensRef} className="spectral-page__lens-canvas" />
      </div>
      <button type="button" className="spectral-page__back" onClick={onClose}>
        {t('pages.back')}
      </button>
    </div>
  )
}

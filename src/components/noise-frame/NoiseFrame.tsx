import { useRef, useState } from 'react'
import {
  clampConfig,
  randomNoiseFrameConfig,
  type NoiseFrameConfig,
} from './noiseFrameConfig'
import { NoiseFrameDevPanel } from './NoiseFrameDevPanel'
import { useNoiseFrames } from './useNoiseFrames'
import { usePointerParallax } from './usePointerParallax'
import './NoiseFrame.css'

type NoiseFrameProps = {
  children?: React.ReactNode
  className?: string
  devMode?: boolean
  defaults?: Partial<NoiseFrameConfig>
}

export function NoiseFrame({
  children,
  className,
  devMode = false,
  defaults,
}: NoiseFrameProps) {
  const [config, setConfig] = useState(() => randomNoiseFrameConfig(defaults))
  const bgRef = useRef<HTMLDivElement>(null)
  const overlayRef = useRef<HTMLDivElement>(null)
  const { frameUrl, overscanPx } = useNoiseFrames(
    bgRef,
    config.density,
    config.shiftX,
    config.shiftY,
    config.rotate,
    config.scale,
  )

  usePointerParallax(overlayRef, {
    enabled: true,
    shiftX: config.shiftX,
    shiftY: config.shiftY,
    rotate: config.rotate,
    scale: config.scale,
  })

  const rootClass = ['noise-frame', className ?? ''].filter(Boolean).join(' ')
  const layerStyle = frameUrl
    ? { backgroundImage: `url(${frameUrl})` }
    : undefined

  return (
    <div
      className={rootClass}
      style={{
        paddingTop: config.paddingPx,
        paddingBottom: config.paddingPx,
        paddingLeft: config.paddingPx,
        paddingRight: config.paddingPx + (devMode ? 260 : 0),
      }}
    >
      <div ref={bgRef} className="noise-frame__bg" aria-hidden>
        <div
          className="noise-frame__layer noise-frame__layer--base"
          style={{
            ...layerStyle,
            inset: -overscanPx,
          }}
        />
        <div
          ref={overlayRef}
          className="noise-frame__layer noise-frame__layer--overlay"
          style={{
            ...layerStyle,
            inset: config.insetPx - overscanPx,
          }}
        />
      </div>
      <div className="noise-frame__content">{children}</div>
      {devMode ? (
        <NoiseFrameDevPanel config={config} onChange={(next) => setConfig(clampConfig(next))} />
      ) : null}
    </div>
  )
}

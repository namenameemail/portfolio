import { useRef, type ReactNode } from 'react'
import { useFinePointer } from '../aim-menu/useFinePointer'
import {
  resolveFocalOptions,
  type FocalOptions,
} from './focalConfig'
import { useFocalDecoder } from './useFocalDecoder'
import { useFocalPointer } from './useFocalPointer'
import './Focal.css'

export type FocalProps = {
  src: string
  className?: string
  children?: ReactNode
  active?: boolean
} & Partial<FocalOptions>

export function Focal({
  src,
  className,
  children,
  active = true,
  ...optionOverrides
}: FocalProps) {
  const options = resolveFocalOptions(optionOverrides)
  const optionsRef = useRef(options)
  optionsRef.current = options

  const finePointer = useFinePointer()
  const rootRef = useRef<HTMLDivElement>(null)
  const bgRef = useRef<HTMLCanvasElement>(null)
  const lensRef = useRef<HTMLCanvasElement>(null)
  const frameRef = useRef<HTMLDivElement>(null)
  const pointerRef = useFocalPointer(active)

  useFocalDecoder({
    rootRef,
    bgRef,
    lensRef,
    frameRef,
    pointerRef,
    src,
    optionsRef,
    active,
  })

  const rootClass = [
    'focal',
    options.hideCursor && finePointer ? 'focal--fine' : '',
    className ?? '',
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <div ref={rootRef} className={rootClass}>
      <canvas ref={bgRef} className="focal__bg" aria-hidden />
      <div
        ref={frameRef}
        className="focal__lens"
        style={{ width: options.lensSize, height: options.lensSize }}
        aria-hidden
      >
        <canvas ref={lensRef} className="focal__lens-canvas" />
      </div>
      {children ? <div className="focal__ui">{children}</div> : null}
    </div>
  )
}

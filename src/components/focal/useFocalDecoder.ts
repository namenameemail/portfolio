import { useEffect, useRef, type RefObject } from 'react'
import { drawSecretFromImage, loadSecretImage } from './drawSecretFromImage'
import { encodeFocal, paintLensGrating } from './encodeFocal'
import type { FocalOptions } from './focalConfig'
import type { FocalPointer } from './useFocalPointer'

type UseFocalDecoderArgs = {
  rootRef: RefObject<HTMLElement | null>
  bgRef: RefObject<HTMLCanvasElement | null>
  lensRef: RefObject<HTMLCanvasElement | null>
  frameRef: RefObject<HTMLElement | null>
  pointerRef: RefObject<FocalPointer>
  src: string
  optionsRef: RefObject<FocalOptions>
  active: boolean
}

export function useFocalDecoder({
  rootRef,
  bgRef,
  lensRef,
  frameRef,
  pointerRef,
  src,
  optionsRef,
  active,
}: UseFocalDecoderArgs) {
  const sizeRef = useRef({ w: 0, h: 0, dpr: 1 })
  const imageRef = useRef<HTMLImageElement | null>(null)
  const lensSizeRef = useRef(optionsRef.current.lensSize)

  useEffect(() => {
    if (!active) return
    const root = rootRef.current
    const bg = bgRef.current
    const lens = lensRef.current
    const frame = frameRef.current
    if (!root || !bg || !lens || !frame) return

    lensSizeRef.current = optionsRef.current.lensSize

    const bgCtx = bg.getContext('2d')
    const lensCtx = lens.getContext('2d', { alpha: true })
    if (!bgCtx || !lensCtx) return

    let cancelled = false
    let debounceId = 0
    let rafId = 0
    let lastKey = ''
    let lastLensKey = ''

    const syncLensCanvas = (dpr: number) => {
      const opts = optionsRef.current
      const css = lensSizeRef.current
      const lensPx = Math.max(1, Math.round(css * dpr))
      const key = `${lensPx}:${opts.period}`
      if (key === lastLensKey) return
      lastLensKey = key
      lens.width = lensPx
      lens.height = lensPx
      lens.style.width = `${css}px`
      lens.style.height = `${css}px`
      frame.style.width = `${css}px`
      frame.style.height = `${css}px`
      paintLensGrating(lensCtx, lensPx, lensPx, opts.period)
    }

    const paintBg = (cssW: number, cssH: number, dpr: number) => {
      const image = imageRef.current
      if (!image) return
      const opts = optionsRef.current

      const w = Math.max(1, Math.round(cssW * dpr))
      const h = Math.max(1, Math.round(cssH * dpr))
      const key = `${w}x${h}:${dpr}:${opts.period}:${opts.strength}:${opts.contrastPow}:${src}`
      if (key === lastKey) return
      lastKey = key

      sizeRef.current = { w, h, dpr }
      bg.width = w
      bg.height = h
      bg.style.width = `${cssW}px`
      bg.style.height = `${cssH}px`

      const secret = drawSecretFromImage(w, h, image, opts.contrastPow)
      const encoded = encodeFocal(secret, opts.period, opts.strength)
      bgCtx.putImageData(encoded, 0, 0)
      lastLensKey = ''
      syncLensCanvas(dpr)
    }

    const schedule = (cssW: number, cssH: number) => {
      window.clearTimeout(debounceId)
      debounceId = window.setTimeout(() => {
        if (cancelled) return
        paintBg(cssW, cssH, window.devicePixelRatio || 1)
      }, 80)
    }

    const onWheel = (e: WheelEvent) => {
      const opts = optionsRef.current
      if (!opts.wheelResize) return
      e.preventDefault()
      const delta = e.deltaY > 0 ? -opts.lensSizeStep : opts.lensSizeStep
      lensSizeRef.current = Math.min(
        opts.lensSizeMax,
        Math.max(opts.lensSizeMin, lensSizeRef.current + delta),
      )
      syncLensCanvas(sizeRef.current.dpr || window.devicePixelRatio || 1)
    }

    const tick = () => {
      if (cancelled) return
      const opts = optionsRef.current
      const { dpr } = sizeRef.current
      const scale = dpr || window.devicePixelRatio || 1
      const lensCss = lensSizeRef.current
      const rootRect = root.getBoundingClientRect()
      const localX = pointerRef.current.x - rootRect.left
      const localY = pointerRef.current.y - rootRect.top
      const left = Math.round((localX - lensCss / 2) * scale) / scale
      const top = Math.round((localY - lensCss / 2) * scale) / scale
      const nx = rootRect.width > 0 ? (localX / rootRect.width) * 2 - 1 : 0
      const ny = rootRect.height > 0 ? (localY / rootRect.height) * 2 - 1 : 0
      const range = opts.rotateDeg
      const t = Math.min(1, Math.max(-1, nx * 0.7 + ny * 0.3))
      const deg = range === 0 ? 0 : t * range
      frame.style.transform = `translate(${left}px, ${top}px) rotate(${deg}deg)`
      rafId = window.requestAnimationFrame(tick)
    }

    const observer = new ResizeObserver((entries) => {
      const entry = entries[0]
      if (!entry) return
      schedule(entry.contentRect.width, entry.contentRect.height)
    })

    root.addEventListener('wheel', onWheel, { passive: false })
    frame.style.transformOrigin = 'center center'

    const rect = root.getBoundingClientRect()
    pointerRef.current = {
      x: rect.left + rect.width / 2,
      y: rect.top + rect.height / 2,
    }

    void loadSecretImage(src).then((image) => {
      if (cancelled) return
      imageRef.current = image
      observer.observe(root)
      const next = root.getBoundingClientRect()
      paintBg(next.width, next.height, window.devicePixelRatio || 1)
      rafId = window.requestAnimationFrame(tick)
    })

    return () => {
      cancelled = true
      window.clearTimeout(debounceId)
      window.cancelAnimationFrame(rafId)
      observer.disconnect()
      root.removeEventListener('wheel', onWheel)
    }
  }, [active, bgRef, frameRef, lensRef, optionsRef, pointerRef, rootRef, src])
}

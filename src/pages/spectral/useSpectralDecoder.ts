import { useEffect, useRef, type RefObject } from 'react'
import { drawSecretGraphic } from './drawSecretGraphic'
import { encodeSpectral } from './encodeSpectral'
import type { SpectralPointer } from './useSpectralPointer'

export const LENS_SIZE_CSS = 136

type UseSpectralDecoderArgs = {
  rootRef: RefObject<HTMLElement | null>
  bgRef: RefObject<HTMLCanvasElement | null>
  lensRef: RefObject<HTMLCanvasElement | null>
  frameRef: RefObject<HTMLElement | null>
  pointerRef: RefObject<SpectralPointer>
  mark: string
  active: boolean
}

export function useSpectralDecoder({
  rootRef,
  bgRef,
  lensRef,
  frameRef,
  pointerRef,
  mark,
  active,
}: UseSpectralDecoderArgs) {
  const sizeRef = useRef({ w: 0, h: 0, dpr: 1 })

  useEffect(() => {
    if (!active) return
    const root = rootRef.current
    const bg = bgRef.current
    const lens = lensRef.current
    const frame = frameRef.current
    if (!root || !bg || !lens || !frame) return

    const bgCtx = bg.getContext('2d', { willReadFrequently: true })
    const lensCtx = lens.getContext('2d', { willReadFrequently: true })
    if (!bgCtx || !lensCtx) return

    const share2 = document.createElement('canvas')
    const share2Ctx = share2.getContext('2d', { willReadFrequently: true })
    if (!share2Ctx) return

    let cancelled = false
    let debounceId = 0
    let rafId = 0
    let lastKey = ''

    const paintBg = (cssW: number, cssH: number, dpr: number) => {
      const w = Math.max(1, Math.round(cssW * dpr))
      const h = Math.max(1, Math.round(cssH * dpr))
      const key = `${w}x${h}:${mark}:${dpr}`
      if (key === lastKey) return
      lastKey = key

      sizeRef.current = { w, h, dpr }
      bg.width = w
      bg.height = h
      bg.style.width = `${cssW}px`
      bg.style.height = `${cssH}px`
      share2.width = w
      share2.height = h

      const secret = drawSecretGraphic(w, h, mark)
      const shares = encodeSpectral(secret)
      bgCtx.putImageData(shares.share1, 0, 0)
      share2Ctx.putImageData(shares.share2, 0, 0)

      const lensPx = Math.max(1, Math.round(LENS_SIZE_CSS * dpr))
      lens.width = lensPx
      lens.height = lensPx
      lens.style.width = `${LENS_SIZE_CSS}px`
      lens.style.height = `${LENS_SIZE_CSS}px`
    }

    const schedule = (cssW: number, cssH: number) => {
      window.clearTimeout(debounceId)
      debounceId = window.setTimeout(() => {
        if (cancelled) return
        paintBg(cssW, cssH, window.devicePixelRatio || 1)
      }, 80)
    }

    const tick = () => {
      if (cancelled) return
      const { w, h, dpr } = sizeRef.current
      if (w > 0 && h > 0) {
        const lensPx = lens.width
        const half = lensPx / 2
        const px = pointerRef.current.x * dpr
        const py = pointerRef.current.y * dpr
        const srcX = Math.round(Math.min(Math.max(0, px - half), Math.max(0, w - lensPx)))
        const srcY = Math.round(Math.min(Math.max(0, py - half), Math.max(0, h - lensPx)))

        const s1 = bgCtx.getImageData(srcX, srcY, lensPx, lensPx)
        const s2 = share2Ctx.getImageData(srcX, srcY, lensPx, lensPx)
        const out = s1.data
        const b = s2.data
        for (let i = 0; i < out.length; i += 4) {
          const v = out[i]! < 128 || b[i]! < 128 ? 0 : 255
          out[i] = v
          out[i + 1] = v
          out[i + 2] = v
          out[i + 3] = 255
        }
        lensCtx.putImageData(s1, 0, 0)

        const left = pointerRef.current.x - LENS_SIZE_CSS / 2
        const top = pointerRef.current.y - LENS_SIZE_CSS / 2
        frame.style.transform = `translate(${left}px, ${top}px)`
      }
      rafId = window.requestAnimationFrame(tick)
    }

    const observer = new ResizeObserver((entries) => {
      const entry = entries[0]
      if (!entry) return
      schedule(entry.contentRect.width, entry.contentRect.height)
    })

    observer.observe(root)
    const rect = root.getBoundingClientRect()
    paintBg(rect.width, rect.height, window.devicePixelRatio || 1)
    rafId = window.requestAnimationFrame(tick)

    return () => {
      cancelled = true
      window.clearTimeout(debounceId)
      window.cancelAnimationFrame(rafId)
      observer.disconnect()
    }
  }, [active, bgRef, frameRef, lensRef, mark, pointerRef, rootRef])
}

import { useEffect, useRef, type RefObject } from 'react'
import { pointerRangeValue, type PointerRange } from './noiseFrameConfig'

type PointerParallaxOptions = {
  enabled: boolean
  shiftX: PointerRange
  shiftY: PointerRange
  rotate: PointerRange
  scale: PointerRange
}

export function usePointerParallax(
  overlayRef: RefObject<HTMLElement | null>,
  options: PointerParallaxOptions,
) {
  const optionsRef = useRef(options)

  useEffect(() => {
    optionsRef.current = options
  }, [options])

  useEffect(() => {
    const overlay = overlayRef.current
    if (!overlay || !options.enabled) {
      if (overlay) overlay.style.transform = 'translate3d(0,0,0) rotate(0deg) scale(1)'
      return
    }

    const finePointer = window.matchMedia('(pointer: fine)').matches
    let rafId = 0
    let pointerX = 0
    let pointerY = 0
    let currentX = 0
    let currentY = 0
    let running = true

    const onMove = (event: PointerEvent) => {
      const halfW = window.innerWidth / 2 || 1
      const halfH = window.innerHeight / 2 || 1
      pointerX = (event.clientX - halfW) / halfW
      pointerY = (event.clientY - halfH) / halfH
    }

    const onScroll = () => {
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight
      if (maxScroll <= 0) {
        pointerX = 0
        pointerY = 0
        return
      }
      const n = Math.min(1, Math.max(0, window.scrollY / maxScroll)) * 2 - 1
      pointerX = n
      pointerY = n
    }

    const tick = () => {
      if (!running) return
      const { shiftX, shiftY, rotate, scale } = optionsRef.current
      currentX += (pointerX - currentX) * 0.12
      currentY += (pointerY - currentY) * 0.12
      const tx = pointerRangeValue(shiftX, currentX, currentY)
      const ty = pointerRangeValue(shiftY, currentX, currentY)
      const rot = pointerRangeValue(rotate, currentX, currentY)
      const nextScale = pointerRangeValue(scale, currentX, currentY)
      overlay.style.transform = `translate3d(${tx}px, ${ty}px, 0) rotate(${rot}deg) scale(${nextScale})`
      rafId = window.requestAnimationFrame(tick)
    }

    if (finePointer) {
      window.addEventListener('pointermove', onMove, { passive: true })
    } else {
      onScroll()
      window.addEventListener('scroll', onScroll, { passive: true })
    }

    rafId = window.requestAnimationFrame(tick)

    return () => {
      running = false
      window.cancelAnimationFrame(rafId)
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('scroll', onScroll)
      overlay.style.transform = 'translate3d(0,0,0) rotate(0deg) scale(1)'
    }
  }, [overlayRef, options.enabled])
}

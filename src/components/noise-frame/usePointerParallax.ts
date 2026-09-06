import { useEffect, useRef, type RefObject } from 'react'
import type { CursorMode } from './noiseFrameConfig'

type PointerParallaxOptions = {
  enabled: boolean
  rotateDeg: number
  shiftPx: number
  cursorMode: CursorMode
}

type ParallaxTarget = {
  x: number
  y: number
}

function mapPointer(
  nx: number,
  ny: number,
  mode: CursorMode,
): ParallaxTarget {
  switch (mode) {
    case 'inverse':
      return { x: -nx, y: -ny }
    case 'axisX':
      return { x: nx, y: 0 }
    case 'axisY':
      return { x: 0, y: ny }
    default:
      return { x: nx, y: ny }
  }
}

function scrollNorm(): { x: number; y: number } {
  const maxScroll = document.documentElement.scrollHeight - window.innerHeight
  if (maxScroll <= 0) return { x: 0, y: 0 }
  const t = Math.min(1, Math.max(0, window.scrollY / maxScroll))
  const n = t * 2 - 1
  return { x: n, y: n }
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
      if (overlay) overlay.style.transform = 'translate3d(0,0,0) rotate(0deg)'
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
      const n = scrollNorm()
      pointerX = n.x
      pointerY = n.y
    }

    const tick = () => {
      if (!running) return
      const { rotateDeg, shiftPx, cursorMode } = optionsRef.current
      const mapped = mapPointer(pointerX, pointerY, cursorMode)
      currentX += (mapped.x - currentX) * 0.12
      currentY += (mapped.y - currentY) * 0.12
      const tx = currentX * shiftPx
      const ty = currentY * shiftPx
      const rot = currentX * rotateDeg
      overlay.style.transform = `translate3d(${tx}px, ${ty}px, 0) rotate(${rot}deg)`
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
      overlay.style.transform = 'translate3d(0,0,0) rotate(0deg)'
    }
  }, [overlayRef, options.enabled])
}

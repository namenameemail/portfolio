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
    if (!overlay) return

    const finePointer = window.matchMedia('(pointer: fine)').matches
    if (!options.enabled || !finePointer) {
      overlay.style.transform = 'translate3d(0,0,0) rotate(0deg)'
      return
    }

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

    window.addEventListener('pointermove', onMove, { passive: true })
    rafId = window.requestAnimationFrame(tick)

    return () => {
      running = false
      window.cancelAnimationFrame(rafId)
      window.removeEventListener('pointermove', onMove)
      overlay.style.transform = 'translate3d(0,0,0) rotate(0deg)'
    }
  }, [overlayRef, options.enabled])
}

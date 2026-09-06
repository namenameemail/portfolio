import { useEffect, useRef, type RefObject } from 'react'
import type { Point } from './useAimTarget'
import './AimMenuDevOverlay.css'

type AimMenuDevOverlayProps = {
  containerRef: RefObject<HTMLElement | null>
  pointerRef: RefObject<Point | null>
  centerRef: RefObject<Point | null>
}

export function AimMenuDevOverlay({
  containerRef,
  pointerRef,
  centerRef,
}: AimMenuDevOverlayProps) {
  const lineRef = useRef<SVGLineElement>(null)

  useEffect(() => {
    let rafId = 0
    let running = true

    const tick = () => {
      if (!running) return
      const container = containerRef.current
      const pointer = pointerRef.current
      const center = centerRef.current
      const line = lineRef.current

      if (container && pointer && center && line) {
        const rect = container.getBoundingClientRect()
        const px = pointer.x - rect.left
        const py = pointer.y - rect.top
        const cx = center.x - rect.left
        const cy = center.y - rect.top
        const dx = cx - px
        const dy = cy - py
        const len = Math.hypot(dx, dy) || 1
        const length = window.innerHeight * 0.75
        const tipX = px + (dx / len) * length
        const tipY = py + (dy / len) * length

        line.setAttribute('x1', String(px))
        line.setAttribute('y1', String(py))
        line.setAttribute('x2', String(tipX))
        line.setAttribute('y2', String(tipY))
      }

      rafId = window.requestAnimationFrame(tick)
    }

    rafId = window.requestAnimationFrame(tick)
    return () => {
      running = false
      window.cancelAnimationFrame(rafId)
    }
  }, [containerRef, pointerRef, centerRef])

  return (
    <svg className="aim-menu-dev" aria-hidden>
      <line ref={lineRef} className="aim-menu-dev__line" />
    </svg>
  )
}

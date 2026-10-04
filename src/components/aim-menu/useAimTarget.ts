import { useEffect, useRef, useState, type RefObject } from 'react'
import { AIM_MENU_ITEMS, type AimMenuItemId } from './aimMenuItems'

export type Point = { x: number; y: number }

function angleDelta(a: number, b: number) {
  let d = a - b
  while (d > Math.PI) d -= Math.PI * 2
  while (d < -Math.PI) d += Math.PI * 2
  return Math.abs(d)
}

function readCenter(el: HTMLElement): Point {
  const rect = el.getBoundingClientRect()
  return {
    x: rect.left + rect.width / 2,
    y: rect.top + rect.height / 2,
  }
}

function readAnchor(el: HTMLElement): Point {
  const rect = el.getBoundingClientRect()
  return {
    x: rect.left + rect.width / 2,
    y: rect.top + rect.height / 2,
  }
}

export function useAimTarget(
  containerRef: RefObject<HTMLElement | null>,
  itemRefs: RefObject<Partial<Record<AimMenuItemId, HTMLElement | null>>>,
  enabled: boolean,
) {
  const [activeId, setActiveId] = useState<AimMenuItemId | null>(null)
  const pointerRef = useRef<Point | null>(null)
  const centerRef = useRef<Point | null>(null)
  const activeRef = useRef<AimMenuItemId | null>(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container || !enabled) {
      setActiveId(null)
      activeRef.current = null
      pointerRef.current = null
      centerRef.current = null
      return
    }

    let rafId = 0
    let running = true

    const onMove = (event: PointerEvent) => {
      pointerRef.current = { x: event.clientX, y: event.clientY }
    }

    const tick = () => {
      if (!running) return
      const pointer = pointerRef.current
      const center = readCenter(container)
      centerRef.current = center

      if (pointer) {
        const dx = pointer.x - center.x
        const dy = pointer.y - center.y
        const aimAngle = Math.atan2(-dy, -dx)
        const refs = itemRefs.current
        let bestId: AimMenuItemId | null = null
        let bestDelta = Infinity

        for (const item of AIM_MENU_ITEMS) {
          const el = refs[item.id]
          if (!el) continue
          const anchor = readAnchor(el)
          const itemAngle = Math.atan2(anchor.y - center.y, anchor.x - center.x)
          const delta = angleDelta(aimAngle, itemAngle)
          if (delta < bestDelta) {
            bestDelta = delta
            bestId = item.id
          }
        }

        if (bestId !== activeRef.current) {
          activeRef.current = bestId
          setActiveId(bestId)
        }
      }

      rafId = window.requestAnimationFrame(tick)
    }

    window.addEventListener('pointermove', onMove, { passive: true })
    rafId = window.requestAnimationFrame(tick)

    return () => {
      running = false
      window.cancelAnimationFrame(rafId)
      window.removeEventListener('pointermove', onMove)
    }
  }, [containerRef, itemRefs, enabled])

  return { activeId, pointerRef, centerRef }
}

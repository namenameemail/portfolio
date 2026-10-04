import { useEffect, useRef } from 'react'

export type FocalPointer = {
  x: number
  y: number
}

export function useFocalPointer(active: boolean) {
  const pointerRef = useRef<FocalPointer>({ x: 0, y: 0 })

  useEffect(() => {
    if (!active) return

    const onMove = (e: PointerEvent) => {
      pointerRef.current = { x: e.clientX, y: e.clientY }
    }

    window.addEventListener('pointermove', onMove, { passive: true })
    return () => window.removeEventListener('pointermove', onMove)
  }, [active])

  return pointerRef
}

import { useEffect, useRef } from 'react'

export type SpectralPointer = {
  x: number
  y: number
}

export function useSpectralPointer(active: boolean) {
  const pointerRef = useRef<SpectralPointer>({
    x: typeof window !== 'undefined' ? window.innerWidth / 2 : 0,
    y: typeof window !== 'undefined' ? window.innerHeight / 2 : 0,
  })

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

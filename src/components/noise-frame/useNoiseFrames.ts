import { useEffect, useState, type RefObject } from 'react'
import { computeOverscanPx } from './computeOverscanPx'

function createBinaryNoiseBlob(
  width: number,
  height: number,
  density: number,
): Promise<Blob | null> {
  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height
  const ctx = canvas.getContext('2d', { willReadFrequently: true })
  if (!ctx) return Promise.resolve(null)

  const image = ctx.createImageData(width, height)
  const { data } = image
  for (let i = 0; i < data.length; i += 4) {
    const solid = Math.random() < density
    data[i] = 0
    data[i + 1] = 0
    data[i + 2] = 0
    data[i + 3] = solid ? 255 : 0
  }
  ctx.putImageData(image, 0, 0)

  return new Promise((resolve) => {
    canvas.toBlob((blob) => resolve(blob), 'image/png')
  })
}

export function useNoiseFrames(
  containerRef: RefObject<HTMLElement | null>,
  density: number,
  rotateDeg: number,
  shiftPx: number,
) {
  const [frameUrl, setFrameUrl] = useState('')
  const [overscanPx, setOverscanPx] = useState(0)

  useEffect(() => {
    const el = containerRef.current
    if (!el) return

    let blobUrl = ''
    let cancelled = false
    let debounceId = 0
    let lastKey = ''

    const revoke = () => {
      if (blobUrl) {
        URL.revokeObjectURL(blobUrl)
        blobUrl = ''
      }
    }

    const generate = async (width: number, height: number) => {
      const contentW = Math.max(1, Math.ceil(width))
      const contentH = Math.max(1, Math.ceil(height))
      const overscan = computeOverscanPx(contentW, contentH, rotateDeg, shiftPx)
      const w = contentW + overscan * 2
      const h = contentH + overscan * 2
      const key = `${w}x${h}:${density}:${overscan}`
      if (key === lastKey && blobUrl) {
        setOverscanPx(overscan)
        return
      }
      lastKey = key

      const blob = await createBinaryNoiseBlob(w, h, density)
      if (cancelled || !blob) return

      revoke()
      blobUrl = URL.createObjectURL(blob)
      setOverscanPx(overscan)
      setFrameUrl(blobUrl)
    }

    const schedule = (width: number, height: number) => {
      window.clearTimeout(debounceId)
      debounceId = window.setTimeout(() => {
        void generate(width, height)
      }, 80)
    }

    const observer = new ResizeObserver((entries) => {
      const entry = entries[0]
      if (!entry) return
      const { width, height } = entry.contentRect
      schedule(width, height)
    })

    observer.observe(el)
    const rect = el.getBoundingClientRect()
    void generate(rect.width, rect.height)

    return () => {
      cancelled = true
      window.clearTimeout(debounceId)
      observer.disconnect()
      revoke()
    }
  }, [containerRef, density, rotateDeg, shiftPx])

  return { frameUrl, overscanPx }
}

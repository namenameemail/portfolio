import type { PointerRange } from './noiseFrameConfig'

function span(range: PointerRange) {
  return Math.max(Math.abs(range.from), Math.abs(range.to))
}

export function computeOverscanPx(
  width: number,
  height: number,
  shiftX: PointerRange,
  shiftY: PointerRange,
  rotate: PointerRange,
  scale: PointerRange,
): number {
  const rotateDeg = span(rotate)
  const rad = (rotateDeg * Math.PI) / 180
  const cos = Math.abs(Math.cos(rad))
  const sin = Math.abs(Math.sin(rad))
  const boundW = width * cos + height * sin
  const boundH = width * sin + height * cos
  const bleed = Math.ceil(Math.max(boundW - width, boundH - height) / 2)
  const shiftPx = Math.max(span(shiftX), span(shiftY))
  const scaleAmp = Math.max(Math.abs(scale.from - 1), Math.abs(scale.to - 1))
  const scaleBleed = Math.ceil(Math.max(width, height) * scaleAmp * 0.5)
  return bleed + Math.ceil(shiftPx) + scaleBleed + 2
}

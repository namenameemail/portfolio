export function computeOverscanPx(
  width: number,
  height: number,
  rotateDeg: number,
  shiftPx: number,
): number {
  const rad = (Math.abs(rotateDeg) * Math.PI) / 180
  const cos = Math.abs(Math.cos(rad))
  const sin = Math.abs(Math.sin(rad))
  const boundW = width * cos + height * sin
  const boundH = width * sin + height * cos
  const bleed = Math.ceil(Math.max(boundW - width, boundH - height) / 2)
  return bleed + Math.ceil(Math.abs(shiftPx)) + 2
}

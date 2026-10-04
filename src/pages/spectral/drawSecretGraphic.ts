export function drawSecretGraphic(
  width: number,
  height: number,
  mark: string,
): ImageData {
  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height
  const ctx = canvas.getContext('2d', { willReadFrequently: true })
  if (!ctx) return new ImageData(width, height)

  ctx.fillStyle = '#fff'
  ctx.fillRect(0, 0, width, height)
  ctx.fillStyle = '#000'

  const cx = width / 2
  const cy = height / 2
  const r = Math.min(width, height) * 0.055

  ctx.beginPath()
  ctx.arc(cx, cy - r * 0.2, r, 0, Math.PI * 2)
  ctx.fill()

  ctx.fillStyle = '#fff'
  ctx.beginPath()
  ctx.arc(cx, cy - r * 0.2, r * 0.42, 0, Math.PI * 2)
  ctx.fill()

  ctx.fillStyle = '#000'
  const size = Math.max(12, Math.min(width, height) * 0.028)
  ctx.font = `700 ${size}px system-ui, sans-serif`
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillText(mark.toUpperCase(), cx, cy + r * 1.35)

  return ctx.getImageData(0, 0, width, height)
}

export function drawSecretFromImage(
  width: number,
  height: number,
  image: CanvasImageSource & { width: number; height: number },
  contrastPow = 0.85,
): ImageData {
  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height
  const ctx = canvas.getContext('2d', { willReadFrequently: true })
  if (!ctx) return new ImageData(width, height)

  const iw = image.width
  const ih = image.height
  const scale = Math.max(width / iw, height / ih)
  const dw = iw * scale
  const dh = ih * scale
  const dx = (width - dw) / 2
  const dy = (height - dh) / 2

  ctx.fillStyle = '#808080'
  ctx.fillRect(0, 0, width, height)
  ctx.drawImage(image, dx, dy, dw, dh)

  const imageData = ctx.getImageData(0, 0, width, height)
  const { data } = imageData
  let min = 255
  let max = 0
  for (let i = 0; i < data.length; i += 4) {
    const lum = data[i]! * 0.299 + data[i + 1]! * 0.587 + data[i + 2]! * 0.114
    if (lum < min) min = lum
    if (lum > max) max = lum
  }
  const range = Math.max(1, max - min)
  for (let i = 0; i < data.length; i += 4) {
    const lum = data[i]! * 0.299 + data[i + 1]! * 0.587 + data[i + 2]! * 0.114
    const norm = (lum - min) / range
    const v = Math.round(Math.pow(norm, contrastPow) * 255)
    data[i] = v
    data[i + 1] = v
    data[i + 2] = v
    data[i + 3] = 255
  }

  return imageData
}

export function loadSecretImage(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.decoding = 'async'
    img.onload = () => resolve(img)
    img.onerror = () => reject(new Error(`failed to load ${url}`))
    img.src = url
  })
}

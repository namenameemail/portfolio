export function encodeFocal(
  source: ImageData,
  period: number,
  strength: number,
): ImageData {
  const { width, height, data } = source
  const out = new ImageData(width, height)
  const dest = out.data
  const half = period / 2

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const i = (y * width + x) * 4
      const lum = (data[i]! + data[i + 1]! + data[i + 2]!) / 3 / 255
      const signal = x % period < half
      const n = hashNoise(x, y)
      const p = 0.5 + (0.5 - lum) * strength
      const ink = n < (signal ? p : 1 - p)
      const v = ink ? 0 : 255
      dest[i] = v
      dest[i + 1] = v
      dest[i + 2] = v
      dest[i + 3] = 255
    }
  }

  return out
}

export function paintLensGrating(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  period: number,
): void {
  ctx.clearRect(0, 0, width, height)
  const image = ctx.createImageData(width, height)
  const { data } = image
  const half = period / 2

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const i = (y * width + x) * 4
      if (x % period < half) {
        data[i + 3] = 0
        continue
      }
      data[i] = 0
      data[i + 1] = 0
      data[i + 2] = 0
      data[i + 3] = 255
    }
  }

  ctx.putImageData(image, 0, 0)
}

function hashNoise(x: number, y: number): number {
  let n = Math.imul(x | 0, 374761393) + Math.imul(y | 0, 668265263)
  n = Math.imul(n ^ (n >>> 15), 2246822519)
  n = Math.imul(n ^ (n >>> 13), 3266489917)
  n ^= n >>> 16
  return (n >>> 0) / 4294967296
}

export type SpectralShares = {
  share1: ImageData
  share2: ImageData
}

function hashBit(x: number, y: number): boolean {
  let n = Math.imul(x | 0, 374761393) + Math.imul(y | 0, 668265263)
  n = Math.imul(n ^ (n >>> 15), 2246822519)
  n = Math.imul(n ^ (n >>> 13), 3266489917)
  n ^= n >>> 16
  return (n >>> 31) === 1
}

export function encodeSpectral(source: ImageData): SpectralShares {
  const { width, height, data } = source
  const share1 = new ImageData(width, height)
  const share2 = new ImageData(width, height)
  const a = share1.data
  const b = share2.data

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const i = (y * width + x) * 4
      const lum = (data[i]! + data[i + 1]! + data[i + 2]!) / 3 / 255
      const dark = lum < 0.5
      const r = hashBit(x, y)
      const v1 = r ? 0 : 255
      const v2 = dark ? (r ? 255 : 0) : v1
      a[i] = v1
      a[i + 1] = v1
      a[i + 2] = v1
      a[i + 3] = 255
      b[i] = v2
      b[i + 1] = v2
      b[i + 2] = v2
      b[i + 3] = 255
    }
  }

  return { share1, share2 }
}

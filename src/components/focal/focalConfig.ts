export type FocalOptions = {
  period: number
  strength: number
  contrastPow: number
  lensSize: number
  lensSizeMin: number
  lensSizeMax: number
  lensSizeStep: number
  rotateDeg: number
  hideCursor: boolean
  wheelResize: boolean
}

export const FOCAL_DEFAULTS: FocalOptions = {
  period: 2,
  strength: 0.82,
  contrastPow: 0.85,
  lensSize: 200,
  lensSizeMin: 64,
  lensSizeMax: 420,
  lensSizeStep: 24,
  rotateDeg: 0.5,
  hideCursor: true,
  wheelResize: true,
}

export function resolveFocalOptions(
  partial?: Partial<FocalOptions>,
): FocalOptions {
  return { ...FOCAL_DEFAULTS, ...partial }
}

export type PointerAxis = 'x' | 'y'

export type PointerRange = {
  from: number
  to: number
  axis: PointerAxis
}

export type NoiseFrameConfig = {
  insetPx: number
  paddingPx: number
  density: number
  shiftX: PointerRange
  shiftY: PointerRange
  rotate: PointerRange
  scale: PointerRange
}

export const DEFAULT_NOISE_FRAME_CONFIG: NoiseFrameConfig = {
  insetPx: 0,
  paddingPx: 0,
  density: 0.5,
  shiftX: { from: -6, to: 6, axis: 'x' },
  shiftY: { from: -6, to: 6, axis: 'y' },
  rotate: { from: -2.3, to: 2.3, axis: 'x' },
  scale: { from: 0.98, to: 1.02, axis: 'x' },
}

const SHIFT_LIMIT = 80
const ROTATE_LIMIT = 45
const SCALE_MIN = 0.5
const SCALE_MAX = 2

export function clampConfig(partial: Partial<NoiseFrameConfig>): NoiseFrameConfig {
  const merged = { ...DEFAULT_NOISE_FRAME_CONFIG, ...partial }
  return {
    insetPx: clamp(merged.insetPx, 0, 32),
    paddingPx: clamp(merged.paddingPx, 0, 64),
    density: 0.5,
    shiftX: clampRange(merged.shiftX, DEFAULT_NOISE_FRAME_CONFIG.shiftX, -SHIFT_LIMIT, SHIFT_LIMIT),
    shiftY: clampRange(merged.shiftY, DEFAULT_NOISE_FRAME_CONFIG.shiftY, -SHIFT_LIMIT, SHIFT_LIMIT),
    rotate: clampRange(merged.rotate, DEFAULT_NOISE_FRAME_CONFIG.rotate, -ROTATE_LIMIT, ROTATE_LIMIT),
    scale: clampRange(merged.scale, DEFAULT_NOISE_FRAME_CONFIG.scale, SCALE_MIN, SCALE_MAX),
  }
}

export function randomNoiseFrameConfig(
  partial?: Partial<NoiseFrameConfig>,
): NoiseFrameConfig {
  const base = clampConfig(partial ?? {})
  return clampConfig({
    ...base,
    shiftX: jitterRange(base.shiftX, 2, 1),
    shiftY: jitterRange(base.shiftY, 2, 1),
    rotate: jitterRange(base.rotate, 0.8, 0.1),
    scale: jitterRange(base.scale, 0.015, 0.01),
  })
}

export function pointerRangeValue(range: PointerRange, x: number, y: number) {
  const source = range.axis === 'x' ? x : y
  const t = clamp((source + 1) / 2, 0, 1)
  return range.from + (range.to - range.from) * t
}

function clampRange(
  value: PointerRange | undefined,
  fallback: PointerRange,
  min: number,
  max: number,
): PointerRange {
  const merged = { ...fallback, ...value }
  return {
    from: clamp(merged.from, min, max),
    to: clamp(merged.to, min, max),
    axis: merged.axis === 'y' ? 'y' : 'x',
  }
}

function jitterRange(range: PointerRange, amount: number, step: number): PointerRange {
  return {
    ...range,
    from: jitter(range.from, amount, step),
    to: jitter(range.to, amount, step),
  }
}

function jitter(value: number, amount: number, step: number) {
  const next = value + (Math.random() * 2 - 1) * amount
  return Math.round(next / step) * step
}

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value))
}

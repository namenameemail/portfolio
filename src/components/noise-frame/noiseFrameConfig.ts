export type CursorMode = 'follow' | 'inverse' | 'axisX' | 'axisY'

export type NoiseFrameConfig = {
  insetPx: number
  paddingPx: number
  rotateDeg: number
  shiftPx: number
  cursorMode: CursorMode
  density: number
}

export const DEFAULT_NOISE_FRAME_CONFIG: NoiseFrameConfig = {
  insetPx: 2,
  paddingPx: 0,
  rotateDeg: 0.6,
  shiftPx: 1,
  cursorMode: 'follow',
  density: 0.56,
}

export const CURSOR_MODES: CursorMode[] = ['follow', 'inverse', 'axisX', 'axisY']

export function clampConfig(partial: Partial<NoiseFrameConfig>): NoiseFrameConfig {
  const merged = { ...DEFAULT_NOISE_FRAME_CONFIG, ...partial }
  return {
    insetPx: clamp(merged.insetPx, 0, 32),
    paddingPx: clamp(merged.paddingPx, 0, 64),
    rotateDeg: clamp(merged.rotateDeg, 0, 8),
    shiftPx: clamp(merged.shiftPx, 0, 24),
    cursorMode: CURSOR_MODES.includes(merged.cursorMode)
      ? merged.cursorMode
      : 'follow',
    density: clamp(merged.density, 0, 1),
  }
}

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value))
}

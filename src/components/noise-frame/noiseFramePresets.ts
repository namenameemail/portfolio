import { clampConfig, type NoiseFrameConfig } from './noiseFrameConfig'

export type NoiseFramePreset = {
  name: string
  config: NoiseFrameConfig
}

export const NOISE_FRAME_PRESETS_KEY = 'noise-frame-presets'

export function loadPresets(): NoiseFramePreset[] {
  try {
    const raw = localStorage.getItem(NOISE_FRAME_PRESETS_KEY)
    if (!raw) return []
    const parsed: unknown = JSON.parse(raw)
    if (!Array.isArray(parsed)) return []
    return parsed
      .filter(
        (item): item is { name: string; config: Partial<NoiseFrameConfig> } =>
          typeof item === 'object' &&
          item !== null &&
          typeof (item as { name?: unknown }).name === 'string' &&
          typeof (item as { config?: unknown }).config === 'object' &&
          (item as { config: unknown }).config !== null,
      )
      .map((item) => ({
        name: item.name,
        config: clampConfig(item.config),
      }))
  } catch {
    return []
  }
}

export function savePresets(presets: NoiseFramePreset[]) {
  localStorage.setItem(NOISE_FRAME_PRESETS_KEY, JSON.stringify(presets))
}

export function nextPresetName(presets: NoiseFramePreset[]) {
  let n = presets.length + 1
  const names = new Set(presets.map((p) => p.name))
  while (names.has(`preset ${n}`)) n += 1
  return `preset ${n}`
}

import { useState } from 'react'
import { CURSOR_MODES, type NoiseFrameConfig } from './noiseFrameConfig'
import {
  loadPresets,
  nextPresetName,
  savePresets,
  type NoiseFramePreset,
} from './noiseFramePresets'
import './NoiseFrameDevPanel.css'

type NoiseFrameDevPanelProps = {
  config: NoiseFrameConfig
  onChange: (next: NoiseFrameConfig) => void
}

export function NoiseFrameDevPanel({ config, onChange }: NoiseFrameDevPanelProps) {
  const [presets, setPresets] = useState<NoiseFramePreset[]>(loadPresets)
  const [selectedName, setSelectedName] = useState('')
  const [nameInput, setNameInput] = useState('')

  const set = <K extends keyof NoiseFrameConfig>(key: K, value: NoiseFrameConfig[K]) => {
    onChange({ ...config, [key]: value })
  }

  const persist = (next: NoiseFramePreset[]) => {
    setPresets(next)
    savePresets(next)
  }

  const onSave = () => {
    const name = nameInput.trim() || nextPresetName(presets)
    const entry = { name, config }
    const index = presets.findIndex((p) => p.name === name)
    const next =
      index >= 0
        ? presets.map((p, i) => (i === index ? entry : p))
        : [...presets, entry]
    persist(next)
    setSelectedName(name)
    setNameInput('')
  }

  const onSelect = (name: string) => {
    setSelectedName(name)
    const preset = presets.find((p) => p.name === name)
    if (preset) onChange(preset.config)
  }

  const onDelete = () => {
    if (!selectedName) return
    const next = presets.filter((p) => p.name !== selectedName)
    persist(next)
    setSelectedName('')
  }

  return (
    <aside className="noise-frame-dev" aria-label="NoiseFrame dev controls">
      <p className="noise-frame-dev__title">NoiseFrame</p>

      <div className="noise-frame-dev__section">
        <p className="noise-frame-dev__section-title">Presets</p>
        <div className="noise-frame-dev__row">
          <input
            type="text"
            className="noise-frame-dev__text"
            placeholder="name"
            value={nameInput}
            onChange={(e) => setNameInput(e.target.value)}
          />
          <button type="button" className="noise-frame-dev__btn" onClick={onSave}>
            Save
          </button>
        </div>
        <div className="noise-frame-dev__row">
          <select
            className="noise-frame-dev__select"
            value={selectedName}
            onChange={(e) => onSelect(e.target.value)}
          >
            <option value="">—</option>
            {presets.map((preset) => (
              <option key={preset.name} value={preset.name}>
                {preset.name}
              </option>
            ))}
          </select>
          <button
            type="button"
            className="noise-frame-dev__btn"
            onClick={onDelete}
            disabled={!selectedName}
          >
            Delete
          </button>
        </div>
      </div>

      <div className="noise-frame-dev__field">
        <label>
          <span>insetPx</span>
          <span>{config.insetPx}</span>
        </label>
        <input
          type="range"
          min={0}
          max={32}
          step={1}
          value={config.insetPx}
          onChange={(e) => set('insetPx', Number(e.target.value))}
        />
      </div>

      <div className="noise-frame-dev__field">
        <label>
          <span>paddingPx</span>
          <span>{config.paddingPx}</span>
        </label>
        <input
          type="range"
          min={0}
          max={64}
          step={1}
          value={config.paddingPx}
          onChange={(e) => set('paddingPx', Number(e.target.value))}
        />
      </div>

      <div className="noise-frame-dev__field">
        <label>
          <span>rotateDeg</span>
          <span>{config.rotateDeg.toFixed(1)}</span>
        </label>
        <input
          type="range"
          min={0}
          max={8}
          step={0.1}
          value={config.rotateDeg}
          onChange={(e) => set('rotateDeg', Number(e.target.value))}
        />
      </div>

      <div className="noise-frame-dev__field">
        <label>
          <span>shiftPx</span>
          <span>{config.shiftPx}</span>
        </label>
        <input
          type="range"
          min={0}
          max={24}
          step={1}
          value={config.shiftPx}
          onChange={(e) => set('shiftPx', Number(e.target.value))}
        />
      </div>

      <div className="noise-frame-dev__field">
        <label>
          <span>density</span>
          <span>{config.density.toFixed(2)}</span>
        </label>
        <input
          type="range"
          min={0}
          max={1}
          step={0.01}
          value={config.density}
          onChange={(e) => set('density', Number(e.target.value))}
        />
      </div>

      <div className="noise-frame-dev__field">
        <label>
          <span>cursorMode</span>
        </label>
        <select
          value={config.cursorMode}
          onChange={(e) => set('cursorMode', e.target.value as NoiseFrameConfig['cursorMode'])}
        >
          {CURSOR_MODES.map((mode) => (
            <option key={mode} value={mode}>
              {mode}
            </option>
          ))}
        </select>
      </div>
    </aside>
  )
}

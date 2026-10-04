import { useState } from 'react'
import {
  type NoiseFrameConfig,
  type PointerAxis,
  type PointerRange,
} from './noiseFrameConfig'
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

      <RangeControl
        label="shiftX"
        range={config.shiftX}
        min={-80}
        max={80}
        step={1}
        digits={0}
        onChange={(next) => set('shiftX', next)}
      />
      <RangeControl
        label="shiftY"
        range={config.shiftY}
        min={-80}
        max={80}
        step={1}
        digits={0}
        onChange={(next) => set('shiftY', next)}
      />
      <RangeControl
        label="rotate"
        range={config.rotate}
        min={-45}
        max={45}
        step={0.1}
        digits={1}
        onChange={(next) => set('rotate', next)}
      />
      <RangeControl
        label="scale"
        range={config.scale}
        min={0.5}
        max={2}
        step={0.01}
        digits={2}
        onChange={(next) => set('scale', next)}
      />
    </aside>
  )
}

function RangeControl({
  label,
  range,
  min,
  max,
  step,
  digits,
  onChange,
}: {
  label: string
  range: PointerRange
  min: number
  max: number
  step: number
  digits: number
  onChange: (next: PointerRange) => void
}) {
  const setAxis = (axis: PointerAxis) => onChange({ ...range, axis })

  return (
    <div className="noise-frame-dev__section">
      <p className="noise-frame-dev__section-title">{label}</p>
      <div className="noise-frame-dev__field">
        <label>
          <span>from</span>
          <span>{range.from.toFixed(digits)}</span>
        </label>
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={range.from}
          onChange={(event) => onChange({ ...range, from: Number(event.target.value) })}
        />
      </div>
      <div className="noise-frame-dev__field">
        <label>
          <span>to</span>
          <span>{range.to.toFixed(digits)}</span>
        </label>
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={range.to}
          onChange={(event) => onChange({ ...range, to: Number(event.target.value) })}
        />
      </div>
      <div className="noise-frame-dev__field">
        <label>
          <span>axis</span>
        </label>
        <select
          value={range.axis}
          onChange={(event) => setAxis(event.target.value as PointerAxis)}
        >
          <option value="x">x</option>
          <option value="y">y</option>
        </select>
      </div>
    </div>
  )
}

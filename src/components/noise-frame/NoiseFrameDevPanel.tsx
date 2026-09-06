import { CURSOR_MODES, type NoiseFrameConfig } from './noiseFrameConfig'
import './NoiseFrameDevPanel.css'

type NoiseFrameDevPanelProps = {
  config: NoiseFrameConfig
  onChange: (next: NoiseFrameConfig) => void
}

export function NoiseFrameDevPanel({ config, onChange }: NoiseFrameDevPanelProps) {
  const set = <K extends keyof NoiseFrameConfig>(key: K, value: NoiseFrameConfig[K]) => {
    onChange({ ...config, [key]: value })
  }

  return (
    <aside className="noise-frame-dev" aria-label="NoiseFrame dev controls">
      <p className="noise-frame-dev__title">NoiseFrame</p>

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

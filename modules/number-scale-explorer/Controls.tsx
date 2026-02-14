import shared from '@/modules/activity.module.css';

const SCALE_OPTIONS = [10, 20, 50, 100, 500, 1000];

interface ControlsProps {
  scale: number;
  cursorCount: number;
  maxCursors: number;
  minCursors: number;
  onScaleChange: (scale: number) => void;
  onAddCursor: () => void;
  onRemoveCursor: () => void;
  onReset: () => void;
}

export default function Controls({
  scale,
  cursorCount,
  maxCursors,
  minCursors,
  onScaleChange,
  onAddCursor,
  onRemoveCursor,
  onReset,
}: ControlsProps) {
  return (
    <div className={shared.controlsBar}>
      <div className={shared.controlGroup}>
        <label htmlFor="scale-select">Scale:</label>
        <select
          id="scale-select"
          value={scale}
          onChange={(e) => onScaleChange(parseInt(e.target.value))}
        >
          {SCALE_OPTIONS.map((v) => (
            <option key={v} value={v}>
              0 – {v}
            </option>
          ))}
        </select>
      </div>

      <div className={shared.controlButtons}>
        <button
          className={shared.btnPrimary}
          onClick={onAddCursor}
          disabled={cursorCount >= maxCursors}
        >
          <span className={shared.btnIcon}>+</span>
          <span>Add Marker</span>
        </button>
        <button
          className={shared.btnDanger}
          onClick={onRemoveCursor}
          disabled={cursorCount <= minCursors}
        >
          <span className={shared.btnIcon}>−</span>
          <span>Remove</span>
        </button>
        <button className={shared.btnSecondary} onClick={onReset}>
          <span className={shared.btnIcon}>↺</span>
          <span>Reset</span>
        </button>
      </div>
    </div>
  );
}

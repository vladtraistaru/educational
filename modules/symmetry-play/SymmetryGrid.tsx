'use client';

import type { MirrorAxis } from './symmetry-utils';
import {
  cellKey,
  isCellEditable,
  isCellFixed,
  isOnAxis,
} from './symmetry-utils';
import styles from './Activity.module.css';

interface SymmetryGridProps {
  size: number;
  axis: MirrorAxis;
  readOnly?: boolean;
  fixedFilled?: Set<string>;
  userFilled?: Set<string>;
  displayFilled?: Set<string>;
  onUserToggle?: (row: number, col: number) => void;
}

export default function SymmetryGrid({
  size,
  axis,
  readOnly = false,
  fixedFilled = new Set(),
  userFilled = new Set(),
  displayFilled = new Set(),
  onUserToggle,
}: SymmetryGridProps) {
  const cells = [];
  for (let row = 0; row < size; row++) {
    for (let col = 0; col < size; col++) {
      const key = cellKey(row, col);
      const axisCell = isOnAxis(row, col, axis, size);
      let filled = false;
      let fixedSide = false;

      if (readOnly) {
        filled = displayFilled.has(key);
      } else if (axisCell) {
        filled = false;
      } else if (isCellFixed(row, col, axis, size)) {
        fixedSide = true;
        filled = fixedFilled.has(key);
      } else if (isCellEditable(row, col, axis, size)) {
        filled = userFilled.has(key);
      }

      const classNames = [styles.cell];
      if (filled) {
        classNames.push(fixedSide ? styles.cellFixed : styles.cellFilled);
      }
      if (axisCell) {
        classNames.push(styles.cellAxis);
      }
      if (!readOnly && isCellEditable(row, col, axis, size)) {
        classNames.push(styles.cellEditable);
      }

      const editable = !readOnly && isCellEditable(row, col, axis, size);

      const handleClick = () => {
        if (editable && onUserToggle) onUserToggle(row, col);
      };

      cells.push(
        <button
          key={key}
          type="button"
          className={classNames.join(' ')}
          disabled={!editable}
          onClick={handleClick}
          aria-label={`cell ${row + 1} ${col + 1}`}
        />,
      );
    }
  }

  return (
    <div className={styles.gridWrap}>
      <div
        className={styles.grid}
        style={{ gridTemplateColumns: `repeat(${size}, 1fr)` }}
      >
        {cells}
      </div>
    </div>
  );
}

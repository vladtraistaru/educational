'use client';

import { useState, type CSSProperties } from 'react';
import { cellName, columnLetter, type Cell } from './grid';
import styles from './Activity.module.css';

export type CellHighlight = 'correct' | 'wrong' | 'path';

interface CoordinateGridProps {
  size: number;
  label: string;
  markers: Record<string, string>;
  highlight: Record<string, CellHighlight>;
  pulse?: Cell;
  pirate?: Cell;
  readOnly?: boolean;
  onCellClick: (cell: Cell) => void;
}

const HIGHLIGHT_CLASS: Record<CellHighlight, string> = {
  correct: styles.cellCorrect,
  wrong: styles.cellWrong,
  path: styles.cellPath,
};

export default function CoordinateGrid({ size, label, markers, highlight, pulse, pirate, readOnly, onCellClick }: CoordinateGridProps) {
  const [hover, setHover] = useState<Cell | null>(null);
  const indexes = Array.from({ length: size }, (_, i) => i);
  const rowsTopDown = [...indexes].reverse();

  const labelClass = (axis: 'col' | 'row', i: number) =>
    [
      styles.label,
      hover?.[axis] === i ? styles.labelActive : '',
      pulse?.[axis] === i ? styles.labelPulse : '',
    ].join(' ');

  return (
    <div className={styles.board} style={{ '--size': size } as CSSProperties} role="region" aria-label={label}>
      <div className={styles.rowLabels} aria-hidden="true">
        {rowsTopDown.map((row) => (
          <span key={row} className={labelClass('row', row)}>
            {row + 1}
          </span>
        ))}
      </div>
      <div className={styles.cells} onMouseLeave={() => setHover(null)}>
        {rowsTopDown.map((row) =>
          indexes.map((col) => {
            const name = cellName({ col, row });
            const mark = highlight[name];
            return (
              <button
                key={name}
                type="button"
                aria-label={name}
                className={`${styles.cell} ${mark ? HIGHLIGHT_CLASS[mark] : ''} ${readOnly ? styles.cellReadOnly : ''}`}
                onMouseEnter={() => setHover({ col, row })}
                onFocus={() => setHover({ col, row })}
                onBlur={() => setHover(null)}
                onClick={() => onCellClick({ col, row })}
              >
                <span aria-hidden="true">{markers[name]}</span>
              </button>
            );
          }),
        )}
        {pirate && (
          <span
            className={styles.pirate}
            aria-hidden="true"
            style={{ '--col': pirate.col, '--row': pirate.row } as CSSProperties}
          >
            🏴‍☠️
          </span>
        )}
      </div>
      <span />
      <div className={styles.colLabels} aria-hidden="true">
        {indexes.map((col) => (
          <span key={col} className={labelClass('col', col)}>
            {columnLetter(col)}
          </span>
        ))}
      </div>
    </div>
  );
}

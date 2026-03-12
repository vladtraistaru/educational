'use client';

import { useCallback } from 'react';
import type { Pattern } from './patterns';
import styles from './Activity.module.css';

interface MultiplicationGridProps {
  activePattern: Pattern | null;
  selectedValue: number | undefined;
  onCellClick: (row: number, col: number) => void;
}

export default function MultiplicationGrid({
  activePattern,
  selectedValue,
  onCellClick,
}: MultiplicationGridProps) {
  const getCellClass = useCallback(
    (row: number, col: number): string => {
      const product = row * col;

      if (!activePattern) return styles.gridCell;

      if (activePattern.id === 'even-odd') {
        return product % 2 === 0
          ? `${styles.gridCell} ${styles.cellEven}`
          : `${styles.gridCell} ${styles.cellOdd}`;
      }

      if (activePattern.getCellColor) {
        const color = activePattern.getCellColor(row, col, product, selectedValue);
        if (color) return `${styles.gridCell} ${styles.cellHighlighted}`;
        return styles.gridCell;
      }

      const highlighted = activePattern.getCellHighlight(row, col, product, selectedValue);
      if (!highlighted) return styles.gridCell;

      if (activePattern.id === 'square-numbers' && row === col) {
        return `${styles.gridCell} ${styles.cellSquare}`;
      }

      return `${styles.gridCell} ${styles.cellHighlighted}`;
    },
    [activePattern, selectedValue],
  );

  const getCellStyle = useCallback(
    (row: number, col: number): React.CSSProperties | undefined => {
      if (!activePattern) return undefined;
      const product = row * col;

      if (activePattern.getCellColor) {
        const color = activePattern.getCellColor(row, col, product, selectedValue);
        if (color) return { backgroundColor: color, color: '#fff' };
        return undefined;
      }

      const cls = getCellClass(row, col);
      const isHighlighted =
        cls.includes(styles.cellHighlighted) || cls.includes(styles.cellSquare);

      const isNinesResult =
        activePattern.id === 'nines-trick' && (row === 9 || col === 9);

      const showMirrorPair =
        activePattern.id === 'commutativity' &&
        selectedValue !== undefined &&
        ((row === Math.floor(selectedValue / 100) && col === selectedValue % 100) ||
          (row === selectedValue % 100 && col === Math.floor(selectedValue / 100)));

      if ((isHighlighted || isNinesResult || showMirrorPair) && activePattern.color) {
        return { backgroundColor: activePattern.color, color: '#fff' };
      }

      return undefined;
    },
    [activePattern, selectedValue, getCellClass],
  );

  const handleClick = useCallback(
    (row: number, col: number) => {
      if (activePattern?.id === 'commutativity') {
        onCellClick(row, col);
      }
    },
    [activePattern, onCellClick],
  );

  const numbers = Array.from({ length: 12 }, (_, i) => i + 1);

  return (
    <div className={styles.gridWrapper}>
      <div className={styles.grid}>
        <div className={styles.gridCorner}>×</div>
        {numbers.map((n) => (
          <div key={`h-${n}`} className={styles.gridHeader}>
            {n}
          </div>
        ))}

        {numbers.map((row) => (
          <GridRow
            key={row}
            row={row}
            numbers={numbers}
            getCellClass={getCellClass}
            getCellStyle={getCellStyle}
            onCellClick={handleClick}
          />
        ))}
      </div>
    </div>
  );
}

function GridRow({
  row,
  numbers,
  getCellClass,
  getCellStyle,
  onCellClick,
}: {
  row: number;
  numbers: number[];
  getCellClass: (row: number, col: number) => string;
  getCellStyle: (row: number, col: number) => React.CSSProperties | undefined;
  onCellClick: (row: number, col: number) => void;
}) {
  return (
    <>
      <div className={styles.gridHeader}>{row}</div>
      {numbers.map((col) => {
        const product = row * col;
        return (
          <div
            key={col}
            className={getCellClass(row, col)}
            style={getCellStyle(row, col)}
            onClick={() => onCellClick(row, col)}
          >
            {product}
          </div>
        );
      })}
    </>
  );
}

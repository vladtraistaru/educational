'use client';

import styles from './Activity.module.css';

interface EndingChipsProps {
  chips: string[];
  shakingChip: number | null;
  disabled: boolean;
  onPick: (ending: string, index: number) => void;
}

export default function EndingChips({
  chips,
  shakingChip,
  disabled,
  onPick,
}: EndingChipsProps) {
  return (
    <div className={styles.chipRow}>
      {chips.map((ending, i) => (
        <button
          key={`${ending}-${i}`}
          type="button"
          className={`${styles.endingChip} ${shakingChip === i ? styles.chipShake : ''}`}
          disabled={disabled}
          onClick={() => onPick(ending, i)}
        >
          -{ending}
        </button>
      ))}
    </div>
  );
}

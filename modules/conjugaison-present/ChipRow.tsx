'use client';

import styles from './Activity.module.css';

interface ChipRowProps {
  chips: string[];
  shakingChip: number | null;
  disabled: boolean;
  onPick: (chip: string, index: number) => void;
}

export default function ChipRow({
  chips,
  shakingChip,
  disabled,
  onPick,
}: ChipRowProps) {
  return (
    <div className={styles.chipRow}>
      {chips.map((chip, i) => (
        <button
          key={`${chip}-${i}`}
          type="button"
          className={`${styles.chip} ${shakingChip === i ? styles.chipShake : ''}`}
          disabled={disabled}
          onClick={() => onPick(chip, i)}
        >
          {chip}
        </button>
      ))}
    </div>
  );
}

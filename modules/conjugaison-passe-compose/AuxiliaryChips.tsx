'use client';

import styles from './Activity.module.css';

interface AuxiliaryChipsProps {
  chips: string[];
  shakingChip: number | null;
  hint: string | null;
  disabled: boolean;
  onPick: (chip: string, index: number) => void;
}

export default function AuxiliaryChips({
  chips,
  shakingChip,
  hint,
  disabled,
  onPick,
}: AuxiliaryChipsProps) {
  return (
    <div className={styles.chipBlock}>
      <div className={styles.chipLabel}>Choisis l'auxiliaire :</div>
      <div className={styles.chipRow}>
        {chips.map((chip, i) => (
          <button
            key={`${chip}-${i}`}
            type="button"
            className={`${styles.chip} ${shakingChip === i ? styles.chipShake : ''}`}
            onClick={() => onPick(chip, i)}
            disabled={disabled}
          >
            {chip}
          </button>
        ))}
      </div>
      {hint && <div className={styles.hintBadge}>{hint}</div>}
    </div>
  );
}

'use client';

import styles from './Activity.module.css';

interface ParticipeChipsProps {
  chips: string[];
  shakingChip: number | null;
  hint: string | null;
  locked: boolean;
  disabled: boolean;
  onPick: (chip: string, index: number) => void;
}

export default function ParticipeChips({
  chips,
  shakingChip,
  hint,
  locked,
  disabled,
  onPick,
}: ParticipeChipsProps) {
  return (
    <div className={styles.chipBlock}>
      <div className={`${styles.chipLabel} ${locked ? styles.chipLabelLocked : ''}`}>
        Choisis le participe :
      </div>
      <div className={styles.chipRow}>
        {chips.map((chip, i) => (
          <button
            key={`${chip}-${i}`}
            type="button"
            className={`${styles.chip} ${locked ? styles.chipLocked : ''} ${
              shakingChip === i ? styles.chipShake : ''
            }`}
            onClick={() => onPick(chip, i)}
            disabled={locked || disabled}
          >
            {chip}
          </button>
        ))}
      </div>
      {hint && <div className={styles.hintBadge}>{hint}</div>}
    </div>
  );
}

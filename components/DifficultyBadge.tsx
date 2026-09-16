import { getDifficultyBand, UI_LABELS } from '@/lib/types';
import type { Language } from '@/lib/language-config';
import styles from './DifficultyBadge.module.css';

interface Props {
  difficulty: number; // 1..10
  lang: Language;
}

const BAND_SEGMENTS = { easy: 1, medium: 2, hard: 3 } as const;

export default function DifficultyBadge({ difficulty, lang }: Props) {
  const ui = UI_LABELS[lang];
  const band = getDifficultyBand(difficulty);
  const filled = BAND_SEGMENTS[band];
  const bandLabel = { easy: ui.easy, medium: ui.medium, hard: ui.hard }[band];

  return (
    <div
      className={styles.badge}
      data-band={band}
      aria-label={`${ui.difficulty} ${difficulty} / 10 — ${bandLabel}`}
    >
      <span className={styles.pill}>{bandLabel}</span>
      <span className={styles.bar} aria-hidden="true">
        {[1, 2, 3].map((i) => (
          <span key={i} className={i <= filled ? styles.segmentFilled : styles.segmentEmpty} />
        ))}
      </span>
    </div>
  );
}

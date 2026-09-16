import type { DivisionTranslations } from './translations';
import styles from './Activity.module.css';

interface Props {
  n: number;
  groups: number[][];
  selection: number[];
  emoji: string;
  locked: boolean;
  t: DivisionTranslations;
  onToggle: (token: number) => void;
  onOpen: (bag: number) => void;
}

export default function GroupScene({ n, groups, selection, emoji, locked, t, onToggle, onOpen }: Props) {
  const grouped = new Set(groups.flat());
  const loose = Array.from({ length: n }, (_, i) => i).filter((i) => !grouped.has(i));

  return (
    <div className={styles.scene}>
      <p className={styles.counter}>
        {t.bags} <strong>{groups.length}</strong>
      </p>

      {groups.length > 0 && (
        <div className={styles.bags}>
          {groups.map((bag, b) => (
            <button
              key={bag.join('-')}
              type="button"
              className={`${styles.bag} ${styles.popIn}`}
              disabled={locked}
              aria-label={`${t.bag} ${b + 1}`}
              onClick={() => onOpen(b)}
            >
              <span className={styles.bagNumber}>{b + 1}</span>
              <span className={styles.bagTokens}>{bag.map(() => emoji).join('')}</span>
            </button>
          ))}
        </div>
      )}

      {loose.length > 0 && (
        <div className={`${styles.field} ${locked ? styles.remainderBox : ''}`}>
          {locked && (
            <span className={styles.boxLabel}>
              {t.remainder} ({loose.length})
            </span>
          )}
          <div className={styles.tokens}>
            {loose.map((i) => (
              <button
                key={i}
                type="button"
                className={`${styles.tokenButton} ${selection.includes(i) ? styles.tokenSelected : ''}`}
                disabled={locked}
                aria-pressed={selection.includes(i)}
                onClick={() => onToggle(i)}
              >
                {emoji}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

import shared from '@/modules/activity.module.css';
import type { DivisionTranslations } from './translations';
import styles from './Activity.module.css';

interface Props {
  plates: number[];
  pile: number;
  emoji: string;
  locked: boolean;
  t: DivisionTranslations;
  onAdd: (plate: number) => void;
  onRemove: (plate: number) => void;
  onDeal: () => void;
}

export default function ShareScene({ plates, pile, emoji, locked, t, onAdd, onRemove, onDeal }: Props) {
  return (
    <div className={styles.scene}>
      <div className={`${styles.pile} ${locked && pile > 0 ? styles.remainderBox : ''}`}>
        <span className={styles.boxLabel}>
          {locked && pile > 0 ? t.remainder : t.pile} ({pile})
        </span>
        <div className={styles.tokens}>
          {Array.from({ length: pile }, (_, i) => (
            <span key={i} className={styles.token}>
              {emoji}
            </span>
          ))}
        </div>
      </div>

      <div className={shared.controlButtons}>
        <button
          type="button"
          className={`${shared.btn} ${shared.btnSecondary}`}
          disabled={locked || pile < plates.length}
          onClick={onDeal}
        >
          {t.dealOne}
        </button>
      </div>

      <div className={styles.plates}>
        {plates.map((count, p) => (
          <div key={p} className={styles.plateCard}>
            <div className={styles.plateTray}>
              {Array.from({ length: count }, (_, i) => (
                <button
                  key={i}
                  type="button"
                  className={`${styles.tokenButton} ${styles.popIn}`}
                  disabled={locked}
                  aria-label={`${t.takeBack} (${t.plate} ${p + 1})`}
                  onClick={() => onRemove(p)}
                >
                  {emoji}
                </button>
              ))}
            </div>
            <button
              type="button"
              className={styles.plateButton}
              disabled={locked || pile === 0}
              aria-label={`${t.plate} ${p + 1}: ${count}`}
              onClick={() => onAdd(p)}
            >
              🍽️
            </button>
            <span className={styles.count}>{count}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

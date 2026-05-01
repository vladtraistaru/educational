'use client';

import shared from '@/modules/activity.module.css';
import styles from './Activity.module.css';

export interface PoolOption<T extends string> {
  id: T;
  label: string;
  variant: 'primary' | 'secondary' | 'danger' | 'warm';
}

interface PoolSelectorProps<T extends string> {
  intro: string;
  pools: PoolOption<T>[];
  onPick: (id: T) => void;
}

const VARIANT_CLASS: Record<PoolOption<string>['variant'], string> = {
  primary: shared.btnPrimary,
  secondary: shared.btnSecondary,
  danger: shared.btnDanger,
  warm: shared.btnPrimary,
};

export default function PoolSelector<T extends string>({
  intro,
  pools,
  onPick,
}: PoolSelectorProps<T>) {
  return (
    <div className={styles.poolScreen}>
      <p className={styles.poolIntro}>{intro}</p>
      <div className={styles.poolGrid}>
        {pools.map((p) => (
          <button
            key={p.id}
            type="button"
            className={`${VARIANT_CLASS[p.variant]} ${styles.poolBtn}`}
            onClick={() => onPick(p.id)}
          >
            {p.label}
          </button>
        ))}
      </div>
    </div>
  );
}

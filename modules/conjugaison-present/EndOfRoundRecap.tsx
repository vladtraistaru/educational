'use client';

import { useState } from 'react';
import Link from 'next/link';
import shared from '@/modules/activity.module.css';
import styles from './Activity.module.css';

export interface RecapRow {
  infinitive: string;
  tricky: boolean;
  fullConjugation: { pronoun: string; form: string }[];
}

interface EndOfRoundRecapProps {
  title: string;
  hint: string;
  rows: RecapRow[];
  restartLabel: string;
  backLabel: string;
  onRestart: () => void;
}

export default function EndOfRoundRecap({
  title,
  hint,
  rows,
  restartLabel,
  backLabel,
  onRestart,
}: EndOfRoundRecapProps) {
  const [expanded, setExpanded] = useState<number | null>(null);

  return (
    <div className={styles.recap}>
      <h3 className={styles.recapTitle}>{title}</h3>
      <p className={styles.recapHint}>{hint}</p>
      <ul className={styles.recapList}>
        {rows.map((r, i) => (
          <li key={`${r.infinitive}-${i}`} className={styles.recapItem}>
            <button
              type="button"
              className={styles.recapRow}
              onClick={() =>
                r.tricky ? setExpanded(expanded === i ? null : i) : undefined
              }
              aria-expanded={expanded === i}
              disabled={!r.tricky}
            >
              <span
                className={r.tricky ? styles.recapDotOrange : styles.recapDotGreen}
                aria-hidden
              >
                {r.tricky ? '●' : '✓'}
              </span>
              <span className={styles.recapVerb}>{r.infinitive}</span>
            </button>
            {r.tricky && expanded === i && (
              <div className={styles.recapExpand}>
                {r.fullConjugation.map((c, k) => (
                  <div key={k} className={styles.recapConjLine}>
                    <span className={styles.recapConjPronoun}>{c.pronoun}</span>
                    <span>{c.form}</span>
                  </div>
                ))}
              </div>
            )}
          </li>
        ))}
      </ul>
      <div className={styles.recapButtons}>
        <button type="button" className={shared.btnPrimary} onClick={onRestart}>
          {restartLabel}
        </button>
        <Link href="/" className={shared.btnSecondary}>
          {backLabel}
        </Link>
      </div>
    </div>
  );
}

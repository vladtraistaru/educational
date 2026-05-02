'use client';

import type { Verb } from '@/lib/linguistics/french/conjugation';
import { SLOT_PRONOUNS, imparfaitStem, imparfaitEnding } from './forms-imp';
import styles from './Activity.module.css';

interface EndOfVerbRevealProps {
  verb: Verb;
}

const PRONOUN_LABEL: Record<string, string> = {
  je: 'je',
  tu: 'tu',
  il: 'il/elle/on',
  nous: 'nous',
  vous: 'vous',
  ils: 'ils/elles',
};

export default function EndOfVerbReveal({ verb }: EndOfVerbRevealProps) {
  const stem = imparfaitStem(verb);
  return (
    <div className={styles.revealTable}>
      {SLOT_PRONOUNS.map((p, i) => (
        <div key={p} className={styles.revealRow}>
          <span className={styles.revealPronoun}>{PRONOUN_LABEL[p]}</span>
          <span>
            <span className={styles.revealStem}>{stem}</span>
            <span className={styles.revealEnding}>{imparfaitEnding(i)}</span>
          </span>
        </div>
      ))}
    </div>
  );
}

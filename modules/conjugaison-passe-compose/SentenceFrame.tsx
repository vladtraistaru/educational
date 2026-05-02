'use client';

import type { Pronoun } from '@/lib/linguistics/french/conjugation';
import type { FrameTemplate } from './frames';
import styles from './Activity.module.css';

interface SentenceFrameProps {
  frame: FrameTemplate;
  pronoun: Pronoun;
  object: string;
  pickedAux: string | null;
  pickedPp: string | null;
  flashAux: boolean;
  flashPp: boolean;
}

export default function SentenceFrame({
  frame,
  pronoun,
  object,
  pickedAux,
  pickedPp,
  flashAux,
  flashPp,
}: SentenceFrameProps) {
  const showPronoun = pronoun === 'je' && pickedAux && /^[aeiouhâêîôûéè]/i.test(pickedAux)
    ? "j'"
    : pronoun === 'je'
      ? 'je '
      : `${pronoun} `;

  return (
    <p className={styles.sentence}>
      <span className={styles.framePart}>{frame.prefix}</span>{' '}
      <span className={styles.pronoun}>{showPronoun}</span>
      {pickedAux ? (
        <span className={`${styles.slotFilled} ${flashAux ? styles.slotFlash : ''}`}>
          {pickedAux}
        </span>
      ) : (
        <span className={styles.slotEmpty} aria-label="auxiliaire">____</span>
      )}{' '}
      {pickedPp ? (
        <span className={`${styles.slotFilled} ${flashPp ? styles.slotFlash : ''}`}>
          {pickedPp}
        </span>
      ) : (
        <span
          className={`${styles.slotEmpty} ${pickedAux ? styles.slotEmptyActive : styles.slotEmptyLocked}`}
          aria-label="participe"
        >
          ____
        </span>
      )}{' '}
      <span className={styles.objectPart}>{object}.</span>
    </p>
  );
}

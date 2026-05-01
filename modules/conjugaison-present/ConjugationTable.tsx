'use client';

import type { Pronoun, Verb } from '@/lib/linguistics/french/conjugation';
import { bareForm, splitForm } from './forms';
import styles from './Activity.module.css';

interface ConjugationTableProps {
  verb: Verb;
  surfacePronouns: Pronoun[];
  filledSlots: boolean[];
  currentSlot: number | null;
  flashSlot: number | null;
}

export default function ConjugationTable({
  verb,
  surfacePronouns,
  filledSlots,
  currentSlot,
  flashSlot,
}: ConjugationTableProps) {
  return (
    <div className={styles.tableWrap}>
      <h3 className={styles.verbHeading}>
        {verb.infinitive} <span className={styles.verbTense}>— présent</span>
      </h3>
      <div className={styles.table}>
        {surfacePronouns.map((pronoun, slot) => {
          const filled = filledSlots[slot];
          const isTarget = slot === currentSlot;
          const isFlashing = slot === flashSlot;
          const labelPronoun = displayPronoun(slot, pronoun);
          return (
            <div
              key={slot}
              className={`${styles.row} ${isTarget ? styles.rowTarget : ''}`}
            >
              <div className={styles.pronounCell}>{labelPronoun}</div>
              <div className={styles.formCell}>
                {filled ? (
                  <FilledForm
                    verb={verb}
                    slot={slot}
                    form={bareForm(verb, pronoun)}
                    isFlashing={isFlashing}
                  />
                ) : isTarget ? (
                  <span className={styles.targetMark}>?</span>
                ) : (
                  <span className={styles.emptyMark}>—</span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function displayPronoun(slot: number, pronoun: Pronoun): string {
  if (slot === 2) return `${pronoun}`;
  if (slot === 5) return `${pronoun}`;
  return pronoun;
}

function FilledForm({
  verb,
  slot,
  form,
  isFlashing,
}: {
  verb: Verb;
  slot: number;
  form: string;
  isFlashing: boolean;
}) {
  const { stem, ending } = splitForm(verb, slot, form);
  return (
    <span className={styles.filledForm}>
      {stem && <span>{stem}</span>}
      <strong className={isFlashing ? styles.endingFlash : styles.ending}>
        {ending}
      </strong>
    </span>
  );
}

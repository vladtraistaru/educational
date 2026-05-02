'use client';

import type { Pronoun, Verb } from '@/lib/linguistics/french/conjugation';
import { conjugate } from '@/lib/linguistics/french/conjugation';
import { imparfaitStem } from './forms-imp';
import styles from './Activity.module.css';

interface QuestionLineProps {
  verb: Verb;
  pronoun: Pronoun;
  flashEnding: string | null;
}

export default function QuestionLine({ verb, pronoun, flashEnding }: QuestionLineProps) {
  const stem = imparfaitStem(verb);
  const elide = pronoun === 'je' && /^[aeiouhâêîôûéè]/i.test(stem);
  return (
    <div className={styles.questionLine}>
      {elide ? (
        <span className={styles.questionPronoun}>j&apos;</span>
      ) : (
        <>
          <span className={styles.questionPronoun}>{pronoun}</span>{' '}
        </>
      )}
      <span className={styles.questionStem}>{stem}</span>
      {flashEnding ? (
        <>
          <span className={styles.endingFlash}>{flashEnding}</span>
          <span className={styles.fullForm}> = {conjugate(verb, 'imparfait', pronoun)}</span>
        </>
      ) : (
        <>
          <span className={styles.blank}>______</span>
          <span className={styles.questionMark}> ?</span>
        </>
      )}
    </div>
  );
}

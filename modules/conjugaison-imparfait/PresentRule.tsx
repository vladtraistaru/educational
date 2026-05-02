'use client';

import type { Verb } from '@/lib/linguistics/french/conjugation';
import { nousPresentStem, nousPresentSuffix } from './forms-imp';
import styles from './Activity.module.css';

interface PresentRuleProps {
  verb: Verb;
  label: string;
  etreNote: string;
}

export default function PresentRule({ verb, label, etreNote }: PresentRuleProps) {
  const stem = nousPresentStem(verb);
  const suffix = nousPresentSuffix(verb);
  const isEtre = verb.infinitive === 'être';

  return (
    <div className={styles.ruleBlock}>
      <div className={styles.ruleLabel}>{label}</div>
      <div className={isEtre ? styles.ruleLineMuted : styles.ruleLine}>
        <span className={styles.rulePronoun}>nous </span>
        <span className={styles.ruleStem}>{stem}</span>
        <span className={styles.ruleStrike}>{suffix}</span>
      </div>
      {isEtre && <div className={styles.etreNote}>{etreNote}</div>}
    </div>
  );
}

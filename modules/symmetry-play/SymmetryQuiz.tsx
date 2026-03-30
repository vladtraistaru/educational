'use client';

import { useCallback, useState } from 'react';
import type { QuizItem } from './puzzles';
import { cellKey } from './symmetry-utils';
import shared from '@/modules/activity.module.css';
import SymmetryGrid from './SymmetryGrid';
import styles from './Activity.module.css';

export interface QuizLabels {
  question: string;
  yes: string;
  no: string;
  feedbackCorrect: string;
  feedbackIncorrect: string;
  next: string;
}

interface SymmetryQuizProps {
  item: QuizItem;
  labels: QuizLabels;
  onNext: () => void;
}

export default function SymmetryQuiz({
  item,
  labels,
  onNext,
}: SymmetryQuizProps) {
  const [result, setResult] = useState<'idle' | 'correct' | 'wrong'>('idle');

  const displayFilled = new Set(
    item.cells.map(([r, c]) => cellKey(r, c)),
  );

  const handleAnswer = useCallback(
    (saidYes: boolean) => {
      const ok = saidYes === item.symmetrical;
      setResult(ok ? 'correct' : 'wrong');
    },
    [item.symmetrical],
  );

  const handleNext = useCallback(() => {
    setResult('idle');
    onNext();
  }, [onNext]);

  return (
    <div>
      <p className={styles.quizPrompt}>{labels.question}</p>
      <SymmetryGrid
        size={item.size}
        axis={item.axis}
        readOnly
        displayFilled={displayFilled}
      />
      {result === 'idle' && (
        <div className={styles.quizActions}>
          <button
            type="button"
            className={`${shared.btn} ${shared.btnPrimary}`}
            onClick={() => handleAnswer(true)}
          >
            {labels.yes}
          </button>
          <button
            type="button"
            className={`${shared.btn} ${shared.btnSecondary}`}
            onClick={() => handleAnswer(false)}
          >
            {labels.no}
          </button>
        </div>
      )}
      {result === 'correct' && (
        <>
          <p className={shared.feedbackCorrect}>{labels.feedbackCorrect}</p>
          <div className={styles.quizActions}>
            <button
              type="button"
              className={`${shared.btn} ${shared.btnPrimary}`}
              onClick={handleNext}
            >
              {labels.next}
            </button>
          </div>
        </>
      )}
      {result === 'wrong' && (
        <>
          <p className={shared.feedbackIncorrect}>{labels.feedbackIncorrect}</p>
          <div className={styles.quizActions}>
            <button
              type="button"
              className={`${shared.btn} ${shared.btnPrimary}`}
              onClick={handleNext}
            >
              {labels.next}
            </button>
          </div>
        </>
      )}
    </div>
  );
}

'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import type { ActivityProps } from '@/lib/types';
import { useLanguage } from '@/lib/language';
import shared from '@/modules/activity.module.css';
import translations from './translations';
import { completePuzzles, quizItems } from './puzzles';
import { cellKey, matchesReflection } from './symmetry-utils';
import SymmetryGrid from './SymmetryGrid';
import SymmetryQuiz from './SymmetryQuiz';
import styles from './Activity.module.css';

type Mode = 'complete' | 'quiz';

export default function Activity(_props: ActivityProps) {
  const { language } = useLanguage();
  const t = translations[language];

  const [mode, setMode] = useState<Mode>('complete');
  const [completeIndex, setCompleteIndex] = useState(0);
  const [quizIndex, setQuizIndex] = useState(0);
  const [userFilled, setUserFilled] = useState<Set<string>>(() => new Set());
  const [completeFeedback, setCompleteFeedback] = useState<
    'idle' | 'correct' | 'wrong'
  >('idle');

  const puzzle = completePuzzles[completeIndex];
  const fixedSet = useMemo(
    () => new Set(puzzle.fixedCells.map(([r, c]) => cellKey(r, c))),
    [puzzle],
  );

  useEffect(() => {
    setUserFilled(new Set());
    setCompleteFeedback('idle');
  }, [completeIndex]);

  const handleToggle = useCallback((row: number, col: number) => {
    const k = cellKey(row, col);
    setUserFilled((prev) => {
      const next = new Set(prev);
      if (next.has(k)) next.delete(k);
      else next.add(k);
      return next;
    });
    setCompleteFeedback('idle');
  }, []);

  const handleCheck = useCallback(() => {
    const ok = matchesReflection(
      userFilled,
      puzzle.fixedCells,
      puzzle.axis,
      puzzle.size,
    );
    setCompleteFeedback(ok ? 'correct' : 'wrong');
  }, [userFilled, puzzle]);

  const quizItem = quizItems[quizIndex];

  const quizLabels = useMemo(
    () => ({
      question: t.quizQuestion,
      yes: t.yes,
      no: t.no,
      feedbackCorrect: t.quizFeedbackCorrect,
      feedbackIncorrect: t.quizFeedbackIncorrect,
      next: t.quizNext,
    }),
    [t],
  );

  return (
    <div className={shared.activityArea}>
      <div className={styles.wrapper}>
        <div className={styles.modeTabs}>
          <button
            type="button"
            className={`${styles.modeTab} ${mode === 'complete' ? styles.modeTabActive : ''}`}
            onClick={() => setMode('complete')}
          >
            {t.modeComplete}
          </button>
          <button
            type="button"
            className={`${styles.modeTab} ${mode === 'quiz' ? styles.modeTabActive : ''}`}
            onClick={() => setMode('quiz')}
          >
            {t.modeQuiz}
          </button>
        </div>

        {mode === 'complete' && (
          <>
            <div className={`${shared.controlsBar} ${styles.puzzleNav}`}>
              <span className={styles.puzzleLabel}>
                {t.puzzleN} {completeIndex + 1}/{completePuzzles.length}
              </span>
              <div className={shared.controlButtons}>
                <button
                  type="button"
                  className={`${shared.btn} ${shared.btnSecondary}`}
                  disabled={completeIndex <= 0}
                  onClick={() =>
                    setCompleteIndex((i) => Math.max(0, i - 1))
                  }
                >
                  {t.prevPuzzle}
                </button>
                <button
                  type="button"
                  className={`${shared.btn} ${shared.btnSecondary}`}
                  disabled={completeIndex >= completePuzzles.length - 1}
                  onClick={() =>
                    setCompleteIndex((i) =>
                      Math.min(completePuzzles.length - 1, i + 1),
                    )
                  }
                >
                  {t.nextPuzzle}
                </button>
                <button
                  type="button"
                  className={`${shared.btn} ${shared.btnPrimary}`}
                  onClick={handleCheck}
                >
                  {t.check}
                </button>
              </div>
            </div>
            <SymmetryGrid
              size={puzzle.size}
              axis={puzzle.axis}
              fixedFilled={fixedSet}
              userFilled={userFilled}
              onUserToggle={handleToggle}
            />
            <div className={styles.feedbackRow}>
              {completeFeedback === 'correct' && (
                <p className={shared.feedbackCorrect}>{t.completeCorrect}</p>
              )}
              {completeFeedback === 'wrong' && (
                <p className={shared.feedbackIncorrect}>{t.completeWrong}</p>
              )}
            </div>
          </>
        )}

        {mode === 'quiz' && (
          <SymmetryQuiz
            key={quizItem.id}
            item={quizItem}
            labels={quizLabels}
            onNext={() =>
              setQuizIndex((i) => (i + 1) % quizItems.length)
            }
          />
        )}
      </div>
    </div>
  );
}

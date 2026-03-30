'use client';

import { useCallback, useEffect, useState } from 'react';
import type { ActivityProps } from '@/lib/types';
import { useLanguage } from '@/lib/language';
import shared from '@/modules/activity.module.css';
import styles from './Activity.module.css';
import translations from './translations';
import RulerView from './RulerView';
import LengthCompare from './LengthCompare';
import {
  READ_EXERCISES,
  COMPARE_EXERCISES,
  readChoices,
  compareTwoCorrect,
  compareThreeLongestIndex,
  shuffledCopy,
} from './exercises';

type Mode = 'read' | 'compare';
type Feedback = 'idle' | 'correct' | 'wrong';

type ThreePerm = [number, number, number];

export default function MeasureLengthsActivity(_props: ActivityProps) {
  const { language } = useLanguage();
  const t = translations[language];

  const [mode, setMode] = useState<Mode>('read');
  const [readOrder] = useState(() =>
    shuffledCopy(READ_EXERCISES.map((_, i) => i)),
  );
  const [readPos, setReadPos] = useState(0);
  const [compareOrder] = useState(() =>
    shuffledCopy(COMPARE_EXERCISES.map((_, i) => i)),
  );
  const [comparePos, setComparePos] = useState(0);

  const [readChoiceValues, setReadChoiceValues] = useState(() =>
    readChoices(READ_EXERCISES[readOrder[0]].lengthCm),
  );
  const [selectedCm, setSelectedCm] = useState<number | null>(null);
  const [feedback, setFeedback] = useState<Feedback>('idle');

  const [threePerm, setThreePerm] = useState<ThreePerm>([0, 1, 2]);

  const currentRead = READ_EXERCISES[readOrder[readPos]];
  const currentCompare = COMPARE_EXERCISES[compareOrder[comparePos]];

  useEffect(() => {
    if (mode !== 'read') return;
    setReadChoiceValues(readChoices(currentRead.lengthCm));
    setSelectedCm(null);
    setFeedback('idle');
  }, [mode, readPos, currentRead.id]);

  useEffect(() => {
    if (mode !== 'compare') return;
    setFeedback('idle');
    if (currentCompare.kind === 'three') {
      const p = shuffledCopy([0, 1, 2]);
      setThreePerm([p[0], p[1], p[2]] as ThreePerm);
    }
  }, [mode, comparePos, currentCompare.id, currentCompare.kind]);

  const handleModeRead = useCallback(() => {
    setMode('read');
  }, []);

  const handleModeCompare = useCallback(() => {
    setMode('compare');
  }, []);

  const handleSelectCm = useCallback((cm: number) => {
    setSelectedCm(cm);
    setFeedback('idle');
  }, []);

  const handleCheckRead = useCallback(() => {
    if (selectedCm === null) return;
    if (selectedCm === currentRead.lengthCm) {
      setFeedback('correct');
    } else {
      setFeedback('wrong');
    }
  }, [selectedCm, currentRead.lengthCm]);

  const handleNextRead = useCallback(() => {
    setReadPos((p) => (p + 1) % READ_EXERCISES.length);
  }, []);

  const handleNextCompare = useCallback(() => {
    setComparePos((p) => (p + 1) % COMPARE_EXERCISES.length);
  }, []);

  const handleCompareTwoAnswer = useCallback(
    (choice: 'first' | 'second' | 'same') => {
      if (currentCompare.kind !== 'two') return;
      const ok = compareTwoCorrect(currentCompare.aCm, currentCompare.bCm) === choice;
      setFeedback(ok ? 'correct' : 'wrong');
    },
    [currentCompare],
  );

  const handleCompareThreeAnswer = useCallback(
    (displayIndex: number) => {
      if (currentCompare.kind !== 'three') return;
      const longestOrig = compareThreeLongestIndex(currentCompare.lengths);
      const correctDisplay = threePerm.indexOf(longestOrig);
      setFeedback(displayIndex === correctDisplay ? 'correct' : 'wrong');
    },
    [currentCompare, threePerm],
  );

  const contextLine =
    mode === 'read'
      ? t.contexts[currentRead.contextKey]
      : currentCompare.kind === 'two' && currentCompare.contextKey
        ? t.contexts[currentCompare.contextKey]
        : null;

  const displayedThreeLengths: [number, number, number] | null =
    currentCompare.kind === 'three'
      ? [
          currentCompare.lengths[threePerm[0]],
          currentCompare.lengths[threePerm[1]],
          currentCompare.lengths[threePerm[2]],
        ]
      : null;

  const threeBarLabels = [t.barA, t.barB, t.barC] as const;

  return (
    <div className={shared.activityArea}>
      <div className={styles.wrapper}>
        <div className={shared.controlsBar}>
          <div className={shared.controlButtons}>
            <button
              type="button"
              className={
                mode === 'read'
                  ? `${shared.btn} ${shared.btnPrimary}`
                  : `${shared.btn} ${shared.btnSecondary}`
              }
              onClick={handleModeRead}
            >
              {t.modeRead}
            </button>
            <button
              type="button"
              className={
                mode === 'compare'
                  ? `${shared.btn} ${shared.btnPrimary}`
                  : `${shared.btn} ${shared.btnSecondary}`
              }
              onClick={handleModeCompare}
            >
              {t.modeCompare}
            </button>
          </div>
        </div>

        {contextLine ? <p className={styles.contextLine}>{contextLine}</p> : null}

        {mode === 'read' ? (
          <>
            <p className={styles.question}>{t.questionRead}</p>
            <p className={styles.readSubtext}>{t.readSubtext}</p>
            <div className={styles.rulerWrap}>
              <div className={styles.rulerCard}>
                <div className={styles.rulerLegend}>
                  <span className={styles.greenSwatch} aria-hidden />
                  <span>{t.measureThisLabel}</span>
                </div>
                <RulerView
                  lengthCm={currentRead.lengthCm}
                  cmLabel={t.cm}
                  ariaLabel={t.rulerAria}
                />
              </div>
            </div>
            <fieldset className={styles.readChoices}>
              <legend className={styles.chooseLegend}>{t.choosePrompt}</legend>
              <div className={styles.choiceGrid}>
                {readChoiceValues.map((cm) => {
                  const selected = selectedCm === cm;
                  return (
                    <button
                      key={cm}
                      type="button"
                      className={`${shared.btn} ${styles.choiceBtn} ${
                        selected ? shared.btnPrimary : shared.btnSecondary
                      }`}
                      onClick={() => handleSelectCm(cm)}
                      disabled={feedback === 'correct'}
                      aria-pressed={selected}
                    >
                      {cm} {t.cm}
                    </button>
                  );
                })}
              </div>
            </fieldset>
            <p className={styles.pickHint}>
              {feedback === 'idle' && selectedCm === null
                ? t.pickLengthFirst
                : feedback === 'idle' && selectedCm !== null
                  ? t.checkReady
                  : feedback === 'wrong'
                    ? t.pickAnother
                    : ''}
            </p>
            <div className={shared.controlButtons}>
              <button
                type="button"
                className={`${shared.btn} ${shared.btnPrimary}`}
                onClick={handleCheckRead}
                disabled={selectedCm === null || feedback === 'correct'}
              >
                {t.check}
              </button>
            </div>
          </>
        ) : currentCompare.kind === 'two' ? (
          <>
            <p className={styles.question}>{t.questionCompareTwo}</p>
            <LengthCompare
              lengthsCm={[currentCompare.aCm, currentCompare.bCm]}
              barLabels={[t.barA, t.barB]}
            />
            <div className={styles.compareActions}>
              <button
                type="button"
                className={`${shared.btn} ${shared.btnSecondary}`}
                onClick={() => handleCompareTwoAnswer('first')}
                disabled={feedback === 'correct'}
              >
                {t.firstLonger}
              </button>
              <button
                type="button"
                className={`${shared.btn} ${shared.btnSecondary}`}
                onClick={() => handleCompareTwoAnswer('second')}
                disabled={feedback === 'correct'}
              >
                {t.secondLonger}
              </button>
              <button
                type="button"
                className={`${shared.btn} ${shared.btnSecondary}`}
                onClick={() => handleCompareTwoAnswer('same')}
                disabled={feedback === 'correct'}
              >
                {t.sameLength}
              </button>
            </div>
          </>
        ) : (
          displayedThreeLengths && (
            <>
              <p className={styles.question}>{t.questionCompareThree}</p>
              <LengthCompare
                lengthsCm={[...displayedThreeLengths]}
                barLabels={[...threeBarLabels]}
              />
              <div className={styles.compareActions}>
                {[0, 1, 2].map((displayIdx) => (
                  <button
                    key={displayIdx}
                    type="button"
                    className={`${shared.btn} ${shared.btnSecondary}`}
                    onClick={() => handleCompareThreeAnswer(displayIdx)}
                    disabled={feedback === 'correct'}
                  >
                    {threeBarLabels[displayIdx]}
                  </button>
                ))}
              </div>
            </>
          )
        )}

        <div className={styles.feedbackRow}>
          {feedback === 'correct' ? (
            <span className={shared.feedbackCorrect}>{t.correct}</span>
          ) : null}
          {feedback === 'wrong' ? (
            <span className={shared.feedbackIncorrect}>{t.tryAgain}</span>
          ) : null}
        </div>

        {feedback === 'correct' ? (
          <div className={styles.nextRow}>
            <button
              type="button"
              className={`${shared.btn} ${shared.btnPrimary}`}
              onClick={mode === 'read' ? handleNextRead : handleNextCompare}
            >
              {t.next}
            </button>
          </div>
        ) : null}
      </div>
    </div>
  );
}

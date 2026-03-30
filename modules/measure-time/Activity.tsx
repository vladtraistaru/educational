'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { useLanguage } from '@/lib/language';
import type { Language } from '@/lib/language-config';
import type { ActivityProps } from '@/lib/types';
import shared from '@/modules/activity.module.css';
import TimeExercises, { type FeedbackState } from './TimeExercises';
import translations from './translations';
import type { ClockTime, ExerciseKind, MinuteStep, TimeQuestion } from './timeItems';
import {
  LEVEL_STEPS,
  generateQuestion,
  snapClockTime,
  timesEqual,
} from './timeItems';
import styles from './Activity.module.css';

const KINDS: ExerciseKind[] = [
  'analog_to_digital',
  'digital_to_analog',
  'set_clock',
  'duration',
  'before_after',
];

function newRoundState(
  kind: ExerciseKind,
  step: MinuteStep,
  language: Language,
): {
  question: TimeQuestion;
  userSetTime: ClockTime;
} {
  return {
    question: generateQuestion(kind, step, language),
    userSetTime: snapClockTime({ hours: 10, minutes: 0 }, step),
  };
}

export default function MeasureTimeActivity(_props: ActivityProps) {
  const { language } = useLanguage();
  const t = translations[language];
  const [kind, setKind] = useState<ExerciseKind>('analog_to_digital');
  const [step, setStep] = useState<MinuteStep>(60);
  const [question, setQuestion] = useState<TimeQuestion>(() =>
    newRoundState('analog_to_digital', 60, language).question,
  );
  const [feedback, setFeedback] = useState<FeedbackState>({ status: 'idle' });
  const [chosenTime, setChosenTime] = useState<ClockTime | null>(null);
  const [chosenDuration, setChosenDuration] = useState<number | null>(null);
  const [userSetTime, setUserSetTime] = useState<ClockTime>(() =>
    newRoundState('analog_to_digital', 60, language).userSetTime,
  );

  const loadRound = useCallback(() => {
    const { question: q, userSetTime: u } = newRoundState(kind, step, language);
    setQuestion(q);
    setFeedback({ status: 'idle' });
    setChosenTime(null);
    setChosenDuration(null);
    setUserSetTime(u);
  }, [kind, step, language]);

  const prevDeps = useRef<{ k: ExerciseKind; s: MinuteStep; l: Language } | null>(
    null,
  );
  useEffect(() => {
    const p = prevDeps.current;
    if (p && p.k === kind && p.s === step && p.l === language) {
      return;
    }
    prevDeps.current = { k: kind, s: step, l: language };
    if (p === null) {
      return;
    }
    loadRound();
  }, [kind, step, language, loadRound]);

  const onPickClockTime = useCallback(
    (picked: ClockTime) => {
      if (feedback.status === 'answered') return;
      let correct = false;
      if (question.kind === 'analog_to_digital' || question.kind === 'digital_to_analog') {
        correct = timesEqual(picked, question.correct);
      } else if (question.kind === 'before_after') {
        correct = timesEqual(picked, question.earlier);
      }
      setChosenTime(picked);
      setFeedback({ status: 'answered', correct });
    },
    [feedback.status, question],
  );

  const onPickDurationMinutes = useCallback(
    (m: number) => {
      if (feedback.status === 'answered' || question.kind !== 'duration') return;
      const correct = m === question.durationMinutes;
      setChosenDuration(m);
      setFeedback({ status: 'answered', correct });
    },
    [feedback.status, question],
  );

  const onSubmitSetClock = useCallback(() => {
    if (feedback.status === 'answered' || question.kind !== 'set_clock') return;
    const correct = timesEqual(userSetTime, question.target);
    setFeedback({ status: 'answered', correct });
  }, [feedback.status, question, userSetTime]);

  return (
    <div className={shared.activityArea}>
      <div className={shared.controlsBar}>
        <div className={shared.controlGroup}>
          <label htmlFor="measure-time-kind">{t.exerciseLabel}</label>
          <select
            id="measure-time-kind"
            value={kind}
            onChange={(e) => setKind(e.target.value as ExerciseKind)}
          >
            {KINDS.map((k) => (
              <option key={k} value={k}>
                {k === 'analog_to_digital' && t.analogToDigital}
                {k === 'digital_to_analog' && t.digitalToAnalog}
                {k === 'set_clock' && t.setClock}
                {k === 'duration' && t.duration}
                {k === 'before_after' && t.beforeAfter}
              </option>
            ))}
          </select>
        </div>
        <div className={shared.controlGroup}>
          <label htmlFor="measure-time-step">{t.levelLabel}</label>
          <select
            id="measure-time-step"
            value={step}
            onChange={(e) => setStep(Number(e.target.value) as MinuteStep)}
          >
            {LEVEL_STEPS.map((s) => (
              <option key={s} value={s}>
                {t.levels[String(s) as keyof typeof t.levels]}
              </option>
            ))}
          </select>
        </div>
      </div>

      <TimeExercises
        question={question}
        lang={language}
        texts={t}
        minuteStep={step}
        feedback={feedback}
        chosenTime={chosenTime}
        chosenDuration={chosenDuration}
        userSetTime={userSetTime}
        onUserSetTime={(u) => setUserSetTime(snapClockTime(u, step))}
        onPickClockTime={onPickClockTime}
        onPickDurationMinutes={onPickDurationMinutes}
        onSubmitSetClock={onSubmitSetClock}
      />

      <div className={styles.feedbackLine}>
        {feedback.status === 'answered' && (
          <span
            className={
              feedback.correct ? shared.feedbackCorrect : shared.feedbackIncorrect
            }
          >
            {feedback.correct ? t.correct : t.wrong}
          </span>
        )}
      </div>

      {feedback.status === 'answered' && (
        <div className={styles.nextRow}>
          <button type="button" className={shared.btnSecondary} onClick={loadRound}>
            {t.nextQuestion}
          </button>
        </div>
      )}
    </div>
  );
}

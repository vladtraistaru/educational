'use client';

import type { Language } from '@/lib/language-config';
import AnalogClock from './AnalogClock';
import DigitalTimePicker from './DigitalTimePicker';
import type { MeasureTimeTranslations } from './translations';
import type { ClockTime, MinuteStep, TimeQuestion } from './timeItems';
import {
  formatDigitalTime,
  formatDurationMinutes,
  timeKey,
  timesEqual,
} from './timeItems';
import shared from '@/modules/activity.module.css';
import styles from './Activity.module.css';

export type FeedbackState =
  | { status: 'idle' }
  | { status: 'answered'; correct: boolean };

function optionClass(
  feedback: FeedbackState,
  isCorrectOption: boolean,
  isThisChosen: boolean,
): string {
  if (feedback.status === 'idle') return styles.optionBtn;
  if (isCorrectOption) return `${styles.optionBtn} ${styles.optionCorrect}`;
  if (isThisChosen) return `${styles.optionBtn} ${styles.optionWrong}`;
  return `${styles.optionBtn} ${styles.optionDimmed}`;
}

interface TimeExercisesProps {
  question: TimeQuestion;
  lang: Language;
  texts: MeasureTimeTranslations;
  minuteStep: MinuteStep;
  feedback: FeedbackState;
  chosenTime: ClockTime | null;
  chosenDuration: number | null;
  userSetTime: ClockTime;
  onUserSetTime: (t: ClockTime) => void;
  onPickClockTime: (t: ClockTime) => void;
  onPickDurationMinutes: (m: number) => void;
  onSubmitSetClock: () => void;
}

export default function TimeExercises({
  question,
  lang,
  texts,
  minuteStep,
  feedback,
  chosenTime,
  chosenDuration,
  userSetTime,
  onUserSetTime,
  onPickClockTime,
  onPickDurationMinutes,
  onSubmitSetClock,
}: TimeExercisesProps) {
  if (question.kind === 'analog_to_digital') {
    const { correct, options } = question;
    return (
      <div className={styles.exerciseBlock}>
        <p className={styles.prompt}>{texts.whichDigital}</p>
        <AnalogClock time={correct} minuteStep={minuteStep} size={240} />
        <div className={styles.optionsGrid}>
          {options.map((opt) => {
            const isCorrectOption = timesEqual(opt, correct);
            const isThisChosen =
              chosenTime !== null &&
              timesEqual(opt, chosenTime) &&
              feedback.status === 'answered';
            return (
              <button
                key={timeKey(opt)}
                type="button"
                className={optionClass(feedback, isCorrectOption, isThisChosen)}
                disabled={feedback.status === 'answered'}
                onClick={() => onPickClockTime(opt)}
              >
                {formatDigitalTime(opt, lang)}
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  if (question.kind === 'digital_to_analog') {
    const { correct, options } = question;
    return (
      <div className={styles.exerciseBlock}>
        <p className={styles.prompt}>{texts.whichClock}</p>
        <p className={styles.digitalPrompt}>{formatDigitalTime(correct, lang)}</p>
        <div className={styles.clockOptionsGrid}>
          {options.map((opt) => {
            const isCorrectOption = timesEqual(opt, correct);
            const isThisChosen =
              chosenTime !== null &&
              timesEqual(opt, chosenTime) &&
              feedback.status === 'answered' &&
              !isCorrectOption;
            return (
              <button
                key={timeKey(opt)}
                type="button"
                className={styles.clockOptionBtn}
                disabled={feedback.status === 'answered'}
                onClick={() => onPickClockTime(opt)}
              >
                <AnalogClock
                  time={opt}
                  minuteStep={minuteStep}
                  size={140}
                  className={
                    feedback.status === 'answered'
                      ? isCorrectOption
                        ? styles.clockOptionCorrect
                        : isThisChosen
                          ? styles.clockOptionWrong
                          : styles.clockOptionDimmed
                      : undefined
                  }
                />
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  if (question.kind === 'set_clock') {
    const { target } = question;
    return (
      <div className={styles.exerciseBlock}>
        <p className={styles.prompt}>
          {texts.setTheClockTo}{' '}
          <strong>{formatDigitalTime(target, lang)}</strong>
        </p>
        <div className={styles.setClockRow}>
          <AnalogClock
            time={userSetTime}
            minuteStep={minuteStep}
            size={260}
            interactive
            onChange={onUserSetTime}
          />
          <DigitalTimePicker
            value={userSetTime}
            minuteStep={minuteStep}
            onChange={onUserSetTime}
            labels={{ hour: texts.pickerHour, minute: texts.pickerMinute }}
          />
        </div>
        <div className={shared.controlButtons}>
          <button
            type="button"
            className={shared.btnPrimary}
            disabled={feedback.status === 'answered'}
            onClick={onSubmitSetClock}
          >
            {texts.check}
          </button>
        </div>
      </div>
    );
  }

  if (question.kind === 'duration') {
    const { start, end, durationMinutes, options } = question;
    return (
      <div className={styles.exerciseBlock}>
        <p className={styles.prompt}>{texts.durationPrompt}</p>
        <div className={styles.durationRow}>
          <div>
            <div className={styles.durationLabel}>{formatDigitalTime(start, lang)}</div>
            <AnalogClock time={start} minuteStep={minuteStep} size={160} />
          </div>
          <span className={styles.durationArrow} aria-hidden>
            →
          </span>
          <div>
            <div className={styles.durationLabel}>{formatDigitalTime(end, lang)}</div>
            <AnalogClock time={end} minuteStep={minuteStep} size={160} />
          </div>
        </div>
        <div className={styles.optionsGrid}>
          {options.map((m) => {
            const isCorrectOption = m === durationMinutes;
            const isThisChosen =
              chosenDuration === m && feedback.status === 'answered' && !isCorrectOption;
            return (
              <button
                key={m}
                type="button"
                className={optionClass(feedback, isCorrectOption, isThisChosen)}
                disabled={feedback.status === 'answered'}
                onClick={() => onPickDurationMinutes(m)}
              >
                {formatDurationMinutes(m, lang)}
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  if (question.kind === 'before_after') {
    const { earlier, later, labelEarlier, labelLater, firstIsEarlier } = question;
    const cards = firstIsEarlier
      ? [
          { label: labelEarlier, time: earlier, key: 'e' as const },
          { label: labelLater, time: later, key: 'l' as const },
        ]
      : [
          { label: labelLater, time: later, key: 'l' as const },
          { label: labelEarlier, time: earlier, key: 'e' as const },
        ];
    return (
      <div className={styles.exerciseBlock}>
        <p className={styles.prompt}>{texts.whichHappensFirst}</p>
        <div className={styles.eventCards}>
          {cards.map((c) => (
            <div key={c.key} className={styles.eventCard}>
              <strong>{c.label}</strong>
              <span className={styles.eventTime}>{formatDigitalTime(c.time, lang)}</span>
              <AnalogClock time={c.time} minuteStep={minuteStep} size={120} />
            </div>
          ))}
        </div>
        <div className={styles.optionsGrid}>
          <button
            type="button"
            className={optionClass(feedback, true, false)}
            disabled={feedback.status === 'answered'}
            onClick={() => onPickClockTime(earlier)}
          >
            {labelEarlier}
          </button>
          <button
            type="button"
            className={optionClass(
              feedback,
              false,
              chosenTime !== null &&
                timesEqual(chosenTime, later) &&
                feedback.status === 'answered',
            )}
            disabled={feedback.status === 'answered'}
            onClick={() => onPickClockTime(later)}
          >
            {labelLater}
          </button>
        </div>
      </div>
    );
  }

  return null;
}

'use client';

import type { ClockTime, MinuteStep } from './timeItems';
import styles from './Activity.module.css';

export interface DigitalTimePickerProps {
  value: ClockTime;
  minuteStep: MinuteStep;
  onChange: (t: ClockTime) => void;
  labels: { hour: string; minute: string };
}

function minuteChoices(step: MinuteStep): number[] {
  const out: number[] = [];
  for (let m = 0; m < 60; m += step) out.push(m);
  return out;
}

export default function DigitalTimePicker({
  value,
  minuteStep,
  onChange,
  labels,
}: DigitalTimePickerProps) {
  const minutes = minuteChoices(minuteStep);

  return (
    <div className={styles.digitalPicker}>
      <label className={styles.pickerField}>
        <span>{labels.hour}</span>
        <select
          className={styles.pickerSelect}
          value={value.hours}
          onChange={(e) =>
            onChange({ hours: Number(e.target.value), minutes: value.minutes })
          }
        >
          {Array.from({ length: 24 }, (_, h) => (
            <option key={h} value={h}>
              {String(h).padStart(2, '0')}
            </option>
          ))}
        </select>
      </label>
      <label className={styles.pickerField}>
        <span>{labels.minute}</span>
        <select
          className={styles.pickerSelect}
          value={value.minutes}
          onChange={(e) =>
            onChange({
              hours: value.hours,
              minutes: Number(e.target.value),
            })
          }
        >
          {minutes.map((m) => (
            <option key={m} value={m}>
              {String(m).padStart(2, '0')}
            </option>
          ))}
        </select>
      </label>
    </div>
  );
}

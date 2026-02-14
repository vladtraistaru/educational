'use client';

import { useState, useCallback, type ComponentType } from 'react';
import type { ActivityProps } from '@/lib/types';
import shared from '@/modules/activity.module.css';
import styles from './Activity.module.css';
import ConnectDots from './ConnectDots';
import ExtendLine from './ExtendLine';
import DrawCircle from './DrawCircle';
import RightAngles from './RightAngles';
import ParallelLines from './ParallelLines';

interface Postulate {
  title: string;
  description: string;
  accentClass: string;
  hint: string;
  Visual: ComponentType;
}

const POSTULATES: Postulate[] = [
  {
    title: 'Connect Any Two Dots',
    description: 'You can always draw a straight line between any two dots.',
    accentClass: styles.accent1,
    hint: 'Tap one dot, then tap another!',
    Visual: ConnectDots,
  },
  {
    title: 'Lines Go On Forever',
    description: 'A line can always be made longer — it never has to stop!',
    accentClass: styles.accent2,
    hint: 'Drag the handles to stretch the line.',
    Visual: ExtendLine,
  },
  {
    title: 'Perfect Circles',
    description: 'Pick any dot and any size — you can always draw a perfect circle.',
    accentClass: styles.accent3,
    hint: 'Click and drag to draw a circle.',
    Visual: DrawCircle,
  },
  {
    title: 'Right Angles Are Always Equal',
    description: 'Every L-shaped corner is exactly the same size — always 90°.',
    accentClass: styles.accent4,
    hint: 'Press Compare to see them overlap!',
    Visual: RightAngles,
  },
  {
    title: 'Parallel Lines Never Meet',
    description: 'Some lines run side by side and never cross, no matter how far they go.',
    accentClass: styles.accent5,
    hint: 'Press Extend to see them grow!',
    Visual: ParallelLines,
  },
];

export default function EuclideanPostulates(_props: ActivityProps) {
  const [step, setStep] = useState(0);

  const goNext = useCallback(() => setStep((s) => Math.min(s + 1, POSTULATES.length - 1)), []);
  const goPrev = useCallback(() => setStep((s) => Math.max(s - 1, 0)), []);

  const postulate = POSTULATES[step];
  const { Visual } = postulate;

  return (
    <>
      {/* Step dots */}
      <div className={styles.stepper}>
        {POSTULATES.map((p, i) => (
          <button
            key={i}
            className={`${i === step ? styles.stepDotActive : styles.stepDot} ${p.accentClass}`}
            onClick={() => setStep(i)}
            aria-label={`Rule ${i + 1}`}
          />
        ))}
      </div>

      {/* Postulate card */}
      <div className={`${styles.card} ${postulate.accentClass}`}>
        <div className={styles.cardHeader}>
          <p className={styles.ruleNumber}>Rule {step + 1} of {POSTULATES.length}</p>
          <h2 className={styles.ruleTitle}>{postulate.title}</h2>
          <p className={styles.ruleDescription}>{postulate.description}</p>
        </div>

        <Visual key={step} />

        <p className={styles.hint}>{postulate.hint}</p>
      </div>

      {/* Navigation */}
      <div className={styles.navRow}>
        <button
          className={shared.btnSecondary}
          onClick={goPrev}
          disabled={step === 0}
        >
          Previous
        </button>
        <span className={styles.stepLabel}>
          {step + 1} / {POSTULATES.length}
        </span>
        <button
          className={shared.btnPrimary}
          onClick={goNext}
          disabled={step === POSTULATES.length - 1}
        >
          Next
        </button>
      </div>
    </>
  );
}

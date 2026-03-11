'use client';

import { useState, useCallback, type ComponentType } from 'react';
import type { ActivityProps } from '@/lib/types';
import { useLanguage } from '@/lib/language';
import shared from '@/modules/activity.module.css';
import styles from './Activity.module.css';
import translations from './translations';
import ConnectDots from './ConnectDots';
import ExtendLine from './ExtendLine';
import DrawCircle from './DrawCircle';
import RightAngles from './RightAngles';
import ParallelLines from './ParallelLines';

const ACCENT_CLASSES = [
  styles.accent1,
  styles.accent2,
  styles.accent3,
  styles.accent4,
  styles.accent5,
];

const VISUALS: ComponentType[] = [
  ConnectDots,
  ExtendLine,
  DrawCircle,
  RightAngles,
  ParallelLines,
];

export default function EuclideanPostulates(_props: ActivityProps) {
  const [step, setStep] = useState(0);
  const { language } = useLanguage();
  const t = translations[language];
  const total = t.postulates.length;

  const goNext = useCallback(() => setStep((s) => Math.min(s + 1, total - 1)), [total]);
  const goPrev = useCallback(() => setStep((s) => Math.max(s - 1, 0)), []);

  const postulate = t.postulates[step];
  const Visual = VISUALS[step];
  const accent = ACCENT_CLASSES[step];
  const ruleLabel = t.ruleOf.replace('{n}', String(step + 1)).replace('{total}', String(total));

  return (
    <>
      <div className={styles.stepper}>
        {ACCENT_CLASSES.map((ac, i) => (
          <button
            key={i}
            className={`${i === step ? styles.stepDotActive : styles.stepDot} ${ac}`}
            onClick={() => setStep(i)}
            aria-label={`${t.ruleOf.replace('{n}', String(i + 1)).replace('{total}', String(total))}`}
          />
        ))}
      </div>

      <div className={`${styles.card} ${accent}`}>
        <div className={styles.cardHeader}>
          <p className={styles.ruleNumber}>{ruleLabel}</p>
          <h2 className={styles.ruleTitle}>{postulate.title}</h2>
          <p className={styles.ruleDescription}>{postulate.description}</p>
        </div>

        <Visual key={step} />

        <p className={styles.hint}>{postulate.hint}</p>
      </div>

      <div className={styles.navRow}>
        <button
          className={shared.btnSecondary}
          onClick={goPrev}
          disabled={step === 0}
        >
          {t.previous}
        </button>
        <span className={styles.stepLabel}>
          {step + 1} / {total}
        </span>
        <button
          className={shared.btnPrimary}
          onClick={goNext}
          disabled={step === total - 1}
        >
          {t.next}
        </button>
      </div>
    </>
  );
}

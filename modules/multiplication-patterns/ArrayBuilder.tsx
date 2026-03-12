'use client';

import { useMemo } from 'react';
import { useLanguage } from '@/lib/language';
import translations from './translations';
import styles from './Activity.module.css';

const ROW_COLORS = [
  '#ff6b6b', '#ffa502', '#ffd43b', '#51cf66', '#20c997',
  '#22b8cf', '#339af0', '#5c7cfa', '#7950f2', '#cc5de8',
  '#f06595', '#e8590c',
];

interface ArrayBuilderProps {
  factorA: number;
  factorB: number;
  onChangeA: (n: number) => void;
  onChangeB: (n: number) => void;
  onFlip: () => void;
}

export default function ArrayBuilder({
  factorA,
  factorB,
  onChangeA,
  onChangeB,
  onFlip,
}: ArrayBuilderProps) {
  const { language } = useLanguage();
  const t = translations[language];
  const product = factorA * factorB;

  const dots = useMemo(() => {
    const result: { row: number; col: number; color: string }[] = [];
    for (let r = 0; r < factorA; r++) {
      for (let c = 0; c < factorB; c++) {
        result.push({ row: r, col: c, color: ROW_COLORS[r % ROW_COLORS.length] });
      }
    }
    return result;
  }, [factorA, factorB]);

  return (
    <div className={styles.arraySection}>
      <h3 className={styles.sectionTitle}>{t.arrayBuilder}</h3>

      <div className={styles.equationRow}>
        <TappableNumber
          value={factorA}
          onChange={onChangeA}
        />
        <span className={styles.equationOperator}>×</span>
        <TappableNumber
          value={factorB}
          onChange={onChangeB}
        />
        <span className={styles.equationOperator}>=</span>
        <span className={styles.equationResult}>{product}</span>
      </div>

      <button className={styles.flipBtn} onClick={onFlip}>
        ⇄ {t.flipIt}
      </button>

      <div
        className={styles.dotGrid}
        style={{
          gridTemplateColumns: `repeat(${factorB}, 1fr)`,
          gridTemplateRows: `repeat(${factorA}, 1fr)`,
        }}
      >
        {dots.map((d) => (
          <div
            key={`${d.row}-${d.col}`}
            className={styles.dot}
            style={{
              backgroundColor: d.color,
              animationDelay: `${(d.row * factorB + d.col) * 20}ms`,
            }}
          />
        ))}
      </div>
    </div>
  );
}

function TappableNumber({
  value,
  onChange,
}: {
  value: number;
  onChange: (n: number) => void;
}) {
  return (
    <div className={styles.tappableNumber}>
      <button
        className={styles.chevronBtn}
        onClick={() => onChange(Math.min(12, value + 1))}
        disabled={value >= 12}
        aria-label="Increase"
      >
        ▲
      </button>
      <span className={styles.numberValue}>{value}</span>
      <button
        className={styles.chevronBtn}
        onClick={() => onChange(Math.max(1, value - 1))}
        disabled={value <= 1}
        aria-label="Decrease"
      >
        ▼
      </button>
    </div>
  );
}

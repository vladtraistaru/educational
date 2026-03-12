'use client';

import { useLanguage } from '@/lib/language';
import translations from './translations';
import {
  patterns,
  getNinesDigitSum,
  getOnesDigitCycle,
  getDoublingChainNumbers,
  DOUBLING_CHAINS,
  lcm,
  ONES_DIGIT_COLORS,
  DIGIT_SUM_COLORS,
} from './patterns';
import DigitStar from './DigitStar';
import styles from './Activity.module.css';

interface PatternPanelProps {
  activePatternId: string | null;
  onSelectPattern: (id: string | null) => void;
  selectedTimesTable: number;
  onSelectTimesTable: (n: number) => void;
  selectedChain: number;
  onSelectChain: (id: number) => void;
  overlapA: number;
  overlapB: number;
  onSelectOverlapA: (n: number) => void;
  onSelectOverlapB: (n: number) => void;
}

const NUMBERS_1_12 = Array.from({ length: 12 }, (_, i) => i + 1);

export default function PatternPanel({
  activePatternId,
  onSelectPattern,
  selectedTimesTable,
  onSelectTimesTable,
  selectedChain,
  onSelectChain,
  overlapA,
  overlapB,
  onSelectOverlapA,
  onSelectOverlapB,
}: PatternPanelProps) {
  const { language } = useLanguage();
  const t = translations[language];
  const activeTranslation = activePatternId
    ? t.patterns[activePatternId]
    : null;

  return (
    <div className={styles.patternSection}>
      <h3 className={styles.sectionTitle}>{t.patternExplorer}</h3>

      <div className={styles.patternButtons}>
        {patterns.map((p) => {
          const pt = t.patterns[p.id];
          const isActive = activePatternId === p.id;
          return (
            <button
              key={p.id}
              className={
                isActive ? styles.patternBtnActive : styles.patternBtn
              }
              style={isActive ? { backgroundColor: p.color, borderColor: p.color } : undefined}
              onClick={() => onSelectPattern(isActive ? null : p.id)}
            >
              <span className={styles.patternIcon}>{p.icon}</span>
              {pt?.label ?? p.id}
            </button>
          );
        })}
      </div>

      {activeTranslation && (
        <p className={styles.patternDescription}>{activeTranslation.description}</p>
      )}

      {(activePatternId === 'times-table' || activePatternId === 'ones-digit') && (
        <NumberPicker
          label={t.pickNumber}
          value={selectedTimesTable}
          onChange={onSelectTimesTable}
        />
      )}

      {activePatternId === 'ones-digit' && (
        <>
          <OnesDigitCycleDisplay number={selectedTimesTable} t={t} />
          <p className={styles.patternHint}>{t.onesDigitStar}</p>
          <DigitStar number={selectedTimesTable} />
        </>
      )}

      {activePatternId === 'commutativity' && (
        <p className={styles.patternHint}>{t.tapCell}</p>
      )}

      {activePatternId === 'nines-trick' && (
        <div className={styles.ninesShowcase}>
          {NUMBERS_1_12.map((n) => {
            const { product, digits, sum } = getNinesDigitSum(n);
            return (
              <div key={n} className={styles.ninesRow}>
                <span className={styles.ninesCalc}>
                  9 × {n} = {product}
                </span>
                <span className={styles.ninesArrow}>→</span>
                <span className={styles.ninesSum}>
                  {digits} = {sum}
                </span>
              </div>
            );
          })}
        </div>
      )}

      {activePatternId === 'doubling' && (
        <DoublingPanel
          selectedChain={selectedChain}
          onSelectChain={onSelectChain}
          selectedTimesTable={selectedTimesTable}
          t={t}
        />
      )}

      {activePatternId === 'digit-sum' && (
        <DigitSumLegend t={t} />
      )}

      {activePatternId === 'multiples-overlap' && (
        <OverlapPanel
          overlapA={overlapA}
          overlapB={overlapB}
          onSelectA={onSelectOverlapA}
          onSelectB={onSelectOverlapB}
          t={t}
        />
      )}
    </div>
  );
}

function NumberPicker({
  label,
  value,
  onChange,
  color,
}: {
  label: string;
  value: number;
  onChange: (n: number) => void;
  color?: string;
}) {
  return (
    <div className={styles.numberPicker}>
      <span className={styles.pickerLabel}>{label}:</span>
      <div className={styles.pickerNumbers}>
        {NUMBERS_1_12.map((n) => (
          <button
            key={n}
            className={n === value ? styles.pickerNumActive : styles.pickerNum}
            style={n === value && color ? { background: color, borderColor: color } : undefined}
            onClick={() => onChange(n)}
          >
            {n}
          </button>
        ))}
      </div>
    </div>
  );
}

function OnesDigitCycleDisplay({
  number,
  t,
}: {
  number: number;
  t: typeof translations.en;
}) {
  const cycle = getOnesDigitCycle(number);
  const uniqueCycle = getUniqueCycleLength(cycle);
  const multiples = Array.from({ length: 12 }, (_, i) => number * (i + 1));

  return (
    <div className={styles.cycleDisplay}>
      <span className={styles.pickerLabel}>{t.onesDigitExample}</span>
      <div className={styles.multiplesRow}>
        {multiples.map((product, i) => {
          const lastDigit = product % 10;
          const productStr = String(product);
          const prefix = productStr.slice(0, -1);
          return (
            <span key={i} className={styles.multipleItem}>
              {prefix}
              <span
                className={styles.multipleLastDigit}
                style={{ color: ONES_DIGIT_COLORS[lastDigit] }}
              >
                {lastDigit}
              </span>
            </span>
          );
        })}
      </div>

      <span className={styles.pickerLabel}>{t.onesDigitCycle}:</span>
      <div className={styles.cycleBadges}>
        {cycle.map((digit, i) => (
          <span
            key={i}
            className={styles.cycleBadge}
            style={{ backgroundColor: ONES_DIGIT_COLORS[digit] }}
          >
            {digit}
          </span>
        ))}
      </div>
      <span className={styles.cycleLength}>
        {uniqueCycle} {t.cycleLength}
      </span>
    </div>
  );
}

function getUniqueCycleLength(cycle: number[]): number {
  for (let len = 1; len <= cycle.length; len++) {
    let repeats = true;
    for (let i = len; i < cycle.length; i++) {
      if (cycle[i] !== cycle[i % len]) { repeats = false; break; }
    }
    if (repeats) return len;
  }
  return cycle.length;
}

function DoublingPanel({
  selectedChain,
  onSelectChain,
  selectedTimesTable,
  t,
}: {
  selectedChain: number;
  onSelectChain: (id: number) => void;
  selectedTimesTable: number;
  t: typeof translations.en;
}) {
  const chainNumbers = getDoublingChainNumbers(selectedChain);
  const col = selectedTimesTable;

  return (
    <div className={styles.doublingPanel}>
      <div className={styles.chainSelector}>
        <span className={styles.pickerLabel}>{t.selectChain}:</span>
        {DOUBLING_CHAINS.map((c) => (
          <button
            key={c.id}
            className={c.id === selectedChain ? styles.chainBtnActive : styles.chainBtn}
            onClick={() => onSelectChain(c.id)}
          >
            {c.label}
          </button>
        ))}
      </div>
      <div className={styles.doublingExamples}>
        {chainNumbers.map((n, i) => (
          <span key={n} className={styles.doublingItem}>
            {n}×{col} = {n * col}
            {i < chainNumbers.length - 1 && (
              <span className={styles.doublingArrow}>→ ×2 →</span>
            )}
          </span>
        ))}
        <span className={styles.doublingLabel}>{t.eachDoubles}</span>
      </div>
    </div>
  );
}

function DigitSumLegend({ t }: { t: typeof translations.en }) {
  return (
    <div className={styles.digitSumLegend}>
      <span className={styles.pickerLabel}>{t.digitSumLegend}:</span>
      <div className={styles.legendItems}>
        {DIGIT_SUM_COLORS.slice(1).map((color, i) => (
          <span
            key={i + 1}
            className={styles.legendItem}
            style={{ backgroundColor: color }}
          >
            {i + 1}
          </span>
        ))}
      </div>
    </div>
  );
}

function OverlapPanel({
  overlapA,
  overlapB,
  onSelectA,
  onSelectB,
  t,
}: {
  overlapA: number;
  overlapB: number;
  onSelectA: (n: number) => void;
  onSelectB: (n: number) => void;
  t: typeof translations.en;
}) {
  const overlapLcm = lcm(overlapA, overlapB);

  return (
    <div className={styles.overlapPanel}>
      <NumberPicker
        label={`${t.multiplesOf} A`}
        value={overlapA}
        onChange={onSelectA}
        color="rgba(9, 132, 227, 0.8)"
      />
      <NumberPicker
        label={`${t.multiplesOf} B`}
        value={overlapB}
        onChange={onSelectB}
        color="rgba(253, 203, 110, 0.9)"
      />
      <p className={styles.overlapResult}>
        {t.overlapAt} <strong>{overlapLcm}</strong>
      </p>
    </div>
  );
}

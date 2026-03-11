import styles from './Activity.module.css';
import { useLanguage } from '@/lib/language';
import translations from './translations';

const SEGMENT_COLORS = [
  styles.segment1,
  styles.segment2,
  styles.segment3,
  styles.segment4,
  styles.segment5,
  styles.segment6,
];

interface BreakdownPanelProps {
  cursorPositions: number[];
  scale: number;
}

export default function BreakdownPanel({
  cursorPositions,
  scale,
}: BreakdownPanelProps) {
  const { language } = useLanguage();
  const t = translations[language];

  const sorted = [...cursorPositions].sort((a, b) => a - b);
  const boundaries = [0, ...sorted, 100];

  const values = [];
  for (let i = 0; i < boundaries.length - 1; i++) {
    const start = (boundaries[i] / 100) * scale;
    const end = (boundaries[i + 1] / 100) * scale;
    values.push(Math.round(end - start));
  }

  const equation = values.join(' + ') + ' = ' + scale;

  return (
    <div className={styles.breakdownPanel}>
      <h2 className={styles.breakdownTitle}>{t.segments}</h2>

      <div className={styles.segmentsList}>
        {values.map((value, i) => (
          <div key={i} className={styles.segmentItem}>
            <div
              className={`${styles.segmentColor} ${SEGMENT_COLORS[i] ?? ''}`}
            />
            <span className={styles.segmentLabel}>{t.part} {i + 1}:</span>
            <span className={styles.segmentNumber}>{value}</span>
          </div>
        ))}
      </div>

      <div className={styles.totalEquation}>{equation}</div>
    </div>
  );
}

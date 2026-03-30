import styles from './Activity.module.css';

const BAR_COLORS = ['#e17055', '#0984e3', '#00b894'];

interface LengthCompareProps {
  lengthsCm: number[];
  barLabels: string[];
}

export default function LengthCompare({
  lengthsCm,
  barLabels,
}: LengthCompareProps) {
  const maxLen = Math.max(...lengthsCm, 1);

  return (
    <div className={styles.compareBars} role="group">
      {lengthsCm.map((cm, i) => (
        <div key={i} className={styles.compareRow}>
          <span className={styles.barLabel}>{barLabels[i] ?? `—`}</span>
          <div className={styles.barTrack}>
            <div
              className={styles.barFill}
              style={{
                width: `${(cm / maxLen) * 100}%`,
                background: BAR_COLORS[i % BAR_COLORS.length],
              }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

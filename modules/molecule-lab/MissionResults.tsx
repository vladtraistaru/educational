import { useLanguage } from '@/lib/language';
import translations from './translations';
import styles from './Activity.module.css';

interface MissionResultsProps {
  solved: number;
  total: number;
  onPlayAgain: () => void;
}

export default function MissionResults({ solved, total, onPlayAgain }: MissionResultsProps) {
  const { language } = useLanguage();
  const t = translations[language];
  const stars = Math.round((solved / total) * 3);

  return (
    <div className={styles.results}>
      <h3 className={styles.resultsTitle}>🧪 {t.results}</h3>
      <div className={styles.starsRow} aria-label={`${stars} / 3`}>
        {[1, 2, 3].map((n) => (
          <span key={n} className={n <= stars ? styles.starEarned : styles.starEmpty}>
            ★
          </span>
        ))}
      </div>
      <p>
        {t.solvedSummary.replace('{solved}', String(solved)).replace('{total}', String(total))}
      </p>
      <button type="button" className={styles.combineBtn} onClick={onPlayAgain}>
        {t.playAgain}
      </button>
    </div>
  );
}

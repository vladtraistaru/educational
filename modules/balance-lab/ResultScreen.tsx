import { useLanguage } from '@/lib/language';
import translations from './translations';
import styles from './Activity.module.css';

interface ResultScreenProps {
  stars: number;
  maxStars: number;
  solved: number;
  predicted: number;
  levelCount: number;
  onPlayAgain: () => void;
}

export default function ResultScreen({
  stars,
  maxStars,
  solved,
  predicted,
  levelCount,
  onPlayAgain,
}: ResultScreenProps) {
  const { language } = useLanguage();
  const t = translations[language];

  return (
    <div className={styles.results}>
      <span className={styles.resultsTrophy}>🏆</span>
      <h3 className={styles.resultsTitle}>{t.results}</h3>

      <div className={styles.starScore}>
        <span className={styles.starScoreValue}>
          ⭐ {stars}
          <span className={styles.starScoreMax}>/{maxStars}</span>
        </span>
        <span className={styles.statLabel}>{t.starsEarned}</span>
      </div>

      <div className={styles.statsRow}>
        <div className={styles.stat}>
          <span className={styles.statValue}>
            {solved}/{levelCount}
          </span>
          <span className={styles.statLabel}>{t.levelsSolved}</span>
        </div>
        <div className={styles.stat}>
          <span className={styles.statValue}>
            {predicted}/{levelCount}
          </span>
          <span className={styles.statLabel}>{t.predictionsRight}</span>
        </div>
      </div>

      <button type="button" className={styles.startBtn} onClick={onPlayAgain}>
        {t.playAgain}
      </button>
    </div>
  );
}

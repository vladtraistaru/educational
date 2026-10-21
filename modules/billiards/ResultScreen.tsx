import { useLanguage } from '@/lib/language';
import translations from './translations';
import styles from './Activity.module.css';

interface ResultScreenProps {
  stars: number;
  maxStars: number;
  solved: number;
  levelCount: number;
  onPlayAgain: () => void;
  onMenu: () => void;
}

export default function ResultScreen({ stars, maxStars, solved, levelCount, onPlayAgain, onMenu }: ResultScreenProps) {
  const { language } = useLanguage();
  const t = translations[language];

  return (
    <div className={styles.results}>
      <span className={styles.resultsTrophy}>🏆</span>
      <h3 className={styles.resultsTitle}>{t.results}</h3>

      <div className={styles.statsRow}>
        <div className={styles.stat}>
          <span className={styles.statValue}>
            ⭐ {stars}/{maxStars}
          </span>
          <span className={styles.statLabel}>{t.starsEarned}</span>
        </div>
        <div className={styles.stat}>
          <span className={styles.statValue}>
            {solved}/{levelCount}
          </span>
          <span className={styles.statLabel}>{t.levelsSolved}</span>
        </div>
      </div>

      <div className={styles.menuButtons}>
        <button type="button" className={styles.startBtn} onClick={onPlayAgain}>
          {t.playAgain}
        </button>
        <button type="button" className={styles.freeBtn} onClick={onMenu}>
          {t.menu}
        </button>
      </div>
    </div>
  );
}

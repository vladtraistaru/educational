'use client';

import { useLanguage } from '@/lib/language';
import translations from './translations';
import { getStars, QUESTIONS_PER_ROUND } from './questions';
import styles from './Activity.module.css';

interface ResultScreenProps {
  score: number;
  correctCount: number;
  onPlayAgain: () => void;
}

export default function ResultScreen({
  score,
  correctCount,
  onPlayAgain,
}: ResultScreenProps) {
  const { language } = useLanguage();
  const t = translations[language];
  const stars = getStars(correctCount);

  return (
    <div className={styles.resultContainer}>
      <div className={styles.starsRow}>
        {[1, 2, 3].map((n) => (
          <span
            key={n}
            className={n <= stars ? styles.starEarned : styles.starEmpty}
          >
            ★
          </span>
        ))}
      </div>

      <div className={styles.finalScore}>
        <span className={styles.finalScoreLabel}>{t.finalScore}</span>
        <span className={styles.finalScoreValue}>{score}</span>
      </div>

      <p className={styles.correctSummary}>
        {t.youGot} <strong>{correctCount}</strong> {t.outOf} {QUESTIONS_PER_ROUND}
      </p>

      <button className={styles.playAgainBtn} onClick={onPlayAgain}>
        {t.playAgain}
      </button>
    </div>
  );
}

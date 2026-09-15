import { useLanguage } from '@/lib/language';
import translations from './translations';
import { getSpecies, getStageIndex, type SpeciesId } from './monsters';
import styles from './Activity.module.css';

interface ResultScreenProps {
  speciesId: SpeciesId;
  score: number;
  correctCount: number;
  bestStreak: number;
  onPlayAgain: () => void;
}

export default function ResultScreen({
  speciesId,
  score,
  correctCount,
  bestStreak,
  onPlayAgain,
}: ResultScreenProps) {
  const { language } = useLanguage();
  const t = translations[language];
  const species = getSpecies(speciesId);
  const stageIndex = getStageIndex(correctCount);
  const monsterEmoji = species.stages[stageIndex];

  return (
    <div className={styles.resultContainer}>
      <h3 className={styles.menuTitle}>{t.gameOver}</h3>

      <span className={styles.resultMonsterEmoji}>{monsterEmoji}</span>
      <p className={styles.resultMonsterLabel}>
        {t.yourMonsterIs} <strong>{t.stageNames[stageIndex]}</strong> {t.species[speciesId]}
      </p>

      <div className={styles.finalScore}>
        <span className={styles.finalScoreLabel}>{t.finalScore}</span>
        <span className={styles.finalScoreValue}>{score}</span>
      </div>

      <div className={styles.resultStatsRow}>
        <div className={styles.resultStat}>
          <span className={styles.resultStatValue}>{correctCount}</span>
          <span className={styles.resultStatLabel}>{t.totalCorrect}</span>
        </div>
        <div className={styles.resultStat}>
          <span className={styles.resultStatValue}>{bestStreak}</span>
          <span className={styles.resultStatLabel}>{t.bestStreak}</span>
        </div>
      </div>

      <button className={styles.playAgainBtn} onClick={onPlayAgain}>
        {t.playAgain}
      </button>
    </div>
  );
}

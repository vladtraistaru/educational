import { useLanguage } from '@/lib/language';
import translations from './translations';
import { getSpecies, getStageIndex, type Quirk, type SpeciesId } from './creatures';
import Creature from './Creature';
import styles from './Activity.module.css';

interface ResultScreenProps {
  speciesId: SpeciesId;
  score: number;
  correctCount: number;
  bestStreak: number;
  quirks: Quirk[];
  onPlayAgain: () => void;
}

export default function ResultScreen({
  speciesId,
  score,
  correctCount,
  bestStreak,
  quirks,
  onPlayAgain,
}: ResultScreenProps) {
  const { language } = useLanguage();
  const t = translations[language];
  const species = getSpecies(speciesId);
  const stageIndex = getStageIndex(correctCount);

  return (
    <div className={styles.resultContainer}>
      <h3 className={styles.menuTitle}>{t.gameOver}</h3>

      <Creature stage={species.stages[stageIndex]} mood="idle" quirks={quirks} />

      <p className={styles.resultCreatureLabel}>
        {t.yourCreatureIs} <strong>{t.stageNames[speciesId][stageIndex]}</strong>
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

      {quirks.length > 0 && (
        <div className={styles.quirkCollection}>
          <span className={styles.resultStatLabel}>{t.collected}</span>
          <span className={styles.quirkCollectionRow}>
            {quirks.map((q) => (
              <span key={q} className={styles.quirkBadge} title={t.quirkLines[q]}>
                {q}
              </span>
            ))}
          </span>
        </div>
      )}

      <button className={styles.playAgainBtn} onClick={onPlayAgain}>
        {t.playAgain}
      </button>
    </div>
  );
}

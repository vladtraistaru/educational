import { useLanguage } from '@/lib/language';
import translations from './translations';
import { getRecipe, getStageIndex, type RecipeId } from './recipes';
import CraftingTable from './CraftingTable';
import styles from './Activity.module.css';

interface ResultScreenProps {
  recipeId: RecipeId;
  score: number;
  correctCount: number;
  bestStreak: number;
  onPlayAgain: () => void;
}

export default function ResultScreen({
  recipeId,
  score,
  correctCount,
  bestStreak,
  onPlayAgain,
}: ResultScreenProps) {
  const { language } = useLanguage();
  const t = translations[language];
  const recipe = getRecipe(recipeId);
  const text = t.recipes[recipeId];
  const stageIndex = getStageIndex(correctCount);
  const found = text.facts.slice(0, stageIndex);

  return (
    <div className={styles.resultContainer}>
      <h3 className={styles.menuTitle}>{t.gameOver}</h3>

      <div className={styles.resultTable}>
        <CraftingTable recipe={recipe} stageIndex={stageIndex} mood="idle" />
      </div>

      <p className={styles.resultRecipeLabel}>
        {t.recipeWas} <strong>{text.name}</strong>
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

      <div className={styles.discoveryList}>
        <span className={styles.resultStatLabel}>{t.discoveries}</span>
        {found.length === 0 ? (
          <span className={styles.discoveryEmpty}>{t.noDiscoveries}</span>
        ) : (
          <ul>
            {found.map((fact) => (
              <li key={fact}>{fact}</li>
            ))}
          </ul>
        )}
      </div>

      <button className={styles.playAgainBtn} onClick={onPlayAgain}>
        {t.playAgain}
      </button>
    </div>
  );
}

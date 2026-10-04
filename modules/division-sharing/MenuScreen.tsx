import { useLanguage } from '@/lib/language';
import translations from './translations';
import { RECIPES, type RecipeId } from './recipes';
import styles from './Activity.module.css';

interface MenuScreenProps {
  onStart: (recipeId: RecipeId) => void;
}

const MYSTERY_SLOTS = Array.from({ length: 9 }, (_, i) => i);

export default function MenuScreen({ onStart }: MenuScreenProps) {
  const { language } = useLanguage();
  const t = translations[language];

  return (
    <div className={styles.menuContainer}>
      <h3 className={styles.menuTitle}>{t.chooseRecipe}</h3>
      <p className={styles.menuHint}>{t.chooseRecipeHint}</p>

      <div className={styles.recipeCards}>
        {RECIPES.map((recipe) => (
          <button
            key={recipe.id}
            className={styles.recipeCard}
            onClick={() => onStart(recipe.id)}
          >
            <span className={styles.mysteryGrid} aria-hidden="true">
              {MYSTERY_SLOTS.map((i) => (
                <span key={i} className={styles.mysterySlot}>
                  {i === 4 ? '?' : ''}
                </span>
              ))}
            </span>
            <span className={styles.recipeCardName}>{t.mysteryRecipe}</span>
            <span className={styles.recipeCardHint}>{t.recipes[recipe.id].hint}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

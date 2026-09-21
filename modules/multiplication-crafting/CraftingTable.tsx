import type { Recipe } from './recipes';
import { CRAFTED_STAGE, GRID_COLUMNS, getVisibleRows } from './recipes';
import PixelIcon from './PixelIcon';
import styles from './Activity.module.css';

export type Mood = 'idle' | 'happy' | 'sad' | 'evolve';

interface CraftingTableProps {
  recipe: Recipe;
  stageIndex: number;
  mood: Mood;
  /** Stage just reached: its new row (or the result) pops in. */
  isNew?: boolean;
}

const MOOD_CLASS: Record<Mood, string> = {
  idle: styles.tableIdle,
  happy: styles.tableHappy,
  sad: styles.tableSad,
  evolve: styles.tableVanish,
};

export default function CraftingTable({ recipe, stageIndex, mood, isNew = false }: CraftingTableProps) {
  const visibleRows = getVisibleRows(stageIndex);
  const crafted = stageIndex >= CRAFTED_STAGE;
  const newRow = isNew && !crafted ? visibleRows - 1 : -1;

  return (
    <div className={styles.tableStage}>
      <div
        className={styles.tableGlow}
        style={{ background: recipe.glow, opacity: 0.12 + stageIndex * 0.1 }}
        aria-hidden="true"
      />

      <div className={`${styles.tableBoard} ${MOOD_CLASS[mood]}`}>
        <div className={styles.craftGrid}>
          {recipe.grid.map((icon, i) => {
            const row = Math.floor(i / GRID_COLUMNS);
            const filled = row < visibleRows;
            return (
              <div key={i} className={styles.slot}>
                {filled && (
                  <PixelIcon
                    id={icon}
                    className={row === newRow ? styles.iconNew : styles.icon}
                  />
                )}
              </div>
            );
          })}
        </div>

        <span className={styles.craftArrow} aria-hidden="true">
          →
        </span>

        <div className={`${styles.slot} ${styles.resultSlot}`}>
          {crafted && (
            <PixelIcon
              id={recipe.result}
              className={isNew ? styles.iconNew : styles.icon}
            />
          )}
        </div>
      </div>
    </div>
  );
}

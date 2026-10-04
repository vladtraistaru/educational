import type { IconId } from './icons';

export type RecipeId = 'chest' | 'ironBlock' | 'bookshelf';

export const GRID_COLUMNS = 3;
export const GRID_ROWS = 3;

export interface Recipe {
  id: RecipeId;
  /** Row-major 3x3 crafting grid; null is an empty slot. */
  grid: (IconId | null)[];
  result: IconId;
  /** Colour of the glow behind the crafting table. */
  glow: string;
}

export const RECIPES: Recipe[] = [
  {
    id: 'chest',
    grid: ['planks', 'planks', 'planks', 'planks', null, 'planks', 'planks', 'planks', 'planks'],
    result: 'chest',
    glow: '#d4a056',
  },
  {
    id: 'ironBlock',
    grid: Array<IconId>(9).fill('ironIngot'),
    result: 'ironBlock',
    glow: '#e0e0e0',
  },
  {
    id: 'bookshelf',
    grid: ['planks', 'planks', 'planks', 'book', 'book', 'book', 'planks', 'planks', 'planks'],
    result: 'bookshelf',
    glow: '#7e57c2',
  },
];

export function getRecipe(id: RecipeId): Recipe {
  return RECIPES.find((r) => r.id === id) ?? RECIPES[0];
}

// Correct answers needed to reach each stage: empty table, row 1, row 2, row 3, crafted.
export const STAGE_THRESHOLDS = [0, 3, 8, 15, 25];
export const CRAFTED_STAGE = STAGE_THRESHOLDS.length - 1;

export function getStageIndex(correctCount: number): number {
  for (let i = STAGE_THRESHOLDS.length - 1; i > 0; i--) {
    if (correctCount >= STAGE_THRESHOLDS[i]) return i;
  }
  return 0;
}

/** How many rows of the grid are filled at a given stage. */
export function getVisibleRows(stageIndex: number): number {
  return Math.min(stageIndex, GRID_ROWS);
}

/** Icons hidden behind the next stage: the next row, or the result once the grid is full. */
export function getNextIcons(recipe: Recipe, stageIndex: number): IconId[] {
  if (stageIndex >= CRAFTED_STAGE) return [];
  if (stageIndex >= GRID_ROWS) return [recipe.result];
  const start = stageIndex * GRID_COLUMNS;
  return recipe.grid
    .slice(start, start + GRID_COLUMNS)
    .filter((icon): icon is IconId => icon !== null);
}

export interface StageProgress {
  stage: number;
  progress: number; // 0-1 toward next stage, 1 if maxed out
  remaining: number; // correct answers still needed to reach the next stage
}

export function getStageProgress(correctCount: number): StageProgress {
  const stage = getStageIndex(correctCount);
  if (stage >= CRAFTED_STAGE) return { stage, progress: 1, remaining: 0 };
  const prev = STAGE_THRESHOLDS[stage];
  const next = STAGE_THRESHOLDS[stage + 1];
  return { stage, progress: (correctCount - prev) / (next - prev), remaining: next - correctCount };
}

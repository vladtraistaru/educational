import { describe, it, expect } from 'vitest';
import { ICONS } from './icons';
import {
  RECIPES,
  CRAFTED_STAGE,
  getNextIcons,
  getStageIndex,
  getStageProgress,
  getVisibleRows,
} from './recipes';

function count(grid: string[], icon: string): number {
  return grid.filter((i) => i === icon).length;
}

describe('icons', () => {
  it('are 8x8', () => {
    for (const [id, art] of Object.entries(ICONS)) {
      expect(art.rows, id).toHaveLength(8);
      for (const row of art.rows) expect(row, id).toHaveLength(8);
    }
  });

  it('only use letters defined in their palette', () => {
    for (const [id, art] of Object.entries(ICONS)) {
      for (const char of art.rows.join('')) {
        if (char !== '.') expect(art.palette[char], `${id}: ${char}`).toBeDefined();
      }
    }
  });
});

describe('recipes', () => {
  it('fill a 3x3 grid with known icons', () => {
    for (const recipe of RECIPES) {
      expect(recipe.grid).toHaveLength(9);
      for (const icon of [...recipe.grid, recipe.result]) expect(ICONS[icon]).toBeDefined();
    }
  });

  it('match the real ingredient counts', () => {
    const grids = Object.fromEntries(RECIPES.map((r) => [r.id, r.grid]));
    expect(count(grids.cake, 'milk')).toBe(3);
    expect(count(grids.cake, 'sugar')).toBe(2);
    expect(count(grids.cake, 'egg')).toBe(1);
    expect(count(grids.cake, 'wheat')).toBe(3);
    expect(count(grids.tnt, 'gunpowder')).toBe(5);
    expect(count(grids.tnt, 'sand')).toBe(4);
    expect(count(grids.beacon, 'glass')).toBe(5);
    expect(count(grids.beacon, 'obsidian')).toBe(3);
    expect(count(grids.beacon, 'netherStar')).toBe(1);
  });
});

describe('stages', () => {
  it('map correct answers to stages', () => {
    expect(getStageIndex(0)).toBe(0);
    expect(getStageIndex(2)).toBe(0);
    expect(getStageIndex(3)).toBe(1);
    expect(getStageIndex(14)).toBe(2);
    expect(getStageIndex(15)).toBe(3);
    expect(getStageIndex(25)).toBe(CRAFTED_STAGE);
    expect(getStageIndex(99)).toBe(CRAFTED_STAGE);
  });

  it('fill one row per stage and cap at three rows', () => {
    expect([0, 1, 2, 3, 4].map(getVisibleRows)).toEqual([0, 1, 2, 3, 3]);
  });

  it('report progress toward the next stage', () => {
    expect(getStageProgress(0)).toEqual({ stage: 0, progress: 0, remaining: 3 });
    expect(getStageProgress(5)).toMatchObject({ stage: 1, remaining: 3 });
    expect(getStageProgress(30)).toEqual({ stage: CRAFTED_STAGE, progress: 1, remaining: 0 });
  });

  it('tease the next row, then the result', () => {
    const beacon = RECIPES[2];
    expect(getNextIcons(beacon, 0)).toEqual(['glass', 'glass', 'glass']);
    expect(getNextIcons(beacon, 2)).toEqual(['obsidian', 'obsidian', 'obsidian']);
    expect(getNextIcons(beacon, 3)).toEqual(['beacon']);
    expect(getNextIcons(beacon, CRAFTED_STAGE)).toEqual([]);
  });
});

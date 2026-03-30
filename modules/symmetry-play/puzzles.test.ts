import { describe, expect, it } from 'vitest';
import { cellKey, gridHasReflectionSymmetry } from './symmetry-utils';
import { quizItems } from './puzzles';

describe('quizItems', () => {
  it('symmetrical flag matches grid check for each item', () => {
    for (const item of quizItems) {
      const filled = new Set(item.cells.map(([r, c]) => cellKey(r, c)));
      expect(gridHasReflectionSymmetry(filled, item.axis, item.size)).toBe(
        item.symmetrical,
      );
    }
  });
});

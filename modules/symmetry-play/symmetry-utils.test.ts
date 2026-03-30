import { describe, expect, it } from 'vitest';
import {
  expectedEditableCells,
  matchesReflection,
  reflectCell,
  gridHasReflectionSymmetry,
} from './symmetry-utils';

describe('reflectCell', () => {
  it('reflects vertically through center of 7', () => {
    expect(reflectCell(0, 0, 'vertical', 7)).toEqual([0, 6]);
    expect(reflectCell(3, 1, 'vertical', 7)).toEqual([3, 5]);
    expect(reflectCell(3, 2, 'vertical', 7)).toEqual([3, 4]);
  });

  it('reflects horizontally through center of 7', () => {
    expect(reflectCell(0, 2, 'horizontal', 7)).toEqual([6, 2]);
    expect(reflectCell(1, 0, 'horizontal', 7)).toEqual([5, 0]);
  });
});

describe('expectedEditableCells', () => {
  it('builds right half from left fixed cells', () => {
    const fixed: [number, number][] = [
      [3, 0],
      [3, 1],
      [3, 2],
    ];
    const exp = expectedEditableCells(fixed, 'vertical', 7);
    expect(exp.has('3,4')).toBe(true);
    expect(exp.has('3,5')).toBe(true);
    expect(exp.has('3,6')).toBe(true);
    expect(exp.size).toBe(3);
  });
});

describe('matchesReflection', () => {
  it('accepts exact match', () => {
    const fixed: [number, number][] = [[1, 0], [1, 1]];
    const user = new Set(['1,5', '1,6']);
    expect(matchesReflection(user, fixed, 'vertical', 7)).toBe(true);
  });

  it('rejects incomplete', () => {
    const fixed: [number, number][] = [[1, 0], [1, 1]];
    const user = new Set(['1,5']);
    expect(matchesReflection(user, fixed, 'vertical', 7)).toBe(false);
  });
});

describe('gridHasReflectionSymmetry', () => {
  it('detects vertical symmetry', () => {
    const filled = new Set(['0,1', '0,5', '1,2', '1,4', '2,3']);
    expect(gridHasReflectionSymmetry(filled, 'vertical', 7)).toBe(true);
  });

  it('detects asymmetric pattern', () => {
    const filled = new Set(['0,1', '1,1', '2,2']);
    expect(gridHasReflectionSymmetry(filled, 'vertical', 5)).toBe(false);
  });
});

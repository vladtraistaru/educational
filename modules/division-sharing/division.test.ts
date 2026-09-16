import { describe, expect, it } from 'vitest';
import {
  divide,
  generateScenario,
  isFairShare,
  isGroupingComplete,
  shareProblem,
  type Difficulty,
} from './division';
import { themes } from './themes';

describe('divide', () => {
  it('returns quotient and remainder', () => {
    expect(divide(12, 3)).toEqual({ quotient: 4, remainder: 0 });
    expect(divide(14, 3)).toEqual({ quotient: 4, remainder: 2 });
    expect(divide(5, 6)).toEqual({ quotient: 0, remainder: 5 });
  });
});

describe('shareProblem / isFairShare', () => {
  it('accepts equal plates with no leftovers', () => {
    expect(isFairShare([4, 4, 4], 0)).toBe(true);
  });

  it('accepts equal plates with a remainder smaller than the plate count', () => {
    expect(isFairShare([4, 4, 4], 2)).toBe(true);
  });

  it('rejects unequal plates', () => {
    expect(shareProblem([4, 3, 4], 1)).toBe('unequal');
    expect(isFairShare([4, 3, 4], 1)).toBe(false);
  });

  it('rejects when every plate could get one more', () => {
    expect(shareProblem([3, 3, 3], 3)).toBe('giveMore');
    expect(shareProblem([0, 0], 5)).toBe('giveMore');
  });

  it('reports unequal before giveMore', () => {
    expect(shareProblem([2, 0, 0], 10)).toBe('unequal');
  });

  it('rejects an empty plate list', () => {
    expect(isFairShare([], 0)).toBe(false);
  });
});

describe('isGroupingComplete', () => {
  it('is complete only when fewer than k tokens are loose', () => {
    expect(isGroupingComplete(0, 3)).toBe(true);
    expect(isGroupingComplete(2, 3)).toBe(true);
    expect(isGroupingComplete(3, 3)).toBe(false);
    expect(isGroupingComplete(7, 3)).toBe(false);
  });
});

describe('generateScenario', () => {
  const bounds: Record<Difficulty, { maxN: number; maxD: number }> = {
    easy: { maxN: 20, maxD: 5 },
    harder: { maxN: 30, maxD: 6 },
  };

  for (const difficulty of ['easy', 'harder'] as Difficulty[]) {
    it(`stays within ${difficulty} bounds`, () => {
      for (let i = 0; i < 500; i++) {
        const s = generateScenario(difficulty);
        const { quotient, remainder } = divide(s.n, s.divisor);
        expect(s.divisor).toBeGreaterThanOrEqual(2);
        expect(s.divisor).toBeLessThanOrEqual(bounds[difficulty].maxD);
        expect(s.n).toBeLessThanOrEqual(bounds[difficulty].maxN);
        expect(quotient).toBeGreaterThan(0);
        expect(s.themeIndex).toBeGreaterThanOrEqual(0);
        expect(s.themeIndex).toBeLessThan(themes.length);
        if (difficulty === 'easy') expect(remainder).toBe(0);
      }
    });
  }

  it('produces remainders in about half of harder scenarios', () => {
    let withRemainder = 0;
    for (let i = 0; i < 1000; i++) {
      const s = generateScenario('harder');
      if (s.n % s.divisor !== 0) withRemainder++;
    }
    expect(withRemainder).toBeGreaterThan(350);
    expect(withRemainder).toBeLessThan(650);
  });

  it('never repeats the previous scenario', () => {
    let previous = generateScenario('easy');
    for (let i = 0; i < 300; i++) {
      const s = generateScenario('easy', previous);
      expect(s.n === previous.n && s.divisor === previous.divisor).toBe(false);
      previous = s;
    }
  });
});

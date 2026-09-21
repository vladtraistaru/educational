import { describe, it, expect } from 'vitest';
import { generateQuestion, getStreakMultiplier } from './questions';

describe('generateQuestion', () => {
  it('never uses 1 as a factor and stays within 2-12', () => {
    for (let i = 0; i < 1000; i++) {
      const { factorA, factorB } = generateQuestion();
      for (const f of [factorA, factorB]) {
        expect(f).toBeGreaterThanOrEqual(2);
        expect(f).toBeLessThanOrEqual(12);
      }
    }
  });

  it('computes the correct answer', () => {
    for (let i = 0; i < 200; i++) {
      const q = generateQuestion();
      expect(q.correctAnswer).toBe(q.factorA * q.factorB);
    }
  });

  it('avoids repeating the previous pair', () => {
    for (let i = 0; i < 200; i++) {
      const q = generateQuestion('7-8');
      expect([q.factorA, q.factorB].sort()).not.toEqual([7, 8]);
    }
  });
});

describe('getStreakMultiplier', () => {
  it('rises with the streak', () => {
    expect([0, 2, 3, 6, 10].map(getStreakMultiplier)).toEqual([1, 1, 2, 3, 4]);
  });
});

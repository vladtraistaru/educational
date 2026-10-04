import { describe, it, expect } from 'vitest';
import { generateQuestion, getStreakMultiplier } from './questions';

describe('generateQuestion', () => {
  it('never uses 1, 2 or 10 as divisor or answer and stays within 2-12', () => {
    for (let i = 0; i < 1000; i++) {
      const { divisor, correctAnswer } = generateQuestion();
      for (const n of [divisor, correctAnswer]) {
        expect(n).toBeGreaterThanOrEqual(2);
        expect(n).toBeLessThanOrEqual(12);
        expect([1, 2, 10]).not.toContain(n);
      }
    }
  });

  it('divides exactly', () => {
    for (let i = 0; i < 200; i++) {
      const q = generateQuestion();
      expect(q.dividend % q.divisor).toBe(0);
      expect(q.correctAnswer).toBe(q.dividend / q.divisor);
    }
  });

  it('avoids repeating the previous question', () => {
    for (let i = 0; i < 200; i++) {
      const q = generateQuestion('56-7');
      expect([q.dividend, q.divisor]).not.toEqual([56, 7]);
    }
  });
});

describe('getStreakMultiplier', () => {
  it('rises with the streak', () => {
    expect([0, 2, 3, 6, 10].map(getStreakMultiplier)).toEqual([1, 1, 2, 3, 4]);
  });
});

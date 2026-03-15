import { describe, it, expect } from 'vitest';
import { randInt, shuffle } from './random';

describe('randInt', () => {
  it('returns a value within the specified range', () => {
    for (let i = 0; i < 100; i++) {
      const val = randInt(3, 7);
      expect(val).toBeGreaterThanOrEqual(3);
      expect(val).toBeLessThanOrEqual(7);
    }
  });

  it('returns the value when min equals max', () => {
    expect(randInt(5, 5)).toBe(5);
  });

  it('returns an integer', () => {
    for (let i = 0; i < 50; i++) {
      const val = randInt(1, 100);
      expect(Number.isInteger(val)).toBe(true);
    }
  });
});

describe('shuffle', () => {
  it('returns an array of the same length', () => {
    const arr = [1, 2, 3, 4, 5];
    expect(shuffle(arr)).toHaveLength(5);
  });

  it('contains the same elements', () => {
    const arr = [10, 20, 30, 40, 50];
    const result = shuffle(arr);
    expect(result.sort((a, b) => a - b)).toEqual([10, 20, 30, 40, 50]);
  });

  it('does not mutate the original array', () => {
    const arr = [1, 2, 3, 4, 5];
    const copy = [...arr];
    shuffle(arr);
    expect(arr).toEqual(copy);
  });

  it('handles empty array', () => {
    expect(shuffle([])).toEqual([]);
  });

  it('handles single-element array', () => {
    expect(shuffle([42])).toEqual([42]);
  });
});

import { describe, expect, it } from 'vitest';
import {
  readChoices,
  compareTwoCorrect,
  compareThreeLongestIndex,
  MIN_CM,
  MAX_CM,
} from './exercises';

describe('readChoices', () => {
  it('includes the correct length', () => {
    for (let cm = MIN_CM; cm <= MAX_CM; cm++) {
      const c = readChoices(cm);
      expect(c).toContain(cm);
    }
  });

  it('has unique values', () => {
    const c = readChoices(7);
    expect(new Set(c).size).toBe(c.length);
  });

  it('has length 4 when enough distractors exist', () => {
    const c = readChoices(10);
    expect(c.length).toBe(4);
  });
});

describe('compareTwoCorrect', () => {
  it('returns first when a > b', () => {
    expect(compareTwoCorrect(8, 3)).toBe('first');
  });
  it('returns second when b > a', () => {
    expect(compareTwoCorrect(4, 9)).toBe('second');
  });
  it('returns same when equal', () => {
    expect(compareTwoCorrect(7, 7)).toBe('same');
  });
});

describe('compareThreeLongestIndex', () => {
  it('returns index of maximum', () => {
    expect(compareThreeLongestIndex([5, 9, 6])).toBe(1);
    expect(compareThreeLongestIndex([10, 4, 7])).toBe(0);
    expect(compareThreeLongestIndex([3, 8, 11])).toBe(2);
  });
  it('prefers lower index on tie', () => {
    expect(compareThreeLongestIndex([8, 8, 6])).toBe(0);
  });
});

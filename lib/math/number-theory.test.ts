import { describe, it, expect } from 'vitest';
import { digitalRoot, gcd, lcm } from './number-theory';

describe('digitalRoot', () => {
  it('returns single-digit numbers as-is', () => {
    for (let i = 0; i <= 9; i++) {
      expect(digitalRoot(i)).toBe(i);
    }
  });

  it('sums digits until single digit', () => {
    expect(digitalRoot(38)).toBe(2); // 3+8=11, 1+1=2
    expect(digitalRoot(99)).toBe(9); // 9+9=18, 1+8=9
    expect(digitalRoot(123)).toBe(6); // 1+2+3=6
  });

  it('returns 9 for multiples of 9 (except 0)', () => {
    expect(digitalRoot(9)).toBe(9);
    expect(digitalRoot(18)).toBe(9);
    expect(digitalRoot(81)).toBe(9);
    expect(digitalRoot(729)).toBe(9);
  });
});

describe('gcd', () => {
  it('returns the number itself when paired with 0', () => {
    expect(gcd(5, 0)).toBe(5);
    expect(gcd(12, 0)).toBe(12);
  });

  it('returns 1 for coprime numbers', () => {
    expect(gcd(7, 13)).toBe(1);
    expect(gcd(8, 15)).toBe(1);
  });

  it('finds common factors', () => {
    expect(gcd(12, 8)).toBe(4);
    expect(gcd(48, 18)).toBe(6);
    expect(gcd(100, 75)).toBe(25);
  });

  it('returns the smaller when one divides the other', () => {
    expect(gcd(10, 5)).toBe(5);
    expect(gcd(3, 9)).toBe(3);
  });

  it('returns the number when both are equal', () => {
    expect(gcd(7, 7)).toBe(7);
  });
});

describe('lcm', () => {
  it('returns the larger when one divides the other', () => {
    expect(lcm(3, 9)).toBe(9);
    expect(lcm(5, 10)).toBe(10);
  });

  it('returns the product for coprime numbers', () => {
    expect(lcm(4, 7)).toBe(28);
    expect(lcm(3, 5)).toBe(15);
  });

  it('finds least common multiple', () => {
    expect(lcm(4, 6)).toBe(12);
    expect(lcm(12, 18)).toBe(36);
  });

  it('returns the number when both are equal', () => {
    expect(lcm(6, 6)).toBe(6);
  });
});

import { describe, it, expect } from 'vitest';
import { Point } from './point';

describe('Point', () => {
  it('stores x and y', () => {
    const p = new Point(3, 4);
    expect(p.x).toBe(3);
    expect(p.y).toBe(4);
  });

  it('adds two points', () => {
    const result = new Point(1, 2).add(new Point(3, 4));
    expect(result.x).toBe(4);
    expect(result.y).toBe(6);
  });

  it('subtracts two points', () => {
    const result = new Point(5, 7).sub(new Point(2, 3));
    expect(result.x).toBe(3);
    expect(result.y).toBe(4);
  });

  it('computes distance between points', () => {
    expect(new Point(0, 0).distanceTo(new Point(3, 4))).toBe(5);
    expect(new Point(1, 1).distanceTo(new Point(1, 1))).toBe(0);
  });

  it('does not mutate operands', () => {
    const a = new Point(1, 2);
    const b = new Point(3, 4);
    a.add(b);
    expect(a.x).toBe(1);
    expect(a.y).toBe(2);
    expect(b.x).toBe(3);
    expect(b.y).toBe(4);
  });
});

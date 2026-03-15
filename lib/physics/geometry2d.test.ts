import { describe, it, expect } from 'vitest';
import { cross, raySegment } from './geometry2d';

describe('cross', () => {
  it('returns zero for parallel vectors', () => {
    expect(cross(1, 0, 2, 0)).toBe(0);
    expect(cross(3, 6, 1, 2)).toBe(0);
  });

  it('returns positive for counter-clockwise pair', () => {
    expect(cross(1, 0, 0, 1)).toBe(1);
  });

  it('returns negative for clockwise pair', () => {
    expect(cross(0, 1, 1, 0)).toBe(-1);
  });

  it('computes magnitude correctly', () => {
    expect(cross(3, 0, 0, 4)).toBe(12);
  });
});

describe('raySegment', () => {
  it('hits a perpendicular segment', () => {
    // ray from (0,0) going right, segment from (5,-5) to (5,5)
    const t = raySegment(0, 0, 1, 0, 5, -5, 5, 5);
    expect(t).toBeCloseTo(5);
  });

  it('returns null when ray is parallel to segment', () => {
    // ray going right, horizontal segment
    const t = raySegment(0, 0, 1, 0, 2, 1, 5, 1);
    expect(t).toBeNull();
  });

  it('returns null when segment is behind the ray', () => {
    // ray going right, segment is to the left
    const t = raySegment(10, 0, 1, 0, 5, -5, 5, 5);
    expect(t).toBeNull();
  });

  it('returns null when ray misses the segment', () => {
    // ray going right, segment is above
    const t = raySegment(0, 0, 1, 0, 5, 10, 5, 20);
    expect(t).toBeNull();
  });

  it('respects custom minT', () => {
    // segment at t=0.5, default minT=0.1 should hit
    const t1 = raySegment(0, 0, 1, 0, 0.5, -1, 0.5, 1);
    expect(t1).toBeCloseTo(0.5);

    // with minT=1, same intersection should be filtered out
    const t2 = raySegment(0, 0, 1, 0, 0.5, -1, 0.5, 1, 1);
    expect(t2).toBeNull();
  });

  it('hits at the segment midpoint for a diagonal ray', () => {
    // ray from origin going at 45 degrees, segment from (3,0) to (0,3)
    const t = raySegment(0, 0, 1, 1, 3, 0, 0, 3);
    expect(t).not.toBeNull();
    // intersection is at (1.5, 1.5), distance along (1,1) direction is 1.5
    expect(t).toBeCloseTo(1.5);
  });
});

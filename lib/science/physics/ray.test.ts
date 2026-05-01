import { describe, it, expect } from 'vitest';
import { Point } from './point';
import { Ray } from './ray';
import { Segment } from './segment';

describe('Ray.intersectSegment', () => {
  it('hits a perpendicular segment', () => {
    const ray = new Ray(new Point(0, 0), 1, 0);
    const seg = new Segment(new Point(5, -5), new Point(5, 5));
    expect(ray.intersectSegment(seg)).toBeCloseTo(5);
  });

  it('returns null when ray is parallel to segment', () => {
    const ray = new Ray(new Point(0, 0), 1, 0);
    const seg = new Segment(new Point(2, 1), new Point(5, 1));
    expect(ray.intersectSegment(seg)).toBeNull();
  });

  it('returns null when segment is behind the ray', () => {
    const ray = new Ray(new Point(10, 0), 1, 0);
    const seg = new Segment(new Point(5, -5), new Point(5, 5));
    expect(ray.intersectSegment(seg)).toBeNull();
  });

  it('returns null when ray misses the segment', () => {
    const ray = new Ray(new Point(0, 0), 1, 0);
    const seg = new Segment(new Point(5, 10), new Point(5, 20));
    expect(ray.intersectSegment(seg)).toBeNull();
  });

  it('respects custom minT', () => {
    const ray = new Ray(new Point(0, 0), 1, 0);
    const seg = new Segment(new Point(0.5, -1), new Point(0.5, 1));
    expect(ray.intersectSegment(seg)).toBeCloseTo(0.5);
    expect(ray.intersectSegment(seg, 1)).toBeNull();
  });

  it('hits at the segment midpoint for a diagonal ray', () => {
    const ray = new Ray(new Point(0, 0), 1, 1);
    const seg = new Segment(new Point(3, 0), new Point(0, 3));
    const t = ray.intersectSegment(seg);
    expect(t).not.toBeNull();
    expect(t).toBeCloseTo(1.5);
  });
});

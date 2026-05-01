import { Point } from './point';
import { Segment } from './segment';

function cross(ax: number, ay: number, bx: number, by: number): number {
  return ax * by - ay * bx;
}

export class Ray {
  constructor(
    public readonly origin: Point,
    public readonly dx: number,
    public readonly dy: number,
  ) {}

  /**
   * Returns the ray parameter `t` at which this ray intersects `segment`,
   * or null if no hit. `minT` filters out hits closer than a threshold.
   */
  intersectSegment(segment: Segment, minT = 0.1): number | null {
    const { a, b } = segment;
    const sx = b.x - a.x;
    const sy = b.y - a.y;
    const denom = cross(this.dx, this.dy, sx, sy);
    if (Math.abs(denom) < 1e-10) return null;
    const ex = a.x - this.origin.x;
    const ey = a.y - this.origin.y;
    const t = cross(ex, ey, sx, sy) / denom;
    const u = cross(ex, ey, this.dx, this.dy) / denom;
    if (t < minT || u < 0 || u > 1) return null;
    return t;
  }
}

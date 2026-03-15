export interface Point {
  x: number;
  y: number;
}

export function cross(ax: number, ay: number, bx: number, by: number) {
  return ax * by - ay * bx;
}

/**
 * Returns the ray parameter `t` at which a ray (origin ox,oy direction dx,dy)
 * intersects the line segment from (ax,ay) to (bx,by), or null if no hit.
 * `minT` filters out hits closer than a threshold (avoids self-intersection).
 */
export function raySegment(
  ox: number, oy: number, dx: number, dy: number,
  ax: number, ay: number, bx: number, by: number,
  minT = 0.1,
): number | null {
  const sx = bx - ax;
  const sy = by - ay;
  const denom = cross(dx, dy, sx, sy);
  if (Math.abs(denom) < 1e-10) return null;
  const ex = ax - ox;
  const ey = ay - oy;
  const t = cross(ex, ey, sx, sy) / denom;
  const u = cross(ex, ey, dx, dy) / denom;
  if (t < minT || u < 0 || u > 1) return null;
  return t;
}

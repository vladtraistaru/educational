import { Point, Ray, Segment } from '@/lib/science/physics';

export { Point };

export interface Mirror {
  id: number;
  pos: Point;
  angle: number;
  halfWidth?: number;
}

export interface BeamSegment {
  from: Point;
  to: Point;
  length: number;
}

export const DEFAULT_LASER_POS: Point = new Point(90, 250);
export const DEFAULT_LASER_ANGLE = 0;

export const DEFAULT_MIRRORS: Mirror[] = [
  { id: 1, pos: new Point(400, 250), angle: -Math.PI / 4 },
];

export const LASER_HALF = 30;
export const MIRROR_HALF = 60;

export const DEFAULT_BEAM_MAX = 30000;
const BOUNCE_LIMIT = 500;

function mirrorEndpoints(m: Mirror): [Point, Point] {
  const hw = m.halfWidth ?? MIRROR_HALF;
  const c = Math.cos(m.angle);
  const s = Math.sin(m.angle);
  return [
    new Point(m.pos.x - c * hw, m.pos.y - s * hw),
    new Point(m.pos.x + c * hw, m.pos.y + s * hw),
  ];
}

export function traceBeam(
  laserPos: Point,
  laserAngle: number,
  mirrors: Mirror[],
  beamMax = DEFAULT_BEAM_MAX,
  bounds?: { w: number; h: number },
): BeamSegment[] {
  let dx = Math.cos(laserAngle);
  let dy = Math.sin(laserAngle);
  let ox = laserPos.x + dx * LASER_HALF;
  let oy = laserPos.y + dy * LASER_HALF;

  const segments: BeamSegment[] = [];
  let lastHitId = -1;
  let remaining = beamMax;

  for (let bounce = 0; bounce < BOUNCE_LIMIT && remaining > 0; bounce++) {
    let bestT = Infinity;
    let bestMirror: Mirror | null = null;

    for (const m of mirrors) {
      if (m.id === lastHitId) continue;
      const [a, b] = mirrorEndpoints(m);
      const t = new Ray(new Point(ox, oy), dx, dy).intersectSegment(new Segment(a, b));
      if (t !== null && t < bestT) {
        bestT = t;
        bestMirror = m;
      }
    }

    if (!bestMirror || bestT === Infinity) {
      let t = remaining;
      if (bounds) {
        const edges = [];
        if (dx > 0) edges.push((bounds.w - ox) / dx);
        if (dx < 0) edges.push(-ox / dx);
        if (dy > 0) edges.push((bounds.h - oy) / dy);
        if (dy < 0) edges.push(-oy / dy);
        const exit = Math.min(...edges.filter((v) => v > 0));
        if (isFinite(exit)) t = Math.min(t, exit);
      }
      segments.push({
        from: new Point(ox, oy),
        to: new Point(ox + dx * t, oy + dy * t),
        length: t,
      });
      break;
    }

    if (bestT >= remaining) {
      segments.push({
        from: new Point(ox, oy),
        to: new Point(ox + dx * remaining, oy + dy * remaining),
        length: remaining,
      });
      break;
    }

    const hx = ox + dx * bestT;
    const hy = oy + dy * bestT;
    segments.push({ from: new Point(ox, oy), to: new Point(hx, hy), length: bestT });
    remaining -= bestT;

    const ms = Math.sin(bestMirror.angle);
    const mc = Math.cos(bestMirror.angle);
    let nx = -ms;
    let ny = mc;
    if (dx * nx + dy * ny > 0) { nx = -nx; ny = -ny; }

    const dot = dx * nx + dy * ny;
    dx = dx - 2 * dot * nx;
    dy = dy - 2 * dot * ny;
    ox = hx;
    oy = hy;
    lastHitId = bestMirror.id;
  }

  return segments;
}

export function getMirrorEndpoints(m: Mirror): [Point, Point] {
  return mirrorEndpoints(m);
}

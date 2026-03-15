import { type Point, raySegment } from '@/lib/physics/geometry2d';

export type { Point };

export interface Mirror {
  id: number;
  pos: Point;
  angle: number;
}

export interface BeamSegment {
  from: Point;
  to: Point;
  length: number;
}

export const DEFAULT_LASER_POS: Point = { x: 90, y: 250 };
export const DEFAULT_LASER_ANGLE = 0;

export const DEFAULT_MIRRORS: Mirror[] = [
  { id: 1, pos: { x: 400, y: 250 }, angle: -Math.PI / 4 },
];

export const LASER_HALF = 30;
export const MIRROR_HALF = 60;

const BEAM_MAX = 1000;
const MAX_BOUNCES = 20;

function mirrorEndpoints(m: Mirror): [Point, Point] {
  const c = Math.cos(m.angle);
  const s = Math.sin(m.angle);
  return [
    { x: m.pos.x - c * MIRROR_HALF, y: m.pos.y - s * MIRROR_HALF },
    { x: m.pos.x + c * MIRROR_HALF, y: m.pos.y + s * MIRROR_HALF },
  ];
}

export function traceBeam(
  laserPos: Point,
  laserAngle: number,
  mirrors: Mirror[],
): BeamSegment[] {
  let dx = Math.cos(laserAngle);
  let dy = Math.sin(laserAngle);
  let ox = laserPos.x + dx * LASER_HALF;
  let oy = laserPos.y + dy * LASER_HALF;

  const segments: BeamSegment[] = [];
  let lastHitId = -1;

  for (let bounce = 0; bounce < MAX_BOUNCES; bounce++) {
    let bestT = Infinity;
    let bestMirror: Mirror | null = null;

    for (const m of mirrors) {
      if (m.id === lastHitId) continue;
      const [a, b] = mirrorEndpoints(m);
      const t = raySegment(ox, oy, dx, dy, a.x, a.y, b.x, b.y);
      if (t !== null && t < bestT) {
        bestT = t;
        bestMirror = m;
      }
    }

    if (!bestMirror || bestT === Infinity) {
      segments.push({
        from: { x: ox, y: oy },
        to: { x: ox + dx * BEAM_MAX, y: oy + dy * BEAM_MAX },
        length: BEAM_MAX,
      });
      break;
    }

    const hx = ox + dx * bestT;
    const hy = oy + dy * bestT;
    segments.push({ from: { x: ox, y: oy }, to: { x: hx, y: hy }, length: bestT });

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

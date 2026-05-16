import { Point, Ray, Segment } from '@/lib/science/physics';

export { Point };

export type ElementKind =
  | 'converging-lens'
  | 'diverging-lens'
  | 'concave-mirror'
  | 'convex-mirror';

export interface OpticalElement {
  id: number;
  kind: ElementKind;
  pos: Point;
  angle: number;
  halfHeight: number;
  bulge: number;
}

export interface BeamSegment {
  from: Point;
  to: Point;
  length: number;
}

export const DEFAULT_SOURCE_POS: Point = new Point(90, 250);
export const DEFAULT_SOURCE_ANGLE = 0;
export const DEFAULT_RAY_COUNT = 7;
export const DEFAULT_BUNDLE_WIDTH = 120;
export const DEFAULT_ELEMENT_HALF_HEIGHT = 80;
export const DEFAULT_BULGE = 11;
export const MIN_BULGE = 2;

export function focalLengthOf(halfHeight: number, bulge: number): number {
  const b = Math.max(bulge, MIN_BULGE);
  return (halfHeight * halfHeight + b * b) / (4 * b);
}

export function bulgeFromFocalLength(halfHeight: number, focalLength: number): number {
  const a = halfHeight;
  const f = Math.max(focalLength, a / 2 + 1);
  return 2 * f - Math.sqrt(Math.max(4 * f * f - a * a, 0));
}

export const SOURCE_HALF = 30;

export const DEFAULT_BEAM_MAX = 30000;
const BOUNCE_LIMIT = 50;

export const DEFAULT_ELEMENTS: OpticalElement[] = [
  {
    id: 1,
    kind: 'converging-lens',
    pos: new Point(400, 250),
    angle: 0,
    halfHeight: DEFAULT_ELEMENT_HALF_HEIGHT,
    bulge: DEFAULT_BULGE,
  },
];

function elementSegment(el: OpticalElement): Segment {
  const nx = -Math.sin(el.angle);
  const ny = Math.cos(el.angle);
  return new Segment(
    new Point(el.pos.x - nx * el.halfHeight, el.pos.y - ny * el.halfHeight),
    new Point(el.pos.x + nx * el.halfHeight, el.pos.y + ny * el.halfHeight),
  );
}

function isMirror(kind: ElementKind): boolean {
  return kind === 'concave-mirror' || kind === 'convex-mirror';
}

function isConverging(kind: ElementKind): boolean {
  return kind === 'converging-lens' || kind === 'concave-mirror';
}

interface BendResult {
  dx: number;
  dy: number;
}

export function bendRay(
  el: OpticalElement,
  hit: Point,
  inDx: number,
  inDy: number,
): BendResult {
  const ax = Math.cos(el.angle);
  const ay = Math.sin(el.angle);
  const dotIn = inDx * ax + inDy * ay;
  const sign = dotIn >= 0 ? 1 : -1;
  const f = focalLengthOf(el.halfHeight, el.bulge);

  let targetX: number;
  let targetY: number;
  let fromTarget: boolean;

  if (isMirror(el.kind)) {
    if (isConverging(el.kind)) {
      targetX = el.pos.x - sign * f * ax;
      targetY = el.pos.y - sign * f * ay;
      fromTarget = false;
    } else {
      targetX = el.pos.x + sign * f * ax;
      targetY = el.pos.y + sign * f * ay;
      fromTarget = true;
    }
  } else if (isConverging(el.kind)) {
    targetX = el.pos.x + sign * f * ax;
    targetY = el.pos.y + sign * f * ay;
    fromTarget = false;
  } else {
    targetX = el.pos.x - sign * f * ax;
    targetY = el.pos.y - sign * f * ay;
    fromTarget = true;
  }

  let vx = fromTarget ? hit.x - targetX : targetX - hit.x;
  let vy = fromTarget ? hit.y - targetY : targetY - hit.y;
  const len = Math.sqrt(vx * vx + vy * vy);
  if (len < 1e-9) return { dx: inDx, dy: inDy };
  return { dx: vx / len, dy: vy / len };
}

function exitDistance(
  ox: number,
  oy: number,
  dx: number,
  dy: number,
  bounds: { w: number; h: number },
): number {
  const edges: number[] = [];
  if (dx > 0) edges.push((bounds.w - ox) / dx);
  if (dx < 0) edges.push(-ox / dx);
  if (dy > 0) edges.push((bounds.h - oy) / dy);
  if (dy < 0) edges.push(-oy / dy);
  const positive = edges.filter((v) => v > 0);
  return positive.length ? Math.min(...positive) : Infinity;
}

function traceSingleRay(
  startX: number,
  startY: number,
  dx: number,
  dy: number,
  elements: OpticalElement[],
  beamMax: number,
  bounds?: { w: number; h: number },
): BeamSegment[] {
  const segments: BeamSegment[] = [];
  let ox = startX;
  let oy = startY;
  let cdx = dx;
  let cdy = dy;
  let lastHitId = -1;
  let remaining = beamMax;

  for (let bounce = 0; bounce < BOUNCE_LIMIT && remaining > 0; bounce++) {
    let bestT = Infinity;
    let bestEl: OpticalElement | null = null;

    for (const el of elements) {
      if (el.id === lastHitId) continue;
      const seg = elementSegment(el);
      const t = new Ray(new Point(ox, oy), cdx, cdy).intersectSegment(seg);
      if (t !== null && t < bestT) {
        bestT = t;
        bestEl = el;
      }
    }

    if (!bestEl || bestT === Infinity || bestT >= remaining) {
      let t = remaining;
      if (bounds) {
        const exit = exitDistance(ox, oy, cdx, cdy, bounds);
        if (isFinite(exit)) t = Math.min(t, exit);
      }
      segments.push({
        from: new Point(ox, oy),
        to: new Point(ox + cdx * t, oy + cdy * t),
        length: t,
      });
      break;
    }

    const hx = ox + cdx * bestT;
    const hy = oy + cdy * bestT;
    segments.push({ from: new Point(ox, oy), to: new Point(hx, hy), length: bestT });
    remaining -= bestT;

    const bent = bendRay(bestEl, new Point(hx, hy), cdx, cdy);
    cdx = bent.dx;
    cdy = bent.dy;
    ox = hx;
    oy = hy;
    lastHitId = bestEl.id;
  }

  return segments;
}

export function traceParallelBundle(
  sourcePos: Point,
  sourceAngle: number,
  rayCount: number,
  bundleWidth: number,
  elements: OpticalElement[],
  beamMax = DEFAULT_BEAM_MAX,
  bounds?: { w: number; h: number },
): BeamSegment[][] {
  const dx = Math.cos(sourceAngle);
  const dy = Math.sin(sourceAngle);
  const nx = -Math.sin(sourceAngle);
  const ny = Math.cos(sourceAngle);
  const startOffset = SOURCE_HALF;

  if (rayCount < 1) return [];
  const result: BeamSegment[][] = [];
  for (let i = 0; i < rayCount; i++) {
    const t = rayCount === 1 ? 0 : i / (rayCount - 1) - 0.5;
    const offset = t * bundleWidth;
    const sx = sourcePos.x + nx * offset + dx * startOffset;
    const sy = sourcePos.y + ny * offset + dy * startOffset;
    result.push(traceSingleRay(sx, sy, dx, dy, elements, beamMax, bounds));
  }
  return result;
}

export function getElementSegment(el: OpticalElement): Segment {
  return elementSegment(el);
}

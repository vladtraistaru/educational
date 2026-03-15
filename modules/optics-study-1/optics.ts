export interface Point {
  x: number;
  y: number;
}

export interface ReflectionGeometry {
  mirrorStart: Point;
  mirrorEnd: Point;
  laserTip: Point;
  beamEnd: Point;
  hitPoint: Point | null;
  reflectedEnd: Point | null;
  incidentBeamLength: number;
  reflectedBeamLength: number;
}

export const DEFAULT_LASER_POS: Point = { x: 90, y: 250 };
export const DEFAULT_LASER_ANGLE = 0;
export const DEFAULT_MIRROR_POS: Point = { x: 400, y: 250 };
export const DEFAULT_MIRROR_ANGLE = -Math.PI / 4;

export const LASER_HALF = 30;
export const MIRROR_HALF = 60;

const BEAM_MAX = 1000;

function cross(ax: number, ay: number, bx: number, by: number) {
  return ax * by - ay * bx;
}

function raySegment(
  ox: number, oy: number, dx: number, dy: number,
  ax: number, ay: number, bx: number, by: number,
): number | null {
  const sx = bx - ax;
  const sy = by - ay;
  const denom = cross(dx, dy, sx, sy);
  if (Math.abs(denom) < 1e-10) return null;
  const ex = ax - ox;
  const ey = ay - oy;
  const t = cross(ex, ey, sx, sy) / denom;
  const u = cross(ex, ey, dx, dy) / denom;
  if (t < 0 || u < 0 || u > 1) return null;
  return t;
}

export function computeReflection(
  laserPos: Point,
  laserAngle: number,
  mirrorPos: Point,
  mirrorAngle: number,
): ReflectionGeometry {
  const dx = Math.cos(laserAngle);
  const dy = Math.sin(laserAngle);

  const tipX = laserPos.x + dx * LASER_HALF;
  const tipY = laserPos.y + dy * LASER_HALF;
  const laserTip: Point = { x: tipX, y: tipY };

  const mc = Math.cos(mirrorAngle);
  const ms = Math.sin(mirrorAngle);
  const mirrorStart: Point = { x: mirrorPos.x - mc * MIRROR_HALF, y: mirrorPos.y - ms * MIRROR_HALF };
  const mirrorEnd: Point = { x: mirrorPos.x + mc * MIRROR_HALF, y: mirrorPos.y + ms * MIRROR_HALF };

  const t = raySegment(tipX, tipY, dx, dy, mirrorStart.x, mirrorStart.y, mirrorEnd.x, mirrorEnd.y);

  if (t === null) {
    return {
      mirrorStart, mirrorEnd, laserTip,
      beamEnd: { x: tipX + dx * BEAM_MAX, y: tipY + dy * BEAM_MAX },
      hitPoint: null, reflectedEnd: null,
      incidentBeamLength: BEAM_MAX, reflectedBeamLength: 0,
    };
  }

  const hitPoint: Point = { x: tipX + dx * t, y: tipY + dy * t };

  let nx = -ms;
  let ny = mc;
  if (dx * nx + dy * ny > 0) { nx = -nx; ny = -ny; }

  const dot = dx * nx + dy * ny;
  const rx = dx - 2 * dot * nx;
  const ry = dy - 2 * dot * ny;
  const reflectedEnd: Point = { x: hitPoint.x + rx * BEAM_MAX, y: hitPoint.y + ry * BEAM_MAX };

  return {
    mirrorStart, mirrorEnd, laserTip,
    beamEnd: hitPoint,
    hitPoint, reflectedEnd,
    incidentBeamLength: t, reflectedBeamLength: BEAM_MAX,
  };
}

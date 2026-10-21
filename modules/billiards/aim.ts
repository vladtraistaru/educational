import { BALL_E, TABLE_H, TABLE_W, type Ball, type Vec, type World } from './physics';

const MAX_PULL = 300;
const MIN_POWER = 0.03;

export interface Shot {
  dir: Vec;
  power: number;
}

/** Slingshot aiming: the ball goes away from the pointer, harder the further the pointer is. */
export function aimFromPointer(cue: Ball, pointer: Vec): Shot | null {
  const dx = cue.x - pointer.x;
  const dy = cue.y - pointer.y;
  const dist = Math.hypot(dx, dy);
  if (dist < cue.r) return null;
  const power = Math.min(1, Math.max(0, (dist - cue.r * 2) / MAX_PULL));
  return { dir: { x: dx / dist, y: dy / dist }, power };
}

export const isShot = (shot: Shot | null): shot is Shot => !!shot && shot.power >= MIN_POWER;

export interface GuideHit {
  ghost: Vec;
  object: Ball;
  objectDir: Vec;
  cueDir: Vec | null;
}

export interface Guide {
  path: Vec[];
  hit: GuideHit | null;
}

/* Distance along unit direction d from o until a circle of radius R around c is touched. */
function castCircle(o: Vec, d: Vec, c: Vec, R: number): number | null {
  const fx = o.x - c.x;
  const fy = o.y - c.y;
  const b = fx * d.x + fy * d.y;
  const cc = fx * fx + fy * fy - R * R;
  const disc = b * b - cc;
  if (disc < 0 || cc < 0) return null;
  const t = -b - Math.sqrt(disc);
  return t > 1e-6 ? t : null;
}

function castCushions(o: Vec, d: Vec, r: number): { t: number; n: Vec } {
  const tx = d.x > 0 ? (TABLE_W - r - o.x) / d.x : d.x < 0 ? (r - o.x) / d.x : Infinity;
  const ty = d.y > 0 ? (TABLE_H - r - o.y) / d.y : d.y < 0 ? (r - o.y) / d.y : Infinity;
  return tx < ty
    ? { t: Math.max(0, tx), n: { x: -Math.sign(d.x), y: 0 } }
    : { t: Math.max(0, ty), n: { x: 0, y: -Math.sign(d.y) } };
}

const reflect = (d: Vec, n: Vec): Vec => {
  const k = 2 * (d.x * n.x + d.y * n.y);
  return { x: d.x - k * n.x, y: d.y - k * n.y };
};

/** Predicts the cue ball's path through up to two bounces, stopping at the first ball it meets. */
export function predictPath(world: World, cue: Ball, dir: Vec, maxSegments = 3): Guide {
  const others = world.balls.filter((b) => b !== cue && !b.potted);
  let o: Vec = { x: cue.x, y: cue.y };
  let d = dir;
  const path: Vec[] = [o];

  for (let s = 0; s < maxSegments; s++) {
    let best = castCushions(o, d, cue.r);
    let ball: Ball | null = null;

    for (const b of others) {
      const t = castCircle(o, d, b, cue.r + b.r);
      if (t !== null && t < best.t) {
        best = { t, n: { x: 0, y: 0 } };
        ball = b;
      }
    }
    for (const p of world.posts) {
      const t = castCircle(o, d, p, cue.r + p.r);
      if (t !== null && t < best.t) {
        const hx = o.x + d.x * t;
        const hy = o.y + d.y * t;
        const len = Math.hypot(hx - p.x, hy - p.y);
        best = { t, n: { x: (hx - p.x) / len, y: (hy - p.y) / len } };
        ball = null;
      }
    }

    const end = { x: o.x + d.x * best.t, y: o.y + d.y * best.t };
    path.push(end);
    if (ball) return { path, hit: collisionPreview(cue, ball, end, d) };
    d = reflect(d, best.n);
    o = end;
  }
  return { path, hit: null };
}

function collisionPreview(cue: Ball, object: Ball, ghost: Vec, d: Vec): GuideHit {
  const len = Math.hypot(object.x - ghost.x, object.y - ghost.y);
  const n = { x: (object.x - ghost.x) / len, y: (object.y - ghost.y) / len };
  const k = ((1 + BALL_E) * object.mass) / (cue.mass + object.mass) * (d.x * n.x + d.y * n.y);
  const after = { x: d.x - k * n.x, y: d.y - k * n.y };
  const speed = Math.hypot(after.x, after.y);
  return {
    ghost,
    object,
    objectDir: n,
    cueDir: speed > 0.08 ? { x: after.x / speed, y: after.y / speed } : null,
  };
}

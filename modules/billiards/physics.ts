export type BallKind = 'cue' | 'target' | 'bomb';

export interface Vec {
  x: number;
  y: number;
}

export interface Ball {
  id: string;
  kind: BallKind;
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
  mass: number;
  color: string;
  label?: string;
  potted: boolean;
}

export interface Post {
  x: number;
  y: number;
  r: number;
}

export interface Pocket {
  x: number;
  y: number;
  r: number;
}

export interface World {
  balls: Ball[];
  posts: Post[];
  friction: number;
}

export const TABLE_W = 1000;
export const TABLE_H = 500;
export const BALL_R = 13;
export const MAX_SHOT_SPEED = 1800;

const CORNER_R = 34;
const SIDE_R = 28;

export const POCKETS: Pocket[] = [
  { x: 0, y: 0, r: CORNER_R },
  { x: TABLE_W / 2, y: 0, r: SIDE_R },
  { x: TABLE_W, y: 0, r: CORNER_R },
  { x: 0, y: TABLE_H, r: CORNER_R },
  { x: TABLE_W / 2, y: TABLE_H, r: SIDE_R },
  { x: TABLE_W, y: TABLE_H, r: CORNER_R },
];

export const BALL_E = 0.95;
const POST_E = 0.9;
const CUSHION_E = 0.8;
const STOP_SPEED = 4;

export const FRICTION = { felt: 320, ice: 70, sand: 900 } as const;
export type Surface = keyof typeof FRICTION;

const speedOf = (b: Ball) => Math.hypot(b.vx, b.vy);

export function isMoving(world: World): boolean {
  return world.balls.some((b) => !b.potted && (b.vx !== 0 || b.vy !== 0));
}

export function cloneWorld(world: World): World {
  return {
    balls: world.balls.map((b) => ({ ...b })),
    posts: world.posts.map((p) => ({ ...p })),
    friction: world.friction,
  };
}

/** Advances the world by dt seconds. Returns the balls sunk during this step. */
export function step(world: World, dt: number): Ball[] {
  const live = () => world.balls.filter((b) => !b.potted);
  const maxSpeed = Math.max(0, ...live().map(speedOf));
  const n = Math.min(60, Math.max(1, Math.ceil((maxSpeed * dt) / (BALL_R * 0.4))));
  const h = dt / n;
  const sunk: Ball[] = [];

  for (let i = 0; i < n; i++) {
    const balls = live();
    for (const b of balls) {
      b.x += b.vx * h;
      b.y += b.vy * h;
    }
    for (let a = 0; a < balls.length; a++) {
      for (let c = a + 1; c < balls.length; c++) collideBalls(balls[a], balls[c]);
      for (const p of world.posts) collidePost(balls[a], p);
    }
    for (const b of balls) {
      bounceCushions(b);
      if (inPocket(b)) {
        b.potted = true;
        b.vx = 0;
        b.vy = 0;
        sunk.push(b);
      }
    }
  }

  for (const b of live()) applyFriction(b, world.friction * dt);
  return sunk;
}

function collideBalls(a: Ball, b: Ball) {
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  const dist = Math.hypot(dx, dy);
  const min = a.r + b.r;
  if (dist >= min || dist === 0) return;

  const nx = dx / dist;
  const ny = dy / dist;
  const ia = 1 / a.mass;
  const ib = 1 / b.mass;
  const push = (min - dist) / (ia + ib);
  a.x -= nx * push * ia;
  a.y -= ny * push * ia;
  b.x += nx * push * ib;
  b.y += ny * push * ib;

  const approach = (b.vx - a.vx) * nx + (b.vy - a.vy) * ny;
  if (approach >= 0) return;
  const j = (-(1 + BALL_E) * approach) / (ia + ib);
  a.vx -= j * ia * nx;
  a.vy -= j * ia * ny;
  b.vx += j * ib * nx;
  b.vy += j * ib * ny;
}

function collidePost(b: Ball, p: Post) {
  const dx = b.x - p.x;
  const dy = b.y - p.y;
  const dist = Math.hypot(dx, dy);
  const min = b.r + p.r;
  if (dist >= min || dist === 0) return;

  const nx = dx / dist;
  const ny = dy / dist;
  b.x = p.x + nx * min;
  b.y = p.y + ny * min;
  const vn = b.vx * nx + b.vy * ny;
  if (vn >= 0) return;
  b.vx -= (1 + POST_E) * vn * nx;
  b.vy -= (1 + POST_E) * vn * ny;
}

/* Cushions have gaps at the pocket mouths so balls can drop in. A ball bigger
   than standard gets a wider mouth, or it would rest on the cushions short of
   the pocket. */
const grow = (b: Ball) => Math.max(0, b.r - BALL_R);
const inLongMouth = (b: Ball) =>
  b.x < CORNER_R + grow(b) ||
  b.x > TABLE_W - CORNER_R - grow(b) ||
  Math.abs(b.x - TABLE_W / 2) < SIDE_R + grow(b);
const inShortMouth = (b: Ball) => b.y < CORNER_R + grow(b) || b.y > TABLE_H - CORNER_R - grow(b);

/* Flip the normal component and scale the whole velocity, so the angle out
   equals the angle in — the mirror rule. */
function bounceCushions(b: Ball) {
  if (!inShortMouth(b)) {
    if (b.x < b.r && b.vx < 0) bounce(b, 'x', b.r);
    else if (b.x > TABLE_W - b.r && b.vx > 0) bounce(b, 'x', TABLE_W - b.r);
  }
  if (!inLongMouth(b)) {
    if (b.y < b.r && b.vy < 0) bounce(b, 'y', b.r);
    else if (b.y > TABLE_H - b.r && b.vy > 0) bounce(b, 'y', TABLE_H - b.r);
  }
}

function bounce(b: Ball, axis: 'x' | 'y', limit: number) {
  b[axis] = 2 * limit - b[axis];
  if (axis === 'x') b.vx = -b.vx;
  else b.vy = -b.vy;
  b.vx *= CUSHION_E;
  b.vy *= CUSHION_E;
}

function inPocket(b: Ball): boolean {
  const outside = b.x < -b.r || b.x > TABLE_W + b.r || b.y < -b.r || b.y > TABLE_H + b.r;
  return outside || POCKETS.some((p) => Math.hypot(b.x - p.x, b.y - p.y) < p.r + grow(b));
}

function applyFriction(b: Ball, loss: number) {
  const s = speedOf(b);
  if (s === 0) return;
  const next = s - loss;
  if (next <= STOP_SPEED) {
    b.vx = 0;
    b.vy = 0;
    return;
  }
  b.vx *= next / s;
  b.vy *= next / s;
}

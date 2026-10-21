import { describe, expect, it } from 'vitest';
import { FRICTION, MAX_SHOT_SPEED, isMoving, step, type Ball, type Vec, type World } from './physics';
import { buildWorld, type LevelBall } from './levels';
import { predictPath } from './aim';

export function shoot(world: World, dir: Vec, power: number): Ball[] {
  const cue = world.balls.find((b) => b.kind === 'cue')!;
  const len = Math.hypot(dir.x, dir.y);
  cue.vx = (dir.x / len) * power * MAX_SHOT_SPEED;
  cue.vy = (dir.y / len) * power * MAX_SHOT_SPEED;
  const sunk: Ball[] = [];
  for (let i = 0; i < 60 * 30 && isMoving(world); i++) sunk.push(...step(world, 1 / 60));
  return sunk;
}

const target = (x: number, y: number, size?: LevelBall['size']): LevelBall => ({ kind: 'target', x, y, size });
const cueOf = (w: World) => w.balls[0];
const objectOf = (w: World) => w.balls[1];

describe('ball collisions', () => {
  it('passes nearly all speed on a head-on hit between equal balls', () => {
    const w = buildWorld({ x: 200, y: 250 }, [target(400, 250)], [], 0);
    for (let i = 0; i < 20; i++) step(w, 1 / 60);
    cueOf(w).vx = 600;
    for (let i = 0; i < 40; i++) step(w, 1 / 60);
    expect(Math.abs(cueOf(w).vx)).toBeLessThan(30);
    expect(objectOf(w).vx).toBeGreaterThan(560);
  });

  it('sends the cue ball back off a heavy ball', () => {
    const w = buildWorld({ x: 200, y: 250 }, [target(400, 250, 'heavy')], [], 0);
    cueOf(w).vx = 600;
    for (let i = 0; i < 40; i++) step(w, 1 / 60);
    expect(cueOf(w).vx).toBeLessThan(0);
    expect(objectOf(w).vx).toBeLessThan(600);
  });

  it('makes a light ball leave faster than the cue ball arrived', () => {
    const w = buildWorld({ x: 200, y: 250 }, [target(400, 250, 'light')], [], 0);
    cueOf(w).vx = 600;
    for (let i = 0; i < 40; i++) step(w, 1 / 60);
    expect(objectOf(w).vx).toBeGreaterThan(600);
    expect(cueOf(w).vx).toBeGreaterThan(0);
  });

  it('splits equal balls at a right angle on a glancing hit', () => {
    const w = buildWorld({ x: 200, y: 250 }, [target(400, 262)], [], 0);
    cueOf(w).vx = 600;
    for (let i = 0; i < 40; i++) step(w, 1 / 60);
    const a = cueOf(w);
    const b = objectOf(w);
    const cos = (a.vx * b.vx + a.vy * b.vy) / (Math.hypot(a.vx, a.vy) * Math.hypot(b.vx, b.vy));
    expect(Math.abs(cos)).toBeLessThan(0.05);
  });
});

describe('cushions and pockets', () => {
  it('bounces with angle out equal to angle in', () => {
    const w = buildWorld({ x: 300, y: 300 }, [], [], 0);
    cueOf(w).vx = 300;
    cueOf(w).vy = 400;
    for (let i = 0; i < 40; i++) step(w, 1 / 60);
    expect(cueOf(w).vy).toBeLessThan(0);
    expect(cueOf(w).vx / -cueOf(w).vy).toBeCloseTo(300 / 400, 5);
  });

  it('sinks a ball rolled into a corner', () => {
    const w = buildWorld({ x: 100, y: 100 }, [], [], 0);
    expect(shoot(w, { x: -1, y: -1 }, 0.3).map((b) => b.kind)).toEqual(['cue']);
  });

  it('stops a ball through friction, sooner on sand than on ice', () => {
    const distance = (friction: number) => {
      const w = buildWorld({ x: 100, y: 250 }, [], [], friction);
      shoot(w, { x: 1, y: 0 }, 0.25);
      return cueOf(w).x;
    };
    expect(distance(FRICTION.sand)).toBeLessThan(distance(FRICTION.felt));
    expect(distance(FRICTION.felt)).toBeLessThan(distance(FRICTION.ice));
  });
});

describe('predictPath', () => {
  it('reflects off a cushion and stops at the first ball', () => {
    const w = buildWorld({ x: 100, y: 250 }, [target(500, 250)], [], 0);
    const guide = predictPath(w, cueOf(w), { x: 1, y: 0 });
    expect(guide.hit?.object.id).toBe('target-0');
    expect(guide.hit?.ghost.x).toBeCloseTo(474, 5);
    expect(guide.hit?.cueDir).toBeNull();
  });
});

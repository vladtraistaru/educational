import { describe, expect, it } from 'vitest';
import { LEVELS, levelWorld, starsFor } from './levels';
import { POCKETS, TABLE_H, type Ball, type Vec, type World } from './physics';
import { shoot } from './physics.test';

const level = (id: string) => LEVELS.find((l) => l.id === id)!;

/* Where the cue ball must be at contact to send `ball` straight at `pocket`. */
function ghostFor(ball: Ball, pocket: Vec, cueR: number): Vec {
  const dx = pocket.x - ball.x;
  const dy = pocket.y - ball.y;
  const len = Math.hypot(dx, dy);
  return { x: ball.x - (dx / len) * (ball.r + cueR), y: ball.y - (dy / len) * (ball.r + cueR) };
}

function pot(world: World, ballId: string, pocket: Vec, power: number, viaBottomCushion = false) {
  const cue = world.balls.find((b) => b.kind === 'cue')!;
  const ball = world.balls.find((b) => b.id === ballId)!;
  const g = ghostFor(ball, pocket, cue.r);
  const aim = viaBottomCushion ? { x: g.x, y: 2 * (TABLE_H - cue.r) - g.y } : g;
  return shoot(world, { x: aim.x - cue.x, y: aim.y - cue.y }, power);
}

const [TL, TM, TR, BL, BM, BR] = POCKETS;
void TL;
void BL;
void BM;

describe('levels', () => {
  it('have unique ids and reachable goals', () => {
    expect(new Set(LEVELS.map((l) => l.id)).size).toBe(LEVELS.length);
    for (const l of LEVELS) {
      expect(l.balls.filter((b) => b.kind === 'target').length).toBeGreaterThanOrEqual(l.goal);
    }
  });

  it.each([
    ['straight', TM],
    ['stop', BR],
    ['cut', TM],
    ['heavy', BR],
    ['light', BR],
  ])('%s is solvable in one shot', (id, pocket) => {
    const sunk = pot(levelWorld(level(id)), 'target-0', pocket, 0.6);
    expect(sunk.some((b) => b.id === 'target-0')).toBe(true);
  });

  it('bank is solvable off the bottom cushion, and the post blocks the direct line', () => {
    const direct = pot(levelWorld(level('bank')), 'target-0', TR, 0.6);
    expect(direct.some((b) => b.id === 'target-0')).toBe(false);
    const banked = pot(levelWorld(level('bank')), 'target-0', TR, 0.8, true);
    expect(banked.some((b) => b.id === 'target-0')).toBe(true);
  });
});

describe('starsFor', () => {
  it('gives 3 at par and drops one per extra shot', () => {
    expect(starsFor(1, 1)).toBe(3);
    expect(starsFor(2, 1)).toBe(2);
    expect(starsFor(3, 1)).toBe(1);
  });
});

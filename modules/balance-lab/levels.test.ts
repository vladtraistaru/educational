import { describe, it, expect } from 'vitest';
import { isBalanced, type Load, type Side } from '@/lib/science/mechanics';
import { LEVELS, MAX_DISTANCE, type Level } from './levels';

const SIDES: Side[] = ['left', 'right'];

/** Exhaustive search for a placement that balances the level within its block budget. */
function findSolution(level: Level): Load[] | null {
  const budget = level.maxBlocks ?? level.blocks.length;
  const occupied = new Set(level.crates.map((c) => `${c.side}:${c.distance}`));

  const search = (index: number, placed: Load[]): Load[] | null => {
    if (placed.length > 0 && isBalanced([...level.crates, ...placed])) return placed;
    if (index >= level.blocks.length || placed.length >= budget) return null;

    const withoutThisBlock = search(index + 1, placed);
    if (withoutThisBlock) return withoutThisBlock;

    for (const side of SIDES) {
      for (let distance = 1; distance <= MAX_DISTANCE; distance++) {
        const key = `${side}:${distance}`;
        if (occupied.has(key)) continue;
        occupied.add(key);
        const found = search(index + 1, [
          ...placed,
          { mass: level.blocks[index], distance, side },
        ]);
        occupied.delete(key);
        if (found) return found;
      }
    }
    return null;
  };

  return search(0, []);
}

describe('LEVELS', () => {
  it('have unique ids', () => {
    const ids = LEVELS.map((l) => l.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('place every crate on a real notch', () => {
    for (const level of LEVELS) {
      for (const crate of level.crates) {
        expect(crate.distance).toBeGreaterThanOrEqual(1);
        expect(crate.distance).toBeLessThanOrEqual(MAX_DISTANCE);
        expect(crate.mass).toBeGreaterThan(0);
      }
    }
  });

  it('never stack two crates on the same notch', () => {
    for (const level of LEVELS) {
      const keys = level.crates.map((c) => `${c.side}:${c.distance}`);
      expect(new Set(keys).size).toBe(keys.length);
    }
  });

  it('do not start already balanced', () => {
    for (const level of LEVELS) {
      expect(isBalanced(level.crates), `${level.id} starts balanced`).toBe(false);
    }
  });

  it.each(LEVELS.map((l) => [l.id, l] as const))(
    'level %s is solvable within its block budget',
    (id, level) => {
      const solution = findSolution(level);
      expect(solution, `no solution for ${id}`).not.toBeNull();
      expect(isBalanced([...level.crates, ...solution!])).toBe(true);
      expect(solution!.length).toBeLessThanOrEqual(
        level.maxBlocks ?? level.blocks.length,
      );
    },
  );
});

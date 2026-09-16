import { describe, expect, it } from 'vitest';
import {
  applyMove,
  applyMoves,
  cellName,
  generatePath,
  generateTask,
  isInside,
  nameDistractors,
  parseCell,
  pathCells,
  randomCell,
  randomScenery,
  sameCell,
  type Cell,
} from './grid';

describe('cellName / parseCell', () => {
  it('names cells with the column letter then the row number (row 0 is 1)', () => {
    expect(cellName({ col: 0, row: 0 })).toBe('A1');
    expect(cellName({ col: 3, row: 2 })).toBe('D3');
    expect(cellName({ col: 7, row: 7 })).toBe('H8');
  });

  it('round-trips every cell of an 8×8 grid', () => {
    for (let col = 0; col < 8; col++) {
      for (let row = 0; row < 8; row++) {
        expect(parseCell(cellName({ col, row }))).toEqual({ col, row });
      }
    }
  });

  it('rejects reversed or malformed names', () => {
    expect(parseCell('3C')).toBeNull();
    expect(parseCell('')).toBeNull();
    expect(parseCell('CC')).toBeNull();
  });
});

describe('moves', () => {
  it('moves up by increasing the row and right by increasing the column', () => {
    expect(applyMove({ col: 1, row: 1 }, { dir: 'up', steps: 2 })).toEqual({ col: 1, row: 3 });
    expect(applyMove({ col: 1, row: 1 }, { dir: 'right', steps: 3 })).toEqual({ col: 4, row: 1 });
    expect(applyMove({ col: 1, row: 1 }, { dir: 'down', steps: 1 })).toEqual({ col: 1, row: 0 });
    expect(applyMove({ col: 1, row: 1 }, { dir: 'left', steps: 1 })).toEqual({ col: 0, row: 1 });
  });

  it('chains moves and lists every step cell', () => {
    const moves = [
      { dir: 'right' as const, steps: 2 },
      { dir: 'up' as const, steps: 1 },
    ];
    expect(applyMoves({ col: 0, row: 0 }, moves)).toEqual({ col: 2, row: 1 });
    expect(pathCells({ col: 0, row: 0 }, moves).map(cellName)).toEqual(['A1', 'B1', 'C1', 'C2']);
  });

  it('checks bounds', () => {
    expect(isInside({ col: 0, row: 0 }, 5)).toBe(true);
    expect(isInside({ col: 4, row: 4 }, 5)).toBe(true);
    expect(isInside({ col: 5, row: 0 }, 5)).toBe(false);
    expect(isInside({ col: 0, row: -1 }, 5)).toBe(false);
  });
});

describe('randomCell', () => {
  it('stays inside and avoids given cells', () => {
    const avoid: Cell[] = [{ col: 0, row: 0 }, { col: 1, row: 1 }];
    for (let i = 0; i < 300; i++) {
      const c = randomCell(2, avoid);
      expect(isInside(c, 2)).toBe(true);
      expect(avoid.some((a) => sameCell(a, c))).toBe(false);
    }
  });
});

describe('nameDistractors', () => {
  const looksValid = (name: string, size: number) => {
    const letters = 'ABCDEFGH'.slice(0, size);
    if (!/^([A-Z]\d|\d[A-Z])$/.test(name)) return false;
    const [letter, digit] = /^\d/.test(name) ? [name[1], name[0]] : [name[0], name[1]];
    return letters.includes(letter) && Number(digit) >= 1 && Number(digit) <= size;
  };

  for (const size of [5, 8]) {
    it(`gives 4 unique valid-looking choices including the answer on a ${size}×${size} grid`, () => {
      for (let i = 0; i < 400; i++) {
        const cell = randomCell(size);
        const choices = nameDistractors(cell, size);
        expect(choices).toHaveLength(4);
        expect(new Set(choices).size).toBe(4);
        expect(choices).toContain(cellName(cell));
        for (const c of choices) expect(looksValid(c, size)).toBe(true);
      }
    });
  }

  it('includes the swapped cell when row and column differ', () => {
    let seen = 0;
    for (let i = 0; i < 200; i++) {
      if (nameDistractors({ col: 2, row: 1 }, 5).includes('B3')) seen++;
    }
    expect(seen).toBeGreaterThan(100);
  });
});

describe('generatePath', () => {
  for (const size of [5, 8]) {
    it(`never leaves a ${size}×${size} grid`, () => {
      const [minMoves, maxMoves] = size === 5 ? [1, 2] : [2, 3];
      for (let i = 0; i < 500; i++) {
        const { start, moves, target } = generatePath(size);
        expect(moves.length).toBeGreaterThanOrEqual(minMoves);
        expect(moves.length).toBeLessThanOrEqual(maxMoves);
        for (const c of pathCells(start, moves)) expect(isInside(c, size)).toBe(true);
        expect(applyMoves(start, moves)).toEqual(target);
        expect(sameCell(start, target)).toBe(false);
        moves.forEach((m, j) => {
          expect(m.steps).toBeGreaterThan(0);
          if (j > 0) {
            const axis = (d: string) => (d === 'up' || d === 'down' ? 'v' : 'h');
            expect(axis(m.dir)).not.toBe(axis(moves[j - 1].dir));
          }
        });
      }
    });
  }
});

describe('generateTask / randomScenery', () => {
  it('builds a task of the requested kind', () => {
    expect(generateTask('find', 5).kind).toBe('find');
    expect(generateTask('name', 5).kind).toBe('name');
    expect(generateTask('path', 8).kind).toBe('path');
  });

  it('never places scenery on avoided cells', () => {
    for (let i = 0; i < 200; i++) {
      const target = randomCell(5);
      const scenery = randomScenery(5, [target]);
      expect(Object.keys(scenery)).toHaveLength(3);
      expect(scenery[cellName(target)]).toBeUndefined();
    }
  });
});

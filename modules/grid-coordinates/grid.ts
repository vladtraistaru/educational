import { randInt, shuffle } from '@/lib/science/math/random';

export interface Cell {
  col: number;
  row: number;
}

export type Direction = 'up' | 'down' | 'left' | 'right';

export interface Move {
  dir: Direction;
  steps: number;
}

export type GridSize = 5 | 8;
export type Mode = 'find' | 'name' | 'path';

export type Task =
  | { kind: 'find'; target: Cell }
  | { kind: 'name'; target: Cell; choices: string[] }
  | { kind: 'path'; start: Cell; moves: Move[]; target: Cell };

const LETTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const DELTA: Record<Direction, Cell> = {
  up: { col: 0, row: 1 },
  down: { col: 0, row: -1 },
  left: { col: -1, row: 0 },
  right: { col: 1, row: 0 },
};
const SCENERY = ['🌳', '🏠', '⛰️', '🌊'];

export const columnLetter = (col: number) => LETTERS[col];

export function cellName({ col, row }: Cell): string {
  return `${LETTERS[col]}${row + 1}`;
}

export function parseCell(name: string): Cell | null {
  const match = /^([A-Z])(\d+)$/.exec(name.trim().toUpperCase());
  if (!match) return null;
  return { col: LETTERS.indexOf(match[1]), row: Number(match[2]) - 1 };
}

export function sameCell(a: Cell, b: Cell): boolean {
  return a.col === b.col && a.row === b.row;
}

export function isInside({ col, row }: Cell, size: number): boolean {
  return col >= 0 && row >= 0 && col < size && row < size;
}

export function applyMove(cell: Cell, { dir, steps }: Move): Cell {
  return { col: cell.col + DELTA[dir].col * steps, row: cell.row + DELTA[dir].row * steps };
}

export function applyMoves(cell: Cell, moves: Move[]): Cell {
  return moves.reduce(applyMove, cell);
}

export function pathCells(start: Cell, moves: Move[]): Cell[] {
  const cells = [start];
  for (const { dir, steps } of moves) {
    for (let i = 0; i < steps; i++) cells.push(applyMove(cells[cells.length - 1], { dir, steps: 1 }));
  }
  return cells;
}

export function randomCell(size: number, avoid: Cell[] = []): Cell {
  let cell: Cell;
  do cell = { col: randInt(0, size - 1), row: randInt(0, size - 1) };
  while (avoid.some((a) => sameCell(a, cell)));
  return cell;
}

export function nameDistractors(cell: Cell, size: number): string[] {
  const correct = cellName(cell);
  const valid = (c: Cell) => (isInside(c, size) ? cellName(c) : null);
  const side = () => (randInt(0, 1) ? 1 : -1);
  const colStep = side();
  const rowStep = side();
  const primary = [
    cell.col !== cell.row ? valid({ col: cell.row, row: cell.col }) : null,
    valid({ col: cell.col + colStep, row: cell.row }) ?? valid({ col: cell.col - colStep, row: cell.row }),
    valid({ col: cell.col, row: cell.row + rowStep }) ?? valid({ col: cell.col, row: cell.row - rowStep }),
    `${cell.row + 1}${LETTERS[cell.col]}`,
  ];
  const extras = [
    valid({ col: cell.col - colStep, row: cell.row }),
    valid({ col: cell.col, row: cell.row - rowStep }),
    valid({ col: cell.col + colStep, row: cell.row + rowStep }),
    valid({ col: cell.col - colStep, row: cell.row - rowStep }),
  ];
  const picked: string[] = [];
  for (const name of [...shuffle(primary), ...extras]) {
    if (name && name !== correct && !picked.includes(name) && picked.length < 3) picked.push(name);
  }
  return shuffle([correct, ...picked]);
}

export function generatePath(size: number): { start: Cell; moves: Move[]; target: Cell } {
  const start = randomCell(size);
  const count = size <= 5 ? randInt(1, 2) : randInt(2, 3);
  const maxSteps = size <= 5 ? 3 : 5;
  const moves: Move[] = [];
  let pos = start;
  let horizontal = randInt(0, 1) === 1;
  for (let i = 0; i < count; i++) {
    const [fwd, back]: Direction[] = horizontal ? ['right', 'left'] : ['up', 'down'];
    const here = horizontal ? pos.col : pos.row;
    const room: [Direction, number][] = [
      [fwd, size - 1 - here],
      [back, here],
    ];
    const options = room.filter(([, r]) => r > 0);
    const [dir, r] = options[randInt(0, options.length - 1)];
    const move = { dir, steps: randInt(1, Math.min(r, maxSteps)) };
    moves.push(move);
    pos = applyMove(pos, move);
    horizontal = !horizontal;
  }
  return { start, moves, target: pos };
}

export function generateTask(mode: Mode, size: number): Task {
  if (mode === 'path') return { kind: 'path', ...generatePath(size) };
  const target = randomCell(size);
  if (mode === 'find') return { kind: 'find', target };
  return { kind: 'name', target, choices: nameDistractors(target, size) };
}

export function randomScenery(size: number, avoid: Cell[]): Record<string, string> {
  const scenery: Record<string, string> = {};
  const taken = [...avoid];
  const count = size <= 5 ? 3 : 5;
  for (let i = 0; i < count; i++) {
    const cell = randomCell(size, taken);
    taken.push(cell);
    scenery[cellName(cell)] = SCENERY[randInt(0, SCENERY.length - 1)];
  }
  return scenery;
}

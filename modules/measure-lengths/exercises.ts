export const MIN_CM = 3;
export const MAX_CM = 15;
export const RULER_MAX_CM = 15;

export interface ReadExercise {
  id: string;
  lengthCm: number;
  contextKey: string;
}

export type CompareExercise =
  | {
      kind: 'two';
      id: string;
      aCm: number;
      bCm: number;
      contextKey?: string;
    }
  | {
      kind: 'three';
      id: string;
      lengths: [number, number, number];
      contextKey?: string;
    };

export const READ_EXERCISES: ReadExercise[] = [
  { id: 'r1', lengthCm: 4, contextKey: 'sticker' },
  { id: 'r2', lengthCm: 7, contextKey: 'pencil' },
  { id: 'r3', lengthCm: 10, contextKey: 'ribbon' },
  { id: 'r4', lengthCm: 5, contextKey: 'crayon' },
  { id: 'r5', lengthCm: 12, contextKey: 'bookmark' },
  { id: 'r6', lengthCm: 3, contextKey: 'straw' },
  { id: 'r7', lengthCm: 9, contextKey: 'pencil' },
  { id: 'r8', lengthCm: 14, contextKey: 'ribbon' },
  { id: 'r9', lengthCm: 6, contextKey: 'sticker' },
  { id: 'r10', lengthCm: 11, contextKey: 'crayon' },
];

export const COMPARE_EXERCISES: CompareExercise[] = [
  { kind: 'two', id: 'c1', aCm: 8, bCm: 5 },
  { kind: 'two', id: 'c2', aCm: 4, bCm: 9 },
  { kind: 'two', id: 'c3', aCm: 7, bCm: 7, contextKey: 'ribbon' },
  { kind: 'two', id: 'c4', aCm: 12, bCm: 6 },
  { kind: 'two', id: 'c5', aCm: 5, bCm: 11 },
  { kind: 'three', id: 'c6', lengths: [5, 9, 6] },
  { kind: 'three', id: 'c7', lengths: [10, 4, 7] },
  { kind: 'three', id: 'c8', lengths: [6, 6, 8] },
  { kind: 'three', id: 'c9', lengths: [3, 11, 8] },
  { kind: 'three', id: 'c10', lengths: [12, 5, 9] },
];

export function shuffleInPlace<T>(items: T[]): void {
  for (let i = items.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [items[i], items[j]] = [items[j], items[i]];
  }
}

export function shuffledCopy<T>(items: readonly T[]): T[] {
  const next = [...items];
  shuffleInPlace(next);
  return next;
}

export function readChoices(lengthCm: number): number[] {
  const pool: number[] = [];
  for (let n = MIN_CM; n <= MAX_CM; n++) {
    if (n !== lengthCm) pool.push(n);
  }
  shuffleInPlace(pool);
  const need = Math.min(3, pool.length);
  const picks = pool.slice(0, need);
  const all = [lengthCm, ...picks];
  shuffleInPlace(all);
  return all;
}

export function compareTwoCorrect(aCm: number, bCm: number): 'first' | 'second' | 'same' {
  if (aCm > bCm) return 'first';
  if (bCm > aCm) return 'second';
  return 'same';
}

export function compareThreeLongestIndex(lengths: [number, number, number]): number {
  let best = 0;
  for (let i = 1; i < 3; i++) {
    if (lengths[i] > lengths[best]) best = i;
  }
  return best;
}

import type { MirrorAxis } from './symmetry-utils';

export interface CompletePuzzle {
  id: string;
  size: number;
  axis: MirrorAxis;
  fixedCells: [number, number][];
}

export type QuizKind = 'grid';

export interface QuizItem {
  id: string;
  kind: QuizKind;
  size: number;
  axis: MirrorAxis;
  /** All filled cells (full pattern) */
  cells: [number, number][];
  symmetrical: boolean;
}

export const completePuzzles: CompletePuzzle[] = [
  {
    id: 'v-arrow',
    size: 7,
    axis: 'vertical',
    fixedCells: [
      [1, 0],
      [2, 0],
      [3, 0],
      [3, 1],
      [3, 2],
      [4, 0],
      [5, 0],
    ],
  },
  {
    id: 'v-house',
    size: 7,
    axis: 'vertical',
    fixedCells: [
      [0, 0],
      [0, 1],
      [1, 0],
      [1, 1],
      [1, 2],
      [2, 0],
      [2, 1],
      [2, 2],
      [3, 0],
      [3, 1],
      [3, 2],
      [4, 0],
      [4, 1],
      [4, 2],
      [5, 0],
      [5, 1],
      [5, 2],
      [6, 0],
      [6, 1],
      [6, 2],
    ],
  },
  {
    id: 'h-smile',
    size: 7,
    axis: 'horizontal',
    fixedCells: [
      [0, 1],
      [0, 2],
      [0, 3],
      [0, 4],
      [0, 5],
      [1, 0],
      [1, 1],
      [1, 5],
      [1, 6],
      [2, 0],
      [2, 6],
    ],
  },
  {
    id: 'v-tree',
    size: 7,
    axis: 'vertical',
    fixedCells: [
      [5, 2],
      [6, 2],
      [4, 1],
      [4, 2],
      [3, 0],
      [3, 1],
      [3, 2],
      [2, 0],
      [2, 1],
      [2, 2],
      [1, 1],
      [1, 2],
      [0, 2],
    ],
  },
];

function quizGrid(
  id: string,
  size: number,
  axis: MirrorAxis,
  cells: [number, number][],
  symmetrical: boolean,
): QuizItem {
  return { id, kind: 'grid', size, axis, cells, symmetrical };
}

export const quizItems: QuizItem[] = [
  quizGrid('q-heart-v', 7, 'vertical', symmetricHeart(), true),
  quizGrid('q-lump', 5, 'vertical', asymmetricBlob(), false),
  quizGrid('q-square', 5, 'vertical', filledRect(5, 1, 1, 3, 3), true),
  quizGrid('q-offset', 5, 'vertical', [[2, 0], [2, 1], [1, 1]], false),
  quizGrid('q-h-sym', 7, 'horizontal', symmetricHorizontalFace(), true),
  quizGrid('q-h-asym', 7, 'horizontal', asymmetricHorizontal(), false),
];

function symmetricHeart(): [number, number][] {
  const left: [number, number][] = [
    [1, 1],
    [1, 2],
    [2, 0],
    [2, 1],
    [2, 2],
    [3, 1],
    [3, 2],
    [4, 2],
    [5, 2],
  ];
  const size = 7;
  const c = 3;
  const set = new Set<string>();
  for (const [r, col] of left) {
    set.add(`${r},${col}`);
    set.add(`${r},${2 * c - col}`);
  }
  return [...set].map((k) => {
    const [r, col] = k.split(',').map(Number);
    return [r, col] as [number, number];
  });
}

function asymmetricBlob(): [number, number][] {
  return [
    [0, 1],
    [1, 0],
    [1, 1],
    [2, 1],
    [2, 2],
    [3, 1],
  ];
}

function filledRect(
  size: number,
  r0: number,
  c0: number,
  w: number,
  h: number,
): [number, number][] {
  const out: [number, number][] = [];
  for (let r = r0; r < r0 + h; r++) {
    for (let col = c0; col < c0 + w; col++) {
      out.push([r, col]);
    }
  }
  return out;
}

function symmetricHorizontalFace(): [number, number][] {
  const top: [number, number][] = [
    [0, 2],
    [0, 3],
    [0, 4],
    [1, 1],
    [1, 2],
    [1, 3],
    [1, 4],
    [1, 5],
    [2, 2],
    [2, 3],
    [2, 4],
  ];
  const size = 7;
  const c = 3;
  const set = new Set<string>();
  for (const [row, col] of top) {
    set.add(`${row},${col}`);
    set.add(`${2 * c - row},${col}`);
  }
  return [...set].map((k) => {
    const [r, col] = k.split(',').map(Number);
    return [r, col] as [number, number];
  });
}

function asymmetricHorizontal(): [number, number][] {
  return [
    [0, 1],
    [0, 2],
    [1, 3],
    [1, 4],
    [2, 2],
    [2, 3],
  ];
}

import type { Side } from '@/lib/science/mechanics';

export const MAX_DISTANCE = 10;

export type ChallengeKind = 'balance' | 'lift' | 'fewest';

export interface Crate {
  mass: number;
  side: Side;
  distance: number;
}

export interface PlacedWeight {
  id: string;
  mass: number;
  side: Side;
  distance: number;
}

export interface Level {
  id: string;
  kind: ChallengeKind;
  crates: Crate[];
  blocks: number[];
  maxBlocks?: number;
}

export const LEVELS: Level[] = [
  { id: 'b1', kind: 'balance', crates: [{ mass: 2, side: 'left', distance: 6 }], blocks: [4] },
  { id: 'b2', kind: 'balance', crates: [{ mass: 5, side: 'left', distance: 4 }], blocks: [10] },
  { id: 'b3', kind: 'balance', crates: [{ mass: 3, side: 'left', distance: 8 }], blocks: [6] },
  { id: 'b4', kind: 'balance', crates: [{ mass: 12, side: 'left', distance: 2 }], blocks: [8] },
  {
    id: 'b5',
    kind: 'balance',
    crates: [
      { mass: 3, side: 'left', distance: 2 },
      { mass: 2, side: 'left', distance: 3 },
    ],
    blocks: [4],
  },
  {
    id: 'b6',
    kind: 'balance',
    crates: [
      { mass: 9, side: 'left', distance: 4 },
      { mass: 6, side: 'right', distance: 2 },
    ],
    blocks: [8],
  },
  { id: 'l1', kind: 'lift', crates: [{ mass: 12, side: 'left', distance: 1 }], blocks: [2] },
  { id: 'l2', kind: 'lift', crates: [{ mass: 10, side: 'left', distance: 3 }], blocks: [5] },
  { id: 'l3', kind: 'lift', crates: [{ mass: 12, side: 'left', distance: 5 }], blocks: [6] },
  {
    id: 'f1',
    kind: 'fewest',
    crates: [{ mass: 7, side: 'left', distance: 4 }],
    blocks: [4, 3, 2],
    maxBlocks: 2,
  },
  {
    id: 'f2',
    kind: 'fewest',
    crates: [{ mass: 11, side: 'left', distance: 6 }],
    blocks: [12, 9, 6, 3],
    maxBlocks: 2,
  },
  {
    id: 'f3',
    kind: 'fewest',
    crates: [
      { mass: 12, side: 'left', distance: 7 },
      { mass: 4, side: 'right', distance: 3 },
    ],
    blocks: [12, 8, 6],
    maxBlocks: 2,
  },
];

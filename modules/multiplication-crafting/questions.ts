import { randInt } from '@/lib/science/math/random';

export interface Question {
  factorA: number;
  factorB: number;
  correctAnswer: number;
}

// Multiplying by 1, 2 or 10 is trivial, so those factors never come up.
const MIN_FACTOR = 2;
const MAX_FACTOR = 12;
const EXCLUDED_FACTORS = new Set([1, 2, 10]);

export const POINTS_PER_QUESTION = 10;
export const STARTING_LIVES = 3;

function factorKey(a: number, b: number): string {
  return `${Math.min(a, b)}-${Math.max(a, b)}`;
}

function randFactor(): number {
  let n = randInt(MIN_FACTOR, MAX_FACTOR);
  while (EXCLUDED_FACTORS.has(n)) {
    n = randInt(MIN_FACTOR, MAX_FACTOR);
  }
  return n;
}

export function generateQuestion(avoidKey?: string): Question {
  let a = randFactor();
  let b = randFactor();
  let key = factorKey(a, b);

  let attempts = 0;
  while (key === avoidKey && attempts < 10) {
    a = randFactor();
    b = randFactor();
    key = factorKey(a, b);
    attempts += 1;
  }

  return { factorA: a, factorB: b, correctAnswer: a * b };
}

export function getStreakMultiplier(streak: number): number {
  if (streak >= 10) return 4;
  if (streak >= 6) return 3;
  if (streak >= 3) return 2;
  return 1;
}

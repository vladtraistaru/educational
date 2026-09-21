import { randInt } from '@/lib/science/math/random';

export interface Question {
  factorA: number;
  factorB: number;
  correctAnswer: number;
}

// Multiplying by 1 is trivial, so it never comes up.
const MIN_FACTOR = 2;
const MAX_FACTOR = 12;

export const POINTS_PER_QUESTION = 10;
export const STARTING_LIVES = 3;

function factorKey(a: number, b: number): string {
  return `${Math.min(a, b)}-${Math.max(a, b)}`;
}

export function generateQuestion(avoidKey?: string): Question {
  let a = randInt(MIN_FACTOR, MAX_FACTOR);
  let b = randInt(MIN_FACTOR, MAX_FACTOR);
  let key = factorKey(a, b);

  let attempts = 0;
  while (key === avoidKey && attempts < 10) {
    a = randInt(MIN_FACTOR, MAX_FACTOR);
    b = randInt(MIN_FACTOR, MAX_FACTOR);
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

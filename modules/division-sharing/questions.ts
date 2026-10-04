import { randInt } from '@/lib/science/math/random';

export interface Question {
  dividend: number;
  divisor: number;
  correctAnswer: number;
}

// Dividing by 1, 2 or 10 (or getting those as the answer) is trivial, so they never come up.
const MIN_FACTOR = 2;
const MAX_FACTOR = 12;
const EXCLUDED_FACTORS = new Set([1, 2, 10]);

export const POINTS_PER_QUESTION = 10;
export const STARTING_LIVES = 3;

export function questionKey(q: Pick<Question, 'dividend' | 'divisor'>): string {
  return `${q.dividend}-${q.divisor}`;
}

function randFactor(): number {
  let n = randInt(MIN_FACTOR, MAX_FACTOR);
  while (EXCLUDED_FACTORS.has(n)) {
    n = randInt(MIN_FACTOR, MAX_FACTOR);
  }
  return n;
}

/** Builds `dividend ÷ divisor` from a times-table fact, so there is never a remainder. */
export function generateQuestion(avoidKey?: string): Question {
  let question: Question;
  let attempts = 0;
  do {
    const divisor = randFactor();
    const quotient = randFactor();
    question = { dividend: divisor * quotient, divisor, correctAnswer: quotient };
    attempts += 1;
  } while (questionKey(question) === avoidKey && attempts < 10);
  return question;
}

export function getStreakMultiplier(streak: number): number {
  if (streak >= 10) return 4;
  if (streak >= 6) return 3;
  if (streak >= 3) return 2;
  return 1;
}

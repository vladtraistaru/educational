import { randInt, shuffle } from '@/lib/science/math/random';

export interface Question {
  factorA: number;
  factorB: number;
  correctAnswer: number;
  options: number[];
}

const MIN_FACTOR = 1;
const MAX_FACTOR = 12;

export const POINTS_PER_QUESTION = 10;
export const STARTING_LIVES = 3;

function generateWrongAnswers(correct: number): number[] {
  const offsets = [-12, -10, -8, -6, -5, -4, -3, -2, -1, 1, 2, 3, 4, 5, 6, 8, 10, 12];
  const candidates = shuffle(offsets)
    .map((o) => correct + o)
    .filter((n) => n > 0 && n !== correct);

  const unique = [...new Set(candidates)];
  while (unique.length < 3) {
    const extra = correct + (unique.length + 1) * (Math.random() < 0.5 ? -1 : 1);
    if (extra > 0 && extra !== correct && !unique.includes(extra)) unique.push(extra);
  }
  return unique.slice(0, 3);
}

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

  const correct = a * b;
  const wrong = generateWrongAnswers(correct);

  return {
    factorA: a,
    factorB: b,
    correctAnswer: correct,
    options: shuffle([correct, ...wrong]),
  };
}

export function getStreakMultiplier(streak: number): number {
  if (streak >= 10) return 4;
  if (streak >= 6) return 3;
  if (streak >= 3) return 2;
  return 1;
}

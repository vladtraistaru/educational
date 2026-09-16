import { randInt } from '@/lib/science/math/random';
import { themes } from './themes';

export type Difficulty = 'easy' | 'harder';
export type ShareProblem = 'unequal' | 'giveMore' | null;

export interface Scenario {
  n: number;
  divisor: number;
  themeIndex: number;
}

export const LIMITS: Record<Difficulty, { maxN: number; maxDivisor: number }> = {
  easy: { maxN: 20, maxDivisor: 5 },
  harder: { maxN: 30, maxDivisor: 6 },
};

export function divide(n: number, d: number): { quotient: number; remainder: number } {
  return { quotient: Math.floor(n / d), remainder: n % d };
}

export function shareProblem(plateCounts: number[], pileLeft: number): ShareProblem {
  if (plateCounts.some((c) => c !== plateCounts[0])) return 'unequal';
  if (pileLeft >= plateCounts.length) return 'giveMore';
  return null;
}

export function isFairShare(plateCounts: number[], pileLeft: number): boolean {
  return plateCounts.length > 0 && shareProblem(plateCounts, pileLeft) === null;
}

export function isGroupingComplete(loose: number, k: number): boolean {
  return loose < k;
}

function randomScenario(difficulty: Difficulty): Scenario {
  const { maxN, maxDivisor } = LIMITS[difficulty];
  const divisor = randInt(2, maxDivisor);
  const remainder = difficulty === 'harder' && Math.random() < 0.5 ? randInt(1, divisor - 1) : 0;
  const quotient = randInt(2, Math.floor((maxN - remainder) / divisor));
  return { n: quotient * divisor + remainder, divisor, themeIndex: randInt(0, themes.length - 1) };
}

export function generateScenario(difficulty: Difficulty, previous?: Scenario): Scenario {
  let s = randomScenario(difficulty);
  while (previous && s.n === previous.n && s.divisor === previous.divisor) {
    s = randomScenario(difficulty);
  }
  return s;
}

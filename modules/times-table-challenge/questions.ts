export interface DifficultyConfig {
  id: 'easy' | 'medium' | 'hard';
  minFactor: number;
  maxFactor: number;
  pointsPerQuestion: number;
}

export const DIFFICULTIES: DifficultyConfig[] = [
  { id: 'easy', minFactor: 2, maxFactor: 5, pointsPerQuestion: 10 },
  { id: 'medium', minFactor: 3, maxFactor: 9, pointsPerQuestion: 20 },
  { id: 'hard', minFactor: 6, maxFactor: 12, pointsPerQuestion: 30 },
];

export interface Question {
  factorA: number;
  factorB: number;
  correctAnswer: number;
  options: number[];
}

export const QUESTIONS_PER_ROUND = 10;

function randInt(min: number, max: number): number {
  return min + Math.floor(Math.random() * (max - min + 1));
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function generateWrongAnswers(correct: number): number[] {
  const offsets = [-7, -5, -3, -2, -1, 1, 2, 3, 4, 5, 6, 8];
  const candidates = shuffle(offsets)
    .map((o) => correct + o)
    .filter((n) => n > 0 && n !== correct);

  const unique = [...new Set(candidates)];
  return unique.slice(0, 3);
}

export function generateRound(difficulty: DifficultyConfig): Question[] {
  const seen = new Set<string>();
  const questions: Question[] = [];

  while (questions.length < QUESTIONS_PER_ROUND) {
    const a = randInt(difficulty.minFactor, difficulty.maxFactor);
    const b = randInt(difficulty.minFactor, difficulty.maxFactor);
    const key = `${Math.min(a, b)}-${Math.max(a, b)}`;
    if (seen.has(key)) continue;
    seen.add(key);

    const correct = a * b;
    const wrong = generateWrongAnswers(correct);
    if (wrong.length < 3) continue;

    questions.push({
      factorA: a,
      factorB: b,
      correctAnswer: correct,
      options: shuffle([correct, ...wrong]),
    });
  }

  return questions;
}

export function getStreakMultiplier(streak: number): number {
  if (streak >= 8) return 4;
  if (streak >= 5) return 3;
  if (streak >= 3) return 2;
  return 1;
}

export function getStars(correctCount: number): number {
  if (correctCount >= 8) return 3;
  if (correctCount >= 5) return 2;
  return 1;
}

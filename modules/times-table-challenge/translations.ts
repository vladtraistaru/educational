import type { Language } from '@/lib/language-config';

export interface ChallengeTranslations {
  title: string;
  description: string;
  pickDifficulty: string;
  start: string;
  factors: string;
  pointsPerQuestion: string;
  pts: string;
  score: string;
  streak: string;
  question: string;
  of: string;
  correct: string;
  wrong: string;
  finalScore: string;
  youGot: string;
  outOf: string;
  playAgain: string;
  difficulties: Record<string, { label: string; description: string }>;
  streakMultiplier: string;
}

const translations: Record<Language, ChallengeTranslations> = {
  en: {
    title: 'Times Table Challenge',
    description: 'Test your times tables! Pick a difficulty, answer 10 questions, and build streaks for bonus points',
    pickDifficulty: 'Pick your level',
    start: 'Start!',
    factors: 'factors',
    pointsPerQuestion: 'pts each',
    pts: 'pts',
    score: 'Score',
    streak: 'Streak',
    question: 'Question',
    of: 'of',
    correct: 'Correct!',
    wrong: 'Not quite!',
    finalScore: 'Final Score',
    youGot: 'You got',
    outOf: 'out of',
    playAgain: 'Play Again',
    streakMultiplier: 'multiplier',
    difficulties: {
      easy: { label: 'Easy', description: 'Numbers 2 - 5' },
      medium: { label: 'Medium', description: 'Numbers 3 - 9' },
      hard: { label: 'Hard', description: 'Numbers 6 - 12' },
    },
  },
  fr: {
    title: 'Défi Tables de Multiplication',
    description: 'Teste tes tables de multiplication ! Choisis un niveau, réponds à 10 questions et enchaîne les séries pour des points bonus',
    pickDifficulty: 'Choisis ton niveau',
    start: 'Commencer !',
    factors: 'facteurs',
    pointsPerQuestion: 'pts chacun',
    pts: 'pts',
    score: 'Score',
    streak: 'Série',
    question: 'Question',
    of: 'sur',
    correct: 'Correct !',
    wrong: 'Pas tout à fait !',
    finalScore: 'Score Final',
    youGot: 'Tu as eu',
    outOf: 'sur',
    playAgain: 'Rejouer',
    streakMultiplier: 'multiplicateur',
    difficulties: {
      easy: { label: 'Facile', description: 'Nombres 2 - 5' },
      medium: { label: 'Moyen', description: 'Nombres 3 - 9' },
      hard: { label: 'Difficile', description: 'Nombres 6 - 12' },
    },
  },
};

export default translations;

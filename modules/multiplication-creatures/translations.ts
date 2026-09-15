import type { Language } from '@/lib/language-config';
import type { SpeciesId } from './monsters';

export interface MonstersTranslations {
  title: string;
  description: string;
  chooseMonster: string;
  chooseMonsterHint: string;
  start: string;
  species: Record<SpeciesId, string>;
  stageNames: [string, string, string, string, string];
  score: string;
  lives: string;
  streak: string;
  correct: string;
  wrong: string;
  evolved: string;
  gameOver: string;
  finalScore: string;
  totalCorrect: string;
  bestStreak: string;
  yourMonsterIs: string;
  playAgain: string;
  pts: string;
}

const translations: Record<Language, MonstersTranslations> = {
  en: {
    title: 'Multiplication Monsters',
    description:
      'Feed your pet monster by answering multiplication facts from 1 to 12! Grow it from an egg to a legendary beast before you run out of lives',
    chooseMonster: 'Pick your monster egg',
    chooseMonsterHint: 'Feed it correct answers to help it hatch and grow!',
    start: 'Start!',
    species: {
      dragon: 'Dragon',
      sea: 'Sea Beast',
      forest: 'Forest Beast',
    },
    stageNames: ['Egg', 'Hatchling', 'Teen', 'Mega', 'Legendary'],
    score: 'Score',
    lives: 'Lives',
    streak: 'Streak',
    correct: 'Yum! Correct!',
    wrong: 'Oops, not quite!',
    evolved: 'Your monster evolved!',
    gameOver: 'Game Over',
    finalScore: 'Final Score',
    totalCorrect: 'Correct Answers',
    bestStreak: 'Best Streak',
    yourMonsterIs: 'Your monster is now a',
    playAgain: 'Play Again',
    pts: 'pts',
  },
  fr: {
    title: 'Monstres de Multiplication',
    description:
      'Nourris ton monstre en répondant à des multiplications de 1 à 12 ! Fais-le grandir d’un œuf jusqu’à une bête légendaire avant de perdre toutes tes vies',
    chooseMonster: 'Choisis ton œuf de monstre',
    chooseMonsterHint: 'Nourris-le de bonnes réponses pour l’aider à éclore et grandir !',
    start: 'Commencer !',
    species: {
      dragon: 'Dragon',
      sea: 'Monstre marin',
      forest: 'Bête des forêts',
    },
    stageNames: ['Œuf', 'Bébé', 'Ado', 'Méga', 'Légendaire'],
    score: 'Score',
    lives: 'Vies',
    streak: 'Série',
    correct: 'Miam ! Correct !',
    wrong: 'Oups, pas tout à fait !',
    evolved: 'Ton monstre a évolué !',
    gameOver: 'Partie Terminée',
    finalScore: 'Score Final',
    totalCorrect: 'Bonnes réponses',
    bestStreak: 'Meilleure série',
    yourMonsterIs: 'Ton monstre est maintenant un',
    playAgain: 'Rejouer',
    pts: 'pts',
  },
};

export default translations;

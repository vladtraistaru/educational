import type { Language } from '@/lib/language';

export interface SymmetryTranslations {
  title: string;
  description: string;
  modeComplete: string;
  modeQuiz: string;
  puzzleN: string;
  prevPuzzle: string;
  nextPuzzle: string;
  check: string;
  completeCorrect: string;
  completeWrong: string;
  quizQuestion: string;
  yes: string;
  no: string;
  quizFeedbackCorrect: string;
  quizFeedbackIncorrect: string;
  quizNext: string;
}

const translations: Record<Language, SymmetryTranslations> = {
  en: {
    title: 'Symmetry Play',
    description:
      'Complete a picture across a mirror line and spot shapes that are symmetrical',
    modeComplete: 'Complete the picture',
    modeQuiz: 'Is it symmetrical?',
    puzzleN: 'Puzzle',
    prevPuzzle: 'Previous',
    nextPuzzle: 'Next',
    check: 'Check',
    completeCorrect: 'Yes! The two sides match.',
    completeWrong: 'Not quite — try mirroring each square to the other side.',
    quizQuestion: 'Is this picture symmetrical across the green line?',
    yes: 'Yes',
    no: 'No',
    quizFeedbackCorrect: 'Well done!',
    quizFeedbackIncorrect: 'Look again at both sides of the line.',
    quizNext: 'Next',
  },
  fr: {
    title: 'Jeu de symétrie',
    description:
      'Complète une image de l’autre côté du miroir et reconnais les figures symétriques',
    modeComplete: 'Complète l’image',
    modeQuiz: 'Symétrique ou pas ?',
    puzzleN: 'Puzzle',
    prevPuzzle: 'Précédent',
    nextPuzzle: 'Suivant',
    check: 'Vérifier',
    completeCorrect: 'Bravo ! Les deux côtés correspondent.',
    completeWrong: 'Pas tout à fait — essaie de reporter chaque case de l’autre côté.',
    quizQuestion: 'Cette image est-elle symétrique par rapport à la ligne verte ?',
    yes: 'Oui',
    no: 'Non',
    quizFeedbackCorrect: 'Très bien !',
    quizFeedbackIncorrect: 'Regarde encore les deux côtés de la ligne.',
    quizNext: 'Suivant',
  },
};

export default translations;

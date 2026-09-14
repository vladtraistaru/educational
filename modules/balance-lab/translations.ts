import type { Language } from '@/lib/language-config';
import type { ChallengeKind } from './levels';

export interface BalanceTranslations {
  title: string;
  description: string;
  bigIdea: string;
  bigIdeaDetail: string;
  start: string;
  level: string;
  of: string;
  kindGoal: Record<ChallengeKind, string>;
  fewestGoal: string;
  tray: string;
  trayEmpty: string;
  placeHint: string;
  predictPrompt: string;
  tipsLeft: string;
  staysBalanced: string;
  tipsRight: string;
  release: string;
  tryAgain: string;
  next: string;
  finish: string;
  balanced: string;
  notBalanced: string;
  tippedLeft: string;
  tippedRight: string;
  goodPrediction: string;
  wrongPrediction: string;
  tooManyBlocks: string;
  leftSide: string;
  rightSide: string;
  results: string;
  starsEarned: string;
  levelsSolved: string;
  predictionsRight: string;
  playAgain: string;
  kg: string;
}

const translations: Record<Language, BalanceTranslations> = {
  en: {
    title: 'Balance Lab',
    description:
      'Balance a seesaw by placing weights at the right distance from the pivot. Predict which way it tips, then release and find out — and discover how a small weight can lift a heavy crate',
    bigIdea: 'force × distance',
    bigIdeaDetail:
      'A seesaw balances when the weight times its distance from the pivot is the same on both sides. Move a weight further out and it pushes harder!',
    start: 'Start',
    level: 'Level',
    of: 'of',
    kindGoal: {
      balance: 'Balance the beam.',
      lift: 'Lift the heavy crate with your small block.',
      fewest: 'Balance the beam using as few blocks as you can.',
    },
    fewestGoal: 'Use at most',
    tray: 'Your blocks',
    trayEmpty: 'All blocks placed',
    placeHint: 'Tap a block, then tap a notch to place it.',
    predictPrompt: 'What will happen when you release it?',
    tipsLeft: 'Tips left',
    staysBalanced: 'Stays balanced',
    tipsRight: 'Tips right',
    release: 'Release!',
    tryAgain: 'Try again',
    next: 'Next level',
    finish: 'See results',
    balanced: 'Balanced!',
    notBalanced: 'Not balanced yet',
    tippedLeft: 'It tipped left.',
    tippedRight: 'It tipped right.',
    goodPrediction: 'Great prediction!',
    wrongPrediction: 'Your prediction was off this time.',
    tooManyBlocks: 'It balances — but try it with fewer blocks!',
    leftSide: 'Left',
    rightSide: 'Right',
    results: 'Lab complete!',
    starsEarned: 'Stars',
    levelsSolved: 'Levels solved',
    predictionsRight: 'Right predictions',
    playAgain: 'Play again',
    kg: 'kg',
  },
  fr: {
    title: 'Labo d’Équilibre',
    description:
      'Équilibre une balançoire en plaçant les poids à la bonne distance du pivot. Prédis de quel côté elle penche, puis relâche pour voir — et découvre comment un petit poids peut soulever une lourde caisse',
    bigIdea: 'force × distance',
    bigIdeaDetail:
      'Une balançoire est en équilibre quand le poids multiplié par sa distance au pivot est le même des deux côtés. Plus un poids est éloigné, plus il pousse fort !',
    start: 'Commencer',
    level: 'Niveau',
    of: 'sur',
    kindGoal: {
      balance: 'Équilibre la barre.',
      lift: 'Soulève la caisse lourde avec ton petit bloc.',
      fewest: 'Équilibre la barre avec le moins de blocs possible.',
    },
    fewestGoal: 'Utilise au maximum',
    tray: 'Tes blocs',
    trayEmpty: 'Tous les blocs sont placés',
    placeHint: 'Touche un bloc, puis touche une encoche pour le placer.',
    predictPrompt: 'Que va-t-il se passer quand tu relâches ?',
    tipsLeft: 'Penche à gauche',
    staysBalanced: 'Reste en équilibre',
    tipsRight: 'Penche à droite',
    release: 'Relâcher !',
    tryAgain: 'Réessayer',
    next: 'Niveau suivant',
    finish: 'Voir les résultats',
    balanced: 'En équilibre !',
    notBalanced: 'Pas encore en équilibre',
    tippedLeft: 'Elle a penché à gauche.',
    tippedRight: 'Elle a penché à droite.',
    goodPrediction: 'Bien prédit !',
    wrongPrediction: 'Ta prédiction était fausse cette fois.',
    tooManyBlocks: 'C’est équilibré — mais essaie avec moins de blocs !',
    leftSide: 'Gauche',
    rightSide: 'Droite',
    results: 'Labo terminé !',
    starsEarned: 'Étoiles',
    levelsSolved: 'Niveaux réussis',
    predictionsRight: 'Bonnes prédictions',
    playAgain: 'Rejouer',
    kg: 'kg',
  },
};

export default translations;

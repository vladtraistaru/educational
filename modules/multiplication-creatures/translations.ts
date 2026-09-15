import type { Language } from '@/lib/language-config';
import type { SpeciesId, Quirk } from './creatures';

type StageNames = [string, string, string, string, string];

export interface CreaturesTranslations {
  title: string;
  description: string;
  chooseCreature: string;
  chooseCreatureHint: string;
  start: string;
  species: Record<SpeciesId, string>;
  stageNames: Record<SpeciesId, StageNames>;
  quirkLines: Record<Quirk, string>;
  score: string;
  lives: string;
  streak: string;
  correct: string;
  wrong: string;
  grewUp: string;
  maxStage: string;
  growthHint: string;
  gameOver: string;
  finalScore: string;
  totalCorrect: string;
  bestStreak: string;
  yourCreatureIs: string;
  collected: string;
  playAgain: string;
  pts: string;
}

const translations: Record<Language, CreaturesTranslations> = {
  en: {
    title: 'Multiplication Creatures',
    description:
      'Hatch a fantasy creature and feed it multiplication facts from 1 to 12! Every right answer makes it bigger, wilder and stranger — how huge can it get before you run out of lives?',
    chooseCreature: 'Pick a mystery egg',
    chooseCreatureHint: 'Nobody knows what is inside. Feed it right answers and find out!',
    start: 'Start!',
    species: {
      unicorn: 'Sparkhoof',
      dragon: 'Emberclaw',
      phoenix: 'Sunfeather',
    },
    stageNames: {
      unicorn: ['Glimmer Egg', 'Wobbly Foal', 'Unicorn', 'Winged Alicorn', 'Starlit Celestial'],
      dragon: ['Ember Egg', 'Tiny Wyrmling', 'Dragonling', 'Great Dragon', 'Volcano Titan'],
      phoenix: ['Sun Egg', 'Fluffy Chick', 'Firebird', 'Blazing Phoenix', 'Eternal Sunbird'],
    },
    quirkLines: {
      '🎩': 'It grew a top hat. Out of its head. We have questions.',
      '🕶️': 'It decided the sun is far too bright for a creature this cool.',
      '🧦': 'It grew exactly ONE sock. Only one. Nobody knows why.',
      '🍕': 'It now smells strongly of pizza. This was not in the plan.',
      '🪄': 'It sneezed so hard a magic wand popped out.',
      '🎈': 'A balloon has decided to follow it forever.',
      '🐌': 'A snail moved in. They are best friends now.',
      '🧢': 'It insists the cap is backwards on purpose.',
    },
    score: 'Score',
    lives: 'Lives',
    streak: 'Streak',
    correct: 'Yum! Correct!',
    wrong: 'Oops, not quite!',
    grewUp: 'IT GREW!',
    maxStage: 'Fully grown!',
    growthHint: '{n} more to grow!',
    gameOver: 'Game Over',
    finalScore: 'Final Score',
    totalCorrect: 'Correct Answers',
    bestStreak: 'Best Streak',
    yourCreatureIs: 'Your creature grew into a',
    collected: 'Weird things it picked up',
    playAgain: 'Play Again',
    pts: 'pts',
  },
  fr: {
    title: 'Créatures de Multiplication',
    description:
      'Fais éclore une créature fantastique et nourris-la de multiplications de 1 à 12 ! Chaque bonne réponse la rend plus grande, plus folle et plus étrange — jusqu’où peux-tu la faire grandir ?',
    chooseCreature: 'Choisis un œuf mystère',
    chooseCreatureHint:
      'Personne ne sait ce qu’il y a dedans. Nourris-le de bonnes réponses pour le découvrir !',
    start: 'Commencer !',
    species: {
      unicorn: 'Sabot-Étincelle',
      dragon: 'Griffe-de-Braise',
      phoenix: 'Plume-de-Soleil',
    },
    stageNames: {
      unicorn: ['Œuf scintillant', 'Poulain bancal', 'Licorne', 'Licorne ailée', 'Céleste étoilée'],
      dragon: ['Œuf de braise', 'Petit dragonneau', 'Jeune dragon', 'Grand dragon', 'Titan du volcan'],
      phoenix: ['Œuf de soleil', 'Poussin tout doux', 'Oiseau de feu', 'Phénix flamboyant', 'Soleil éternel'],
    },
    quirkLines: {
      '🎩': 'Un haut-de-forme a poussé sur sa tête. On a des questions.',
      '🕶️': 'Elle trouve le soleil beaucoup trop brillant pour une créature aussi stylée.',
      '🧦': 'Elle a fait pousser UNE chaussette. Une seule. Personne ne sait pourquoi.',
      '🍕': 'Elle sent très fort la pizza. Ce n’était pas prévu.',
      '🪄': 'Elle a éternué si fort qu’une baguette magique est sortie.',
      '🎈': 'Un ballon a décidé de la suivre pour toujours.',
      '🐌': 'Un escargot a emménagé. Ils sont meilleurs amis.',
      '🧢': 'Elle jure que la casquette est à l’envers exprès.',
    },
    score: 'Score',
    lives: 'Vies',
    streak: 'Série',
    correct: 'Miam ! Correct !',
    wrong: 'Oups, pas tout à fait !',
    grewUp: 'ELLE A GRANDI !',
    maxStage: 'Taille maximale !',
    growthHint: 'Encore {n} pour grandir !',
    gameOver: 'Partie Terminée',
    finalScore: 'Score Final',
    totalCorrect: 'Bonnes réponses',
    bestStreak: 'Meilleure série',
    yourCreatureIs: 'Ta créature est devenue une',
    collected: 'Trucs bizarres ramassés',
    playAgain: 'Rejouer',
    pts: 'pts',
  },
};

export default translations;

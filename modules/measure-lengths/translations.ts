import type { Language } from '@/lib/language';

export interface MeasureLengthsTranslations {
  title: string;
  description: string;
  modeRead: string;
  modeCompare: string;
  questionRead: string;
  readSubtext: string;
  measureThisLabel: string;
  choosePrompt: string;
  pickLengthFirst: string;
  checkReady: string;
  pickAnother: string;
  questionCompareTwo: string;
  questionCompareThree: string;
  check: string;
  next: string;
  correct: string;
  tryAgain: string;
  cm: string;
  contexts: Record<string, string>;
  firstLonger: string;
  secondLonger: string;
  sameLength: string;
  barA: string;
  barB: string;
  barC: string;
  rulerAria: string;
}

const translations: Record<Language, MeasureLengthsTranslations> = {
  en: {
    title: 'Measure Lengths',
    description: 'Read centimetres on a ruler and compare lengths',
    modeRead: 'Read the ruler',
    modeCompare: 'Compare',
    questionRead: 'How many centimetres long is the green bar?',
    readSubtext:
      'Start at 0 on the ruler. Count the centimetre marks until you reach the end of the green bar.',
    measureThisLabel: 'Measure this part',
    choosePrompt: 'How long is it?',
    pickLengthFirst: 'Tap one answer below.',
    checkReady: 'Press Check to see if you are right.',
    pickAnother: 'Tap another answer.',
    questionCompareTwo: 'Which strip is longer?',
    questionCompareThree: 'Which strip is the longest?',
    check: 'Check',
    next: 'Next',
    correct: 'Well done!',
    tryAgain: 'Not quite — try again.',
    cm: 'cm',
    contexts: {
      pencil: 'A pencil.',
      ribbon: 'A piece of ribbon.',
      sticker: 'A sticker.',
      crayon: 'A crayon.',
      bookmark: 'A bookmark.',
      straw: 'A drinking straw.',
    },
    firstLonger: 'The first is longer',
    secondLonger: 'The second is longer',
    sameLength: 'Same length',
    barA: 'Red strip',
    barB: 'Blue strip',
    barC: 'Green strip',
    rulerAria: 'Centimetre ruler with a coloured segment from zero',
  },
  fr: {
    title: 'Mesurer des longueurs',
    description: 'Lire des centimètres sur une règle et comparer des longueurs',
    modeRead: 'Lire la règle',
    modeCompare: 'Comparer',
    questionRead: 'Combien de centimètres mesure la barre verte ?',
    readSubtext:
      'Pars de 0 sur la règle. Compte les marques centimètre jusqu’à la fin de la barre verte.',
    measureThisLabel: 'À mesurer',
    choosePrompt: 'Quelle est la longueur ?',
    pickLengthFirst: 'Choisis une réponse ci-dessous.',
    checkReady: 'Appuie sur Vérifier pour voir si c’est juste.',
    pickAnother: 'Choisis une autre réponse.',
    questionCompareTwo: 'Quelle bande est la plus longue ?',
    questionCompareThree: 'Quelle bande est la plus longue ?',
    check: 'Vérifier',
    next: 'Suivant',
    correct: 'Bravo !',
    tryAgain: 'Pas tout à fait — réessaie.',
    cm: 'cm',
    contexts: {
      pencil: 'Un crayon (à écrire).',
      ribbon: 'Un morceau de ruban.',
      sticker: 'Un autocollant.',
      crayon: 'Un crayon de couleur.',
      bookmark: 'Un marque-page.',
      straw: 'Une paille.',
    },
    firstLonger: 'La première est plus longue',
    secondLonger: 'La deuxième est plus longue',
    sameLength: 'Même longueur',
    barA: 'Bande rouge',
    barB: 'Bande bleue',
    barC: 'Bande verte',
    rulerAria: 'Règle en centimètres avec un segment coloré depuis zéro',
  },
};

export default translations;

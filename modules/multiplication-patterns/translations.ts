import type { Language } from '@/lib/language-config';

interface PatternText {
  label: string;
  description: string;
}

export interface MultiplicationTranslations {
  title: string;
  description: string;
  arrayBuilder: string;
  patternExplorer: string;
  rows: string;
  columns: string;
  flipIt: string;
  equation: string;
  total: string;
  sameAnswer: string;
  tapCell: string;
  pickNumber: string;
  onesDigitCycle: string;
  cycleLength: string;
  selectChain: string;
  eachDoubles: string;
  digitSumLegend: string;
  pickTwo: string;
  overlapAt: string;
  multiplesOf: string;
  patterns: Record<string, PatternText>;
}

const translations: Record<Language, MultiplicationTranslations> = {
  en: {
    title: 'Multiplication Patterns',
    description: 'Build arrays, explore the times table grid, and discover hidden patterns in multiplication',
    arrayBuilder: 'Array Builder',
    patternExplorer: 'Pattern Explorer',
    rows: 'rows',
    columns: 'columns',
    flipIt: 'Flip it!',
    equation: 'equation',
    total: 'total',
    sameAnswer: 'Same answer!',
    tapCell: 'Tap any cell to see its mirror',
    pickNumber: 'Pick a number',
    onesDigitCycle: 'Ones digit cycle',
    cycleLength: 'digits before repeating',
    selectChain: 'Pick a chain',
    eachDoubles: 'each doubles!',
    digitSumLegend: 'Digit sum',
    pickTwo: 'Pick two numbers',
    overlapAt: 'Overlap at multiples of',
    multiplesOf: 'Multiples of',
    patterns: {
      'times-table': {
        label: 'Times Table',
        description: 'Pick a number and see its whole times table light up — count by that number!',
      },
      'square-numbers': {
        label: 'Square Numbers',
        description: 'The diagonal shows numbers multiplied by themselves: 1, 4, 9, 16, 25 … these are square numbers!',
      },
      'even-odd': {
        label: 'Even / Odd',
        description: 'Even results are green, odd are purple — can you see the pattern?',
      },
      commutativity: {
        label: 'Mirror',
        description: 'Tap a cell — its mirror across the diagonal has the same answer! 3×5 = 5×3.',
      },
      'nines-trick': {
        label: 'Nines Trick',
        description: 'The digits of every 9× answer add up to 9! Try it: 9×7 = 63 → 6+3 = 9.',
      },
      'ones-digit': {
        label: 'Ones Digit',
        description: 'Pick a number — the last digit of each multiple follows a repeating cycle!',
      },
      doubling: {
        label: 'Doubling',
        description: 'The 4s are double the 2s, the 8s are double the 4s. Double-double-double!',
      },
      'digit-sum': {
        label: 'Digit Sum',
        description: 'Add each product\'s digits until you get one digit — beautiful diagonal stripes appear!',
      },
      'multiples-overlap': {
        label: 'Overlap',
        description: 'Pick two numbers — where their multiples overlap, you find multiples of a bigger number!',
      },
    },
  },
  fr: {
    title: 'Patterns de Multiplication',
    description: 'Construis des tableaux, explore la grille de multiplication et découvre les patterns cachés',
    arrayBuilder: 'Construire un tableau',
    patternExplorer: 'Explorer les patterns',
    rows: 'lignes',
    columns: 'colonnes',
    flipIt: 'Retourner !',
    equation: 'équation',
    total: 'total',
    sameAnswer: 'Même résultat !',
    tapCell: 'Touche une case pour voir son miroir',
    pickNumber: 'Choisis un nombre',
    onesDigitCycle: 'Cycle du chiffre des unités',
    cycleLength: 'chiffres avant de se répéter',
    selectChain: 'Choisis une chaîne',
    eachDoubles: 'chaque fois le double !',
    digitSumLegend: 'Somme des chiffres',
    pickTwo: 'Choisis deux nombres',
    overlapAt: 'Se croisent aux multiples de',
    multiplesOf: 'Multiples de',
    patterns: {
      'times-table': {
        label: 'Table de multiplication',
        description: 'Choisis un nombre et vois toute sa table s\'allumer — compte par ce nombre !',
      },
      'square-numbers': {
        label: 'Nombres carrés',
        description: 'La diagonale montre les nombres multipliés par eux-mêmes : 1, 4, 9, 16, 25 … ce sont les nombres carrés !',
      },
      'even-odd': {
        label: 'Pair / Impair',
        description: 'Les résultats pairs sont en vert, les impairs en violet — vois-tu le motif ?',
      },
      commutativity: {
        label: 'Miroir',
        description: 'Touche une case — son miroir de l\'autre côté de la diagonale a le même résultat ! 3×5 = 5×3.',
      },
      'nines-trick': {
        label: 'Astuce du 9',
        description: 'Les chiffres de chaque résultat de 9× s\'additionnent pour faire 9 ! Essaie : 9×7 = 63 → 6+3 = 9.',
      },
      'ones-digit': {
        label: 'Chiffre des unités',
        description: 'Choisis un nombre — le dernier chiffre de chaque multiple suit un cycle qui se répète !',
      },
      doubling: {
        label: 'Doublement',
        description: 'Les 4 sont le double des 2, les 8 le double des 4. Double-double-double !',
      },
      'digit-sum': {
        label: 'Somme des chiffres',
        description: 'Additionne les chiffres de chaque produit jusqu\'à obtenir un seul chiffre — de belles rayures diagonales apparaissent !',
      },
      'multiples-overlap': {
        label: 'Chevauchement',
        description: 'Choisis deux nombres — là où leurs multiples se croisent, tu trouves les multiples d\'un plus grand nombre !',
      },
    },
  },
};

export default translations;

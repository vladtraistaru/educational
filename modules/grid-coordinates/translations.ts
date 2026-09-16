import type { Language } from '@/lib/language';
import type { Direction } from './grid';

export interface GridTranslations extends Record<Direction, string> {
  title: string;
  description: string;
  modeFind: string;
  modeName: string;
  modePath: string;
  small: string;
  large: string;
  mapLabel: string;
  findPrompt: string;
  namePrompt: string;
  pathPrompt: string;
  hint: string;
  findCorrect: string;
  findWrongCol: string;
  findWrongRow: string;
  nameCorrect: string;
  nameWrong: string;
  pathCorrect: string;
  pathWrong: string;
  pathShown: string;
  next: string;
  streak: string;
}

const translations: Record<Language, GridTranslations> = {
  en: {
    title: 'Grid Coordinates',
    description: 'Find cells like C4 on a treasure map and follow a pirate’s moves',
    modeFind: 'Find the cell',
    modeName: 'Name the cell',
    modePath: 'Follow the path',
    small: 'Small 5×5',
    large: 'Large 8×8',
    mapLabel: 'Treasure map',
    findPrompt: 'Click on cell {cell}.',
    namePrompt: 'Where is the treasure?',
    pathPrompt: 'The pirate follows these moves. Tap the cell where he lands.',
    hint: 'Letter first: go along the bottom to the column, then up to the row.',
    findCorrect: 'You found the treasure!',
    findWrongCol: 'That’s {pick}. Look for column {col}.',
    findWrongRow: 'That’s {pick}. Look for row {row}.',
    nameCorrect: 'Yes! The treasure is at {cell}.',
    nameWrong: 'Not quite. The treasure is at {cell}: column {col}, row {row}.',
    pathCorrect: 'Ahoy! The pirate reached the treasure.',
    pathWrong: 'Not quite — try following one move at a time.',
    pathShown: 'Not quite — follow the faint path on the map.',
    up: 'up',
    down: 'down',
    left: 'left',
    right: 'right',
    next: 'Next',
    streak: 'correct in a row',
  },
  fr: {
    title: 'Coordonnées sur quadrillage',
    description: 'Trouve des cases comme C4 sur une carte au trésor et suis les déplacements du pirate',
    modeFind: 'Trouver la case',
    modeName: 'Nommer la case',
    modePath: 'Suivre le chemin',
    small: 'Petit 5×5',
    large: 'Grand 8×8',
    mapLabel: 'Carte au trésor',
    findPrompt: 'Clique sur la case {cell}.',
    namePrompt: 'Où est le trésor ?',
    pathPrompt: 'Le pirate suit ces déplacements. Touche la case où il arrive.',
    hint: 'La lettre d’abord : avance le long du bas jusqu’à la colonne, puis monte jusqu’à la ligne.',
    findCorrect: 'Tu as trouvé le trésor !',
    findWrongCol: 'Ça, c’est {pick}. Cherche la colonne {col}.',
    findWrongRow: 'Ça, c’est {pick}. Cherche la ligne {row}.',
    nameCorrect: 'Oui ! Le trésor est en {cell}.',
    nameWrong: 'Pas tout à fait. Le trésor est en {cell} : colonne {col}, ligne {row}.',
    pathCorrect: 'Bravo ! Le pirate a atteint le trésor.',
    pathWrong: 'Pas tout à fait — suis un déplacement à la fois.',
    pathShown: 'Pas tout à fait — suis le chemin dessiné sur la carte.',
    up: 'haut',
    down: 'bas',
    left: 'gauche',
    right: 'droite',
    next: 'Suivant',
    streak: 'réussis de suite',
  },
};

export default translations;

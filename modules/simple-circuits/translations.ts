import type { Language } from '@/lib/language';

interface SimpleCircuitsStrings {
  title: string;
  description: string;
  paletteTitle: string;
  bulb: string;
  switchLabel: string;
  tip: string;
  resetButton: string;
  trash: string;
}

const translations: Record<Language, SimpleCircuitsStrings> = {
  en: {
    title: 'Simple Circuits',
    description: '',
    paletteTitle: 'Parts',
    bulb: 'Bulb',
    switchLabel: 'Switch',
    tip: 'Drag parts onto the board. Click two terminals to connect them with a wire.',
    resetButton: 'Reset',
    trash: 'Drag here to remove',
  },
  fr: {
    title: 'Circuits simples',
    description: '',
    paletteTitle: 'Pièces',
    bulb: 'Ampoule',
    switchLabel: 'Interrupteur',
    tip: 'Fais glisser les pièces sur le plateau. Clique sur deux bornes pour les relier par un fil.',
    resetButton: 'Réinitialiser',
    trash: 'Glisse ici pour supprimer',
  },
};

export default translations;

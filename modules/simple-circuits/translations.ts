import type { Language } from '@/lib/language';

interface SimpleCircuitsStrings {
  title: string;
  description: string;
  paletteTitle: string;
  bulb: string;
  switchLabel: string;
  resistor: string;
  capacitor: string;
  tip: string;
  resetButton: string;
  powerLabel: string;
  powerStateOn: string;
  powerStateOff: string;
  trash: string;
}

const translations: Record<Language, SimpleCircuitsStrings> = {
  en: {
    title: 'Simple Circuits',
    description: '',
    paletteTitle: 'Parts',
    bulb: 'Bulb',
    switchLabel: 'Switch',
    resistor: 'Resistor',
    capacitor: 'Capacitor',
    tip: 'Drag parts onto the board. Click two terminals to connect them with a wire. A resistor controls bulb brightness; a capacitor stores charge and lets the bulb flash, then fade.',
    resetButton: 'Reset',
    powerLabel: 'Power',
    powerStateOn: 'ON',
    powerStateOff: 'OFF',
    trash: 'Drag here to remove',
  },
  fr: {
    title: 'Circuits simples',
    description: '',
    paletteTitle: 'Pièces',
    bulb: 'Ampoule',
    switchLabel: 'Interrupteur',
    resistor: 'Résistance',
    capacitor: 'Condensateur',
    tip: "Fais glisser les pièces sur le plateau. Clique sur deux bornes pour les relier par un fil. La résistance règle la brillance de l'ampoule ; le condensateur stocke de la charge et fait clignoter l'ampoule avant qu'elle s'éteigne.",
    resetButton: 'Réinitialiser',
    powerLabel: 'Alim.',
    powerStateOn: 'MARCHE',
    powerStateOff: 'ARRÊT',
    trash: 'Glisse ici pour supprimer',
  },
};

export default translations;

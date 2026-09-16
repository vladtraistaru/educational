import type { ElementSymbol } from '@/lib/science/chemistry';

export interface LayoutAtom {
  el: ElementSymbol;
  x: number;
  y: number;
}

// [atomIndexA, atomIndexB, order] — order 0 draws a dashed "ionic" link
export type Bond = [number, number, 0 | 1 | 2 | 3];

export interface Molecule {
  id: string;
  formula: string;
  emoji: string;
  atoms: LayoutAtom[];
  bonds: Bond[];
}

export const MOLECULES: Molecule[] = [
  {
    id: 'hydrogen', formula: 'H2', emoji: '☀️',
    atoms: [{ el: 'H', x: 0, y: 0 }, { el: 'H', x: 1, y: 0 }],
    bonds: [[0, 1, 1]],
  },
  {
    id: 'oxygen', formula: 'O2', emoji: '🌳',
    atoms: [{ el: 'O', x: 0, y: 0 }, { el: 'O', x: 1.2, y: 0 }],
    bonds: [[0, 1, 2]],
  },
  {
    id: 'nitrogen', formula: 'N2', emoji: '🌬️',
    atoms: [{ el: 'N', x: 0, y: 0 }, { el: 'N', x: 1.2, y: 0 }],
    bonds: [[0, 1, 3]],
  },
  {
    id: 'chlorine', formula: 'Cl2', emoji: '🏊',
    atoms: [{ el: 'Cl', x: 0, y: 0 }, { el: 'Cl', x: 1.3, y: 0 }],
    bonds: [[0, 1, 1]],
  },
  {
    id: 'water', formula: 'H2O', emoji: '💧',
    atoms: [{ el: 'O', x: 1, y: 0 }, { el: 'H', x: 0.2, y: 0.65 }, { el: 'H', x: 1.8, y: 0.65 }],
    bonds: [[0, 1, 1], [0, 2, 1]],
  },
  {
    id: 'salt', formula: 'NaCl', emoji: '🌊',
    atoms: [{ el: 'Na', x: 0, y: 0 }, { el: 'Cl', x: 1.3, y: 0 }],
    bonds: [[0, 1, 0]],
  },
  {
    id: 'carbon-dioxide', formula: 'CO2', emoji: '🫧',
    atoms: [{ el: 'O', x: 0, y: 0 }, { el: 'C', x: 1.2, y: 0 }, { el: 'O', x: 2.4, y: 0 }],
    bonds: [[0, 1, 2], [1, 2, 2]],
  },
  {
    id: 'ammonia', formula: 'NH3', emoji: '🌱',
    atoms: [
      { el: 'N', x: 1, y: 0 }, { el: 'H', x: 0.1, y: 0.6 },
      { el: 'H', x: 1, y: 1.05 }, { el: 'H', x: 1.9, y: 0.6 },
    ],
    bonds: [[0, 1, 1], [0, 2, 1], [0, 3, 1]],
  },
  {
    id: 'ozone', formula: 'O3', emoji: '🛡️',
    atoms: [{ el: 'O', x: 0, y: 0.6 }, { el: 'O', x: 1, y: 0 }, { el: 'O', x: 2, y: 0.6 }],
    bonds: [[0, 1, 2], [1, 2, 1]],
  },
  {
    id: 'hydrochloric-acid', formula: 'HCl', emoji: '🍽️',
    atoms: [{ el: 'H', x: 0, y: 0 }, { el: 'Cl', x: 1.1, y: 0 }],
    bonds: [[0, 1, 1]],
  },
  {
    id: 'carbon-monoxide', formula: 'CO', emoji: '🚨',
    atoms: [{ el: 'C', x: 0, y: 0 }, { el: 'O', x: 1.2, y: 0 }],
    bonds: [[0, 1, 3]],
  },
  {
    id: 'hydrogen-sulfide', formula: 'H2S', emoji: '🥚',
    atoms: [{ el: 'S', x: 1, y: 0 }, { el: 'H', x: 0.15, y: 0.7 }, { el: 'H', x: 1.85, y: 0.7 }],
    bonds: [[0, 1, 1], [0, 2, 1]],
  },
  {
    id: 'sulfur-dioxide', formula: 'SO2', emoji: '🌋',
    atoms: [{ el: 'S', x: 1.1, y: 0 }, { el: 'O', x: 0, y: 0.7 }, { el: 'O', x: 2.2, y: 0.7 }],
    bonds: [[0, 1, 2], [0, 2, 2]],
  },
  {
    id: 'nitric-oxide', formula: 'NO', emoji: '⚡',
    atoms: [{ el: 'N', x: 0, y: 0 }, { el: 'O', x: 1.2, y: 0 }],
    bonds: [[0, 1, 2]],
  },
  {
    id: 'hydrogen-peroxide', formula: 'H2O2', emoji: '🩹',
    atoms: [
      { el: 'H', x: 0, y: 0.65 }, { el: 'O', x: 0.7, y: 0 },
      { el: 'O', x: 1.9, y: 0 }, { el: 'H', x: 2.6, y: -0.65 },
    ],
    bonds: [[0, 1, 1], [1, 2, 1], [2, 3, 1]],
  },
  {
    id: 'sodium-hydroxide', formula: 'NaOH', emoji: '🧼',
    atoms: [{ el: 'Na', x: 0, y: 0 }, { el: 'O', x: 1.3, y: 0 }, { el: 'H', x: 2.25, y: 0 }],
    bonds: [[0, 1, 0], [1, 2, 1]],
  },
  {
    id: 'baking-soda', formula: 'NaHCO3', emoji: '🧁',
    atoms: [
      { el: 'Na', x: 0, y: 0 }, { el: 'O', x: 1.3, y: 0 }, { el: 'C', x: 2.35, y: 0.6 },
      { el: 'O', x: 2.35, y: 1.8 }, { el: 'O', x: 3.4, y: 0 }, { el: 'H', x: 4.3, y: 0 },
    ],
    bonds: [[0, 1, 0], [1, 2, 1], [2, 3, 2], [2, 4, 1], [4, 5, 1]],
  },
];

export function getMolecule(id: string): Molecule {
  const molecule = MOLECULES.find((m) => m.id === id);
  if (!molecule) throw new Error(`Unknown molecule: ${id}`);
  return molecule;
}

import {
  compositionDiff,
  countAtoms,
  parseFormula,
  sameComposition,
  type CompositionDiff,
  type ElementSymbol,
} from '@/lib/science/chemistry';
import { getMolecule, MOLECULES, type Molecule } from './molecules';

export const MAX_BOWL_ATOMS = 8;
export const ALMOST_DISTANCE = 2;

export function findMolecule(atoms: ElementSymbol[]): Molecule | undefined {
  if (atoms.length === 0) return undefined;
  const comp = countAtoms(atoms);
  return MOLECULES.find((m) => sameComposition(parseFormula(m.formula), comp));
}

export function hintFor(moleculeId: string, atoms: ElementSymbol[]): CompositionDiff {
  return compositionDiff(parseFormula(getMolecule(moleculeId).formula), countAtoms(atoms));
}

export function closestHint(atoms: ElementSymbol[]): CompositionDiff | undefined {
  if (atoms.length === 0) return undefined;
  let best: CompositionDiff | undefined;
  for (const m of MOLECULES) {
    const diff = hintFor(m.id, atoms);
    if (!best || diff.distance < best.distance) best = diff;
  }
  return best && best.distance <= ALMOST_DISTANCE ? best : undefined;
}

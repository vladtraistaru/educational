import { describe, expect, it } from 'vitest';
import { parseFormula, totalAtoms } from '@/lib/science/chemistry';
import { closestHint, findMolecule, hintFor, MAX_BOWL_ATOMS } from './lab';
import { MOLECULES } from './molecules';
import moleculeFacts from './moleculeFacts';

describe('molecule data', () => {
  it('has unique ids and formulas', () => {
    expect(new Set(MOLECULES.map((m) => m.id)).size).toBe(MOLECULES.length);
    expect(new Set(MOLECULES.map((m) => m.formula)).size).toBe(MOLECULES.length);
  });

  it('layouts contain exactly the atoms of the formula', () => {
    for (const m of MOLECULES) {
      const fromLayout = findMolecule(m.atoms.map((a) => a.el));
      expect(fromLayout?.id).toBe(m.id);
    }
  });

  it('bonds reference existing atoms', () => {
    for (const m of MOLECULES) {
      for (const [a, b] of m.bonds) {
        expect(m.atoms[a]).toBeDefined();
        expect(m.atoms[b]).toBeDefined();
      }
    }
  });

  it('every molecule fits in the bowl', () => {
    for (const m of MOLECULES) {
      expect(totalAtoms(parseFormula(m.formula))).toBeLessThanOrEqual(MAX_BOWL_ATOMS);
    }
  });

  it('every molecule has facts in every language', () => {
    for (const lang of ['en', 'fr'] as const) {
      for (const m of MOLECULES) expect(moleculeFacts[lang][m.id]?.name).toBeTruthy();
    }
  });
});

describe('findMolecule', () => {
  it('matches regardless of atom order', () => {
    expect(findMolecule(['H', 'O', 'H'])?.id).toBe('water');
    expect(findMolecule(['O', 'Na', 'C', 'O', 'H', 'O'])?.id).toBe('baking-soda');
  });

  it('returns undefined for unknown or empty mixes', () => {
    expect(findMolecule([])).toBeUndefined();
    expect(findMolecule(['C', 'C', 'C'])).toBeUndefined();
  });
});

describe('hints', () => {
  it('hintFor tells what to add and remove for a target', () => {
    const diff = hintFor('water', ['H', 'O', 'O']);
    expect(diff.missing).toEqual({ H: 1 });
    expect(diff.extra).toEqual({ O: 1 });
  });

  it('closestHint finds a near molecule', () => {
    expect(closestHint(['H', 'O'])?.distance).toBe(1);
  });

  it('closestHint gives up when nothing is close', () => {
    expect(closestHint(['C', 'C', 'C', 'C', 'C'])).toBeUndefined();
  });
});

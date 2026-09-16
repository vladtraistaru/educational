import { describe, expect, it } from 'vitest';
import {
  compositionDiff,
  compositionEntries,
  countAtoms,
  parseFormula,
  sameComposition,
  totalAtoms,
} from './formula';

describe('parseFormula', () => {
  it('parses simple and multi-letter formulas', () => {
    expect(parseFormula('H2O')).toEqual({ H: 2, O: 1 });
    expect(parseFormula('NaCl')).toEqual({ Na: 1, Cl: 1 });
    expect(parseFormula('NaHCO3')).toEqual({ Na: 1, H: 1, C: 1, O: 3 });
  });

  it('merges repeated symbols', () => {
    expect(parseFormula('HOOH')).toEqual({ H: 2, O: 2 });
  });

  it('rejects unknown elements', () => {
    expect(() => parseFormula('Fe2O3')).toThrow();
  });
});

describe('countAtoms / totalAtoms', () => {
  it('counts a list of symbols', () => {
    const comp = countAtoms(['H', 'O', 'H']);
    expect(comp).toEqual({ H: 2, O: 1 });
    expect(totalAtoms(comp)).toBe(3);
  });
});

describe('sameComposition', () => {
  it('ignores order and zero counts', () => {
    expect(sameComposition({ H: 2, O: 1 }, { O: 1, H: 2, C: 0 })).toBe(true);
    expect(sameComposition({ H: 2, O: 1 }, { H: 2, O: 2 })).toBe(false);
  });
});

describe('compositionDiff', () => {
  it('reports missing and extra atoms', () => {
    const diff = compositionDiff({ H: 2, O: 1 }, { H: 1, O: 1, C: 1 });
    expect(diff.missing).toEqual({ H: 1 });
    expect(diff.extra).toEqual({ C: 1 });
    expect(diff.distance).toBe(2);
  });
});

describe('compositionEntries', () => {
  it('lists non-zero entries in element order', () => {
    expect(compositionEntries({ O: 1, H: 2, C: 0 })).toEqual([
      ['H', 2],
      ['O', 1],
    ]);
  });
});

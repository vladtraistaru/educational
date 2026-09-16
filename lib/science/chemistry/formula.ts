import { ELEMENT_ORDER, isElementSymbol, type ElementSymbol } from './elements';

export type Composition = Partial<Record<ElementSymbol, number>>;

export function parseFormula(formula: string): Composition {
  const comp: Composition = {};
  const matches = formula.matchAll(/([A-Z][a-z]?)(\d*)/g);
  for (const [, symbol, digits] of matches) {
    if (!isElementSymbol(symbol)) throw new Error(`Unknown element: ${symbol}`);
    comp[symbol] = (comp[symbol] ?? 0) + (digits ? Number(digits) : 1);
  }
  return comp;
}

export function countAtoms(symbols: ElementSymbol[]): Composition {
  const comp: Composition = {};
  for (const s of symbols) comp[s] = (comp[s] ?? 0) + 1;
  return comp;
}

export function totalAtoms(comp: Composition): number {
  return Object.values(comp).reduce((sum, n) => sum + (n ?? 0), 0);
}

export function sameComposition(a: Composition, b: Composition): boolean {
  return ELEMENT_ORDER.every((s) => (a[s] ?? 0) === (b[s] ?? 0));
}

export interface CompositionDiff {
  missing: Composition;
  extra: Composition;
  distance: number;
}

export function compositionDiff(target: Composition, current: Composition): CompositionDiff {
  const missing: Composition = {};
  const extra: Composition = {};
  let distance = 0;
  for (const s of ELEMENT_ORDER) {
    const delta = (target[s] ?? 0) - (current[s] ?? 0);
    if (delta > 0) missing[s] = delta;
    if (delta < 0) extra[s] = -delta;
    distance += Math.abs(delta);
  }
  return { missing, extra, distance };
}

export function compositionEntries(comp: Composition): [ElementSymbol, number][] {
  return ELEMENT_ORDER.filter((s) => (comp[s] ?? 0) > 0).map((s) => [s, comp[s]!]);
}

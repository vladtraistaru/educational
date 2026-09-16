export type ElementSymbol = 'H' | 'C' | 'N' | 'O' | 'Na' | 'Cl' | 'S';

export interface Element {
  symbol: ElementSymbol;
  atomicNumber: number;
  hands: number; // usual number of bonds, kid-friendly "valence"
  color: string;
  textColor: string;
  radius: number; // relative drawing size
}

export const ELEMENTS: Record<ElementSymbol, Element> = {
  H: { symbol: 'H', atomicNumber: 1, hands: 1, color: '#f5f6fa', textColor: '#2d3436', radius: 0.32 },
  C: { symbol: 'C', atomicNumber: 6, hands: 4, color: '#2d3436', textColor: '#ffffff', radius: 0.42 },
  N: { symbol: 'N', atomicNumber: 7, hands: 3, color: '#0984e3', textColor: '#ffffff', radius: 0.42 },
  O: { symbol: 'O', atomicNumber: 8, hands: 2, color: '#d63031', textColor: '#ffffff', radius: 0.42 },
  Na: { symbol: 'Na', atomicNumber: 11, hands: 1, color: '#8c7ae6', textColor: '#ffffff', radius: 0.48 },
  Cl: { symbol: 'Cl', atomicNumber: 17, hands: 1, color: '#00b894', textColor: '#ffffff', radius: 0.48 },
  S: { symbol: 'S', atomicNumber: 16, hands: 2, color: '#fdcb6e', textColor: '#2d3436', radius: 0.48 },
};

export const ELEMENT_ORDER: ElementSymbol[] = ['H', 'O', 'N', 'C', 'Na', 'Cl', 'S'];

export function isElementSymbol(value: string): value is ElementSymbol {
  return value in ELEMENTS;
}

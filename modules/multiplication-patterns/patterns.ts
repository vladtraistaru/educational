import { digitalRoot, gcd, lcm } from '@/lib/math/number-theory';

export { digitalRoot, gcd, lcm };

export interface Pattern {
  id: string;
  icon: string;
  color: string;
  getCellHighlight: (
    row: number,
    col: number,
    product: number,
    selected?: number,
  ) => boolean;
  getCellColor?: (
    row: number,
    col: number,
    product: number,
    selected?: number,
  ) => string | null;
}

const ONES_DIGIT_COLORS = [
  '#636e72', '#ff6b6b', '#ffa502', '#ffd43b', '#51cf66',
  '#20c997', '#22b8cf', '#339af0', '#7950f2', '#cc5de8',
];

const DIGIT_SUM_COLORS = [
  '', '#ff6b6b', '#ffa502', '#ffd43b', '#51cf66', '#20c997',
  '#22b8cf', '#339af0', '#7950f2', '#cc5de8',
];

const DOUBLING_SHADES: Record<string, [string, string, string]> = {
  '2-4-8': ['#74b9ff', '#0984e3', '#0652a3'],
  '3-6-12': ['#81ecec', '#00cec9', '#007a78'],
};

const OVERLAP_COLORS = {
  a: 'rgba(9, 132, 227, 0.35)',
  b: 'rgba(253, 203, 110, 0.45)',
  both: '#e17055',
};

export const patterns: Pattern[] = [
  {
    id: 'times-table',
    icon: '#',
    color: '#0984e3',
    getCellHighlight: (row, col, _product, selected) =>
      selected !== undefined && (row === selected || col === selected),
  },
  {
    id: 'square-numbers',
    icon: '▪',
    color: '#6c5ce7',
    getCellHighlight: (row, col) => row === col,
  },
  {
    id: 'even-odd',
    icon: '⊞',
    color: '#00b894',
    getCellHighlight: () => true,
  },
  {
    id: 'commutativity',
    icon: '⇄',
    color: '#e17055',
    getCellHighlight: (row, col, _product, selected) => {
      if (selected === undefined) return false;
      const selRow = Math.floor(selected / 100);
      const selCol = selected % 100;
      return (
        (row === selRow && col === selCol) ||
        (row === selCol && col === selRow)
      );
    },
  },
  {
    id: 'nines-trick',
    icon: '9',
    color: '#fdcb6e',
    getCellHighlight: (row, col) => row === 9 || col === 9,
  },
  {
    id: 'ones-digit',
    icon: '◎',
    color: '#e84393',
    getCellHighlight: (row, col, _product, selected) =>
      selected !== undefined && (row === selected || col === selected),
    getCellColor: (row, col, _product, selected) => {
      if (selected === undefined) return null;
      if (row !== selected && col !== selected) return null;
      const product = row * col;
      return ONES_DIGIT_COLORS[product % 10];
    },
  },
  {
    id: 'doubling',
    icon: '×2',
    color: '#0984e3',
    getCellHighlight: (row, col, _product, selected) => {
      if (selected === undefined) return false;
      const chain = getDoublingChainNumbers(selected);
      return chain.includes(row) || chain.includes(col);
    },
    getCellColor: (row, col, _product, selected) => {
      if (selected === undefined) return null;
      const chain = getDoublingChainNumbers(selected);
      const chainKey = selected === 1 ? '2-4-8' : '3-6-12';
      const shades = DOUBLING_SHADES[chainKey];
      for (let i = 0; i < chain.length; i++) {
        if (row === chain[i] || col === chain[i]) return shades[i];
      }
      return null;
    },
  },
  {
    id: 'digit-sum',
    icon: 'Σ',
    color: '#6c5ce7',
    getCellHighlight: () => true,
    getCellColor: (_row, _col, product) => {
      const dr = digitalRoot(product);
      return DIGIT_SUM_COLORS[dr] ?? null;
    },
  },
  {
    id: 'multiples-overlap',
    icon: '∩',
    color: '#e17055',
    getCellHighlight: (_row, _col, product, selected) => {
      if (selected === undefined) return false;
      const a = Math.floor(selected / 100);
      const b = selected % 100;
      return product % a === 0 || product % b === 0;
    },
    getCellColor: (_row, _col, product, selected) => {
      if (selected === undefined) return null;
      const a = Math.floor(selected / 100);
      const b = selected % 100;
      const divA = product % a === 0;
      const divB = product % b === 0;
      if (divA && divB) return OVERLAP_COLORS.both;
      if (divA) return OVERLAP_COLORS.a;
      if (divB) return OVERLAP_COLORS.b;
      return null;
    },
  },
];

export function getPattern(id: string): Pattern | undefined {
  return patterns.find((p) => p.id === id);
}

export function getNinesDigitSum(n: number): { product: number; digits: string; sum: number } {
  const product = 9 * n;
  const digits = String(product).split('').join(' + ');
  return { product, digits, sum: digitalRoot(product) };
}

export function getOnesDigitCycle(n: number): number[] {
  const cycle: number[] = [];
  for (let i = 1; i <= 12; i++) {
    cycle.push((n * i) % 10);
  }
  return cycle;
}

export function getDoublingChainNumbers(chainId: number): number[] {
  if (chainId === 1) return [2, 4, 8];
  return [3, 6, 12];
}

export const DOUBLING_CHAINS = [
  { id: 1, label: '2 → 4 → 8' },
  { id: 2, label: '3 → 6 → 12' },
];

export { ONES_DIGIT_COLORS, DIGIT_SUM_COLORS };

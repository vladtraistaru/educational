export type MirrorAxis = 'vertical' | 'horizontal';

export function axisIndex(size: number): number {
  return (size - 1) / 2;
}

export function cellKey(row: number, col: number): string {
  return `${row},${col}`;
}

export function parseCellKey(key: string): [number, number] {
  const [r, c] = key.split(',').map(Number);
  return [r, c];
}

export function reflectCell(
  row: number,
  col: number,
  axis: MirrorAxis,
  size: number,
): [number, number] {
  const c = axisIndex(size);
  if (axis === 'vertical') {
    return [row, 2 * c - col];
  }
  return [2 * c - row, col];
}

export function expectedEditableCells(
  fixedCells: Iterable<[number, number]>,
  axis: MirrorAxis,
  size: number,
): Set<string> {
  const c = axisIndex(size);
  const out = new Set<string>();
  for (const [row, col] of fixedCells) {
    if (axis === 'vertical') {
      if (col >= c) continue;
    } else {
      if (row >= c) continue;
    }
    const [rr, cc] = reflectCell(row, col, axis, size);
    out.add(cellKey(rr, cc));
  }
  return out;
}

export function isCellEditable(
  row: number,
  col: number,
  axis: MirrorAxis,
  size: number,
): boolean {
  const c = axisIndex(size);
  if (axis === 'vertical') {
    return col > c;
  }
  return row > c;
}

export function isCellFixed(
  row: number,
  col: number,
  axis: MirrorAxis,
  size: number,
): boolean {
  const c = axisIndex(size);
  if (axis === 'vertical') {
    return col < c;
  }
  return row < c;
}

export function isOnAxis(
  row: number,
  col: number,
  axis: MirrorAxis,
  size: number,
): boolean {
  const c = axisIndex(size);
  if (axis === 'vertical') {
    return col === c;
  }
  return row === c;
}

export function matchesReflection(
  userFilled: Set<string>,
  fixedCells: Iterable<[number, number]>,
  axis: MirrorAxis,
  size: number,
): boolean {
  const expected = expectedEditableCells(fixedCells, axis, size);
  if (userFilled.size !== expected.size) return false;
  for (const k of expected) {
    if (!userFilled.has(k)) return false;
  }
  return true;
}

export function gridHasReflectionSymmetry(
  filled: Set<string>,
  axis: MirrorAxis,
  size: number,
): boolean {
  const c = axisIndex(size);
  for (const key of filled) {
    const [row, col] = parseCellKey(key);
    const [rr, cc] = reflectCell(row, col, axis, size);
    if (axis === 'vertical') {
      if (col === c) continue;
    } else {
      if (row === c) continue;
    }
    if (!filled.has(cellKey(rr, cc))) return false;
  }
  return true;
}

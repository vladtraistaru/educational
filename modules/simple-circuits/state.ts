export type ComponentKind = 'battery' | 'bulb' | 'switch' | 'resistor';
export type Terminal = 'a' | 'b';
export type Rotation = 0 | 90 | 180 | 270;

export interface PlacedComponent {
  id: string;
  kind: ComponentKind;
  x: number;
  y: number;
  rotation: Rotation;
  closed?: boolean;
  ohms?: number;
}

export const RESISTOR_OHMS_OPTIONS = [10, 50, 100, 250, 500] as const;
export const DEFAULT_RESISTOR_OHMS = 100;

export interface TerminalRef {
  componentId: string;
  terminal: Terminal;
}

export interface WireLink {
  id: string;
  from: TerminalRef;
  to: TerminalRef;
}

export interface SimResult {
  componentCurrent: Map<string, number>;
  wireCurrent: Map<string, number>;
  bulbLit: Map<string, boolean>;
  bulbBurnt: Map<string, boolean>;
  wireReversed: Map<string, boolean>;
  shortCircuit: boolean;
}

export const COMPONENT_WIDTH = 80;
export const COMPONENT_HEIGHT = 50;
export const TERMINAL_RADIUS = 6;
export const BULB_LIT_THRESHOLD = 0.005;

export function getTerminalPosition(c: PlacedComponent, t: Terminal): { x: number; y: number } {
  const localX = (t === 'a' ? -1 : 1) * (COMPONENT_WIDTH / 2);
  const r = rotateLocal(localX, 0, c.rotation);
  return { x: c.x + r.x, y: c.y + r.y };
}

export function getTerminalOutward(c: PlacedComponent, t: Terminal): { x: number; y: number } {
  const localDx = t === 'a' ? -1 : 1;
  return rotateLocal(localDx, 0, c.rotation);
}

function rotateLocal(x: number, y: number, deg: Rotation): { x: number; y: number } {
  switch (deg) {
    case 0: return { x, y };
    case 90: return { x: -y, y: x };
    case 180: return { x: -x, y: -y };
    case 270: return { x: y, y: -x };
  }
}

export function findTerminalAt(
  placed: PlacedComponent[],
  x: number,
  y: number,
): TerminalRef | null {
  for (const c of placed) {
    for (const t of ['a', 'b'] as Terminal[]) {
      const p = getTerminalPosition(c, t);
      const dx = x - p.x;
      const dy = y - p.y;
      if (dx * dx + dy * dy <= TERMINAL_RADIUS * TERMINAL_RADIUS * 4) {
        return { componentId: c.id, terminal: t };
      }
    }
  }
  return null;
}

export function terminalKey(ref: TerminalRef): string {
  return `${ref.componentId}:${ref.terminal}`;
}

export function sameTerminal(a: TerminalRef, b: TerminalRef): boolean {
  return a.componentId === b.componentId && a.terminal === b.terminal;
}

export interface Pt {
  x: number;
  y: number;
}

const WIRE_STUB = 20;

/**
 * Manhattan route between two terminals. Each end leaves along its outward
 * direction (the stub) before turning, so wires never cross component bodies
 * at the connection points. The intermediate routing always preserves the
 * stub directions: wire exits `from` along fOut, and arrives at `to` from
 * the −tOut direction.
 */
export function routeOrthogonal(
  from: Pt,
  fOut: Pt,
  to: Pt,
  tOut: Pt,
): Pt[] {
  const fStub = { x: from.x + fOut.x * WIRE_STUB, y: from.y + fOut.y * WIRE_STUB };
  const tStub = { x: to.x + tOut.x * WIRE_STUB, y: to.y + tOut.y * WIRE_STUB };

  const fHorizontal = fOut.x !== 0;
  const tHorizontal = tOut.x !== 0;

  if (fHorizontal && tHorizontal) {
    if (fStub.y === tStub.y && (tStub.x - fStub.x) * fOut.x > 0) {
      return [from, fStub, tStub, to];
    }
    if (fOut.x * tOut.x < 0 && (tStub.x - fStub.x) * fOut.x >= 0) {
      const midX = (fStub.x + tStub.x) / 2;
      return [from, fStub, { x: midX, y: fStub.y }, { x: midX, y: tStub.y }, tStub, to];
    }
    const wrapX = fOut.x > 0
      ? Math.max(fStub.x, tStub.x)
      : Math.min(fStub.x, tStub.x);
    return [from, fStub, { x: wrapX, y: fStub.y }, { x: wrapX, y: tStub.y }, tStub, to];
  }

  if (!fHorizontal && !tHorizontal) {
    if (fStub.x === tStub.x && (tStub.y - fStub.y) * fOut.y > 0) {
      return [from, fStub, tStub, to];
    }
    if (fOut.y * tOut.y < 0 && (tStub.y - fStub.y) * fOut.y >= 0) {
      const midY = (fStub.y + tStub.y) / 2;
      return [from, fStub, { x: fStub.x, y: midY }, { x: tStub.x, y: midY }, tStub, to];
    }
    const wrapY = fOut.y > 0
      ? Math.max(fStub.y, tStub.y)
      : Math.min(fStub.y, tStub.y);
    return [from, fStub, { x: fStub.x, y: wrapY }, { x: tStub.x, y: wrapY }, tStub, to];
  }

  // Perpendicular stubs.
  const naturalCorner = fHorizontal
    ? { x: tStub.x, y: fStub.y }
    : { x: fStub.x, y: tStub.y };
  const cornerOutwardFrom = fHorizontal
    ? (naturalCorner.x - from.x) * fOut.x >= 0
    : (naturalCorner.y - from.y) * fOut.y >= 0;
  const cornerOutwardTo = tHorizontal
    ? (naturalCorner.x - to.x) * tOut.x >= 0
    : (naturalCorner.y - to.y) * tOut.y >= 0;

  if (cornerOutwardFrom && cornerOutwardTo) {
    return [from, fStub, naturalCorner, to];
  }

  // Wrap around: turn perpendicular at fStub, run past tStub on its outward
  // side, then in along the to-axis. This approaches `to` from the −tOut
  // direction without crossing the destination body.
  if (fHorizontal) {
    const standoffY = tStub.y + tOut.y * WIRE_STUB;
    return [
      from,
      fStub,
      { x: fStub.x, y: standoffY },
      { x: tStub.x, y: standoffY },
      tStub,
      to,
    ];
  }
  const standoffX = tStub.x + tOut.x * WIRE_STUB;
  return [
    from,
    fStub,
    { x: standoffX, y: fStub.y },
    { x: standoffX, y: tStub.y },
    tStub,
    to,
  ];
}

export function pointsToFlat(points: Pt[]): number[] {
  const out: number[] = [];
  for (const p of points) {
    out.push(p.x, p.y);
  }
  return out;
}

export function pathLength(points: Pt[]): number {
  let total = 0;
  for (let i = 1; i < points.length; i++) {
    const dx = points[i].x - points[i - 1].x;
    const dy = points[i].y - points[i - 1].y;
    total += Math.sqrt(dx * dx + dy * dy);
  }
  return total;
}

export function pointAlongPath(points: Pt[], distance: number): Pt | null {
  if (points.length < 2) return null;
  let remaining = distance;
  for (let i = 1; i < points.length; i++) {
    const a = points[i - 1];
    const b = points[i];
    const dx = b.x - a.x;
    const dy = b.y - a.y;
    const segLen = Math.sqrt(dx * dx + dy * dy);
    if (segLen === 0) continue;
    if (remaining <= segLen) {
      const t = remaining / segLen;
      return { x: a.x + dx * t, y: a.y + dy * t };
    }
    remaining -= segLen;
  }
  return null;
}

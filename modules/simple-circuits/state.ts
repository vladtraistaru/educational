export type ComponentKind = 'battery' | 'bulb' | 'switch';
export type Terminal = 'a' | 'b';

export interface PlacedComponent {
  id: string;
  kind: ComponentKind;
  x: number;
  y: number;
  closed?: boolean;
}

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
}

export const COMPONENT_WIDTH = 80;
export const COMPONENT_HEIGHT = 50;
export const TERMINAL_RADIUS = 6;
export const BULB_LIT_THRESHOLD = 0.005;

export function getTerminalPosition(c: PlacedComponent, t: Terminal): { x: number; y: number } {
  const dx = COMPONENT_WIDTH / 2;
  return { x: c.x + (t === 'a' ? -dx : dx), y: c.y };
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
 * Outward horizontal direction of a terminal: 'a' exits left, 'b' exits right.
 */
function outwardDx(t: Terminal): number {
  return t === 'a' ? -1 : 1;
}

/**
 * Manhattan route between two terminals. Each end leaves horizontally along
 * its outward direction (a→left, b→right) before turning, so wires never
 * cross component bodies. The vertical leg is placed outside both components
 * based on the stub directions.
 */
export function routeOrthogonal(
  from: Pt,
  fromTerminal: Terminal,
  to: Pt,
  toTerminal: Terminal,
): Pt[] {
  const fdx = outwardDx(fromTerminal);
  const tdx = outwardDx(toTerminal);
  const fStub = { x: from.x + fdx * WIRE_STUB, y: from.y };
  const tStub = { x: to.x + tdx * WIRE_STUB, y: to.y };

  if (fStub.y === tStub.y) {
    return [from, fStub, tStub, to];
  }

  let midX: number;
  if (fdx > 0 && tdx > 0) {
    midX = Math.max(fStub.x, tStub.x);
  } else if (fdx < 0 && tdx < 0) {
    midX = Math.min(fStub.x, tStub.x);
  } else if (fdx > 0 && tdx < 0) {
    if (fStub.x <= tStub.x) {
      midX = (fStub.x + tStub.x) / 2;
    } else {
      midX = Math.max(from.x, to.x) + COMPONENT_WIDTH / 2 + WIRE_STUB;
    }
  } else {
    midX = Math.min(from.x, to.x) - COMPONENT_WIDTH / 2 - WIRE_STUB;
  }

  return [
    from,
    fStub,
    { x: midX, y: fStub.y },
    { x: midX, y: tStub.y },
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

import {
  Circuit,
  Resistor,
  Switch,
  VoltageSource,
  Wire,
} from '@/lib/science/electricity';
import {
  BULB_LIT_THRESHOLD,
  DEFAULT_RESISTOR_OHMS,
  PlacedComponent,
  SimResult,
  WireLink,
} from './state';

const BATTERY_VOLTS = 5;

export function simulate(
  placed: PlacedComponent[],
  wires: WireLink[],
  powerOn: boolean = true,
): SimResult {
  const componentCurrent = new Map<string, number>();
  const wireCurrent = new Map<string, number>();
  const bulbLit = new Map<string, boolean>();
  const bulbBurnt = new Map<string, boolean>();
  const wireReversed = new Map<string, boolean>();

  const empty: SimResult = {
    componentCurrent,
    wireCurrent,
    bulbLit,
    bulbBurnt,
    wireReversed,
    shortCircuit: false,
  };

  if (!powerOn) return empty;

  const battery = placed.find((c) => c.kind === 'battery');
  if (!battery) return empty;

  const circuit = new Circuit();
  const nodeFor = (componentId: string, t: 'a' | 'b') => circuit.node(`${componentId}:${t}`);

  const libByPlacedId = new Map<string, Resistor | Switch | VoltageSource | Wire>();

  for (const c of placed) {
    const a = nodeFor(c.id, 'a');
    const b = nodeFor(c.id, 'b');
    if (c.kind === 'battery') {
      libByPlacedId.set(c.id, circuit.addComponent(new VoltageSource(c.id, BATTERY_VOLTS, a, b)));
    } else if (c.kind === 'bulb') {
      libByPlacedId.set(c.id, circuit.addComponent(new Wire(c.id, a, b)));
    } else if (c.kind === 'switch') {
      libByPlacedId.set(c.id, circuit.addComponent(new Switch(c.id, c.closed ?? false, a, b)));
    } else if (c.kind === 'resistor') {
      libByPlacedId.set(c.id, circuit.addComponent(new Resistor(c.id, c.ohms ?? DEFAULT_RESISTOR_OHMS, a, b)));
    }
  }

  for (const w of wires) {
    const a = nodeFor(w.from.componentId, w.from.terminal);
    const b = nodeFor(w.to.componentId, w.to.terminal);
    circuit.addComponent(new Wire(w.id, a, b));
  }

  try {
    circuit.solve();
  } catch (err) {
    const isShort = err instanceof Error && /short-circuited/.test(err.message);
    if (!isShort) return empty;
    for (const c of placed) {
      if (c.kind === 'bulb') bulbBurnt.set(c.id, true);
    }
    return { ...empty, shortCircuit: true };
  }

  const batteryLib = libByPlacedId.get(battery.id);
  const totalI = batteryLib ? Math.abs(batteryLib.current) : 0;

  for (const c of placed) {
    if (c.kind !== 'bulb') continue;
    componentCurrent.set(c.id, totalI);
    bulbLit.set(c.id, totalI > BULB_LIT_THRESHOLD);
  }
  for (const [id, libC] of libByPlacedId) {
    const placedC = placed.find((p) => p.id === id);
    if (placedC?.kind === 'bulb') continue;
    componentCurrent.set(id, Math.abs(libC.current));
  }

  for (const w of wires) {
    wireCurrent.set(w.id, totalI);
  }

  if (totalI > BULB_LIT_THRESHOLD) {
    assignWireDirections(placed, wires, battery.id, wireReversed);
  }

  return { componentCurrent, wireCurrent, bulbLit, bulbBurnt, wireReversed, shortCircuit: false };
}

/**
 * BFS over the conducting graph from the battery's `−` terminal (terminal `a`)
 * to find which end of each wire is upstream (electron-flow source side).
 * Electrons leave the battery via `a`, traverse the loop, and return via `b`.
 */
function assignWireDirections(
  placed: PlacedComponent[],
  wires: WireLink[],
  batteryId: string,
  wireReversed: Map<string, boolean>,
): void {
  const adjacency = new Map<string, string[]>();
  const addEdge = (u: string, v: string) => {
    if (!adjacency.has(u)) adjacency.set(u, []);
    if (!adjacency.has(v)) adjacency.set(v, []);
    adjacency.get(u)!.push(v);
    adjacency.get(v)!.push(u);
  };

  const key = (componentId: string, t: 'a' | 'b') => `${componentId}:${t}`;

  for (const w of wires) {
    addEdge(key(w.from.componentId, w.from.terminal), key(w.to.componentId, w.to.terminal));
  }
  for (const c of placed) {
    if (c.id === batteryId) continue;
    if (c.kind === 'switch' && !c.closed) continue;
    addEdge(key(c.id, 'a'), key(c.id, 'b'));
  }

  const dist = new Map<string, number>();
  const start = key(batteryId, 'a');
  dist.set(start, 0);
  const queue = [start];
  while (queue.length > 0) {
    const node = queue.shift()!;
    const d = dist.get(node)!;
    for (const next of adjacency.get(node) ?? []) {
      if (dist.has(next)) continue;
      dist.set(next, d + 1);
      queue.push(next);
    }
  }

  for (const w of wires) {
    const dFrom = dist.get(key(w.from.componentId, w.from.terminal));
    const dTo = dist.get(key(w.to.componentId, w.to.terminal));
    if (dFrom === undefined || dTo === undefined) continue;
    wireReversed.set(w.id, dFrom > dTo);
  }
}

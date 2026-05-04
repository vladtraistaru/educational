import {
  Capacitor,
  CAPACITOR_FULL,
  Circuit,
  Resistor,
  Switch,
  VoltageSource,
  Wire,
} from '@/lib/science/electricity';
import {
  BULB_LIT_THRESHOLD,
  DEFAULT_CAPACITOR_UF,
  DEFAULT_RESISTOR_OHMS,
  PlacedComponent,
  SimResult,
  WireLink,
} from './state';
import { allocateWireFlows } from './wireFlow';

const BATTERY_VOLTS = 5;

type LibComponent = Resistor | Switch | VoltageSource | Wire | Capacitor;

interface SimulateInput {
  placed: PlacedComponent[];
  wires: WireLink[];
  powerOn: boolean;
  chargeState: Map<string, number>;
  dt: number;
}

interface SimulateOutput extends SimResult {
  newChargeState: Map<string, number>;
}

export function simulate(input: SimulateInput): SimulateOutput {
  const { placed, wires, powerOn, chargeState, dt } = input;

  const newChargeState = new Map(chargeState);
  ensureChargeEntries(placed, newChargeState);

  const empty = emptyResult(newChargeState);

  const battery = placed.find((c) => c.kind === 'battery');
  if (!battery) return empty;

  if (powerOn) {
    return simulateCharging(placed, wires, battery.id, newChargeState, dt);
  }
  return simulateDischarging(placed, wires, newChargeState, dt);
}

function ensureChargeEntries(placed: PlacedComponent[], state: Map<string, number>): void {
  const liveIds = new Set<string>();
  for (const c of placed) {
    if (c.kind !== 'capacitor') continue;
    liveIds.add(c.id);
    if (!state.has(c.id)) state.set(c.id, 0);
  }
  for (const id of state.keys()) {
    if (!liveIds.has(id)) state.delete(id);
  }
}

function emptyResult(newChargeState: Map<string, number>): SimulateOutput {
  return {
    componentCurrent: new Map(),
    wireCurrent: new Map(),
    bulbLit: new Map(),
    bulbBurnt: new Map(),
    wireReversed: new Map(),
    capacitorCharge: new Map(newChargeState),
    shortCircuit: false,
    newChargeState,
  };
}

function buildCircuit(
  placed: PlacedComponent[],
  wires: WireLink[],
  chargeState: Map<string, number>,
  options: { batteryMode: 'source' | 'wire'; capacitorAsSource?: string },
): { circuit: Circuit; libByPlacedId: Map<string, LibComponent> } {
  const circuit = new Circuit();
  const nodeFor = (componentId: string, t: 'a' | 'b') => circuit.node(`${componentId}:${t}`);
  const libByPlacedId = new Map<string, LibComponent>();

  for (const c of placed) {
    const a = nodeFor(c.id, 'a');
    const b = nodeFor(c.id, 'b');
    if (c.kind === 'battery') {
      if (options.batteryMode === 'source') {
        libByPlacedId.set(c.id, circuit.addComponent(new VoltageSource(c.id, BATTERY_VOLTS, a, b)));
      } else {
        libByPlacedId.set(c.id, circuit.addComponent(new Wire(c.id, a, b)));
      }
    } else if (c.kind === 'bulb') {
      libByPlacedId.set(c.id, circuit.addComponent(new Wire(c.id, a, b)));
    } else if (c.kind === 'switch') {
      libByPlacedId.set(c.id, circuit.addComponent(new Switch(c.id, c.closed ?? false, a, b)));
    } else if (c.kind === 'resistor') {
      libByPlacedId.set(
        c.id,
        circuit.addComponent(new Resistor(c.id, c.ohms ?? DEFAULT_RESISTOR_OHMS, a, b)),
      );
    } else if (c.kind === 'capacitor') {
      const q = chargeState.get(c.id) ?? 0;
      if (options.capacitorAsSource === c.id) {
        libByPlacedId.set(
          c.id,
          circuit.addComponent(new VoltageSource(c.id, q * BATTERY_VOLTS, a, b)),
        );
      } else {
        libByPlacedId.set(
          c.id,
          circuit.addComponent(new Capacitor(c.id, c.microFarads ?? DEFAULT_CAPACITOR_UF, q, a, b)),
        );
      }
    }
  }

  for (const w of wires) {
    const a = nodeFor(w.from.componentId, w.from.terminal);
    const b = nodeFor(w.to.componentId, w.to.terminal);
    circuit.addComponent(new Wire(w.id, a, b));
  }

  return { circuit, libByPlacedId };
}

function simulateCharging(
  placed: PlacedComponent[],
  wires: WireLink[],
  batteryId: string,
  newChargeState: Map<string, number>,
  dt: number,
): SimulateOutput {
  const { circuit, libByPlacedId } = buildCircuit(placed, wires, newChargeState, {
    batteryMode: 'source',
  });

  try {
    circuit.solve();
  } catch (err) {
    const isShort = err instanceof Error && /short-circuited/.test(err.message);
    const result = emptyResult(newChargeState);
    if (isShort) {
      for (const c of placed) {
        if (c.kind === 'bulb') result.bulbBurnt.set(c.id, true);
      }
      result.shortCircuit = true;
    }
    return result;
  }

  const batteryLib = libByPlacedId.get(batteryId);
  const totalI = batteryLib ? Math.abs(batteryLib.current) : 0;

  const result = emptyResult(newChargeState);

  for (const [id, libC] of libByPlacedId) {
    const placedC = placed.find((p) => p.id === id);
    if (placedC?.kind === 'bulb') continue;
    result.componentCurrent.set(id, Math.abs(libC.current));
  }

  for (const c of placed) {
    if (c.kind !== 'capacitor') continue;
    const lib = libByPlacedId.get(c.id);
    if (!(lib instanceof Capacitor)) continue;
    const q = newChargeState.get(c.id) ?? 0;
    if (q >= CAPACITOR_FULL) {
      newChargeState.set(c.id, 1);
      continue;
    }
    const microFarads = c.microFarads ?? DEFAULT_CAPACITOR_UF;
    const dq = integrateCharge(Math.abs(lib.current), microFarads, dt);
    newChargeState.set(c.id, Math.min(1, q + dq));
  }
  result.capacitorCharge = new Map(newChargeState);

  if (totalI > BULB_LIT_THRESHOLD) {
    applyFlows(placed, wires, batteryId, 'a', result);
  }

  return result;
}

function applyFlows(
  placed: PlacedComponent[],
  wires: WireLink[],
  sourceId: string,
  sourceTerminal: 'a' | 'b',
  result: SimResult,
): void {
  const flows = allocateWireFlows({
    placed,
    wires,
    sourceId,
    sourceTerminal,
    componentCurrent: result.componentCurrent,
  });
  for (const [wId, i] of flows.wireCurrent) result.wireCurrent.set(wId, i);
  for (const [wId, rev] of flows.wireReversed) result.wireReversed.set(wId, rev);
  for (const [bulbId, i] of flows.bulbCurrent) {
    result.componentCurrent.set(bulbId, i);
    result.bulbLit.set(bulbId, i > BULB_LIT_THRESHOLD);
  }
}

function simulateDischarging(
  placed: PlacedComponent[],
  wires: WireLink[],
  newChargeState: Map<string, number>,
  dt: number,
): SimulateOutput {
  const result = emptyResult(newChargeState);

  const dischargingCap = placed.find(
    (c) => c.kind === 'capacitor' && (newChargeState.get(c.id) ?? 0) > 0.001,
  );
  if (!dischargingCap) return result;

  const { circuit, libByPlacedId } = buildCircuit(placed, wires, newChargeState, {
    batteryMode: 'wire',
    capacitorAsSource: dischargingCap.id,
  });

  try {
    circuit.solve();
  } catch {
    return result;
  }

  const sourceLib = libByPlacedId.get(dischargingCap.id);
  const totalI = sourceLib ? Math.abs(sourceLib.current) : 0;

  if (totalI > BULB_LIT_THRESHOLD) {
    const microFarads = dischargingCap.microFarads ?? DEFAULT_CAPACITOR_UF;
    const dq = integrateCharge(totalI, microFarads, dt);
    const q = newChargeState.get(dischargingCap.id) ?? 0;
    newChargeState.set(dischargingCap.id, Math.max(0, q - dq));
    result.capacitorCharge = new Map(newChargeState);
  }

  return result;
}

/**
 * Δq fraction over dt seconds at the given current. Uses dQ = I·dt and
 * Q_full = C·V_battery so dq/dt = I / (C · V). The animation tick is far
 * coarser than a real RC time constant, so we cap dq per step to keep the
 * cap's apparent resistance from jumping discontinuously.
 */
function integrateCharge(currentAmps: number, microFarads: number, dt: number): number {
  const farads = microFarads * 1e-6;
  const qFull = farads * BATTERY_VOLTS;
  if (qFull <= 0) return 0;
  const raw = (currentAmps * dt) / qFull;
  return Math.min(0.05, raw);
}

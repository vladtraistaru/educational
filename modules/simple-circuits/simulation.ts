import {
  Circuit,
  Resistor,
  Switch,
  VoltageSource,
  Wire,
} from '@/lib/science/electricity';
import {
  BULB_LIT_THRESHOLD,
  PlacedComponent,
  SimResult,
  WireLink,
} from './state';

const BATTERY_VOLTS = 9;
const BULB_OHMS = 50;

export function simulate(placed: PlacedComponent[], wires: WireLink[]): SimResult {
  const componentCurrent = new Map<string, number>();
  const wireCurrent = new Map<string, number>();
  const bulbLit = new Map<string, boolean>();

  const battery = placed.find((c) => c.kind === 'battery');
  if (!battery) return { componentCurrent, wireCurrent, bulbLit };

  const circuit = new Circuit();
  const nodeFor = (componentId: string, t: 'a' | 'b') => circuit.node(`${componentId}:${t}`);

  const libByPlacedId = new Map<string, Resistor | Switch | VoltageSource>();

  for (const c of placed) {
    const a = nodeFor(c.id, 'a');
    const b = nodeFor(c.id, 'b');
    if (c.kind === 'battery') {
      libByPlacedId.set(c.id, circuit.addComponent(new VoltageSource(c.id, BATTERY_VOLTS, a, b)));
    } else if (c.kind === 'bulb') {
      libByPlacedId.set(c.id, circuit.addComponent(new Resistor(c.id, BULB_OHMS, a, b)));
    } else if (c.kind === 'switch') {
      libByPlacedId.set(c.id, circuit.addComponent(new Switch(c.id, c.closed ?? false, a, b)));
    }
  }

  for (const w of wires) {
    const a = nodeFor(w.from.componentId, w.from.terminal);
    const b = nodeFor(w.to.componentId, w.to.terminal);
    circuit.addComponent(new Wire(w.id, a, b));
  }

  try {
    circuit.solve();
  } catch {
    return { componentCurrent, wireCurrent, bulbLit };
  }

  for (const [id, libC] of libByPlacedId) {
    const i = Math.abs(libC.current);
    componentCurrent.set(id, i);
    const placedC = placed.find((p) => p.id === id);
    if (placedC?.kind === 'bulb') {
      bulbLit.set(id, i > BULB_LIT_THRESHOLD);
    }
  }

  const batteryLib = libByPlacedId.get(battery.id);
  const totalI = batteryLib ? Math.abs(batteryLib.current) : 0;
  for (const w of wires) {
    wireCurrent.set(w.id, totalI);
  }

  return { componentCurrent, wireCurrent, bulbLit };
}

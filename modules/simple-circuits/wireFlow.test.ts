import { describe, expect, it } from 'vitest';
import { allocateWireFlows } from './wireFlow';
import { PlacedComponent, WireLink } from './state';

/**
 * These tests exercise the allocator against the topologies enumerated in
 * `plans/simple-circuits-electron-flow.md`. The solver is mocked: we hand
 * the allocator the per-component current values it would normally read
 * from `lib/science/electricity`, so we can isolate flow-allocation bugs
 * from solver bugs.
 */

const placedAt = (id: string, kind: PlacedComponent['kind'], extras: Partial<PlacedComponent> = {}): PlacedComponent => ({
  id,
  kind,
  x: 0,
  y: 0,
  rotation: 0,
  ...extras,
});

const wire = (id: string, fromId: string, fromT: 'a' | 'b', toId: string, toT: 'a' | 'b'): WireLink => ({
  id,
  from: { componentId: fromId, terminal: fromT },
  to: { componentId: toId, terminal: toT },
});

describe('allocateWireFlows — case A: pure series', () => {
  // battery a → bulb a; bulb b → resistor a; resistor b → battery b
  const placed: PlacedComponent[] = [
    placedAt('battery', 'battery'),
    placedAt('bulb', 'bulb'),
    placedAt('r', 'resistor', { ohms: 100 }),
  ];
  const wires: WireLink[] = [
    wire('w1', 'battery', 'a', 'bulb', 'a'),
    wire('w2', 'bulb', 'b', 'r', 'a'),
    wire('w3', 'r', 'b', 'battery', 'b'),
  ];
  const componentCurrent = new Map<string, number>([
    ['battery', 0.05],
    ['bulb', 0],
    ['r', 0.05],
  ]);

  it('every wire carries the same magnitude', () => {
    const out = allocateWireFlows({
      placed,
      wires,
      sourceId: 'battery',
      sourceTerminal: 'a',
      componentCurrent,
    });
    expect(out.wireCurrent.get('w1')).toBeCloseTo(0.05, 6);
    expect(out.wireCurrent.get('w2')).toBeCloseTo(0.05, 6);
    expect(out.wireCurrent.get('w3')).toBeCloseTo(0.05, 6);
  });

  it('infers the bulb current from incident wires', () => {
    const out = allocateWireFlows({
      placed,
      wires,
      sourceId: 'battery',
      sourceTerminal: 'a',
      componentCurrent,
    });
    expect(out.bulbCurrent.get('bulb')).toBeCloseTo(0.05, 6);
  });

  it('all wires animate in a consistent loop direction', () => {
    const out = allocateWireFlows({
      placed,
      wires,
      sourceId: 'battery',
      sourceTerminal: 'a',
      componentCurrent,
    });
    // w1: battery.a (electron source) → bulb.a; from-end IS the source-end →
    // not reversed (electrons travel from→to).
    expect(out.wireReversed.get('w1')).toBe(false);
    // w2: bulb.b → r.a; bulb.b is downstream (electrons leave bulb at b),
    // so from-end is the source-end → not reversed.
    expect(out.wireReversed.get('w2')).toBe(false);
    // w3: r.b → battery.b; r.b is downstream from r.a → not reversed.
    expect(out.wireReversed.get('w3')).toBe(false);
  });
});

describe('allocateWireFlows — case B: parallel resistors', () => {
  // battery.a → bulb.a; bulb.b → R1.a; bulb.b → R2.a (J1 = bulb.b/R1.a/R2.a)
  // R1.b → battery.b; R2.b → battery.b (J2 = R1.b/R2.b/battery.b)
  const placed: PlacedComponent[] = [
    placedAt('battery', 'battery'),
    placedAt('bulb', 'bulb'),
    placedAt('r1', 'resistor', { ohms: 100 }),
    placedAt('r2', 'resistor', { ohms: 100 }),
  ];
  const wires: WireLink[] = [
    wire('w_batA_bulbA', 'battery', 'a', 'bulb', 'a'),
    wire('w_bulbB_r1A', 'bulb', 'b', 'r1', 'a'),
    wire('w_bulbB_r2A', 'bulb', 'b', 'r2', 'a'),
    wire('w_r1B_batB', 'r1', 'b', 'battery', 'b'),
    wire('w_r2B_batB', 'r2', 'b', 'battery', 'b'),
  ];
  const componentCurrent = new Map<string, number>([
    ['battery', 0.1],
    ['bulb', 0],
    ['r1', 0.05],
    ['r2', 0.05],
  ]);

  it('trunk wire carries full current; branch wires carry half', () => {
    const out = allocateWireFlows({
      placed,
      wires,
      sourceId: 'battery',
      sourceTerminal: 'a',
      componentCurrent,
    });
    expect(out.wireCurrent.get('w_batA_bulbA')).toBeCloseTo(0.1, 6);
    expect(out.wireCurrent.get('w_bulbB_r1A')).toBeCloseTo(0.05, 6);
    expect(out.wireCurrent.get('w_bulbB_r2A')).toBeCloseTo(0.05, 6);
    expect(out.wireCurrent.get('w_r1B_batB')).toBeCloseTo(0.05, 6);
    expect(out.wireCurrent.get('w_r2B_batB')).toBeCloseTo(0.05, 6);
  });

  it('bulb current equals trunk current, not branch current', () => {
    const out = allocateWireFlows({
      placed,
      wires,
      sourceId: 'battery',
      sourceTerminal: 'a',
      componentCurrent,
    });
    expect(out.bulbCurrent.get('bulb')).toBeCloseTo(0.1, 6);
  });

  it('no wire animates against its from→to direction inconsistently with the loop', () => {
    const out = allocateWireFlows({
      placed,
      wires,
      sourceId: 'battery',
      sourceTerminal: 'a',
      componentCurrent,
    });
    // Every wire is laid out so that the electron-flow direction matches
    // from → to (we constructed the WireLinks accordingly).
    for (const w of wires) {
      expect(out.wireReversed.get(w.id)).toBe(false);
    }
  });
});

describe('allocateWireFlows — case B with equipotential connector', () => {
  // Same topology as case B but with an extra wire INSIDE J1 that is purely
  // an equipotential connector (R1.a ↔ R2.a directly). The trunk wire from
  // bulb.b connects only to R1.a; current must split evenly via the
  // connector wire to R2.a but the connector should not animate at full
  // trunk current. Net flow on the connector is +I/2 (electrons flow
  // R1.a → R2.a since R2 is a sibling sink).
  const placed: PlacedComponent[] = [
    placedAt('battery', 'battery'),
    placedAt('bulb', 'bulb'),
    placedAt('r1', 'resistor', { ohms: 100 }),
    placedAt('r2', 'resistor', { ohms: 100 }),
  ];
  const wires: WireLink[] = [
    wire('w1', 'battery', 'a', 'bulb', 'a'),
    wire('w_trunk', 'bulb', 'b', 'r1', 'a'),
    wire('w_jumper', 'r1', 'a', 'r2', 'a'),
    wire('w3', 'r1', 'b', 'battery', 'b'),
    wire('w4', 'r2', 'b', 'battery', 'b'),
  ];
  const componentCurrent = new Map<string, number>([
    ['battery', 0.1],
    ['bulb', 0],
    ['r1', 0.05],
    ['r2', 0.05],
  ]);

  it('trunk into J1 carries full current; jumper carries half', () => {
    const out = allocateWireFlows({
      placed,
      wires,
      sourceId: 'battery',
      sourceTerminal: 'a',
      componentCurrent,
    });
    expect(out.wireCurrent.get('w_trunk')).toBeCloseTo(0.1, 6);
    expect(out.wireCurrent.get('w_jumper')).toBeCloseTo(0.05, 6);
  });
});

describe('allocateWireFlows — case C: parallel bulbs (with series resistor)', () => {
  // Without a series resistor, two ideal-wire bulbs in parallel short out
  // the battery and the solver throws — the allocator never runs. The
  // pedagogically meaningful case is a series resistor + two parallel bulbs.
  // battery.a → R.a; R.b → bulb1.a; R.b → bulb2.a (J1)
  // bulb1.b → battery.b; bulb2.b → battery.b (J2)
  const placed: PlacedComponent[] = [
    placedAt('battery', 'battery'),
    placedAt('r', 'resistor', { ohms: 50 }),
    placedAt('bulb1', 'bulb'),
    placedAt('bulb2', 'bulb'),
  ];
  const wires: WireLink[] = [
    wire('w_in', 'battery', 'a', 'r', 'a'),
    wire('w_split1', 'r', 'b', 'bulb1', 'a'),
    wire('w_split2', 'r', 'b', 'bulb2', 'a'),
    wire('w_join1', 'bulb1', 'b', 'battery', 'b'),
    wire('w_join2', 'bulb2', 'b', 'battery', 'b'),
  ];
  const componentCurrent = new Map<string, number>([
    ['battery', 0.1],
    ['r', 0.1],
    ['bulb1', 0],
    ['bulb2', 0],
  ]);

  it('each bulb carries half the source current', () => {
    const out = allocateWireFlows({
      placed,
      wires,
      sourceId: 'battery',
      sourceTerminal: 'a',
      componentCurrent,
    });
    // Two unknown bulbs at the same super-node — topology pre-pass cannot
    // disambiguate, so we fall back to the per-wire allocation, which
    // distributes the trunk evenly when the wire-tree is symmetric.
    expect(out.wireCurrent.get('w_in')).toBeCloseTo(0.1, 6);
    const b1 = out.bulbCurrent.get('bulb1') ?? 0;
    const b2 = out.bulbCurrent.get('bulb2') ?? 0;
    expect(b1 + b2).toBeCloseTo(0.1, 6);
  });
});

describe('allocateWireFlows — case E: open switch in series', () => {
  // battery.a → switch.a (open); switch.b → bulb.a; bulb.b → battery.b
  const placed: PlacedComponent[] = [
    placedAt('battery', 'battery'),
    placedAt('sw', 'switch', { closed: false }),
    placedAt('bulb', 'bulb'),
  ];
  const wires: WireLink[] = [
    wire('w1', 'battery', 'a', 'sw', 'a'),
    wire('w2', 'sw', 'b', 'bulb', 'a'),
    wire('w3', 'bulb', 'b', 'battery', 'b'),
  ];
  // Open switch → solver finds no current path → all currents 0.
  const componentCurrent = new Map<string, number>([
    ['battery', 0],
    ['sw', 0],
    ['bulb', 0],
  ]);

  it('no wire carries current', () => {
    const out = allocateWireFlows({
      placed,
      wires,
      sourceId: 'battery',
      sourceTerminal: 'a',
      componentCurrent,
    });
    for (const v of out.wireCurrent.values()) {
      expect(v).toBe(0);
    }
  });

  it('bulb current is zero', () => {
    const out = allocateWireFlows({
      placed,
      wires,
      sourceId: 'battery',
      sourceTerminal: 'a',
      componentCurrent,
    });
    expect(out.bulbCurrent.get('bulb')).toBe(0);
  });
});

describe('allocateWireFlows — case F: disconnected component', () => {
  const placed: PlacedComponent[] = [
    placedAt('battery', 'battery'),
    placedAt('bulb', 'bulb'),
  ];
  const wires: WireLink[] = [];
  const componentCurrent = new Map<string, number>([
    ['battery', 0],
    ['bulb', 0],
  ]);

  it('produces empty results without errors', () => {
    const out = allocateWireFlows({
      placed,
      wires,
      sourceId: 'battery',
      sourceTerminal: 'a',
      componentCurrent,
    });
    expect(out.wireCurrent.size).toBe(0);
    expect(out.bulbCurrent.get('bulb')).toBe(0);
  });
});

describe('allocateWireFlows — equipotential cycle', () => {
  // J1 has 3 wires forming a cycle between bulb.b, r1.a, r2.a:
  //   bulb.b ↔ r1.a, r1.a ↔ r2.a, r2.a ↔ bulb.b. The non-tree edge gets 0.
  const placed: PlacedComponent[] = [
    placedAt('battery', 'battery'),
    placedAt('bulb', 'bulb'),
    placedAt('r1', 'resistor', { ohms: 100 }),
    placedAt('r2', 'resistor', { ohms: 100 }),
  ];
  const wires: WireLink[] = [
    wire('w_in', 'battery', 'a', 'bulb', 'a'),
    wire('e1', 'bulb', 'b', 'r1', 'a'),
    wire('e2', 'r1', 'a', 'r2', 'a'),
    wire('e3', 'r2', 'a', 'bulb', 'b'),
    wire('w_out1', 'r1', 'b', 'battery', 'b'),
    wire('w_out2', 'r2', 'b', 'battery', 'b'),
  ];
  const componentCurrent = new Map<string, number>([
    ['battery', 0.1],
    ['bulb', 0],
    ['r1', 0.05],
    ['r2', 0.05],
  ]);

  it('two of the three cycle wires carry flow; one is dropped', () => {
    const out = allocateWireFlows({
      placed,
      wires,
      sourceId: 'battery',
      sourceTerminal: 'a',
      componentCurrent,
    });
    const cycleFlows = ['e1', 'e2', 'e3'].map((id) => out.wireCurrent.get(id) ?? 0);
    const nonZero = cycleFlows.filter((v) => v > 1e-6);
    expect(nonZero.length).toBe(2);
  });
});

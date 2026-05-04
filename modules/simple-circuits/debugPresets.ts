import { PlacedComponent, WireLink } from './state';

/**
 * Hand-built circuit topologies used by both the integration tests and the
 * /debug-circuits page. Keeping the same fixtures in both places means a
 * regression I see visually is reproducible in the test suite, and vice
 * versa.
 *
 * Coordinates are chosen so the shapes look reasonable on the canvas;
 * the simulation logic is independent of position.
 */

export interface Preset {
  id: string;
  title: string;
  description: string;
  placed: PlacedComponent[];
  wires: WireLink[];
  /** Expected per-wire behavior, used by integration tests. */
  expectations?: Expectation[];
}

export interface Expectation {
  wireId: string;
  /** Expected current magnitude in amps; null means "any positive value". */
  current: number | null;
  /** Optional tolerance (default 1e-3 A = 1 mA). */
  tolerance?: number;
  /** Expected reversed flag (false = electrons travel from→to). */
  reversed?: boolean;
}

const W = (id: string, fromId: string, fromT: 'a' | 'b', toId: string, toT: 'a' | 'b'): WireLink => ({
  id,
  from: { componentId: fromId, terminal: fromT },
  to: { componentId: toId, terminal: toT },
});

// ---- Preset A: pure series ------------------------------------------------
// battery − (a) → bulb → R(100Ω) → battery + (b)
// Expected: I = 5V / 100Ω = 0.05 A on every wire.
const SERIES: Preset = {
  id: 'series',
  title: 'A. Pure series',
  description: 'battery → bulb → 100Ω resistor → battery. Every wire carries 50 mA.',
  placed: [
    { id: 'battery', kind: 'battery', x: 200, y: 300, rotation: 0 },
    { id: 'bulb', kind: 'bulb', x: 400, y: 200, rotation: 0 },
    { id: 'r', kind: 'resistor', x: 600, y: 200, rotation: 0, ohms: 100 },
  ],
  wires: [
    W('w1', 'battery', 'a', 'bulb', 'a'),
    W('w2', 'bulb', 'b', 'r', 'a'),
    W('w3', 'r', 'b', 'battery', 'b'),
  ],
  expectations: [
    { wireId: 'w1', current: 0.05, reversed: false },
    { wireId: 'w2', current: 0.05, reversed: false },
    { wireId: 'w3', current: 0.05, reversed: false },
  ],
};

// ---- Preset B: parallel resistors -----------------------------------------
// battery − → bulb → J1 → {R1=100, R2=100} → J2 → battery +
// Expected: trunk wires carry 0.1 A; each branch carries 0.05 A.
const PARALLEL_RESISTORS: Preset = {
  id: 'parallel-resistors',
  title: 'B. Parallel resistors',
  description: 'Two 100Ω resistors in parallel after the bulb. Trunk = 100 mA, each branch = 50 mA.',
  placed: [
    { id: 'battery', kind: 'battery', x: 200, y: 300, rotation: 0 },
    { id: 'bulb', kind: 'bulb', x: 400, y: 150, rotation: 0 },
    { id: 'r1', kind: 'resistor', x: 600, y: 100, rotation: 0, ohms: 100 },
    { id: 'r2', kind: 'resistor', x: 600, y: 250, rotation: 0, ohms: 100 },
  ],
  wires: [
    W('w_in', 'battery', 'a', 'bulb', 'a'),
    W('w_split1', 'bulb', 'b', 'r1', 'a'),
    W('w_split2', 'bulb', 'b', 'r2', 'a'),
    W('w_join1', 'r1', 'b', 'battery', 'b'),
    W('w_join2', 'r2', 'b', 'battery', 'b'),
  ],
  expectations: [
    { wireId: 'w_in', current: 0.1, reversed: false },
    { wireId: 'w_split1', current: 0.05, reversed: false },
    { wireId: 'w_split2', current: 0.05, reversed: false },
    { wireId: 'w_join1', current: 0.05, reversed: false },
    { wireId: 'w_join2', current: 0.05, reversed: false },
  ],
};

// ---- Preset B': parallel resistors with equipotential jumper --------------
// Same as B but with R1.a wired directly to R2.a inside the junction.
// The trunk wire carries the full 0.1 A; the jumper carries 0.05 A as the
// current splits unevenly across the wire-tree topology.
const PARALLEL_WITH_JUMPER: Preset = {
  id: 'parallel-with-jumper',
  title: "B'. Parallel resistors + jumper wire",
  description:
    'Like B but with an extra wire R1.a ↔ R2.a. The trunk into the junction must still carry full current, the jumper half.',
  placed: [
    { id: 'battery', kind: 'battery', x: 200, y: 300, rotation: 0 },
    { id: 'bulb', kind: 'bulb', x: 400, y: 150, rotation: 0 },
    { id: 'r1', kind: 'resistor', x: 600, y: 100, rotation: 0, ohms: 100 },
    { id: 'r2', kind: 'resistor', x: 600, y: 250, rotation: 0, ohms: 100 },
  ],
  wires: [
    W('w_in', 'battery', 'a', 'bulb', 'a'),
    W('w_trunk', 'bulb', 'b', 'r1', 'a'),
    W('w_jumper', 'r1', 'a', 'r2', 'a'),
    W('w_join1', 'r1', 'b', 'battery', 'b'),
    W('w_join2', 'r2', 'b', 'battery', 'b'),
  ],
  expectations: [
    { wireId: 'w_in', current: 0.1, reversed: false },
    { wireId: 'w_trunk', current: 0.1, reversed: false },
    // Jumper: r1.a -> r2.a. Electrons must flow from r1.a (where the trunk
    // pours them in) toward r2.a (the resistor that has no other supply),
    // so reversed=false (animation runs from→to).
    { wireId: 'w_jumper', current: 0.05, reversed: false },
    { wireId: 'w_join1', current: 0.05, reversed: false },
    { wireId: 'w_join2', current: 0.05, reversed: false },
  ],
};

// ---- Preset C: parallel bulbs after a series resistor --------------------
// battery → R(50) → {bulb1, bulb2 in parallel} → battery
// Expected: trunk = 0.1 A; each bulb-branch = 0.05 A.
const PARALLEL_BULBS: Preset = {
  id: 'parallel-bulbs',
  title: 'C. Parallel bulbs',
  description: '50Ω resistor in series with two bulbs in parallel. Each bulb gets 50 mA.',
  placed: [
    { id: 'battery', kind: 'battery', x: 200, y: 300, rotation: 0 },
    { id: 'r', kind: 'resistor', x: 400, y: 200, rotation: 0, ohms: 50 },
    { id: 'bulb1', kind: 'bulb', x: 600, y: 100, rotation: 0 },
    { id: 'bulb2', kind: 'bulb', x: 600, y: 250, rotation: 0 },
  ],
  wires: [
    W('w_in', 'battery', 'a', 'r', 'a'),
    W('w_split1', 'r', 'b', 'bulb1', 'a'),
    W('w_split2', 'r', 'b', 'bulb2', 'a'),
    W('w_join1', 'bulb1', 'b', 'battery', 'b'),
    W('w_join2', 'bulb2', 'b', 'battery', 'b'),
  ],
  expectations: [
    { wireId: 'w_in', current: 0.1, reversed: false },
    { wireId: 'w_split1', current: 0.05, reversed: false },
    { wireId: 'w_split2', current: 0.05, reversed: false },
    { wireId: 'w_join1', current: 0.05, reversed: false },
    { wireId: 'w_join2', current: 0.05, reversed: false },
  ],
};

// ---- Preset D: bulb on each parallel branch ------------------------------
// battery → J1 → {bulb1 + R1, bulb2 + R2 in parallel} → J2 → battery
// Two independent loads in parallel. Each branch's current = 5/100 = 0.05 A.
const PARALLEL_BULB_BRANCHES: Preset = {
  id: 'parallel-bulb-branches',
  title: 'D. One bulb per parallel branch',
  description: 'Two parallel branches, each with bulb + 100Ω resistor. Both bulbs glow equally.',
  placed: [
    { id: 'battery', kind: 'battery', x: 200, y: 300, rotation: 0 },
    { id: 'bulb1', kind: 'bulb', x: 450, y: 150, rotation: 0 },
    { id: 'r1', kind: 'resistor', x: 700, y: 150, rotation: 0, ohms: 100 },
    { id: 'bulb2', kind: 'bulb', x: 450, y: 350, rotation: 0 },
    { id: 'r2', kind: 'resistor', x: 700, y: 350, rotation: 0, ohms: 100 },
  ],
  wires: [
    W('w_top_in', 'battery', 'a', 'bulb1', 'a'),
    W('w_top_mid', 'bulb1', 'b', 'r1', 'a'),
    W('w_top_out', 'r1', 'b', 'battery', 'b'),
    W('w_bot_in', 'battery', 'a', 'bulb2', 'a'),
    W('w_bot_mid', 'bulb2', 'b', 'r2', 'a'),
    W('w_bot_out', 'r2', 'b', 'battery', 'b'),
  ],
  expectations: [
    { wireId: 'w_top_in', current: 0.05, reversed: false },
    { wireId: 'w_top_mid', current: 0.05, reversed: false },
    { wireId: 'w_top_out', current: 0.05, reversed: false },
    { wireId: 'w_bot_in', current: 0.05, reversed: false },
    { wireId: 'w_bot_mid', current: 0.05, reversed: false },
    { wireId: 'w_bot_out', current: 0.05, reversed: false },
  ],
};

export const DEBUG_PRESETS: Preset[] = [
  SERIES,
  PARALLEL_RESISTORS,
  PARALLEL_WITH_JUMPER,
  PARALLEL_BULBS,
  PARALLEL_BULB_BRANCHES,
];

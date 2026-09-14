import { describe, it, expect } from 'vitest';
import {
  torque,
  sideTorque,
  netTorque,
  tilt,
  isBalanced,
  beamAngle,
  mechanicalAdvantage,
  solveBalance,
  type Load,
} from './torque';

const load = (mass: number, distance: number, side: Load['side']): Load => ({
  mass,
  distance,
  side,
});

describe('torque', () => {
  it('multiplies mass by distance', () => {
    expect(torque(load(3, 4, 'left'))).toBe(12);
    expect(torque(load(12, 1, 'right'))).toBe(12);
  });

  it('is zero at the pivot', () => {
    expect(torque(load(9, 0, 'left'))).toBe(0);
  });
});

describe('sideTorque', () => {
  it('sums only the requested side', () => {
    const loads = [load(2, 3, 'left'), load(4, 1, 'left'), load(5, 2, 'right')];
    expect(sideTorque(loads, 'left')).toBe(10);
    expect(sideTorque(loads, 'right')).toBe(10);
  });

  it('returns 0 when a side is empty', () => {
    expect(sideTorque([load(5, 5, 'left')], 'right')).toBe(0);
  });
});

describe('netTorque', () => {
  it('is positive when the right side is heavier', () => {
    expect(netTorque([load(2, 3, 'left'), load(4, 3, 'right')])).toBe(6);
  });

  it('is negative when the left side is heavier', () => {
    expect(netTorque([load(4, 3, 'left'), load(2, 3, 'right')])).toBe(-6);
  });

  it('is zero for a balanced beam', () => {
    expect(netTorque([load(3, 8, 'left'), load(6, 4, 'right')])).toBe(0);
  });

  it('is zero for an empty beam', () => {
    expect(netTorque([])).toBe(0);
  });
});

describe('tilt', () => {
  it('reports the heavier side', () => {
    expect(tilt([load(1, 1, 'left')])).toBe('left');
    expect(tilt([load(1, 1, 'right')])).toBe('right');
  });

  it('reports balanced when torques match', () => {
    expect(tilt([load(12, 2, 'left'), load(8, 3, 'right')])).toBe('balanced');
    expect(tilt([])).toBe('balanced');
  });
});

describe('isBalanced', () => {
  it('is true when equal torques sit on both sides', () => {
    expect(isBalanced([load(5, 4, 'left'), load(10, 2, 'right')])).toBe(true);
  });

  it('is false when masses match but distances do not', () => {
    expect(isBalanced([load(5, 4, 'left'), load(5, 3, 'right')])).toBe(false);
  });
});

describe('beamAngle', () => {
  it('is level when balanced', () => {
    expect(beamAngle([load(3, 8, 'left'), load(6, 4, 'right')])).toBe(0);
  });

  it('is positive when the right side sinks', () => {
    expect(beamAngle([load(4, 3, 'right')])).toBeGreaterThan(0);
  });

  it('is negative when the left side sinks', () => {
    expect(beamAngle([load(4, 3, 'left')])).toBeLessThan(0);
  });

  it('is symmetric for mirrored loads', () => {
    const right = beamAngle([load(4, 3, 'right')]);
    const left = beamAngle([load(4, 3, 'left')]);
    expect(right).toBeCloseTo(-left);
  });

  it('tilts further as the imbalance grows', () => {
    const small = beamAngle([load(1, 2, 'right')]);
    const large = beamAngle([load(10, 8, 'right')]);
    expect(large).toBeGreaterThan(small);
  });

  it('never reaches the maximum angle', () => {
    expect(Math.abs(beamAngle([load(12, 10, 'right')], 25))).toBeLessThan(25);
  });
});

describe('mechanicalAdvantage', () => {
  it('is the ratio of effort arm to load arm', () => {
    expect(mechanicalAdvantage(6, 1)).toBe(6);
    expect(mechanicalAdvantage(4, 2)).toBe(2);
  });

  it('is 1 for equal arms', () => {
    expect(mechanicalAdvantage(5, 5)).toBe(1);
  });
});

describe('solveBalance', () => {
  it('finds the notch that balances a single load', () => {
    expect(solveBalance([load(2, 6, 'left')], 4, 'right', 10)).toBe(3);
    expect(solveBalance([load(12, 1, 'left')], 2, 'right', 10)).toBe(6);
  });

  it('accounts for weights already on the target side', () => {
    const loads = [load(9, 4, 'left'), load(6, 2, 'right')];
    expect(solveBalance(loads, 8, 'right', 10)).toBe(3);
  });

  it('returns null when the notch would be fractional', () => {
    expect(solveBalance([load(5, 1, 'left')], 2, 'right', 10)).toBeNull();
  });

  it('returns null when the notch is out of reach', () => {
    expect(solveBalance([load(12, 10, 'left')], 1, 'right', 10)).toBeNull();
  });

  it('returns null when the load is already on the wrong side', () => {
    expect(solveBalance([load(4, 2, 'left')], 3, 'left', 10)).toBeNull();
  });

  it('returns null for a non-positive mass', () => {
    expect(solveBalance([load(4, 2, 'left')], 0, 'right', 10)).toBeNull();
  });
});

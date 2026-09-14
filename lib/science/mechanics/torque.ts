export type Side = 'left' | 'right';

export type Tilt = 'left' | 'right' | 'balanced';

export interface Load {
  mass: number;
  distance: number;
  side: Side;
}

export function torque(load: Load): number {
  return load.mass * load.distance;
}

export function sideTorque(loads: Load[], side: Side): number {
  return loads
    .filter((l) => l.side === side)
    .reduce((sum, l) => sum + torque(l), 0);
}

export function netTorque(loads: Load[]): number {
  return sideTorque(loads, 'right') - sideTorque(loads, 'left');
}

export function tilt(loads: Load[]): Tilt {
  const net = netTorque(loads);
  if (net === 0) return 'balanced';
  return net > 0 ? 'right' : 'left';
}

export function isBalanced(loads: Load[]): boolean {
  return netTorque(loads) === 0;
}

const ANGLE_SCALE = 24;

/**
 * Visual tilt model, not a rigid-body simulation: a real beam would swing all
 * the way to the ground. The angle saturates so a bigger imbalance reads as a
 * steeper tilt without ever pinning at the limit.
 */
export function beamAngle(loads: Load[], maxAngle = 25): number {
  const net = netTorque(loads);
  if (net === 0) return 0;
  return (maxAngle * net) / (Math.abs(net) + ANGLE_SCALE);
}

export function mechanicalAdvantage(
  effortDistance: number,
  loadDistance: number,
): number {
  return effortDistance / loadDistance;
}

/**
 * Notch at which `mass` must sit on `side` to balance `loads`, or null when no
 * whole-notch position within `maxDistance` does it.
 */
export function solveBalance(
  loads: Load[],
  mass: number,
  side: Side,
  maxDistance: number,
): number | null {
  if (mass <= 0) return null;
  const sign = side === 'right' ? 1 : -1;
  const distance = -netTorque(loads) / (sign * mass);
  if (!Number.isInteger(distance)) return null;
  if (distance < 1 || distance > maxDistance) return null;
  return distance;
}

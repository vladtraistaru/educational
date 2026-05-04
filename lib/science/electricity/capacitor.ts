import { Component } from './component';
import { Node } from './node';

export const CAPACITOR_FULL = 0.999;

/**
 * DC pseudo-resistor model: an empty cap looks like ~1 Ω (current flows freely),
 * a nearly full cap looks like ~Infinity (open circuit). Charge integration
 * lives in the simulation layer; this class only reports an effective
 * resistance for the existing series/parallel solver.
 */
export class Capacitor extends Component {
  constructor(
    id: string,
    public microFarads: number,
    public chargeFraction: number,
    nodeA: Node,
    nodeB: Node,
  ) {
    super(id, nodeA, nodeB);
  }

  resistance(): number {
    if (this.chargeFraction >= CAPACITOR_FULL) return Infinity;
    const ramp = this.chargeFraction / (1 - this.chargeFraction);
    return 1 + ramp * 50;
  }
}

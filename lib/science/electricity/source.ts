import { Component } from './component';
import { Node } from './node';

export class VoltageSource extends Component {
  constructor(id: string, public volts: number, nodeA: Node, nodeB: Node) {
    super(id, nodeA, nodeB);
  }

  resistance(): number {
    return 0;
  }
}

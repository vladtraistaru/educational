import { Component } from './component';
import { Node } from './node';

export class Resistor extends Component {
  constructor(id: string, public ohms: number, nodeA: Node, nodeB: Node) {
    super(id, nodeA, nodeB);
  }

  resistance(): number {
    return this.ohms;
  }
}

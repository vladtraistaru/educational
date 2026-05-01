import { Component } from './component';
import { Node } from './node';

export class Switch extends Component {
  constructor(id: string, public closed: boolean, nodeA: Node, nodeB: Node) {
    super(id, nodeA, nodeB);
  }

  resistance(): number {
    return this.closed ? 0 : Infinity;
  }
}

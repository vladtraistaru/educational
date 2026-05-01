import { Component } from './component';
import { Node } from './node';
import { solve } from './solver';

export class Circuit {
  components: Component[] = [];
  nodes: Node[] = [];

  node(id: string): Node {
    const existing = this.nodes.find((n) => n.id === id);
    if (existing) return existing;
    const node = new Node(id);
    this.nodes.push(node);
    return node;
  }

  addComponent<C extends Component>(component: C): C {
    this.components.push(component);
    if (!this.nodes.includes(component.nodeA)) this.nodes.push(component.nodeA);
    if (!this.nodes.includes(component.nodeB)) this.nodes.push(component.nodeB);
    return component;
  }

  solve(): void {
    solve(this);
  }
}

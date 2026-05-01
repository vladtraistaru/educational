import { Node } from './node';

export abstract class Component {
  current = 0;
  voltage = 0;

  constructor(
    public readonly id: string,
    public readonly nodeA: Node,
    public readonly nodeB: Node,
  ) {}

  abstract resistance(): number;
}

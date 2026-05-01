import type { Circuit } from './circuit';
import { Component } from './component';
import { Node } from './node';
import { Switch } from './switch';
import { VoltageSource } from './source';
import { Wire } from './wire';

type EdgeTree =
  | { kind: 'leaf'; component: Component; ohms: number }
  | { kind: 'series'; children: EdgeTree[]; ohms: number }
  | { kind: 'parallel'; children: EdgeTree[]; ohms: number };

interface Edge {
  a: number;
  b: number;
  tree: EdgeTree;
}

class UnionFind {
  private parent = new Map<Node, Node>();

  find(n: Node): Node {
    const p = this.parent.get(n);
    if (!p || p === n) {
      this.parent.set(n, n);
      return n;
    }
    const root = this.find(p);
    this.parent.set(n, root);
    return root;
  }

  union(a: Node, b: Node): void {
    const ra = this.find(a);
    const rb = this.find(b);
    if (ra !== rb) this.parent.set(ra, rb);
  }
}

export function solve(circuit: Circuit): void {
  resetState(circuit);

  const sources = circuit.components.filter((c): c is VoltageSource => c instanceof VoltageSource);
  if (sources.length === 0) return;
  if (sources.length > 1) throw new Error('Multiple voltage sources are not supported yet');
  const source = sources[0];

  const uf = new UnionFind();
  for (const c of circuit.components) {
    if (c instanceof Wire) uf.union(c.nodeA, c.nodeB);
    else if (c instanceof Switch && c.closed) uf.union(c.nodeA, c.nodeB);
  }

  const superNodes = new Map<Node, number>();
  let nextId = 0;
  const idOf = (n: Node): number => {
    const root = uf.find(n);
    let id = superNodes.get(root);
    if (id === undefined) {
      id = nextId++;
      superNodes.set(root, id);
    }
    return id;
  };

  const sourceA = idOf(source.nodeA);
  const sourceB = idOf(source.nodeB);
  if (sourceA === sourceB) throw new Error('Voltage source is short-circuited');

  const edges: Edge[] = [];
  for (const c of circuit.components) {
    if (c instanceof VoltageSource) continue;
    if (c instanceof Wire) continue;
    if (c instanceof Switch && c.closed) continue;
    const a = idOf(c.nodeA);
    const b = idOf(c.nodeB);
    if (a === b) continue;
    edges.push({ a, b, tree: { kind: 'leaf', component: c, ohms: c.resistance() } });
  }

  const reduced = reduce(edges, sourceA, sourceB);

  const totalR = reduced.ohms;
  const totalI = totalR === Infinity ? 0 : source.volts / totalR;

  source.current = totalI;
  source.voltage = source.volts;

  distribute(reduced, source.volts, totalI);
}

function resetState(circuit: Circuit): void {
  for (const c of circuit.components) {
    c.current = 0;
    c.voltage = 0;
  }
  for (const n of circuit.nodes) n.potential = 0;
}

function reduce(initial: Edge[], srcA: number, srcB: number): EdgeTree {
  let edges = initial.slice();

  while (true) {
    const parallel = findParallel(edges);
    if (parallel) {
      edges = mergeParallel(edges, parallel);
      continue;
    }

    if (edges.length === 1 && sameEndpoints(edges[0], srcA, srcB)) break;

    const series = findSeries(edges, srcA, srcB);
    if (series) {
      edges = mergeSeries(edges, series);
      continue;
    }

    throw new Error('Circuit not reducible to series/parallel; bridge topologies not supported yet');
  }

  return edges[0].tree;
}

function sameEndpoints(e: Edge, a: number, b: number): boolean {
  return (e.a === a && e.b === b) || (e.a === b && e.b === a);
}

function findParallel(edges: Edge[]): [number, number] | null {
  for (let i = 0; i < edges.length; i++) {
    for (let j = i + 1; j < edges.length; j++) {
      if (sameEndpoints(edges[i], edges[j].a, edges[j].b)) return [i, j];
    }
  }
  return null;
}

function mergeParallel(edges: Edge[], [i, j]: [number, number]): Edge[] {
  const e1 = edges[i];
  const e2 = edges[j];
  const ohms = parallelOhms(e1.tree.ohms, e2.tree.ohms);
  const children = [...flatten(e1.tree, 'parallel'), ...flatten(e2.tree, 'parallel')];
  const merged: Edge = {
    a: e1.a,
    b: e1.b,
    tree: { kind: 'parallel', children, ohms },
  };
  return edges.filter((_, k) => k !== i && k !== j).concat(merged);
}

function findSeries(edges: Edge[], srcA: number, srcB: number): number | null {
  const incidence = new Map<number, number[]>();
  edges.forEach((e, idx) => {
    pushAt(incidence, e.a, idx);
    pushAt(incidence, e.b, idx);
  });
  for (const [node, idxs] of incidence) {
    if (node === srcA || node === srcB) continue;
    if (idxs.length === 2) return node;
  }
  return null;
}

function mergeSeries(edges: Edge[], pivot: number): Edge[] {
  const involved = edges.filter((e) => e.a === pivot || e.b === pivot);
  const e1 = involved[0];
  const e2 = involved[1];
  const outer1 = e1.a === pivot ? e1.b : e1.a;
  const outer2 = e2.a === pivot ? e2.b : e2.a;
  const ohms = e1.tree.ohms + e2.tree.ohms;
  const children = [...flatten(e1.tree, 'series'), ...flatten(e2.tree, 'series')];
  const merged: Edge = {
    a: outer1,
    b: outer2,
    tree: { kind: 'series', children, ohms },
  };
  return edges.filter((e) => e !== e1 && e !== e2).concat(merged);
}

function flatten(tree: EdgeTree, kind: 'series' | 'parallel'): EdgeTree[] {
  if (tree.kind === kind) return tree.children;
  return [tree];
}

function parallelOhms(r1: number, r2: number): number {
  if (r1 === Infinity) return r2;
  if (r2 === Infinity) return r1;
  if (r1 === 0 || r2 === 0) return 0;
  return (r1 * r2) / (r1 + r2);
}

function pushAt<K, V>(map: Map<K, V[]>, key: K, value: V): void {
  const arr = map.get(key);
  if (arr) arr.push(value);
  else map.set(key, [value]);
}

function distribute(tree: EdgeTree, voltage: number, current: number): void {
  if (tree.kind === 'leaf') {
    tree.component.voltage = voltage;
    tree.component.current = current;
    return;
  }
  if (tree.kind === 'series') {
    for (const child of tree.children) {
      const childV = tree.ohms === 0 ? 0 : voltage * (child.ohms / tree.ohms);
      distribute(child, childV, current);
    }
    return;
  }
  for (const child of tree.children) {
    const childI = child.ohms === Infinity ? 0 : voltage / child.ohms;
    distribute(child, voltage, childI);
  }
}


import { PlacedComponent, WireLink } from './state';

/**
 * Implements the per-wire flow allocation algorithm from
 * `plans/simple-circuits-electron-flow.md`. Pure function: given a
 * topology, the source, and component currents, it returns the magnitude
 * and electron-flow direction of each wire and the inferred current
 * through each bulb.
 *
 * Algorithm steps (cross-referenced with the spec):
 *   1. Super-nodes: union-find over wires + closed switches.
 *   2. External super-node graph: every active component except the source.
 *   3. Distance BFS from the source's negative-terminal super-node.
 *   4. Sign per attach: source pumps electrons out at terminal `a`; for any
 *      passive component, electrons enter the super-node on the downstream
 *      side (greater distance) and leave on the upstream side.
 *   5. Per super-node: spanning-tree post-order over the wire graph;
 *      each tree edge's flow magnitude is |sum of attach signs in subtree|;
 *      direction follows from the sign.
 *   6. Bulb current = max wire current on any incident wire.
 */

export type Term = string;

export interface FlowResult {
  wireCurrent: Map<string, number>;
  /** True when the rendering route should be reversed so animation runs in the electron-flow direction. */
  wireReversed: Map<string, boolean>;
  /** Current through each bulb, inferred from incident wires. */
  bulbCurrent: Map<string, number>;
}

export interface FlowInput {
  placed: PlacedComponent[];
  wires: WireLink[];
  sourceId: string;
  /** The source terminal at which electrons EXIT the source (battery `−` side). */
  sourceTerminal: 'a' | 'b';
  /** Magnitude of current through each non-source component (from solver). */
  componentCurrent: Map<string, number>;
}

const FLOW_EPS = 1e-6;

const tkey = (componentId: string, t: 'a' | 'b'): Term => `${componentId}:${t}`;

export function allocateWireFlows(input: FlowInput): FlowResult {
  const { placed, wires, sourceId, sourceTerminal, componentCurrent } = input;

  const result: FlowResult = {
    wireCurrent: new Map(),
    wireReversed: new Map(),
    bulbCurrent: new Map(),
  };
  for (const w of wires) result.wireCurrent.set(w.id, 0);

  const find = buildSuperNodes(placed, wires);
  const superDist = bfsSuperDistances(placed, sourceId, sourceTerminal, find);

  // Bulbs are modeled as ideal wires in the solver, so their `current` is 0.
  // We must infer it before per-super-node KCL allocation runs, otherwise the
  // bulb's "attach" disappears and the super-node's KCL fails. Inference =
  // close KCL at each super-node iteratively: where exactly one bulb's
  // current is unknown, it equals the magnitude of the other attaches' net.
  const effectiveCurrent = inferBulbCurrentsFromTopology(
    placed,
    sourceId,
    sourceTerminal,
    componentCurrent,
    superDist,
    find,
  );

  const wiresBySuper = groupWiresBySuperNode(wires, find);

  for (const [superNode, supWires] of wiresBySuper) {
    if (superDist.get(superNode) === undefined) continue;

    const attaches = collectAttaches(
      placed,
      sourceId,
      sourceTerminal,
      effectiveCurrent,
      superDist,
      find,
      superNode,
    );

    allocateOnTree(supWires, attaches, result);
  }

  // Refine bulb-current readout from incident wire flows: this captures the
  // case where a bulb sits in parallel with a resistor and the topology
  // pre-pass couldn't disambiguate. Wires are the source of truth.
  refineBulbCurrentsFromWires(placed, wires, effectiveCurrent, result);

  return result;
}

function inferBulbCurrentsFromTopology(
  placed: PlacedComponent[],
  sourceId: string,
  sourceTerminal: 'a' | 'b',
  componentCurrent: Map<string, number>,
  superDist: Map<Term, number>,
  find: (t: Term) => Term,
): Map<string, number> {
  const out = new Map(componentCurrent);
  const bulbIds = placed.filter((c) => c.kind === 'bulb').map((c) => c.id);
  if (bulbIds.length === 0) return out;

  const unknownBulbs = new Set(bulbIds.filter((id) => (out.get(id) ?? 0) <= FLOW_EPS));
  if (unknownBulbs.size === 0) return out;

  // Group all super-nodes touched by anything.
  const allSupers = new Set<Term>();
  for (const c of placed) {
    allSupers.add(find(tkey(c.id, 'a')));
    allSupers.add(find(tkey(c.id, 'b')));
  }

  let progressed = true;
  while (progressed && unknownBulbs.size > 0) {
    progressed = false;
    for (const s of allSupers) {
      if (superDist.get(s) === undefined) continue;
      let knownNet = 0;
      const unknownHere: { id: string; sign: number }[] = [];
      for (const c of placed) {
        if (c.kind === 'switch' && !c.closed) continue;
        for (const t of ['a', 'b'] as const) {
          if (find(tkey(c.id, t)) !== s) continue;
          const otherSuper = find(tkey(c.id, t === 'a' ? 'b' : 'a'));
          if (otherSuper === s) continue;
          let sign: number;
          if (c.id === sourceId) {
            sign = t === sourceTerminal ? +1 : -1;
          } else {
            const dHere = superDist.get(s);
            const dOther = superDist.get(otherSuper);
            if (dHere === undefined || dOther === undefined) continue;
            sign = dHere > dOther ? +1 : dHere < dOther ? -1 : 0;
          }
          if (sign === 0) continue;
          if (unknownBulbs.has(c.id)) {
            unknownHere.push({ id: c.id, sign });
          } else {
            const i = out.get(c.id) ?? 0;
            knownNet += sign * i;
          }
        }
      }
      if (unknownHere.length === 1) {
        // Need: knownNet + u.sign * |i| = 0 → |i| = |knownNet|.
        const u = unknownHere[0];
        out.set(u.id, Math.abs(knownNet));
        unknownBulbs.delete(u.id);
        progressed = true;
      } else if (
        unknownHere.length > 1 &&
        unknownHere.every((u) => u.sign === unknownHere[0].sign)
      ) {
        // All unknown bulbs at S share a sign (same direction): the deficit
        // must split among them. Bulbs are ideal wires so we assume an
        // equal split. This isn't physically exact when the parallel bulbs
        // are part of differently-loaded branches, but it's what a circuit
        // with identical parallel bulbs does.
        const each = Math.abs(knownNet) / unknownHere.length;
        for (const u of unknownHere) {
          out.set(u.id, each);
          unknownBulbs.delete(u.id);
        }
        progressed = true;
      }
    }
  }
  return out;
}

function refineBulbCurrentsFromWires(
  placed: PlacedComponent[],
  wires: WireLink[],
  effectiveCurrent: Map<string, number>,
  result: FlowResult,
): void {
  for (const c of placed) {
    if (c.kind !== 'bulb') continue;
    let i = effectiveCurrent.get(c.id) ?? 0;
    for (const w of wires) {
      if (w.from.componentId === c.id || w.to.componentId === c.id) {
        i = Math.max(i, result.wireCurrent.get(w.id) ?? 0);
      }
    }
    result.bulbCurrent.set(c.id, i);
  }
}

function buildSuperNodes(placed: PlacedComponent[], wires: WireLink[]): (t: Term) => Term {
  const parent = new Map<Term, Term>();
  const find = (t: Term): Term => {
    let r = parent.get(t) ?? t;
    if (r === t) {
      parent.set(t, t);
      return t;
    }
    r = find(r);
    parent.set(t, r);
    return r;
  };
  const union = (a: Term, b: Term) => {
    const ra = find(a);
    const rb = find(b);
    if (ra !== rb) parent.set(ra, rb);
  };

  for (const w of wires) {
    union(tkey(w.from.componentId, w.from.terminal), tkey(w.to.componentId, w.to.terminal));
  }
  for (const c of placed) {
    if (c.kind === 'switch' && c.closed) {
      union(tkey(c.id, 'a'), tkey(c.id, 'b'));
    }
  }
  return find;
}

function bfsSuperDistances(
  placed: PlacedComponent[],
  sourceId: string,
  sourceTerminal: 'a' | 'b',
  find: (t: Term) => Term,
): Map<Term, number> {
  const adj = new Map<Term, Term[]>();
  const addEdge = (a: Term, b: Term) => {
    const ra = find(a);
    const rb = find(b);
    if (ra === rb) return;
    if (!adj.has(ra)) adj.set(ra, []);
    if (!adj.has(rb)) adj.set(rb, []);
    adj.get(ra)!.push(rb);
    adj.get(rb)!.push(ra);
  };

  for (const c of placed) {
    if (c.id === sourceId) continue;
    if (c.kind === 'switch' && !c.closed) continue;
    addEdge(tkey(c.id, 'a'), tkey(c.id, 'b'));
  }

  const start = find(tkey(sourceId, sourceTerminal));
  const dist = new Map<Term, number>();
  dist.set(start, 0);
  const q: Term[] = [start];
  while (q.length > 0) {
    const s = q.shift()!;
    const d = dist.get(s)!;
    for (const n of adj.get(s) ?? []) {
      if (dist.has(n)) continue;
      dist.set(n, d + 1);
      q.push(n);
    }
  }
  return dist;
}

function groupWiresBySuperNode(
  wires: WireLink[],
  find: (t: Term) => Term,
): Map<Term, WireLink[]> {
  const out = new Map<Term, WireLink[]>();
  for (const w of wires) {
    const root = find(tkey(w.from.componentId, w.from.terminal));
    if (!out.has(root)) out.set(root, []);
    out.get(root)!.push(w);
  }
  return out;
}

interface Attach {
  terminal: Term;
  /** Signed current: + means electrons enter the super-node here, − means they leave. */
  signed: number;
}

function collectAttaches(
  placed: PlacedComponent[],
  sourceId: string,
  sourceTerminal: 'a' | 'b',
  componentCurrent: Map<string, number>,
  superDist: Map<Term, number>,
  find: (t: Term) => Term,
  superNode: Term,
): Attach[] {
  const attaches: Attach[] = [];
  for (const c of placed) {
    if (c.kind === 'switch' && !c.closed) continue;
    const i = componentCurrent.get(c.id) ?? 0;
    if (i <= FLOW_EPS) continue;
    for (const t of ['a', 'b'] as const) {
      const here = find(tkey(c.id, t));
      if (here !== superNode) continue;
      const otherSuper = find(tkey(c.id, t === 'a' ? 'b' : 'a'));
      if (here === otherSuper) continue;

      let sign: number;
      if (c.id === sourceId) {
        // Source: electrons exit at `sourceTerminal`. So at that terminal,
        // electrons LEAVE the source = ENTER the adjacent super-node (+1).
        sign = t === sourceTerminal ? +1 : -1;
      } else {
        const dHere = superDist.get(here);
        const dOther = superDist.get(otherSuper);
        if (dHere === undefined || dOther === undefined) continue;
        // Passive component: electrons enter super-node at the downstream
        // terminal (greater distance from source) and leave at the upstream
        // terminal. Equal-distance bridges are unoriented; skip them.
        sign = dHere > dOther ? +1 : dHere < dOther ? -1 : 0;
      }
      if (sign === 0) continue;
      attaches.push({ terminal: tkey(c.id, t), signed: sign * i });
    }
  }
  return attaches;
}

function allocateOnTree(
  supWires: WireLink[],
  attaches: Attach[],
  result: FlowResult,
): void {
  const wireAdj = new Map<Term, { other: Term; wireId: string }[]>();
  const ensureNode = (t: Term) => {
    if (!wireAdj.has(t)) wireAdj.set(t, []);
  };
  for (const w of supWires) {
    const a = tkey(w.from.componentId, w.from.terminal);
    const b = tkey(w.to.componentId, w.to.terminal);
    ensureNode(a);
    ensureNode(b);
    wireAdj.get(a)!.push({ other: b, wireId: w.id });
    wireAdj.get(b)!.push({ other: a, wireId: w.id });
  }
  for (const at of attaches) ensureNode(at.terminal);
  if (wireAdj.size === 0) return;

  // Root selection: prefer an upstream attach (electrons ENTER here, +).
  // This makes the parent→child convention align with electron flow on the
  // tree, which is easier to reason about. Any choice works mathematically.
  let root: Term | undefined;
  for (const at of attaches) {
    if (at.signed > 0 && wireAdj.has(at.terminal)) {
      root = at.terminal;
      break;
    }
  }
  if (!root) {
    for (const at of attaches) {
      if (wireAdj.has(at.terminal)) {
        root = at.terminal;
        break;
      }
    }
  }
  if (!root) root = wireAdj.keys().next().value as Term;

  // BFS spanning tree. Cycles ignored: non-tree wire edges get flow 0.
  const parent = new Map<Term, { node: Term; wireId: string } | null>();
  parent.set(root, null);
  const order: Term[] = [root];
  const q: Term[] = [root];
  while (q.length > 0) {
    const n = q.shift()!;
    for (const e of wireAdj.get(n) ?? []) {
      if (parent.has(e.other)) continue;
      parent.set(e.other, { node: n, wireId: e.wireId });
      order.push(e.other);
      q.push(e.other);
    }
  }

  const injection = new Map<Term, number>();
  for (const at of attaches) {
    injection.set(at.terminal, (injection.get(at.terminal) ?? 0) + at.signed);
  }

  // Post-order: subtreeInjection[N] = sum of injections in N's subtree.
  // For the wire that connects N to its parent, that sum is the *net excess*
  // of electrons in the subtree, which must flow OUT through that wire (i.e.
  // child → parent) if positive, IN (parent → child) if negative.
  const subtreeInjection = new Map<Term, number>();
  for (let i = order.length - 1; i >= 0; i--) {
    const node = order[i];
    let sum = injection.get(node) ?? 0;
    for (const e of wireAdj.get(node) ?? []) {
      const p = parent.get(e.other);
      if (p && p.node === node) {
        sum += subtreeInjection.get(e.other) ?? 0;
      }
    }
    subtreeInjection.set(node, sum);
  }

  for (const w of supWires) {
    const a = tkey(w.from.componentId, w.from.terminal);
    const b = tkey(w.to.componentId, w.to.terminal);
    const pa = parent.get(a);
    const pb = parent.get(b);

    let childTerm: Term | null = null;
    let parentEnd: 'from' | 'to' = 'from';
    if (pa && pa.node === b && pa.wireId === w.id) {
      childTerm = a;
      parentEnd = 'to';
    } else if (pb && pb.node === a && pb.wireId === w.id) {
      childTerm = b;
      parentEnd = 'from';
    }
    if (!childTerm) {
      result.wireCurrent.set(w.id, 0);
      continue;
    }

    const subIn = subtreeInjection.get(childTerm) ?? 0;
    const magnitude = Math.abs(subIn);
    result.wireCurrent.set(w.id, magnitude);
    if (magnitude < FLOW_EPS) continue;

    // subIn > 0 → electrons flow child → parent.
    // subIn < 0 → electrons flow parent → child.
    const electronsChildToParent = subIn > 0;
    // Convert child/parent direction to from/to direction.
    const electronsFromIsFrom =
      parentEnd === 'to' ? electronsChildToParent : !electronsChildToParent;
    result.wireReversed.set(w.id, !electronsFromIsFrom);
  }
}


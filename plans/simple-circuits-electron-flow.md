# Simple Circuits — Electron Flow Animation Spec

## Current issues (observed bugs)

These all manifest in topologies with parallel branches (e.g. battery → bulb → two resistors in parallel → battery):

1. **Wires inside a junction show electrons flowing in both directions.** A "junction" is a point where 3+ wires meet at one component terminal. The wires *around* that junction sometimes animate as if electrons are converging from two directions, or diverging in two directions inconsistently with the rest of the loop.

2. **Components show electrons entering from both terminals.** Visually, a resistor or bulb appears to have electrons flowing *into* it on both sides, instead of in-one-side / out-the-other.

3. **Equipotential connector wires animate as if they carry current.** A wire that physically connects two points at the same potential (e.g. a short wire between two terminals that are part of the same junction) shouldn't show any electron flow. Currently they animate at full source current.

4. **All wires display the same current magnitude (`totalI`).** A wire on a parallel branch carrying half the total current animates identically to the trunk wire carrying the full total. The animation density should reflect the actual current through that specific wire.

5. **Bulbs in parallel would all glow at full source current.** Same root cause as #4: bulb brightness uses `totalI`, not the bulb's own branch current. (Not currently observable since users can't easily wire two bulbs in parallel and notice, but it's the same bug.)

---

## Goals

A user looking at any working circuit should see:

- Electrons leaving battery `−`, traveling through the external circuit, and returning to battery `+`.
- At every junction, electrons flow consistently: in via one or more wires, out via one or more wires, with the totals balancing.
- Each wire animates with electron *density and speed* matching the actual current through that specific wire (more current = more dots, faster movement).
- Wires that carry no current show no electrons.
- Each bulb's brightness reflects the current through that specific bulb, not the total source current.

This must hold for arbitrary user-built topologies the solver supports: pure series, parallel branches, mixed series-parallel, and circuits with capacitors (charging).

---

## Concepts

### Terminals, wires, junctions, super-nodes

- Each component has two **terminals**, named `a` and `b`.
- A **wire** is a 2-endpoint object linking two terminals (`from` and `to`).
- Multiple wires may share a single terminal — that terminal becomes a **junction**.
- A **super-node** is a maximal set of terminals connected to each other through wires only (and through closed switches, which act electrically like wires). Every terminal in a super-node is at the same electrical potential.
- An **edge** in the abstract circuit graph is an active component (resistor, bulb, capacitor, voltage source, open switch). An edge connects two super-nodes (the super-nodes containing its `a` and `b` terminals respectively). Note: a component's two terminals may sometimes belong to the same super-node — that's a short across the component. The solver already handles this case.

### Electron flow direction

- The battery is the only source. By convention in this app, electrons exit terminal `a` (the `−` side) and re-enter terminal `b` (the `+` side).
- For every passive component (resistor, bulb, capacitor, closed switch), electrons enter on the upstream side and exit on the downstream side. Upstream/downstream is defined by which super-node is closer to battery `−` along the *external* circuit (not through the battery itself).
- For a wire, "direction" means which end electrons are flowing toward.

### Current per wire

- Each component has a known current magnitude `i` from the solver (or, for bulbs modeled as ideal wires, inferred — see below).
- Within a single super-node S: at every terminal where an active component attaches, electrons either *enter* S (from the component) or *leave* S (into the component). Sum of inflows = sum of outflows = the super-node's total throughput.
- The wires inside S form a connected subgraph (typically a tree, but cycles are allowed if the user drew redundant wires). Each wire carries some portion of the super-node's flow.
- KCL must hold at every wire-internal junction inside S.

---

## Algorithm: how to compute per-wire flow and direction

### Step 1 — Build super-nodes

Union-find over (terminals as elements):
- For every wire, `union(wire.from, wire.to)`.
- For every closed switch, `union(switch.a, switch.b)`.

Now every terminal has a super-node root.

### Step 2 — Build the super-node graph

Nodes: super-node roots. Edges: every active component **except the source** that connects two distinct super-nodes (or the same super-node — a self-loop — which we ignore for orientation purposes).

The source is intentionally excluded. We use this graph to measure "distance from battery `−` through the external circuit," and the source itself is the start, not a hop.

### Step 3 — Super-node distance BFS

BFS from the super-node containing battery's `−` terminal. Assign each reachable super-node an integer distance. Every super-node should be reachable through the external circuit; if not, that part of the circuit is dead (no current flows through it) and we can skip it.

### Step 4 — For each component, determine direction

For each active component `c`:
- Let `S_a` = super-node of `c.a`, `S_b` = super-node of `c.b`.
- If `c` is the source: electrons exit at terminal `a` (so at `c.a`'s super-node, electrons are *injected*; at `c.b`'s super-node, electrons are *withdrawn*).
- Otherwise: the terminal in the super-node with **smaller** distance is the upstream side; the other is downstream. Electrons enter at upstream, exit at downstream. (If the two super-nodes have equal distance, the component is on a "bridge" topology the simple solver doesn't support; treat as unoriented.)

This produces, for each super-node S, a list of "attaches": each attach is a terminal in S where a component meets S, plus a signed current — positive if electrons enter S at this attach, negative if they leave S at this attach.

By KCL, the sum of signed currents over all attaches of a super-node equals 0.

### Step 5 — Per-super-node wire flow allocation

For each super-node S with attaches and at least one wire:

1. Build the wire graph within S: nodes are terminals, undirected edges are wires.
2. The wire graph forms a **tree** in normal usage (the user draws one wire between any two points). If it has cycles (redundant user wires), we'll handle them separately — see "cycles" below.
3. Assume tree for now. Each wire `w` is a tree edge that, when cut, splits S into two halves: side(`from`) and side(`to`). Define **flow through w** as: sum of attach currents (signed, with "+ = enter S") whose terminal lies on side(`to`). If positive, electrons are flowing across the wire from `from` to `to` (electrons enter S on side(`to`) and must leave through side(`from`) — wait, let me re-derive).

Let me restate Step 5.3 carefully:

> Define `subtreeInflow(w, side)` = sum of signed attach currents (entering = +) on the chosen side of `w`. Pick one side, call it the "child" side; the "parent" side is the other. By KCL within the child side, the *net* electron flow leaving the child side through `w` equals `subtreeInflow(w, child)`. So:
> - If `subtreeInflow(w, child) > 0`: electrons are entering the child side via attaches, and that excess must leave via `w` going into the parent side. So electrons flow **child → parent** across `w`. Magnitude = `subtreeInflow(w, child)`.
> - If `< 0`: electrons flow parent → child across `w`. Magnitude = `|subtreeInflow|`.
> - If `= 0`: no flow across `w`. The wire is dead — equipotential connector with no current.

Concretely: pick any terminal as root, run a tree BFS, then post-order accumulate signed attach inflows up the tree. Each wire's flow magnitude is `|subtree sum|`, direction is `child → parent` if subtree sum is positive, else reverse.

### Step 6 — Bulb current

Bulbs are modeled as ideal wires in the solver, so the solver leaves their `current` field at 0. We can't read it.

Instead, infer: for each bulb, look at the wires touching either of its two terminals. Among those, find the maximum allocated wire flow. That's the bulb's current. (Equivalent: read the flow of any wire incident to the bulb that lies on the bulb's series path.)

### Step 7 — Animation

For each wire `w`:
- If allocated flow magnitude is below a small epsilon: don't render electrons.
- Otherwise render electron dots traveling along the wire. Speed/density scale with magnitude (the existing `renderElectrons` already does this). Direction = the direction Step 5 returned (orient the polyline so animation runs from electron-source-end to electron-sink-end).

For each bulb:
- Brightness ∝ inferred current (Step 6). Use the existing scaling.
- "Burnt" / short-circuit detection unchanged from current code.

---

## Edge cases

### Cycles within a super-node

If the user draws redundant wires (e.g. two wires both connecting terminal X to terminal Y), the wire graph inside the super-node has a cycle. The flow split between cycle wires is physically indeterminate without resistance — they're all 0 Ω.

Resolution: take a spanning tree of the super-node (e.g. via BFS), allocate flows on the tree as in Step 5, and assign 0 flow to non-tree wires. They render with no animation. This is a slight white lie (in reality each wire would carry half the flow), but pedagogically harmless and visually clean.

### Multiple sources

The solver rejects multi-source circuits. The discharge pass already temporarily replaces a charged capacitor with a `VoltageSource` while excluding the battery. The allocator must run with whichever single source is active in the current pass:
- Charging pass: source = battery, terminal = `a`.
- Discharge pass: source = the discharging capacitor, terminal = the cap plate at higher potential. (Currently the discharge pass hides all animation, so this case doesn't arise — but if we ever show discharge animations again, the allocator should be reused with the cap as source.)

### Disconnected sub-circuits

If the user has placed wires that don't connect back to the battery, those wires form super-nodes unreachable from the start in Step 3. Skip them; they show no animation. Already handled by Step 3 returning `undefined` distance.

### Open switches

An open switch is an active component edge in the super-node graph but with infinite resistance: the solver assigns it zero current. It will appear in the attach list with `currentInto = 0`, contributing nothing. The two super-nodes it connects may both be reachable via other paths, or one may be a dead branch (Step 3 may not visit it via the open switch). Either way the animation result is correct: no current through open switches, no current in their dead-branch wires.

### Bulb modeled as Wire

The bulb's two terminals end up in the *same super-node* because the bulb is internally a Wire which we union in Step 1... wait, **we don't union via bulbs in Step 1**. Step 1 only unions via real wires (`WireLink`) and closed switches. The bulb is a placed `Component` whose two terminals are different terminals (`bulb-1:a` and `bulb-1:b`), and they're only connected by the bulb itself. They're in **different super-nodes**.

But the bulb is added as a `Wire` to the solver's circuit, which means in the solver it gets folded into super-nodes. That's the solver's internal business — for our allocator, the bulb is just an active component edge between two super-nodes (Step 2), like any other passive component. It contributes to the super-node graph and gets a current of 0 from the solver, which means as an attach it has `currentInto = 0` and is filtered out — exactly right, the bulb itself doesn't inject current into either super-node, it's a transparent edge whose two adjacent super-nodes carry the same flow as each other.

This is consistent and the bulb-current inference in Step 6 picks up the right value.

---

## Acceptance criteria (manual test cases)

A. **Pure series**: battery → bulb → resistor → battery.
   - All wires animate same direction, same density.
   - Bulb glows at the series current.
   - Resistor mA reading equals bulb current.

B. **Two resistors in parallel, between battery and bulb**: battery − → bulb → junction J1 → {R1, R2 in parallel} → junction J2 → battery +.
   - Trunk wires (battery to bulb, bulb to J1, J2 to battery) animate at full source current.
   - Each parallel branch animates at half current (assuming equal resistors).
   - **No wire has electrons flowing in both directions.**
   - **No component has electrons entering from both terminals.**
   - Wires inside J1 (if J1 is a junction with multiple wires) carry no animation if they are equipotential connectors, or animate consistently in the direction electrons are leaving J1.

C. **Two bulbs in parallel**: battery → J1 → {bulb1, bulb2} → J2 → battery.
   - Both bulbs glow at half the source current (same brightness).
   - Each bulb's mA readout shows half the source current, not the full source current.

D. **Capacitor charging in series with a bulb**: battery → cap → bulb → battery.
   - While charging: animation runs in the loop; bulb dims as the cap fills.
   - At steady state (cap full): no animation, bulb dark.
   - **No electrons appear inside the cap (between the plates).** Electrons may appear on the wires touching either plate; that's correct.

E. **Open switch in series**: battery → switch (open) → bulb → battery.
   - No animation anywhere.
   - Bulb dark.
   - Closing the switch starts the animation.

F. **Disconnected component**: place a bulb on the canvas with no wires.
   - Nothing animates. Bulb dark. No errors.

G. **Power off**: any circuit, power toggle off.
   - No animation, no glow, regardless of charge state.
   - Capacitors retain their charge (or silently bleed — current behavior).

---

## What this spec replaces

The current implementation (`allocateWireFlows` in `modules/simple-circuits/simulation.ts`) has the right *structure* (super-nodes, super-node BFS, per-super-node wire tree, post-order subtree sum) but produces wrong results in case B above. Likely root causes still in the code:

1. The super-node BFS may include the source as an edge (intended to be excluded — recently fixed but worth verifying).
2. The "sign" inference at attach terminals (Step 4) uses `dHere > dOther` but this comparison can be wrong if both terminals of a passive component are in super-nodes at *equal* distance from the source, which happens in symmetric parallel topologies.
3. The post-order accumulation might pick the wrong "side" because the BFS root isn't necessarily the upstream attach in all cases — particularly when a super-node has multiple upstream attaches (rare but possible).

A clean reimplementation following this spec literally — Step 1 through Step 7, with explicit testable intermediate values — should resolve all bugs. The key invariant to assert at runtime: **for every super-node, the sum of signed attach currents equals 0 (KCL)**. If that fails for any super-node, there's a bug in the sign inference (Step 4) and the rest is downstream.

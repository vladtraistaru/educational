# Simple Circuits

## Purpose

Free-play sandbox where the user builds simple electrical circuits and sees what makes a bulb light up. Teaches the "closed loop" concept: a battery, wires forming a complete path, and what a switch does in series.

No goals, no levels — pure sandbox. By design.

## User Experience

1. The canvas opens with a single battery placed in the middle. The battery cannot be added or removed.
2. A palette on the left shows two draggable items: a bulb and a switch.
3. The user drags items from the palette onto the canvas. They are positioned where they're dropped.
4. The user clicks a terminal (small dot) on a component, then clicks another terminal on a different component, to draw a wire between them.
5. Clicking an existing wire deletes it. Pressing Escape or clicking empty canvas cancels a pending wire.
6. The switch is clicked (without dragging) to toggle open/closed.
7. Whenever the circuit is closed, the bulb glows yellow and animated electron dots flow along the wires from the battery's `+` terminal back to its `−` terminal.

## Components

| File | Role |
|------|------|
| `Activity.tsx` | Top-level state owner; runs the simulation; passes data to `Palette` and `CircuitCanvas`. |
| `Palette.tsx` | Left sidebar with HTML5-draggable bulb and switch icons. |
| `CircuitCanvas.tsx` | Konva Stage; renders all placed components and wires; handles drop events and click-to-connect logic. |
| `components-on-canvas/BatteryNode.tsx` | Konva group: battery body + 2 terminals. Locked (not removable, but draggable). |
| `components-on-canvas/BulbNode.tsx` | Konva group: bulb that glows when current flows. Removable, draggable. |
| `components-on-canvas/SwitchNode.tsx` | Konva group: switch lever; click to toggle, drag to move. Removable. |
| `components-on-canvas/WireLine.tsx` | Konva line between two terminals + animated electron dots when current flows. |
| `state.ts` | UI state types (`PlacedComponent`, `WireLink`) and terminal-position helpers. |
| `simulation.ts` | Bridge: convert UI state to a `Circuit` from `@/lib/science/electricity`, solve, return per-component currents and `bulbLit`. |
| `translations.ts` | EN/FR strings (palette labels, tip text). |

## Key State

In `Activity.tsx`:

- `placedComponents: PlacedComponent[]` — battery, bulbs, switches with `id`, `kind`, `x`, `y`, optional `closed` for switches.
- `wires: WireLink[]` — each wire links two terminals.
- `pendingWireStart: { componentId, terminal: 'a' | 'b' } | null` — transient state for the click-then-click wire creation flow.
- `simResult: SimResult` — derived (via `useMemo`) from `placedComponents` and `wires` by `simulation.ts`. Contains a per-component current map and a `bulbLit` flag per bulb.

Data flow:

```
user action → setPlacedComponents/setWires → useMemo runs simulation.ts →
simResult passed down to CircuitCanvas → BulbNode glows, WireLine animates electrons
```

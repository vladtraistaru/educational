# Simple Circuits

## Purpose

Free-play sandbox where the user builds simple electrical circuits and sees what makes a bulb light up — and how brightly. Teaches the "closed loop" concept (battery, wires, switch in series) and introduces the resistor as a way to control current: more ohms means less current and a dimmer bulb.

No goals, no levels — pure sandbox. By design.

## User Experience

1. The canvas opens with a single 5 V battery placed in the middle. The battery is labeled `5V` on its body and cannot be added or removed.
2. A palette on the left shows three draggable items: a bulb, a switch, and a resistor.
3. The user drags items from the palette onto the canvas. They are positioned where they're dropped.
4. The user clicks a terminal (small dot) on a component, then clicks another terminal on a different component, to draw a wire between them.
5. Clicking an existing wire deletes it. Pressing Escape or clicking empty canvas cancels a pending wire and deselects.
6. The switch is clicked (without dragging) to toggle open/closed.
7. Selecting a component shows a rotate button (`↻`) at its top-right corner. Selecting a resistor additionally shows a row of ohms chips above it (10, 50, 100, 250, 500 Ω); clicking one updates that resistor's value.
8. Whenever the circuit is closed, the bulb glows yellow and animated electron dots flow along the wires from the battery's `−` terminal, around the loop, back into its `+` terminal (electron-flow convention). The bulb's brightness scales with the actual current through it: with no resistor in the loop the bulb shines at half brightness (5 V / 50 Ω = 0.1 A), a small resistor brightens it (lower total resistance), and a large resistor dims it.

## Components

| File | Role |
|------|------|
| `Activity.tsx` | Top-level state owner; runs the simulation; passes data to `Palette` and `CircuitCanvas`. |
| `Palette.tsx` | Left sidebar with HTML5-draggable bulb, switch, and resistor icons. |
| `CircuitCanvas.tsx` | Konva Stage; renders all placed components (battery with `5V` label, bulb, switch, resistor with its ohms label) and wires; handles drop events, click-to-connect logic, the rotate button, and the ohms picker chips for selected resistors. |
| `state.ts` | UI state types (`PlacedComponent`, `WireLink`), terminal-position helpers, orthogonal wire routing, `RESISTOR_OHMS_OPTIONS`, `DEFAULT_RESISTOR_OHMS`. |
| `simulation.ts` | Bridge: convert UI state to a `Circuit` from `@/lib/science/electricity` (5 V battery, 50 Ω bulb-as-resistor, switches, user resistors), solve, return per-component currents, `bulbLit`, and per-wire reverse flags. |
| `translations.ts` | EN/FR strings (palette labels, tip text, reset). |

## Key State

In `Activity.tsx`:

- `placed: PlacedComponent[]` — battery, bulbs, switches, and resistors with `id`, `kind`, `x`, `y`, `rotation`, plus `closed` for switches and `ohms` for resistors.
- `wires: WireLink[]` — each wire links two terminals.
- `pendingWireStart: TerminalRef | null` — transient state for the click-then-click wire creation flow.
- `selectedId: string | null` — currently selected component (drives the rotate button and, for resistors, the ohms picker).
- `simResult: SimResult` — derived (via `useMemo`) from `placed` and `wires` by `simulation.ts`. Contains a per-component current map, per-wire current map, a `bulbLit` flag per bulb, and a per-wire `wireReversed` flag for electron-direction animation.

Data flow:

```
user action → setPlaced/setWires → useMemo runs simulation.ts →
simResult passed down to CircuitCanvas → BulbNode glows (brightness ∝ current),
WireLine animates electrons in the correct direction
```

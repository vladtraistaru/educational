# Simple Circuits

## Purpose

Free-play sandbox where the user builds simple electrical circuits and sees what happens. Teaches the "closed loop" idea (battery, wires, switch in series) and three component behaviors:

- **Resistor**: more ohms means less current and a dimmer bulb.
- **Capacitor**: stores charge — when you flip the power on, current flows briefly while the cap charges, so the bulb flashes and fades; when you flip the power off, a charged cap discharges through the bulb, glowing briefly.
- **Short circuit**: connecting the battery directly to itself with no resistance burns the bulb.

No goals, no levels — pure sandbox. By design.

## User Experience

1. The canvas opens with a single 5 V battery placed in the middle. The battery is labeled `5V` and cannot be added or removed.
2. A palette on the left shows four draggable items: a bulb, a switch, a resistor, and a capacitor.
3. The user drags items from the palette onto the canvas; they are positioned where they're dropped.
4. The user clicks a terminal (small dot) on a component, then clicks another terminal on a different component, to draw a wire between them.
5. Clicking an existing wire deletes it. Pressing Escape or clicking empty canvas cancels a pending wire and deselects.
6. The switch is clicked (without dragging) to toggle open/closed.
7. Selecting a component shows a rotate button (`↻`) at its top-right corner and a remove button (`×`) at its top-left (the battery is not removable). Selecting a resistor additionally shows a row of ohms chips above it (10, 50, 100, 250, 500 Ω). Selecting a capacitor shows a row of capacitance chips (100 µF, 470 µF, 1 mF, 4.7 mF, 10 mF). Clicking a chip updates that component's value.
8. A power toggle (`OFF` / `ON`) at the bottom of the canvas turns the battery on. While the simulation is `OFF` the bulb is dark and no current flows; charged capacitors retain their charge.
9. Whenever the circuit is closed and powered, the bulb glows yellow and animated electron dots flow along the wires from the battery's `−` terminal, around the loop, back into its `+` terminal (electron-flow convention). The bulb's brightness scales with the actual current through it; a tiny "mA" readout below the bulb shows the current in milliamps.
10. If the battery is short-circuited (e.g. wired directly to itself with no resistor or capacitor in between), every bulb in the circuit is shown as **burnt** with a `⚡ burnt` label until the user resets or rewires.
11. With a charged capacitor in a closed loop with the bulb, switching the power off causes the capacitor to discharge through the bulb — the bulb glows briefly and fades as the capacitor empties. Capacitors show a small blue fill bar between their plates that grows with charge.

## Components

| File | Role |
|------|------|
| `Activity.tsx` | Top-level state owner; runs the per-frame simulation tick; passes data to `Palette` and `CircuitCanvas`. |
| `Palette.tsx` | Left sidebar with HTML5-draggable bulb, switch, resistor, and capacitor icons. |
| `CircuitCanvas.tsx` | Konva Stage; renders all placed components (battery with `5V` label, bulb, switch, resistor with `Ω` label, capacitor with `µF`/`mF` label and charge bar) and wires; handles drop events, click-to-connect logic, the rotate/remove buttons, and the value-picker chips for selected resistors and capacitors. |
| `state.ts` | UI state types (`PlacedComponent`, `WireLink`, `SimResult`), terminal-position helpers, orthogonal wire routing, picker constants. |
| `simulation.ts` | Bridge: convert UI state to a `Circuit` from `@/lib/science/electricity` (5 V battery, bulb-as-`Wire`, switches, user resistors, user capacitors), solve it, integrate capacitor charge over time, and return per-component currents, `bulbLit`, `bulbBurnt`, `capacitorCharge`, and per-wire reverse flags. Runs both a charging pass (when power is on) and a discharging pass (when power is off and a capacitor has stored charge). |
| `translations.ts` | EN/FR strings (palette labels, tip text, reset, power label). |

## Key State

In `Activity.tsx`:

- `placed: PlacedComponent[]` — battery, bulbs, switches, resistors, and capacitors with `id`, `kind`, `x`, `y`, `rotation`; plus `closed` for switches, `ohms` for resistors, `microFarads` for capacitors.
- `wires: WireLink[]` — each wire links two terminals.
- `pendingWireStart: TerminalRef | null` — transient state for click-then-click wire creation.
- `selectedId: string | null` — currently selected component (drives the rotate/remove buttons and the picker chips).
- `powerOn: boolean` — battery on/off toggle.
- `simResult: SimResult` — output of the latest simulation tick; contains per-component current, per-wire current, `bulbLit` / `bulbBurnt` flags, `capacitorCharge` (0..1 per cap), `wireReversed` (electron-direction animation), and a `shortCircuit` flag.
- `chargeStateRef: Map<id, q>` — owned by `Activity.tsx`, mutated each tick; passed in/out of `simulate()` so capacitor charge persists across frames.

The simulation is **stateful in time** (not a `useMemo`): a `requestAnimationFrame` loop in `Activity.tsx` calls `simulate({ placed, wires, powerOn, chargeState, dt })` every frame, writes the new `chargeState` back to the ref, and updates `simResult`.

## Capacitor model

The DC solver in `@/lib/science/electricity` is a series/parallel resistance reducer with no time domain. The capacitor is modeled as a **variable resistor** whose effective resistance grows with its charge fraction `q`:

- `q = 0` → `R ≈ 1 Ω` (cap acts like a wire — current flows freely on connect)
- `q = 0.5` → `R ≈ 51 Ω` (cap is partially blocking)
- `q ≥ 0.999` → `R = ∞` (cap fully blocks DC)

Each frame, the simulation reads the cap's current `i` from the solved circuit and integrates `q += i · dt / (C · V_battery)`, capped at 1. Per-step `Δq` is clamped to `0.05` to keep apparent resistance smooth.

For discharge (power off, a cap holds charge), the cap is temporarily replaced with a `VoltageSource(q · 5V)` and the battery is treated as an internal wire (so a cap-bulb-battery loop can drain through itself); the circuit is re-solved, the resulting current lights bulbs in the loop and integrates `q` downward.

The data flow per tick:

```
animation tick (dt) →
  simulate({ placed, wires, powerOn, chargeState, dt }) →
    powerOn  ? charging pass  (battery as source, caps as variable R)
             : discharge pass (charged cap as source, no battery)
  → newChargeState (written back to chargeStateRef)
  → simResult (passed to CircuitCanvas)
  → BulbNode glows ∝ current, capacitor draws charge bar,
    WireLine animates electrons in the correct direction
```

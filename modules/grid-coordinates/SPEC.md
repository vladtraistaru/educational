# Grid Coordinates

## Purpose

Introduces **locating positions on a grid** using column letters and row numbers (e.g. **C4**), and following simple movement instructions — a treasure-map framing. Aligns with MER *Espace* (repérage dans le plan). Prepares for (x, y) coordinates later.

## User Experience

The activity has three mode tabs (same tab pattern as `symmetry-play`) and a grid size toggle.

### Grid

- Columns labelled **A, B, C…** along the bottom; rows labelled **1, 2, 3…** up the left side.
- **Row 1 is at the bottom** (map / future x-y convention), so "up" increases the row number. Labels are always visible.
- Cells are square buttons, responsive: the whole grid fits phone width (≥ 320px) without horizontal scroll.
- Hovering/focusing a cell softly highlights its column letter and row number labels — this is the key teaching aid ("go along, then up").
- Decorative map theme: light parchment-ish background, a few scenery emoji (🌳 🏠 ⛰️ 🌊) placed on random cells that never overlap the target.
- Sizes: **Small 5×5** (default) and **Large 8×8**.

### Mode 1 — Find the cell

1. Prompt: "Click on cell **D3**."
2. Learner taps a cell. Correct → the cell shows 💎 and green feedback. Wrong → the tapped cell flashes red, feedback says what they tapped ("That's **B3**. Look for column **D**.", or "Look for row **3**." when the column was already right) and they can try again.
3. The very first task is always **D3** with fixed scenery so server and client render the same; later tasks are random.
4. **Next** gives a new target.

### Mode 2 — Name the cell

1. A treasure 💎 sits in one cell. Prompt: "Where is the treasure?"
2. Four answer buttons, e.g. `C2`, `B3`, `C3`, `2C`. Three distractors are picked at random from common mistakes: row/column swapped (only when different and valid), neighbour column, neighbour row, reversed notation (`2C`); other neighbours fill in if needed.
3. One answer per task. Correct → green; wrong → red on the picked button, correct button highlighted, the target's column and row labels pulse.
4. **Next** gives a new position.

### Mode 3 — Follow the path

1. A pirate 🏴‍☠️ stands on a start cell. Prompt lists 1–3 moves as arrow chips: "**2 → right**, **3 ↑ up**".
2. Learner taps the destination cell.
3. Correct → the pirate animates along the path one cell at a time (CSS transition per step) onto 💎. Wrong → the tapped cell turns red, feedback "Not quite — try following one move at a time", and from the second wrong try the path (every cell after the start) is drawn faintly.
4. Moves are generated so the path never leaves the grid. Small grid: 1–2 moves of 1–3 steps; large grid: 2–3 moves of 1–5 steps. Consecutive moves always alternate axis (horizontal / vertical), so never "2 right, 1 right" or "2 right, 1 left".
5. **Next** gives a new path.

### Score

Per-mode "✓ in a row" streak; a wrong answer resets it. No timer.

### Vocabulary (EN / FR)

column / colonne · row / ligne · cell / case · up, down, left, right / haut, bas, gauche, droite · treasure / trésor. Cell names are identical in both languages (letter then number).

## Components

| File | Role |
|------|------|
| `Activity.tsx` | Mode tabs, size toggle, current task, streak, feedback, Next. |
| `CoordinateGrid.tsx` | Renders labels + cells; controlled props for `markers` (emoji per cell), `highlight` (cell → `correct`/`wrong`/`path`), `pulse` (cell whose labels pulse), `pirate` (overlay position), `readOnly`, `onCellClick`; label highlight on hover/focus. |
| `NameChoices.tsx` | Four answer buttons for Mode 2. |
| `PathPrompt.tsx` | Arrow chips describing the moves for Mode 3. |
| `grid.ts` | Pure logic: `cellName(cell)`, `parseCell(name)`, `sameCell`, `applyMove(cell, move)`, `applyMoves`, `pathCells(start, moves)` (every step cell), `isInside`, `randomCell(size, avoid)`, `nameDistractors(cell, size)`, `generatePath(size)`, `generateTask(mode, size)`, `randomScenery(size, avoid)`. Randomness via `Math.random` (through `randInt`/`shuffle`), no rng parameter. Columns/rows 0-indexed internally; row 0 = label "1" at the bottom. |
| `grid.test.ts` | Vitest tests for naming/parsing round-trip, moves, bounds, distractors (4 unique, include correct, all valid-looking), path generator never leaving the grid. |
| `Activity.module.css` | Scoped styles: grid, labels, map background, pirate step animation. |
| `config.ts`, `translations.ts`, `index.ts` | Standard module files. |

Use `randInt` / `shuffle` from `@/lib/science/math/random`. No new dependencies. Plain DOM grid (CSS grid of buttons), not canvas — keyboard- and screen-reader-accessible (`aria-label="D3"` on each cell).

## Key State

- `Activity.tsx`: `mode` (`find` \| `name` \| `path`), `size` (5 \| 8), `task` (discriminated union: `{ kind: 'find', target }` \| `{ kind: 'name', target, choices }` \| `{ kind: 'path', start, moves, target }`), `scenery` (cells → emoji), `feedback` (`idle` \| `correct` \| `wrong`), `lastPick` (cell or choice name), `wrongTries`, `streak` per mode, `step` (pirate position index along `pathCells` during the success animation).
- New task generated on mode change, size change, and Next. After a correct answer (or any answer in Name mode), the task is read-only until Next.
- `CoordinateGrid.tsx` is fully controlled; only hover/focus label highlight is local state.

## Future (not v1)

- (x, y) ordered pairs with axes starting at 0 on grid lines instead of cells.
- Learner writes the path instructions for a given start and end.

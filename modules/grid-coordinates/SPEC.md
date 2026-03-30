# Grid Coordinates

## Purpose

Introduces **position on a grid**: rows and columns, alphanumeric cell names (e.g. A3), and simple “map” tasks. Aligns with MER *Espace* (repérage). Optional later extension: first-quadrant (x, y) pairs.

## User Experience

1. **Named grid**: columns labeled A–H, rows 1–8 (size tunable); a treasure or star sits in one cell.
2. **Find the cell**: prompt “Click cell **D4**”; correct cell highlights.
3. **Name the cell**: learner picks from multiple choice or types `B6` (with forgiving parsing).
4. **Path** (optional): “Start at A1, move 2 right and 3 up” — learner clicks destination.
5. Later extension: same grid corner as (0,0) with small ordered pairs — separate level, not required for v1.

## Components

| File | Role |
|------|------|
| `Activity.tsx` | Level, task type, target cell, attempts. |
| `CoordinateGrid.tsx` | Renders grid, labels, click handling, highlight. |
| `CoordinatePrompt.tsx` | Text or MC for “which cell?” / “where is the …?” |
| `gridConfig.ts` | Dimensions, label scheme, puzzle list. |

## Key State

- `Activity.tsx`: `task` (`clickNamed` \| `nameCell` \| `path`), `target`, `selectedCell`, `feedback`
- `CoordinateGrid.tsx`: controlled `highlight` / `selection` from parent

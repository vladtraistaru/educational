# Number Scale Explorer

## Purpose

Teaches number decomposition using an interactive number line. Learners drag markers to split a scale into segments and see how the parts add up to the whole.

## User Experience

1. A number line runs from 0 to the selected scale (default 100). One marker sits at 50.
2. The user drags markers along the line. Each marker snaps to whole numbers and shows its value.
3. The controls bar lets the user:
   - Change the scale (10, 20, 50, 100, 500, 1000)
   - Add a marker (up to 5) — appears in the middle of the largest gap
   - Remove the last marker (minimum 1)
   - Reset to scale 100 with one marker at 50
4. Colored segments fill the space between markers. A breakdown panel below shows each segment's size and the addition equation (e.g. `30 + 40 + 30 = 100`).

## Components

| File | Role |
|------|------|
| `Activity.tsx` | Owns state (scale, marker positions). Composes Controls, NumberLine, BreakdownPanel. |
| `Controls.tsx` | Scale dropdown, add/remove/reset buttons. Uses shared activity styles. |
| `NumberLine.tsx` | SVG number line with colored segments, ticks, and draggable markers. Handles pointer events, snapping, and collision avoidance. |
| `BreakdownPanel.tsx` | Lists each segment with color, label, size, and the total equation. |

## Key State

All state lives in `Activity.tsx`:

- `scale` (number) — max value on the line (default 100)
- `cursorPositions` (number[]) — marker positions as percentages along the line (default `[50]`)

Markers cannot overlap — `NumberLine` enforces a minimum gap of one scale unit during drag.

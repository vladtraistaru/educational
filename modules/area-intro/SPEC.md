# Area Intro

## Purpose

Introduces **area** as **counting unit squares** inside a shape; compares areas; progresses to **rectangles** on a grid (rows × columns). MER *Grandeurs et mesures*. Intended to follow or sit after `perimeter-intro` when learners distinguish perimeter vs area.

## User Experience

1. **Count squares**: irregular or rectangular region on a grid; partially shaded cells off for v1 (full cells only).
2. **Rectangle area**: show m × n grid; learner enters `m × n` or total after counting aid.
3. **Compare area**: two shapes, “Which covers more squares?”
4. **Perimeter trap** (one item type): same perimeter, different area — multiple choice to observe difference (optional).
5. Feedback uses “square units” / *unités carrées* in copy.

## Components

| File | Role |
|------|------|
| `Activity.tsx` | Task, region definition, answer, feedback. |
| `AreaGrid.tsx` | Filled cells, grid lines, optional row/column highlights for `m×n`. |
| `CompareTwo.tsx` | Side-by-side grids. |
| `areaTasks.ts` | Regions as sets of (row,col), expected area. |

## Key State

- `Activity.tsx`: `task`, `region`, `userCount` or `userExpression`
- Optional: `highlightedCells` for “tap each square” mode

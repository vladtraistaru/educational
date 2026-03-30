# Solid Views

## Purpose

Connects **3D solids** to **orthographic views** (top, front, side). Extends concepts from `3d-shape-explorer` with *vue de dessus / face / côté*. MER *Espace*.

## User Experience

1. A **block construction** (voxel-style) or a named solid (cube, cylinder, prism) is shown with a subtle rotation or fixed 3/4 view.
2. Three silhouettes or grids represent **top**, **front**, **side** views; one set is the correct match.
3. Learner taps which option is e.g. “view from above” or matches all three in a row.
4. Start with **axis-aligned blocks on a small grid** (1–2 layers); avoid ambiguous projections in v1.
5. Optional: same as multiple choice only (no free drawing).

## Components

| File | Role |
|------|------|
| `Activity.tsx` | Puzzle index, selection state, scoring. |
| `BlockModel.tsx` | Renders voxel model (CSS 3D or SVG isometric). |
| `ViewChoices.tsx` | 2–4 candidate 2D grids or outlines; one correct. |
| `projections.ts` | Pure: compute top/front/side 2D bitmap from 3D occupancy grid. |
| `puzzles.ts` | Small set of models and distractors. |

## Key State

- `Activity.tsx`: `puzzleId`, `selectedChoiceId`, `revealed`
- 3D rotation: optional `yaw` for inspect mode

# Symmetry Play

## Purpose

Introduces **reflection symmetry**: completing a figure across a mirror line and recognizing symmetrical vs asymmetrical shapes. Aligns with MER *Espace* (symétries).

## User Experience

1. **Mirror line** (vertical or horizontal) divides the canvas; one half shows a pattern of cells or a simple polygon outline.
2. **Complete it**: learner paints or toggles cells on the empty half so the figure is symmetrical; check compares to target.
3. **Yes / no**: show a shape or picture (abstract or simple); “Is it symmetrical?” with one mirror line suggested when helpful.
4. Difficulty: start with grid squares (pixel art style), then simple polygons on a grid.
5. Optional: learner picks **where** the mirror line is from 2–3 options for one variant.

## Components

| File | Role |
|------|------|
| `Activity.tsx` | Game mode, level, puzzle index, validation. |
| `SymmetryGrid.tsx` | Half grid + mirror; click to fill cells; read-only mode for display. |
| `SymmetryQuiz.tsx` | Binary symmetry questions with shape SVG or grid. |
| `puzzles.ts` | List of half-patterns and correct completions; symmetry flags for quiz shapes. |

## Key State

- `Activity.tsx`: `mode` (`complete` \| `quiz`), `puzzleIndex`, `gridState` (Record or 2D array)
- `SymmetryGrid.tsx`: may lift `cells` up to parent for single source of truth

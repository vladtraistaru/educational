# Symmetry Play

## Purpose

Introduces **reflection symmetry**: completing a figure across a mirror line and recognizing symmetrical vs asymmetrical shapes. Aligns with MER *Espace* (symétries).

## User Experience

1. **Mirror line** (vertical or horizontal) divides the canvas; one half shows a pattern of cells or a simple polygon outline.
2. **Complete it**: learner paints or toggles cells on the empty half so the figure is symmetrical; check compares to target.
3. **Yes / no**: show a shape or picture (abstract or simple); “Is it symmetrical?” with one mirror line suggested when helpful.
4. **Shipped:** grid squares (pixel art style) only. Simple polygons on a grid and optional “pick the mirror line” are not implemented yet.
5. Optional (future): learner picks **where** the mirror line is from 2–3 options for one variant.

## Components

| File | Role |
|------|------|
| `Activity.tsx` | Modes `complete` / `quiz`, puzzle indices, lifted `userFilled` Set, check validation. |
| `SymmetryGrid.tsx` | Half grid + mirror; click to fill editable cells; read-only mode for quiz display. |
| `SymmetryQuiz.tsx` | Binary symmetry questions using read-only grid patterns. |
| `puzzles.ts` | Half-patterns for complete mode; full patterns + flags for quiz. |
| `symmetry-utils.ts` | Reflection, editable/fixed halves, validation helpers. |

## Key State

- `Activity.tsx`: `mode`, `completeIndex`, `quizIndex`, `userFilled` (`Set` of `row,col` keys), `completeFeedback` after Check
- `SymmetryQuiz.tsx`: local `result` after Yes/No until Next

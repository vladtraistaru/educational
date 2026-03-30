# Add & Subtract Playground

## Purpose

Practices **addition and subtraction** with small numbers: mental strategies, inverse relationship, and optional vertical layout. Complements existing multiplication modules; supports MER *Opérations*.

## User Experience

1. **Mental mode**: expression like `27 + 15` or `50 − 18`; number pad or chip answers; optional “hint” reveals a strategy name (e.g. round then adjust) without forcing one path.
2. **Number line hop**: start value, hops for +/−; learner confirms landing number (visual bridge to `number-scale-explorer`).
3. **Missing number**: `? + 8 = 15` or `20 − ? = 12`.
4. Difficulty bands: sums under 20, then under 100 without regrouping, then with regrouping.
5. Streak or gentle score; no time pressure by default.

## Components

| File | Role |
|------|------|
| `Activity.tsx` | Difficulty, mode, current problem, attempts, feedback. |
| `MentalCard.tsx` | Shows expression, input, submit, hint button. |
| `NumberLineHops.tsx` | Simple line with arcs for add/subtract steps. |
| `MissingNumberCard.tsx` | One blank in an equation. |
| `generator.ts` | Pure functions: `nextProblem(difficulty, mode)`. |

## Key State

- `Activity.tsx`: `difficulty`, `mode`, `problem` object, `inputValue`, `streak`
- Optional local state in cards for animation phase

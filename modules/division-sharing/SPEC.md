# Division Sharing

## Purpose

Builds **division** as **fair sharing** and as **grouping** (“how many groups of 3?”). Links visually to **arrays** used in `multiplication-patterns`. MER *Opérations*.

## User Experience

1. **Sharing**: N objects (icons) and P people/plates; learner drags or taps to distribute equally; app checks each gets the same count; shows `N ÷ P = q` with remainder called out when N not divisible.
2. **Grouping**: “Make groups of k”; learner forms groups from N items; result `N ÷ k`.
3. **Link to multiplication**: after a division, show `q × P = N` (when no remainder) as reinforcement.
4. Numbers stay small (e.g. N ≤ 24, divisors ≤ 6) for first version.
5. EN/FR vocabulary: share / groupe / reste.

## Components

| File | Role |
|------|------|
| `Activity.tsx` | Scenario type, N, divisor/plates, phase, feedback. |
| `ShareScene.tsx` | Draggable tokens into bins; equality check. |
| `GroupScene.tsx` | Drag to form equal groups; count groups. |
| `EquationStrip.tsx` | Shows division and optional linked multiplication. |
| `scenarios.ts` | Preset (N, P) or (N, k) lists per difficulty. |

## Key State

- `Activity.tsx`: `scenario`, `assignments` (which token in which bin), `grouping` structure
- Drag layers may use local state synced on drop

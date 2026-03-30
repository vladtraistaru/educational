# Measure Lengths

## Purpose

Teaches reading and comparing lengths in **cm** and **m**, aligned with MER *Grandeurs et mesures* (primaire). Learners connect the number line idea to a ruler and to short real-world situations.

## User Experience

1. A horizontal ruler (cm ticks, optional m label for 100 cm) is always visible.
2. **Read the mark**: a segment or object ends at a tick; learner enters the length or picks from choices. Feedback shows the correct reading.
3. **Compare**: two lengths side by side (bars or segments); learner picks longer / shorter / same, or orders three items.
4. **Place an object**: drag an endpoint so a segment matches a target length (optional, if interaction stays simple).
5. One short “context” line per item (e.g. pencil, book edge) without heavy text; EN/FR via translations.

## Components

| File | Role |
|------|------|
| `Activity.tsx` | Owns exercise mode, current item, score or streak; composes subviews. |
| `RulerView.tsx` | SVG or div-based ruler with ticks and optional draggable marker. |
| `LengthCompare.tsx` | Two or three bars; tap to answer compare / order. |
| `exercises.ts` | Pure data: target lengths, comparison pairs, tolerance rules. |

## Key State

- `Activity.tsx`: `mode` (`read` \| `compare` \| `place`), `itemIndex`, `answer` / `feedback`
- `RulerView.tsx` (if draggable): `endPosition` or controlled value from parent

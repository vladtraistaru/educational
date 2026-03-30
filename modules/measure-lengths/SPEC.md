# Measure Lengths

## Purpose

Teaches reading and comparing lengths in **cm**, aligned with MER *Grandeurs et mesures* (primaire). Learners connect the number line idea to a ruler and to short real-world situations. **v1 is cm-only** (no metre exercises yet).

## User Experience

1. **Modes**: tabs **Read the ruler** and **Compare**.
2. **Read**: horizontal cm ruler (0–15); green segment from 0 to a whole-number length. Learner picks the length from **multiple-choice** buttons, then **Check**. **Next** after a correct answer cycles shuffled items.
3. **Compare — two strips**: two coloured bars; learner picks **first longer**, **second longer**, or **same length** (instant check). **Next** after correct.
4. **Compare — three strips**: three bars in a **shuffled display order**; learner picks which strip is **longest** (red / blue / green label). **Next** after correct.
5. Optional one-line **context** (pencil, ribbon, …) via translations.
6. **Deferred (v2)**: drag an endpoint to match a target length (**Place**). **Metres** / 100 cm ruler as a separate pass.

## Components

| File | Role |
|------|------|
| `Activity.tsx` | `mode`, shuffled indices, `feedback`, composes ruler / compare / controls. |
| `RulerView.tsx` | SVG ruler, cm ticks, labels at 0/5/10/15, coloured segment. |
| `LengthCompare.tsx` | Proportional bars + labels. |
| `exercises.ts` | `READ_EXERCISES`, `COMPARE_EXERCISES`, `readChoices`, compare helpers. |
| `Activity.module.css` | Layout for ruler, choices, bars. |

## Key State

- `Activity.tsx`: `mode`, `readPos` / `comparePos`, `readChoiceValues`, `selectedCm`, `feedback`, `threePerm` for shuffled three-bar order
- No draggable ruler state in v1

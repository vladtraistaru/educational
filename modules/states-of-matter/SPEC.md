# States of Matter

## Purpose

**Sciences de la nature** (matière): **solid, liquid, gas** — sort examples, recognize properties in everyday life. No particle model required in v1; keep phenomena concrete.

## User Experience

1. **Sort**: items as icons or words (ice, water, steam, rock, air in a balloon…); three bins **Solid / Liquid / Gas**; drag or tap category.
2. **Property quiz**: “Which can you pour?” “Which keeps its shape?” — binary or MC linked to state.
3. **Same substance** (optional): water / ice / steam triplet highlighted as “same matter, different state” with simple temperature cue (without numbers if too heavy).
4. Safe, familiar examples only; no chemistry lab framing.

## Components

| File | Role |
|------|------|
| `Activity.tsx` | Level, exercise type, attempts. |
| `SortBins.tsx` | Three zones and draggable items. |
| `PropertyQuestion.tsx` | MC from `questions.ts`. |
| `matterItems.ts` | Item id, state, icon key, per-language label. |
| `questions.ts` | Property questions referencing states. |

## Key State

- `Activity.tsx`: `itemPlacements` (itemId → state), `quizIndex`, `feedback`

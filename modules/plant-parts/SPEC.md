# Plant Parts

## Purpose

**Sciences de la nature** (vivant): recognize main parts of a **plant** — root, stem, leaf, flower, fruit — and link to everyday examples. Observation and vocabulary, not anatomy depth.

## User Experience

1. **Diagram**: side view of a generic plant with neutral illustration.
2. **Label**: pointers or drag labels to parts; or tap a part then pick the name from a list.
3. **Match**: small set of photos or icons (apple, carrot, lettuce) — “Which part do we eat?” multiple choice.
4. **Order** (optional): simple life sequence seed → plant → flower → fruit as a vertical ordering exercise.
5. Content stays inclusive and non-regional-specific; EN/FR plant terms.

## Components

| File | Role |
|------|------|
| `Activity.tsx` | Screen flow, score, language. |
| `PlantDiagram.tsx` | SVG with clickable regions and ids. |
| `LabelBank.tsx` | Draggable or tap-to-assign labels. |
| `FoodQuiz.tsx` | Which plant part MC items. |
| `plantData.ts` | Part ids, labels per language, quiz items. |

## Key State

- `Activity.tsx`: `phase` (`label` \| `food` \| `order`), `assignments` (partId → labelId), `quizSelection`

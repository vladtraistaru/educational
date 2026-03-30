# Food Chains (Simple)

## Purpose

**Sciences de la nature**: simple **food chains** — **producer** (plant), **consumer** (herbivore, carnivore), **decomposer** optional at end. Observation-level; one chain at a time.

## User Experience

1. **Biome strip**: e.g. pond, forest, meadow with 3–4 organisms illustrated.
2. **Build the chain**: learner orders cards from “energy from sun” / plant to top consumer; arrows flip to correct direction on check.
3. **Who eats whom?** MC: “The frog eats ___.”
4. Vocabulary: producer / consumer / herbivore / carnivore in EN; équivalents FR.
5. Avoid complex webs in v1; single linear chains only.

## Components

| File | Role |
|------|------|
| `Activity.tsx` | Scenario id, mode, user order, feedback. |
| `ChainBuilder.tsx` | Drag-and-drop or tap-to-insert slots with arrows. |
| `OrganismCard.tsx` | Image + name. |
| `scenarios.ts` | Chains as ordered organism ids, MC questions, locale strings. |

## Key State

- `Activity.tsx`: `chainOrder` (array of ids), `currentMcQuestion`

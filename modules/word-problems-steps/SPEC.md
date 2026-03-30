# Word Problems (Steps)

## Purpose

Practices **one- and two-step** word problems with **+ − ×** (division optional later). Supports MER transversal **aide à la résolution de problèmes**; short contexts, accessible vocabulary, EN/FR.

## User Experience

1. A **story** (2–4 sentences) with numbers embedded; question at the end.
2. Learner enters **final answer**; optional **intermediate step** field for two-step problems (scaffolded: “Step 1? Step 2?”).
3. **Optional hint**: reveal a **bar model** or **line diagram** (read-only SVG) after one wrong attempt.
4. Problem types: combine, compare, equal groups (multiplication), take away, two-step shopping / tickets.
5. Bank of problems tagged by operation mix; shuffle within difficulty.

## Components

| File | Role |
|------|------|
| `Activity.tsx` | Difficulty, problem index, answers, hint visibility, feedback. |
| `ProblemCard.tsx` | Story text, inputs, submit. |
| `BarModelHint.tsx` | Simple segmented bar SVG for the current problem (optional). |
| `problems.ts` | `{ story, numbers, steps, answer, operations, hintModel? }[]` per locale or i18n keys. |

## Key State

- `Activity.tsx`: `problem`, `step1Answer`, `finalAnswer`, `wrongCount`, `hintUnlocked`

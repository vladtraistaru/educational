# Measure Time

## Purpose

Teaches **reading time** (analog and digital) and simple **durations** and **order in the day** (*avant / après*), aligned with MER *Grandeurs et mesures* (temps).

## User Experience

1. **Analog clock**: hands set to a time; learner chooses the matching digital time or vice versa (difficulty scales: whole hours, half hours, quarters, then five minutes).
2. **Set the clock**: given a digital or spoken-style prompt, learner drags hour and minute hands; snap to valid steps for the level.
3. **Duration**: “From 3:00 to 4:30 — how long?” with multiple choice or short input (hours / minutes).
4. **Before / after**: two events with times; learner orders them or answers which is earlier.
5. Language: use 12h or 24h consistently per locale preference if added later; start with one convention in EN/FR copy.

## Components

| File | Role |
|------|------|
| `Activity.tsx` | Level, exercise type, current question, feedback. |
| `AnalogClock.tsx` | Face, hands, drag or display-only. |
| `DigitalTimePicker.tsx` | Hours/minutes selection for answer or prompt. |
| `TimeExercises.tsx` | Renders question type; pulls from `timeItems.ts`. |
| `timeItems.ts` | Question generators or static banks per difficulty. |

## Key State

- `Activity.tsx`: `level`, `questionType`, `currentId`, `userAnswer`, `showFeedback`
- `AnalogClock.tsx`: `hourAngle`, `minuteAngle` (or `hours`, `minutes` derived)

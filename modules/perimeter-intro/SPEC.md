# Perimeter Intro

## Purpose

Introduces **perimeter** as distance around a shape. Starts with **rectangles on a grid** and integer side lengths; aligns with MER *Grandeurs et mesures* + *Espace*.

## User Experience

1. A rectangle (or rectilinear shape) on a **unit square grid**; each edge length shown implicitly by cell count.
2. **Count the perimeter**: learner enters total units or clicks all boundary segments with a running total.
3. **Given sides**: labeled lengths a and b; learner computes perimeter of rectangle `2(a+b)` with scaffolding (show formula toggle).
4. **Compare**: two shapes, same area different perimeter or vice versa (one stretch item).
5. Wrong answers get short feedback (“count each side once”).

## Components

| File | Role |
|------|------|
| `Activity.tsx` | Exercise type, shape, user value, feedback. |
| `GridShape.tsx` | Draws outline on grid; optional click-per-edge mode. |
| `LabeledRectangle.tsx` | Simple rectangle with side labels (numbers). |
| `perimeterTasks.ts` | Shape definitions, answers, distractors. |

## Key State

- `Activity.tsx`: `taskKind`, `shape`, `answer`, `edgeClicked` set if applicable
